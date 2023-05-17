import os
import json
import logging
from dataclasses import dataclass
from typing import List, Iterable, Callable, Union, Optional

# ES
from elasticsearch import Elasticsearch

logging.basicConfig(level=logging.INFO)

@dataclass
class Metadata:
    filename: str
    mapping_filename: str
    index: str
    id_field: Union[List[str], str]
    array_fields: Optional[List[str]] = None
    lat_field: Optional[str] = None
    lon_field: Optional[str] = None


METADATA = [
    Metadata(
        filename="yelp_academic_dataset_business.json",
        mapping_filename="./mappings/business.json",
        index="business",
        id_field="business_id",
        array_fields=["categories"],
        lat_field = "latitude",
        lon_field = "longitude",
    ),
    Metadata(
        filename="yelp_academic_dataset_review.json",
        mapping_filename="./mappings/review.json",
        index="review",
        id_field="review_id",
    ),
    Metadata(
        filename="yelp_academic_dataset_user.json",
        mapping_filename="./mappings/user.json",
        index="user",
        id_field="user_id",
    ),
    Metadata(
        filename="yelp_academic_dataset_tip.json",
        mapping_filename="./mappings/tip.json",
        index="tip",
        id_field=["user_id", "business_id"],
    ),
    Metadata(
        filename="yelp_academic_dataset_checkin.json",
        mapping_filename="./mappings/checkin.json",
        index="checkin",
        id_field="business_id",
    ),
]


# ES
def get_client() -> Elasticsearch:
    es_url = os.getenv("ES_URL", "http://localhost:9200")
    return Elasticsearch(es_url)


# Data
def read_json(filename: str, limit: int = 5) -> Iterable[dict]:
    # Stream data from JSON file, line by line
    counter = 0
    with open(filename, "r") as f:
        for line in f:
            if counter >= limit:
                break
            counter += 1
            yield json.loads(line)


def _dummy_row(row) -> int:
    print(row)
    return len(row)


def _split_array_fields(row: dict, id: str, array_fields: List[str]) -> dict:
    for field in array_fields:
        if row.get(field):
            try: 
                row[field] = row[field].split(", ")
            except Exception as e:
                logging.error(f"Error splitting {field} for {id}: {e}")
    return row


def _join_lat_lon_fields(row: dict, lat_field: str, lon_field: str) -> dict:
    if row.get(lat_field) and row.get(lon_field):
        lon = row[lon_field]
        lat = row[lat_field]
        row["_geoloc"] = f"{lat}, {lon}"
        # delete old fields
        del row[lat_field]
        del row[lon_field]
    print(row)
    return row


def _index_row(row: dict, es: Elasticsearch, func_metadata: Metadata) -> None:
    if isinstance(func_metadata.id_field, list):
        id = "_".join([row[field] for field in func_metadata.id_field])
    else:
        id = row[func_metadata.id_field]
        # delete id field from row
        del row[func_metadata.id_field]

    # Split
    if func_metadata.array_fields:
        row = _split_array_fields(row, id, func_metadata.array_fields)
    
    # Join geo fields
    if func_metadata.lat_field and func_metadata.lon_field:
        row = _join_lat_lon_fields(row, func_metadata.lat_field, func_metadata.lon_field)

    # Index
    try:
        index_res: dict = es.index(index=func_metadata.index, id=id, document=row)
    except Exception as e:
        logging.error(f"Error indexing {func_metadata.index} {id}: {e}\n\t - row: {row}")
        return None
    if index_res["result"] != "created":
        logging.warning(f"Didn't index {func_metadata.index} {id}: {index_res}\n\t - row: {row}")
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
    results = []
    for row in read_json(filename, limit=limit):
        results.append(process_func(row, **kwargs))
    print(f"Done! Processed {len(results)} rows.")
    return results


def read_mapping(filename: str) -> dict:
    with open(filename, "r") as f:
        return json.load(f)["mappings"]


def main():
    # Connect to ES
    es = get_client()
    print(es.info().body)
    # Read & process data
    limit = int(os.getenv("INDEX_LIMIT", 5))
    results = []
    for metadata in METADATA[0:1]:
        print(f"Processing {metadata.index}...")
        # Read mapping
        mapping = read_mapping(metadata.mapping_filename)
        # Check if indices exist
        if not es.indices.exists(index=metadata.index):
            # if not, create
            es.indices.create(
                index=metadata.index,
                mappings=mapping,
            )
        # Then index data
        new_result = process_data(
            metadata,
            process_func=_index_row,
            es=es,
            func_metadata=metadata,
            limit=limit,
        )
        total = es.cat.count(index=metadata.index, params={"format": "json"})[0][
            "count"
        ]
        results.append({"processed": len(new_result), "total": total})
    return results


if __name__ == "__main__":
    results = main()
    print(f"Done! Processed {results} rows.")
