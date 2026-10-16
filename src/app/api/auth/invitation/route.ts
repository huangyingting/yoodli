import { NextRequest, NextResponse } from "next/server";
import { inspectAccountInvitation } from "@/lib/account-admission";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = typeof body?.token === "string" ? body.token : "";
    if (!token) {
      return NextResponse.json(
        { status: "invalid", maskedEmail: null, expiresAt: null },
        { status: 400 }
      );
    }

    const view = await inspectAccountInvitation(token);
    return NextResponse.json({
      id: view.id,
      status: view.status,
      maskedEmail: view.maskedEmail,
      email: view.email || null,
      expiresAt: view.expiresAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Error inspecting invitation:", error);
    return NextResponse.json(
      { status: "invalid", maskedEmail: null, expiresAt: null },
      { status: 500 }
    );
  }
}
