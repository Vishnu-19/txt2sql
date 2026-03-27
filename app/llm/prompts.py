def build_text_to_sql_prompt(schema_context: str, question: str) -> str:
    return f"""
You are an expert PostgreSQL SQL generator helping business users query data.

The user is a product owner or business analyst who may not know SQL.

Your job is to translate their question into an accurate SQL query.

STRICT RULES:
- Only generate SELECT queries
- Do NOT use DELETE, UPDATE, INSERT, DROP
- Use only tables and columns provided
- Add LIMIT 100 unless aggregation is used
- Use proper JOINs when multiple tables are involved
- Prefer meaningful aggregations (SUM, COUNT, AVG) when the question implies analysis
- Handle time-based queries correctly (e.g., "last month", "last 7 days")

BUSINESS INTERPRETATION RULES:
- "top", "best" → use ORDER BY DESC + LIMIT
- "trend" → include date column + ORDER BY date
- "total" → use SUM()
- "average" → use AVG()
- "count" → use COUNT()
- "by" → use GROUP BY
- "last month/week/year" → use date filters

Relevant Schema:
{schema_context}

User Question:
{question}

Return ONLY the SQL query. Do not include explanations or formatting.
"""

def build_response_synthesis_prompt(question: str, sql: str, rows: list) -> str:
    rows_preview = '\n'.join([str(row) for row in rows[:10]])
    more_rows = "... (more rows)" if len(rows) > 10 else ""

    return f"""
You are a data assistant helping product owners and business analysts understand query results.

User Question:
{question}

Executed SQL:
{sql}

Query Results (first 10 rows):
{rows_preview}
{more_rows}

Instructions:
- First, determine the intent of the question:
  • If it is a simple factual question (e.g., "who is the top customer", "total sales"):
    → Provide a direct, concise answer (1–2 sentences max)
    → Do NOT add extra insights or recommendations

  • If it is an analytical or open-ended question (e.g., "how are sales doing", "trends"):
    → Provide a brief summary with key insights (3–5 sentences)
    → Highlight patterns, trends, or comparisons

- Always use clear, non-technical language
- Do NOT mention SQL or technical details
- Do NOT over-explain

Answer:
"""