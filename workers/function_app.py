import azure.functions as func
from core import generate_sql

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)


@app.route(route="sqlgeneration")
def sqlGeneration(req: func.HttpRequest) -> func.HttpResponse:
    # Process the request
    req_json: dict = req.get_json()
    table_name: str = req_json.get("table", "")
    conditions: list = req_json.get("conditions", [])
    try:
        # Generate SQL
        sql = generate_sql(table_name=table_name, conditions=conditions)
        # TODO: Handle errors
        return func.HttpResponse(
            sql,
            status_code=200,
        )
    except Exception as e:
        return func.HttpResponse(
            str(e),
            status_code=500,
        )
