import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { tableMetadata } from "@/lib/db/schema";
import { TableMetaData } from "@/types/table";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const response = await axios.post(
      process.env.WORKERS_URL
        ? `${process.env.WORKERS_URL}?code=${process.env.WORKERS_KEY}`
        : "http://localhost:7071/api/sqlGeneration",
      data
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
