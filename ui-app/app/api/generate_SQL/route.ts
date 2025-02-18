import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const response = await axios.post(
      process.env.WORKERS_URL
        ? `${process.env.WORKERS_URL}?code=${process.env.WORKERS_KEY}`
        : "http://localhost:7071/api/sqlgeneration",
      data
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.response?.data || "Error processing request";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
