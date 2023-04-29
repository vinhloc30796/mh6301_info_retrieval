import os
from dataclasses import dataclass
from typing import List, Iterable, Callable, Union, Optional
import json
from elasticsearch import Elasticsearch


@dataclass
class Metadata:
    filename: str
    index: str
    id_field: Union[List[str], str]
    mapping: dict
    array_fields: Optional[Union[List[str], str]] = None


METADATA = [
    Metadata(
        filename="yelp_academic_dataset_business.json",
        index="business",
        id_field="business_id",
        mapping={
            "properties": {
                # "business_id": {"type": "keyword"},
                "name": {"type": "text"},
                "address": {"type": "text"},
                "city": {"type": "text"},
                "state": {"type": "text"},
                "postal_code": {"type": "text"},
                "latitude": {"type": "float"},
                "longitude": {"type": "float"},
                "stars": {"type": "float"},
                "review_count": {"type": "integer"},
                "is_open": {"type": "integer"},
                "attributes": {"type": "text"},
                "categories": {"type": "text"},
                "hours": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
            }
        },
        array_fields=["categories"],
    ),
    Metadata(
        filename="yelp_academic_dataset_review.json",
        index="review",
        id_field="review_id",
        mapping={
            "properties": {
                # "review_id": {"type": "keyword"},
                "user_id": {"type": "keyword"},
                "business_id": {"type": "keyword"},
                "stars": {"type": "float"},
                "useful": {"type": "integer"},
                "funny": {"type": "integer"},
                "cool": {"type": "integer"},
                "text": {"type": "text"},
                "date": {"type": "date"},
            }
        },
    ),
    Metadata(
        filename="yelp_academic_dataset_user.json",
        index="user",
        id_field="user_id",
        mapping={
            "properties": {
                # "user_id": {"type": "keyword"},
                "name": {"type": "text"},
                "review_count": {"type": "integer"},
                "yelping_since": {"type": "date"},
                "useful": {"type": "integer"},
                "funny": {"type": "integer"},
                "cool": {"type": "integer"},
                "elite": {"type": "text"},
                "friends": {"type": "text"},
                "fans": {"type": "integer"},
                "average_stars": {"type": "float"},
                "compliment_hot": {"type": "integer"},
                "compliment_more": {"type": "integer"},
                "compliment_profile": {"type": "integer"},
                "compliment_cute": {"type": "integer"},
                "compliment_list": {"type": "integer"},
                "compliment_note": {"type": "integer"},
                "compliment_plain": {"type": "integer"},
                "compliment_cool": {"type": "integer"},
                "compliment_funny": {"type": "integer"},
                "compliment_writer": {"type": "integer"},
                "compliment_photos": {"type": "integer"},
            }
        },
    ),
    Metadata(
        filename="yelp_academic_dataset_tip.json",
        index="tip",
        id_field=["user_id", "business_id"],
        mapping={
            "properties": {
                # "tip_id": {"type": "keyword"},
                "user_id": {"type": "keyword"},
                "business_id": {"type": "keyword"},
                "text": {"type": "text"},
                "date": {"type": "date"},
                "compliment_count": {"type": "integer"},
            }
        },
    ),
    Metadata(
        filename="yelp_academic_dataset_checkin.json",
        index="checkin",
        id_field="business_id",
        mapping={
            "properties": {
                # "checkin_id": {"type": "keyword"},
                "business_id": {"type": "keyword"},
                "date": {"type": "date"},
            }
        },
    ),
]


# ES
def get_client() -> Elasticsearch:
    es_url = os.getenv("ES_URL", "http://localhost:9200")
    return Elasticsearch(es_url)


# Data
def read_json(filename: str) -> Iterable[dict]:
    # Stream data from JSON file, line by line
    with open(filename, "r") as f:
        for line in f:
            yield json.loads(line)


def _dummy_row(row) -> int:
    print(row)
    return len(row)


def _split_array_fields(row: dict, array_fields: List[str]) -> dict:
    for field in array_fields:
        if field in row:
            row[field] = row[field].split(", ")
    return row


def _index_row(row: dict, es: Elasticsearch, func_metadata: Metadata) -> None:
    if isinstance(func_metadata.id_field, list):
        id = "_".join([row[field] for field in func_metadata.id_field])
    else:
        id = row[func_metadata.id_field]

    # Split
    if func_metadata.array_fields:
        row = _split_array_fields(row, func_metadata.array_fields)

    # Index
    index_res: dict = es.index(index=func_metadata.index, id=id, document=row)
    if index_res["result"] != "created":
        print(f"Error indexing {func_metadata.index} {id}: {index_res}")
        return None
    return index_res


def process_data(
    metadata: Metadata,
    process_func: Callable = _dummy_row,
    limit: int = 5,
    **kwargs,
) -> Iterable:
    # Print first `limit` rows
    filename = f"../data/{metadata.filename}"
    print(f"Processing {filename}...")

    # Initialize index
    result = []
    for row in read_json(filename):
        result.append(process_func(row, **kwargs))
        if len(result) == limit:
            break
    print(f"Done! Processed {len(result)} rows.")
    return result


def main():
    # Connect to ES
    es = get_client()
    print(es.info().body)
    # Read & process data
    results = []
    for metadata in METADATA:
        new_result = process_data(
            metadata,
            process_func=_index_row,
            es=es,
            func_metadata=metadata,
        )
        total = es.cat.count(index=metadata.index, params={"format": "json"})[0][
            "count"
        ]
        results.append(
            {
                "processed": len(new_result),
                "total": total,
            }
        )
    return results


if __name__ == "__main__":
    results = main()
    print(f"Done! Processed {results} rows.")
