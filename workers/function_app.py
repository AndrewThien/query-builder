import azure.functions as func
import logging
from sqlalchemy import select, MetaData
from sqlalchemy.sql import and_
from sqlalchemy.sql.expression import ClauseElement
from sqlalchemy.sql.schema import Table, Column
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
from datetime import datetime
from sqlalchemy import (
    cast,
    String,
    between,
)
from typing import Any, Dict, List


app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)


def cast_value(column: Column, value: Any):
    """Helper function to cast values based on column type"""
    # Get the type in Python of the column in the DB
    python_type = column.type.python_type
    print("python_type: ", python_type.__name__)
    # Checking mismatch
    if not isinstance(value, python_type):
        logging.warning(
            f"There is a type mismatch between column type declared in DB (column: {column.name} - type: {python_type.__name__}) and value type (value: {value} - type: {type(value).__name__}) in JSON config. Trying to cast the value..."
        )
    try:
        if python_type is str:
            return str(value)
        elif python_type is int:
            return int(value)
        elif python_type is float:
            return float(value)
        elif python_type is bool:
            return bool(value)
        elif python_type is bytes:
            return bytes(value, "utf-8")
        elif python_type is datetime.date:
            return datetime(value)
        # TODO: do we need to handle datetime ("%Y-%m-%d %H:%M:%S") cast as well?
        logging.info("Casting successfully!")
        return value
    except Exception as e:
        logging.error(f"Error casting value for column {column.name}: {e}")
        raise ValueError(f"Error casting value for column {column.name}: {e}")


def handle_between_condition(column: Column, value: List[Any]) -> Any:
    """Handle BETWEEN condition"""
    if not isinstance(value, list) or len(value) != 2:
        raise ValueError("BETWEEN operator requires a list of [start, end] values")
    start_value = cast_value(column, value[0])
    end_value = cast_value(column, value[1])
    return between(column, start_value, end_value)


def building_conditions(table: Table, conditions: List[Dict[str, Any]]) -> List[Any]:
    """Build conditions using SQLAlchemy"""
    operator_map = {
        "=": lambda col, val: col == val,
        "!=": lambda col, val: col != val,
        ">": lambda col, val: col > val,
        "<": lambda col, val: col < val,
        ">=": lambda col, val: col >= val,
        "<=": lambda col, val: col <= val,
        "like": lambda col, val: cast(col, String).like(val),
    }

    built_conditions = []
    for col in conditions:
        # Get the column as SQL structure, value and the operator for each condition
        column: Column = getattr(table.c, col["column_name"])
        operator = col["operator"].strip().lower()
        value = col["value"]

        if operator == "between":
            built_conditions.append(handle_between_condition(column, value))
        elif operator in operator_map:
            casted_value = cast_value(column, value)
            built_conditions.append(operator_map[operator](column, casted_value))
        else:
            raise ValueError(f"Unsupported operator: {operator}")

    return built_conditions


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
    # queries_list = []
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
        # queries_list.append(f"""{compiled_query_str}""")
        # # Create and validate headers query
        # headers_query: ClauseElement = (
        #     select(text("column_name"))
        #     .select_from(text("information_schema.columns"))
        #     .where(text(f"table_name = '{table_name}'"))
        # )
        # compiled_headers = headers_query.compile(dialect=mssql.dialect())
        # queries_list.append(f"""{str(compiled_headers)}""")
        # return f'["""{compiled_query_str}""", """{str(compiled_headers)}"""]'
        return compiled_query_str

    except Exception as e:
        logging.error(f"Error generating SQL query: {e}")
        raise ValueError(f"Task failed due to: {e}")


@app.function_name(name="sqlgeneration")
@app.route(route="sqlgeneration")
def sqlGeneration(req: func.HttpRequest) -> func.HttpResponse:
    # Process the request
    req_json: dict = req.get_json()
    table_name: str = req_json.get("table", "")
    conditions: list = req_json.get("conditions", [])
    # Generate SQL
    sql = generate_sql_new(table_name=table_name, conditions=conditions)

    return func.HttpResponse(
        sql,
        status_code=200,
    )
