import { NextRequest } from "next/server";
import { db } from "@/components/archive/db";
import { tableMetadata } from "@/components/archive/db/schema";
import { TableMetaData } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // const data = await req.json();
    // const metadataEntries = data.map((record: TableMetaData) => ({
    //   section: record.section,
    //   columnName: record.column_name,
    //   dataType: record.data_type,
    //   columnDescription: record.column_description,
    //   sensitive: record.sensitive,
    // }));
    // await db.insert(tableMetadata).values(metadataEntries);
    // return NextResponse.json({ message: "Data inserted successfully." });
  } catch (error) {
    // console.error(error);
    // return NextResponse.json(
    //   { error: "Error inserting data." },
    //   { status: 500 }
    // );
  }
}
