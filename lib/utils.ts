import { Condition } from "@/components/QueryBuilder";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cleanColumnDescription = (rows: string[][]): string[][] => {
  return rows.map((row) => {
    // Create a copy of the row to avoid mutating original
    const cleanedRow = [...row];

    // If the column description (4th column) spans multiple cells
    if (cleanedRow.length > 4) {
      // Combine additional cells into the description
      const description = cleanedRow
        .slice(3, cleanedRow.length - 1)
        .join(" ")
        .trim();

      // Keep only the first 4 original columns, with combined description
      return [
        cleanedRow[0],
        cleanedRow[1],
        cleanedRow[2],
        description,
        cleanedRow[cleanedRow.length - 1],
      ];
    }

    return cleanedRow;
  });
};

export const generateSQLQuery = (
  conditions: Condition[],
  table: string
): string => {
  if (!table) return "";
  let query = `SELECT * FROM ${table}`;
  if (conditions.length > 0) {
    const conditionStrings = conditions.map(
      ({ column_name, operator, value }) => {
        if (operator.toLowerCase() === "between") {
          const [val1, val2] = value.split(",");
          return `${column_name} BETWEEN '${val1.trim()}' AND '${val2.trim()}'`;
        }
        return `${column_name} ${operator} '${value}'`;
      }
    );
    query += ` WHERE ${conditionStrings.join(" AND ")}`;
  }
  return query;
};
