# txt-sql: RAG Text-to-SQL MVP

## Overview
txt-sql is a FastAPI-based backend that translates natural language questions into SQL queries, executes them on your database, and returns both the raw results and a natural language summary using an LLM (OpenAI GPT-4o-mini). It uses Retrieval-Augmented Generation (RAG) to improve SQL generation accuracy.

## Features
- Natural language to SQL translation using LLM
- RAG-based schema retrieval for context-aware SQL
- Supports PostgreSQL and SQLite
- Caching for engines, vector stores, and query results
- Returns both SQL, data, and a text summary

## Requirements
- Python 3.9+
- OpenAI API key
- (Optional) PostgreSQL or SQLite database

## Setup Instructions
1. **Clone the repository:**
	 ```sh
	 git clone <repo-url>
	 cd txt-sql
	 ```
2. **Install dependencies:**
	 ```sh
	 python -m venv venv
	 source venv/bin/activate
	 pip install -r requirements.txt
	 ```
3. **Set up environment variables:**
	 - Create a `.env` file in the root directory:
		 ```env
		 OPENAI_API_KEY=your-openai-key
		 ```
4. **Run the server:**
	 ```sh
	 uvicorn app.main:app --reload
	 ```

## Usage
Send a POST request to `/query` with a JSON body:

```
POST /query
{
	"db_config": {
		"db_path": "sample/sample.db"  // or PostgreSQL config fields
	},
	"question": "What are the top 5 products by sales?"
}
```

**Response:**
```
{
	"sql": "SELECT ...",
	"data": [ ... ],
	"response": "The top 5 products by sales are ...",
	"context_used": "...",
	"cached": false
}
```

## Configuration
- **OpenAI API Key:** Set `OPENAI_API_KEY` in your `.env` file.
- **Database:**
	- For SQLite: provide `db_path` in `db_config`.
	- For PostgreSQL: provide `username`, `password`, `host`, `port`, `database` in `db_config`.

## File Structure
- `app/main.py` — FastAPI entrypoint
- `app/api/routes.py` — API endpoints
- `app/services/query_service.py` — Main query orchestration
- `app/services/cache.py` — In-memory caching logic
- `app/llm/` — LLM client, prompts, and SQL/text generation
- `app/db/` — DB connection and schema extraction
- `app/rag/` — Embedding, indexing, and retrieval for RAG

## Caching
The app uses in-memory caching for:
- Database engines
- Vector stores
- Query results (with TTL)

## License
MIT (or specify your license)
