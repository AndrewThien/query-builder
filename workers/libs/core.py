import pandas as pd
import logging
import random
import string
from sqlalchemy import select, text, MetaData, create_engine
from sqlalchemy.sql import and_
from sqlalchemy.sql.expression import ClauseElement
from sqlalchemy.sql.schema import Table
from libs.lib import building_conditions, process_headers, save_sql
from sqlalchemy.dialects import mssql


# TODO: Error handling better
# TODO: How to handle query about tables related to each other by FKs?
def generate_sql(request: dict):
    """Generate SQL query based on dag_run.conf using SQLAlchemy"""
    # Create SQLAlchemy engine for metadata reflection
    # TODO: Understand and Make this more flexible
    # engine = create_engine("postgresql+psycopg2://airflow:airflow@postgres/postgres")
    # metadata = MetaData()

    try:
        # Process the query
        tables = request.get("tables", [])
        queries = []
        queries_headers = []

        # Validate input configuration
        if not tables:
            raise ValueError("No tables defined in configuration")
        if not isinstance(tables, list):
            raise ValueError("Tables configuration must be a list")

        for i, table_dict in enumerate(tables):
            # Validate table configuration
            if "table_name" not in table_dict:
                raise ValueError(f"Table definition {i} missing 'table_name'")
            # Get table name
            table_name = table_dict["table_name"]
            if "conditions" not in table_dict:
                raise ValueError(f"Table {table_name} missing 'conditions'")

            # # Get the table as SQL structure
            # try:
            #     table = Table(table_name, metadata, autoload_with=engine)
            # except Exception:
            #     raise ValueError(
            #         f"Failed to get the table named {table_name}."
            #     )

            # Build conditions using SQLAlchemy
            conditions = building_conditions(
                table=table_name, conditions=table_dict["conditions"]
            )

            # Create and validate select query
            # TODO: Distinct function only works when selecting specific columns, not records, need confirming
            query: ClauseElement = (
                select("*").select_from(table_name).where(and_(*conditions)).distinct()
            )
            # Compile the query with proper value binding
            compiled_query = query.compile(
                dialect=mssql.dialect(), compile_kwargs={"literal_binds": True}
            )
            compiled_query_str = str(compiled_query)
            if not compiled_query_str.strip():
                raise ValueError(f"Empty query generated for table {table_name}")
            queries.append(compiled_query_str)

            # # Create and validate headers query
            # headers_query: ClauseElement = (
            #     select(text("column_name"))
            #     .select_from(text("information_schema.columns"))
            #     .where(text(f"table_name = '{table_name}'"))
            # )
            # compiled_headers = headers_query.compile(dialect=engine.dialect)
            # queries_headers.append(str(compiled_headers))

        # Validate generated queries
        if not queries:
            raise ValueError("No SQL queries generated for data extraction")
        if not queries_headers:
            raise ValueError("No header queries generated")

        # Save validated SQL queries
        save_sql(file_name="sql_data_query.sql", query=queries)
        # save_sql(file_name="sql_headers_query.sql", query=queries_headers)

    except Exception as e:
        logging.error(f"Error generating SQL query: {e}")
        raise ValueError(f"Task failed due to: {e}")


def save_data(**context):
    """Save the data to final CSV location"""
    task_instance: TaskInstance = context["task_instance"]
    try:
        # Get and porcess headers
        table_headers = process_headers(task_instance.xcom_pull(task_ids="get_headers"))
        # Get query data
        query_results = task_instance.xcom_pull(task_ids="get_data")
        query_id = task_instance.xcom_pull(key="query_id", task_ids="generate_sql")
        # Check if query_results is None or empty
        if not query_results:
            raise ValueError("No data retrieved from get_data task")

        # Iterate over the query results and save each to a separate CSV file
        for i, query_result in enumerate(query_results):
            # Convert the result to a DataFrame
            df = pd.DataFrame(query_result)

            # Generate a random string of letters and digits
            random_string = "".join(
                random.choices(string.ascii_letters + string.digits, k=5)
            )
            # get table name according to the query
            table_name = task_instance.xcom_pull(
                key=f"table_name_{i}", task_ids="generate_sql"
            )
            # build file name
            file_name = (
                f"Query:{query_id}_Table:{table_name}_FileId:{random_string}.csv"
            )
            # Define file paths
            final_path = f"/opt/airflow/dags/data/{file_name}"

            # Save to final location for two scenarios
            if df.empty:
                df.to_csv(final_path, index=False)
                logging.info(f"Query data from table {table_name} returned empty")
            else:
                df.to_csv(final_path, index=False, header=table_headers[i])
                logging.info(
                    f"Data queried from table {table_name} saved to {final_path}"
                )

    except FileNotFoundError as e:
        logging.error(f"File not found: {e}")
        raise ValueError(f"File not found: {e}")
    except pd.errors.EmptyDataError as e:
        logging.error(f"Empty data error: {e}")
        raise ValueError(f"Empty data error: {e}")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise ValueError(f"Task failed due to: {e}")


def save_data_sql_server(**context):
    """Save the data to final CSV location"""
    task_instance: TaskInstance = context["task_instance"]
    try:
        # Get query data
        query_results = task_instance.xcom_pull(task_ids="get_all_countries")
        print(query_results)

        # Check if query_results is None or empty
        if not query_results:
            raise ValueError("No data retrieved from get_data task")

        # Convert the result to a DataFrame
        df = pd.DataFrame(query_results, columns=["ID", "Country", "Continent"])

        # Define file path
        final_path = "/opt/airflow/dags/data/sql_server.csv"

        # Save to final location
        if df.empty:
            df.to_csv(final_path, index=False)
            logging.info("Query data from table returned empty")
        else:
            df.to_csv(final_path, index=False)
            logging.info(f"Data queried from table saved to {final_path}")

    except FileNotFoundError as e:
        logging.error(f"File not found: {e}")
        raise ValueError(f"File not found: {e}")
    except pd.errors.EmptyDataError as e:
        logging.error(f"Empty data error: {e}")
        raise ValueError(f"Empty data error: {e}")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise ValueError(f"Task failed due to: {e}")
