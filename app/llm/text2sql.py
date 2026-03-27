from app.llm.prompts import build_response_synthesis_prompt

def generate_response(question: str, sql: str, rows: list) -> str:
    """Convert SQL results to a natural language response using the LLM."""
    try:
        prompt = build_response_synthesis_prompt(question, sql, rows)
        from app.llm.client import call_llm
        response = call_llm(prompt)
        return response
    except Exception as e:
        return f"[LLM synthesis error: {e}]"
from app.llm.client import call_llm
from app.llm.prompts import build_text_to_sql_prompt


def generate_sql(schema: str, question: str) -> str:
    prompt = build_text_to_sql_prompt(schema, question)
    sql = call_llm(prompt)

    sql = clean_sql(sql)

    return sql

def clean_sql(sql: str) -> str:
    # Remove markdown code blocks
    sql = sql.strip()

    if sql.startswith("```"):
        sql = sql.replace("```sql", "").replace("```", "").strip()

    return sql