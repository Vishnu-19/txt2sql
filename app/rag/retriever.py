from app.rag.embeddings import get_embedding

def retrieve_relevant_schema(vector_store, question, k=3):
    query_embedding = get_embedding(question)
    results = vector_store.search(query_embedding, k=k)
    return "\n".join(results)