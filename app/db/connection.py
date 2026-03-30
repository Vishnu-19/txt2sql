from sqlalchemy import create_engine, text, inspect
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


def create_mysql_engine(
    username: str,
    password: str,
    host: str,
    port: int,
    database: str
) -> Engine:
    url = f"mysql+pymysql://{username}:{password}@{host}:{port}/{database}"
    return create_engine(url)


def create_engine_from_uri(db_uri: str) -> Engine:
    """Create engine directly from connection URI"""
    return create_engine(db_uri)


def test_connection(engine: Engine) -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


def get_tables(engine: Engine) -> list:
    """Get list of all tables in the database"""
    try:
        inspector = inspect(engine)
        return inspector.get_table_names()
    except Exception as e:
        print(f"Error retrieving tables: {e}")
        return []


def create_db_engine(config: dict) -> Engine:
    """
    Smart engine creator:
    1. Try URI if provided
    2. Try PostgreSQL if valid config provided
    3. Try MySQL if valid config provided
    4. Fallback to SQLite otherwise
    """

    # Try URI first
    if config.get("db_uri"):
        try:
            engine = create_engine_from_uri(config["db_uri"])
            if test_connection(engine):
                print("✅ Connected via URI")
                return engine
            else:
                raise Exception("URI connection test failed")
        except Exception as e:
            print(f"⚠️ URI connection failed: {e}")
            raise Exception(f"Invalid database URI: {str(e)}")

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