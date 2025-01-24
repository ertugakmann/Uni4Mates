// app/api/test-connection/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "Database Connected to Web" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Database could not connected!", error: error.message },
      { status: 500 }
    );
  }
}
