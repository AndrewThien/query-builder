import azure.functions as func


app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)


@app.route(route="http_trigger")
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    # Process the request
    req_json: dict = req.get_json()
    table_name: str = req_json.get("table", "")
    conditions: list = req_json.get("conditions", [])
    # Generate SQL
    sql = f"{table_name}{conditions}"

    return func.HttpResponse(
        sql,
        status_code=200,
    )
