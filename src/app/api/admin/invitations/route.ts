import { NextRequest, NextResponse } from "next/server";
import {
  AccountAdmissionError,
  accountAdmissionMode,
  accountAdmissionSecretLink,
  createAccountInvitation,
  listAccountInvitations,
} from "@/lib/account-admission";

export async function GET() {
  try {
    const invitations = await listAccountInvitations();
    return NextResponse.json({
      mode: accountAdmissionMode(),
      invitations,
    });
  } catch (error) {
    console.error("Error listing invitations:", error);
    return NextResponse.json(
      { error: "list_failed", message: "Unable to list invitations." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email : "";
    const expiresAt =
      typeof body?.expiresAt === "string"
        ? new Date(body.expiresAt)
        : undefined;

    const grant = await createAccountInvitation({
      email,
      expiresAt,
    });

    const inviteUrl = accountAdmissionSecretLink(
      "/invite",
      grant.token,
      req.url
    );

    return NextResponse.json(
      {
        invitation: {
          id: grant.invitation.id,
          email: grant.invitation.email,
          status: grant.invitation.status,
          expiresAt: grant.invitation.expiresAt.toISOString(),
          createdAt: grant.invitation.createdAt.toISOString(),
        },
        token: grant.token,
        inviteUrl,
        delivery: grant.delivery,
      },
      { status: 201 }
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
        error: "create_invitation_failed",
        message: "Unable to create invitation.",
      },
      { status: 500 }
    );
  }
}
