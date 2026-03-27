import hashlib
import json
import time
from app.db.connection import create_db_engine
from app.rag.indexer import build_vector_store

ENGINE_CACHE = {}
VECTOR_STORE_CACHE = {}
QUERY_CACHE = {}

CACHE_TTL = 300

def get_db_key(db_config):
    """Create unique key per DB"""
    key_str = json.dumps(db_config, sort_keys=True)
    return hashlib.md5(key_str.encode()).hexdigest()


def get_engine(db_config):
    key = get_db_key(db_config)
    if key not in ENGINE_CACHE:
        ENGINE_CACHE[key] = create_db_engine(db_config)
    return ENGINE_CACHE[key]


def get_vector_store(db_key, schema):
    if db_key not in VECTOR_STORE_CACHE:
        VECTOR_STORE_CACHE[db_key] = build_vector_store(schema)
    return VECTOR_STORE_CACHE[db_key]


def get_cached_query(db_key, question):
    key = f"{db_key}:{question}"
    if key in QUERY_CACHE:
        entry = QUERY_CACHE[key]
        # TTL check
        if time.time() - entry["time"] < CACHE_TTL:
            return entry["data"]
    return None


def set_cached_query(db_key, question, data):
    key = f"{db_key}:{question}"
    QUERY_CACHE[key] = {
        "data": data,
        "time": time.time()
    }
