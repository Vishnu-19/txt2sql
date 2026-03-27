from app.rag.embeddings import get_embedding
from app.rag.vector_store import VectorStore


def format_schema_for_embedding(table):
    table_name = table["table"]
    columns = table["columns"]

    col_names = ", ".join([col["name"] for col in columns])

    return f"Table {table_name} with columns {col_names}"


def chunk_schema(schema):
    chunks = []

    for table in schema:
        text = format_schema_for_embedding(table)
        chunks.append(text)

    return chunks


def build_vector_store(schema):
    chunks = chunk_schema(schema)

    # 🚨 SAFETY CHECK 1
    if not chunks:
        raise ValueError("No schema found. Database might be empty or inaccessible.")

    embeddings = []

    for chunk in chunks:
        try:
            emb = get_embedding(chunk)
            embeddings.append(emb)
        except Exception as e:
            print(f"Embedding failed for chunk: {chunk}, error: {e}")

    # 🚨 SAFETY CHECK 2
    if not embeddings:
        raise ValueError("Failed to generate embeddings for schema.")

    dim = len(embeddings[0])

    store = VectorStore(dim)
    store.add(embeddings, chunks)

    return store