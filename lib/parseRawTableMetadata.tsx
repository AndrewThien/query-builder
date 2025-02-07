import { Columns } from "@/types/table";

const rawData = `
[ETL_ID] [int] IDENTITY(1,1) NOT NULL,
...
`;

const parseColumns = (data: string, table: string): Columns[] => {
  const lines = data.trim().split("\n");
  return lines.map((line) => {
    const match = line.match(/\[(.*?)\] \[(.*?)\](?:\((\d+)\))?(.*)/);
    if (!match) {
      throw new Error(`Invalid line format: ${line}`);
    }

    const [, name, data_type, max_length, rest] = match;
    const primary = rest.includes("IDENTITY");
    const description = rest.includes("NOT NULL") ? "Required" : "Optional";

    return {
      name,
      data_type,
      primary,
      max_length: max_length ? parseInt(max_length, 10) : undefined,
      description,
      table,
    };
  });
};

const columns: Columns[] = parseColumns(rawData, "COSD");
console.log(columns);
