import logging
from sqlalchemy import select, MetaData
from sqlalchemy.sql import and_
from sqlalchemy.sql.expression import ClauseElement
from sqlalchemy.sql.schema import Table
from sqlalchemy.dialects import mssql
from utils import convert_columns, building_conditions


def generate_sql(table_name: str, conditions: list):
    """Generate SQL query using SQLAlchemy"""
    # Create SQLAlchemy engine for metadata reflection
    metadata = MetaData()
    # TODO: Need refactoring
    column_definitions = convert_columns(conditions=conditions)

    # Create a "mock" table schema
    table_schema = Table(table_name, metadata, *column_definitions.values())

    try:
        # TODO: improve naming
        selected_columns = [
            col for col in conditions if not col["operator"] or not col["value"]
        ]

        selected = convert_columns(selected_columns)

        valid_conditions = [
            col for col in conditions if col["operator"] and col["value"]
        ]

        built_conditions = building_conditions(
            table=table_schema, conditions=valid_conditions
        )

        # Create and validate select query
        # TODO: Distinct function only works when selecting specific columns, not records, need confirming
        query: ClauseElement = (
            select(*selected.values())
            .select_from(table_schema)
            .where(and_(*built_conditions))
            .distinct()
        )

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
