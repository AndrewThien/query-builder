import logging
from sqlalchemy import (
    select,
    MetaData,
)
from sqlalchemy.sql import and_
from sqlalchemy.sql.expression import ClauseElement
from sqlalchemy.sql.schema import Table, Column
from libs.lib import building_conditions
from sqlalchemy.dialects import mssql
from sqlalchemy.sql.sqltypes import (
    INTEGER,
    NVARCHAR,
    BOOLEAN,
    VARBINARY,
    DATE,
    DATETIME,
    FLOAT,
)


def generate_sql_new(table_name: str, conditions: list):
    """Generate SQL query using SQLAlchemy"""
    # Create SQLAlchemy engine for metadata reflection
    metadata = MetaData()
    # TODO: Need refactoring
    column_definitions = {}
    for condition in conditions:
        column_name = condition["column_name"]
        data_type = condition["data_type"]

        # Map the data type
        if data_type == "int":
            column_definitions[column_name] = Column(column_name, INTEGER)
        elif data_type == "date":
            column_definitions[column_name] = Column(column_name, DATE)
        elif data_type == "datetime":
            column_definitions[column_name] = Column(column_name, DATETIME)
        elif data_type == "float":
            column_definitions[column_name] = Column(column_name, FLOAT)
        elif data_type == "nvarchar":
            column_definitions[column_name] = Column(column_name, NVARCHAR)
        elif data_type == "varbinary":
            column_definitions[column_name] = Column(column_name, VARBINARY)
        elif data_type == "boolean":
            column_definitions[column_name] = Column(column_name, BOOLEAN)

    # Create a "mock" table schema
    table_schema = Table(table_name, metadata, *column_definitions.values())

    try:
        # Build conditions using SQLAlchemy
        conditions = building_conditions(table=table_schema, conditions=conditions)

        # Create and validate select query
        # TODO: Distinct function only works when selecting specific columns, not records, need confirming
        query: ClauseElement = (
            select("*").select_from(table_schema).where(and_(*conditions)).distinct()
        )
        # Compile the query with proper value binding
        compiled_query = query.compile(
            dialect=mssql.dialect(), compile_kwargs={"literal_binds": True}
        )
        compiled_query_str = str(compiled_query)
        if not compiled_query_str.strip():
            raise ValueError(f"Empty query generated for table {table_name}")
        # TO works with Airflow, the return value need to be like beneath!?
        # return f'["""{compiled_query_str}"""]'
        return compiled_query_str

    except Exception as e:
        logging.error(f"Error generating SQL query: {e}")
        raise ValueError(f"Task failed due to: {e}")
