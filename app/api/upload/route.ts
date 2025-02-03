import { NextApiRequest } from "next";
import { parse } from "csv-parse/sync";
import { db } from "@/lib/db";
import { tableMetadata } from "@/lib/db/schema";
import { TableMetaData } from "@/types/table";
import { NextResponse } from "next/server";

export const POST = async (req: NextApiRequest) => {
  try {
    const file = req.body;
    console.log("🚀 ~ POST ~ file:", typeof file);
    const fileContent =
      typeof file === "string" ? file : file.toString("utf-8");
    const records = parse(fileContent, { columns: true });

    console.log("🚀 ~ POST ~ records:", records);
    const metadataEntries = records.map((record: TableMetaData) => ({
      section: record.section,
      columnName: record.column_name,
      dataType: record.data_type,
      columnDescription: record.column_description,
      sensitive: record.sensitive,
    }));

    await db.insert(tableMetadata).values(metadataEntries);

    return NextResponse.json({ message: "Data inserted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error inserting data." },
      { status: 500 }
    );
  }
};
