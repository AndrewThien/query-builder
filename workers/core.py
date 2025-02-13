import logging
from sqlalchemy import select, text
from sqlalchemy.sql import and_
from sqlalchemy.sql.expression import ClauseElement
from sqlalchemy.dialects import mssql
from utils import forming_columns_schema, building_filters


def generate_sql(table_name: str, conditions: list):
    """Generate SQL query using SQLAlchemy"""
    # TODO: Confirm if Airflow works without table schema
    column_schema = forming_columns_schema(conditions=conditions)
    columns_with_filter = [
        col for col in conditions if col["operator"] and col["value"]
    ]
    try:
        # Build filters based on columns with filters
        filters = building_filters(
            column_schema=column_schema, conditions=columns_with_filter
        )
        # Create query clause
        query: ClauseElement = (
            select(*column_schema.values())
            .select_from(text(f"[{table_name}]"))
            .where(and_(*filters))
            .distinct()
        )
        #  Compile, convert and validate it
        compiled_query = query.compile(
            dialect=mssql.dialect(), compile_kwargs={"literal_binds": True}
        )
        compiled_query_str = str(compiled_query)
        if not compiled_query_str.strip():
            raise ValueError(f"Empty query generated for table {table_name}")
        return compiled_query_str

    except Exception as e:
        logging.error(f"Error generating SQL query: {e}")
        raise ValueError(f"Task failed due to: {e}")
