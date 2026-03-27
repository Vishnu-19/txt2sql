from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine


def create_sqlite_engine(db_path: str = "sample.db") -> Engine:
    return create_engine(f"sqlite:///{db_path}")


def create_postgres_engine(
    username: str,
    password: str,
    host: str,
    port: int,
    database: str
) -> Engine:
    url = f"postgresql://{username}:{password}@{host}:{port}/{database}"
    return create_engine(url)


def test_connection(engine: Engine) -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


def create_db_engine(config: dict) -> Engine:
    """
    Smart engine creator:
    1. Try PostgreSQL if valid config provided
    2. Fallback to SQLite otherwise
    """

    postgres_values = [
        config.get("username"),
        config.get("password"),
        config.get("host"),
        config.get("port"),
        config.get("database"),
    ]

    if all(postgres_values):
        try:
            engine = create_postgres_engine(
                config["username"],
                config["password"],
                config["host"],
                int(config["port"]), 
                config["database"]
            )

            if test_connection(engine):
                print("✅ Connected to PostgreSQL")
                return engine
            else:
                print("⚠️ PostgreSQL connection failed. Falling back to SQLite...")

        except Exception as e:
            print(f"⚠️ Postgres init error: {e}. Falling back to SQLite...")

    db_path = config.get("db_path", "sample.db")
    engine = create_sqlite_engine(db_path)

    if not test_connection(engine):
        raise Exception("❌ SQLite fallback also failed")

    print(f"✅ Connected to SQLite ({db_path})")
    return engine