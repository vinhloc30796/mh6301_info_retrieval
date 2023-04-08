import os
from elasticsearch import Elasticsearch

def client() -> Elasticsearch:
    es_url = os.getenv("ES_URL", "http://localhost:9200")
    return Elasticsearch(es_url)

def main():
    es = client()
    print(es.info().body)

if __name__ == "__main__":
    main()