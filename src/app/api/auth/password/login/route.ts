import { NextRequest, NextResponse } from "next/server";
import {
  authenticatePassword,
  setDatabaseSessionCookie,
} from "@/lib/account-admission";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";

    const result = await authenticatePassword({ email, password });
    if (!result) {
      return NextResponse.json(
        {
          error: "invalid_credentials",
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      status: "authenticated",
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
    });
    setDatabaseSessionCookie(response, result.session);
    return response;
  } catch {
    return NextResponse.json(
      { error: "login_failed", message: "Unable to sign in." },
      { status: 500 }
    );
  }
}
