import azure.functions as func
import logging
from libs.core import generate_sql_new

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)


@app.route(route="sqlGeneration")
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
