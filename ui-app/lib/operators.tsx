export default function Operators({ data_type }: { data_type: string }) {
  if (data_type == "int" || data_type == "float") {
    return [
      { value: 1, label: ">" },
      { value: 2, label: "<" },
      { value: 3, label: ">=" },
      { value: 4, label: "<=" },
      { value: 5, label: "=" },
      { value: 6, label: "!=" },
      { value: 7, label: "<>" },
      { value: 9, label: "!>" },
      { value: 10, label: "!<" },
    ];
  }
  if (data_type == "date" || data_type == "datetime") {
    return [
      { value: 1, label: ">" },
      { value: 2, label: "<" },
      { value: 3, label: ">=" },
      { value: 4, label: "<=" },
      { value: 5, label: "=" },
      { value: 6, label: "!=" },
      { value: 7, label: "<>" },
      { value: 9, label: "!>" },
      { value: 10, label: "!<" },
      { value: 12, label: "BETWEEN" },
    ];
  }
  if (
    data_type == "varchar" ||
    data_type == "nvarchar" ||
    data_type == "varbinary"
  ) {
    return [
      { value: 5, label: "=" },
      { value: 6, label: "!=" },
      { value: 11, label: "LIKE" },
    ];
  }
  return [{ value: 0, label: "Not supported data type" }];
}
