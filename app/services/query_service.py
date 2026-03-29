from sqlalchemy import text
from app.db.connection import create_db_engine
from app.db.schema import extract_schema
from app.llm.text2sql import generate_sql, generate_response

from app.rag.indexer import build_vector_store
from app.rag.retriever import retrieve_relevant_schema

from app.services.cache import (
    get_db_key,
    get_engine,
    get_vector_store,
    get_cached_query,
    set_cached_query
)


def run_query_flow(db_config, question: str):
    db_key = get_db_key(db_config)

    # Step 0: Get cached engine
    engine = get_engine(db_config)

    # Step 1: Check query cache
    cached = get_cached_query(db_key, question)
    if cached:
        return {
            "cached": True,
            **cached
        }

    # Step 2: Extract schema
    schema = extract_schema(engine)

    # Step 3: Get cached vector store
    vector_store = get_vector_store(db_key, schema)

    # Step 4: Retrieve relevant schema
    schema_context = retrieve_relevant_schema(vector_store, question)

    # Step 5: Generate SQL
    sql = generate_sql(schema_context, question)

    # Step 6: Execute SQL
    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql))
            rows = [dict(row._mapping) for row in result]
    except Exception as e:
        return {
            "error": str(e),
            "sql": sql,
            "context_used": schema_context
        }

    # Step 7: Limit rows for LLM (IMPORTANT)
    limited_rows = rows[:20]

    # Step 8: Generate NL response
    response_text = generate_response(question, sql, schema_context,limited_rows)

    response = {
        "sql": sql,
        "data": rows,
        "response": response_text,
        "context_used": schema_context,
        "cached": False
    }

    # Step 9: Cache result
    set_cached_query(db_key, question, response)

    return response