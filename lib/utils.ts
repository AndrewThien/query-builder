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
