interface AddConditionInterface {
  (
    column_name: string,
    operator: string,
    value: string,
    reason: string,
    table: string,
    data_type: string
  ): void;
}
