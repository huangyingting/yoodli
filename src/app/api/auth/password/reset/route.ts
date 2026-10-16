import { NextRequest, NextResponse } from "next/server";
import {
  AccountAdmissionError,
  resetPassword,
} from "@/lib/account-admission";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = typeof body?.token === "string" ? body.token : "";
    const password = typeof body?.password === "string" ? body.password : "";

    const result = await resetPassword({ token, password });
    return NextResponse.json({ status: "reset", userId: result.userId });
  } catch (error) {
    if (error instanceof AccountAdmissionError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: "reset_failed", message: "Unable to reset password." },
      { status: 500 }
    );
  }
}
