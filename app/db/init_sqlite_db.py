import sqlite3

def init_db():
    conn = sqlite3.connect("sample.db")
    cursor = conn.cursor()

    # Drop tables if they exist
    cursor.execute("DROP TABLE IF EXISTS customers")
    cursor.execute("DROP TABLE IF EXISTS orders")

    # Create customers table
    cursor.execute("""
    CREATE TABLE customers (
        id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        country TEXT
    )
    """)

    # Create orders table
    cursor.execute("""
    CREATE TABLE orders (
        id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        amount REAL,
        status TEXT,
        created_at TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(id)
    )
    """)

    # Insert sample customers
    customers = [
        (1, "Alice Johnson", "alice@example.com", "USA"),
        (2, "Bob Smith", "bob@example.com", "USA"),
        (3, "Charlie Brown", "charlie@example.com", "Canada"),
        (4, "David Lee", "david@example.com", "UK"),
    ]

    cursor.executemany(
        "INSERT INTO customers VALUES (?, ?, ?, ?)", customers
    )

    # Insert sample orders
    orders = [
        (1, 1, 120.50, "completed", "2025-02-10"),
        (2, 1, 80.00, "completed", "2025-02-15"),
        (3, 2, 200.00, "pending", "2025-03-01"),
        (4, 3, 150.75, "completed", "2025-03-05"),
        (5, 4, 300.20, "cancelled", "2025-03-10"),
        (6, 2, 50.00, "completed", "2025-03-12"),
    ]

    cursor.executemany(
        "INSERT INTO orders VALUES (?, ?, ?, ?, ?)", orders
    )

    conn.commit()
    conn.close()
    print("✅ SQLite DB created: sample.db")

if __name__ == "__main__":
    init_db()