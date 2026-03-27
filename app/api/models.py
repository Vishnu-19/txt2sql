from pydantic import BaseModel, model_validator
from typing import Optional


class DBConfig(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    database: Optional[str] = None
    db_path: Optional[str] = "sample.db"

    @model_validator(mode="after")
    def validate_config(self):
        postgres_fields = [
            self.username,
            self.password,
            self.host,
            self.port,
            self.database
        ]

        if all(postgres_fields):
            return self

        if self.db_path:
            return self

        raise ValueError("Provide either Postgres config or db_path for SQLite")

class QueryRequest(BaseModel):
    db_config: DBConfig
    question: str