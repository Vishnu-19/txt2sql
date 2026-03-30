# QueryGenie: RAG Text-to-SQL


## Problem Statement
Business users, product owners, and analysts often need insights from databases but lack the ability to write complex SQL queries. This creates a bottleneck, requiring constant support from data engineers or developers to translate questions into SQL, run them, and interpret the results. The process is slow, error-prone, and limits self-service analytics.

## Solution
**QueryGenie** enables anyone to ask questions about their data in plain English. It automatically:
- Converts natural language questions into accurate SQL queries
- Executes those queries on your database (PostgreSQL or SQLite)
- Returns both the raw data and a clear, concise natural language summary

This empowers non-technical users to get answers instantly, reduces engineering workload, and accelerates data-driven decision making.

---

## Technical Overview
QueryGenie is a FastAPI backend that leverages Retrieval-Augmented Generation (RAG) and OpenAI's models to generate context-aware SQL and summarize results. It features:
- RAG-based schema retrieval for improved SQL accuracy
- LLM-powered SQL and text generation
- In-memory caching for performance
- Modular, extensible Python codebase

## Requirements
- Python 3.9+
- OpenAI API key
- PostgreSQL or SQLite database

## Setup Instructions
1. **Clone the repository:**
	 ```sh
	 git clone <repo-url>
	 cd QueryGenie
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
MIT
