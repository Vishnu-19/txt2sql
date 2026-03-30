from pydantic import BaseModel, model_validator
from typing import Optional
from enum import Enum


class DBType(str, Enum):
    POSTGRES = "postgres"
    SQLITE = "sqlite"
    MYSQL = "mysql"
    URI = "uri"


class DBConfig(BaseModel):
    db_type: Optional[DBType] = None
    
    # Postgres/MySQL fields
    username: Optional[str] = None
    password: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    database: Optional[str] = None
    
    # SQLite field
    db_path: Optional[str] = "sample.db"
    
    # URI field for direct connection string
    db_uri: Optional[str] = None

    @model_validator(mode="after")
    def validate_config(self):
        postgres_fields = [
            self.username,
            self.password,
            self.host,
            self.port,
            self.database
        ]

        # If URI is provided, it's valid
        if self.db_uri:
            self.db_type = DBType.URI
            return self

        if all(postgres_fields):
            self.db_type = DBType.POSTGRES
            return self

        if self.db_path:
            self.db_type = DBType.SQLITE
            return self

        raise ValueError("Provide either Postgres config, db_path for SQLite, or db_uri")


class DBValidationRequest(BaseModel):
    db_config: DBConfig


class DBValidationResponse(BaseModel):
    success: bool
    message: str
    tables: Optional[list] = None
    error: Optional[str] = None


class QueryRequest(BaseModel):
    db_config: DBConfig
    question: str