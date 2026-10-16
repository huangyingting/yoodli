import { NextRequest, NextResponse } from "next/server";
import {
  AccountAdmissionError,
  accountAdmissionMode,
  beginPublicRegistration,
  registerWithInvitation,
  setDatabaseSessionCookie,
} from "@/lib/account-admission";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const name = typeof body?.name === "string" ? body.name : undefined;
    const primaryGoal =
      typeof body?.primaryGoal === "string" ? body.primaryGoal : undefined;
    const token = typeof body?.token === "string" ? body.token : "";
    const mode = accountAdmissionMode();

    if (mode === "invitation-only") {
      if (!token) {
        return NextResponse.json(
          {
            error: "invitation_required",
            message:
              "A valid invitation link is required to create a Yoodli account.",
          },
          { status: 403 }
        );
      }

      const { user, session, orgSlug } = await registerWithInvitation({
        email,
        password,
        name,
        primaryGoal,
        token,
      });

      const response = NextResponse.json(
        {
          mode,
          status: "registered",
          userId: user.id,
          user,
          orgSlug,
        },
        { status: 201 }
      );
      setDatabaseSessionCookie(response, session);
      return response;
    }

    const result = await beginPublicRegistration({
      email,
      password,
      name,
      primaryGoal,
    });
    return NextResponse.json(
      {
        mode,
        status: "verification_pending",
        expiresAt: result.expiresAt.toISOString(),
      },
      { status: 202 }
    );
  } catch (error) {
    if (error instanceof AccountAdmissionError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      {
        error: "registration_failed",
        message: "Unable to complete registration.",
      },
      { status: 500 }
    );
  }
}
