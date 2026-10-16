import { NextRequest, NextResponse } from "next/server";
import {
  accountAdmissionSecretLink,
  requestPasswordReset,
} from "@/lib/account-admission";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email : "";
    const result = await requestPasswordReset(email);

    const resetUrl =
      result && process.env.NODE_ENV !== "production"
        ? accountAdmissionSecretLink("/reset-password", result.token, req.url)
        : null;

    return NextResponse.json(
      {
        status: "accepted",
        message:
          "If an account exists for that email, a password reset link has been generated.",
        resetUrl,
      },
      { status: 202 }
    );
  } catch {
    return NextResponse.json(
      { status: "accepted", resetUrl: null },
      { status: 202 }
    );
  }
}
