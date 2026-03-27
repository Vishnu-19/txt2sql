from sqlalchemy import inspect

def extract_schema(engine):
    inspector = inspect(engine)

    schema = []

    for table_name in inspector.get_table_names():
        columns = inspector.get_columns(table_name)

        schema.append({
            "table": table_name,
            "columns": [
                {
                    "name": col["name"],
                    "type": str(col["type"])
                }
                for col in columns
            ]
        })

    return schema


def format_schema_for_prompt(schema):
    output = ""
    for table in schema:
        output += f"\nTable: {table['table']}\nColumns:\n"
        for col in table["columns"]:
            output += f"- {col['name']} ({col['type']})\n"
    return output