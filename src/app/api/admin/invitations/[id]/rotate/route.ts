import { NextRequest, NextResponse } from "next/server";
import {
  AccountAdmissionError,
  accountAdmissionSecretLink,
  rotateAccountInvitation,
} from "@/lib/account-admission";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const grant = await rotateAccountInvitation(id);
    const inviteUrl = accountAdmissionSecretLink(
      "/invite",
      grant.token,
      req.url
    );

    return NextResponse.json({
      invitation: {
        id: grant.invitation.id,
        email: grant.invitation.email,
        status: grant.invitation.status,
        expiresAt: grant.invitation.expiresAt.toISOString(),
      },
      token: grant.token,
      inviteUrl,
      delivery: grant.delivery,
    });
  } catch (error) {
    if (error instanceof AccountAdmissionError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: "rotate_failed", message: "Unable to rotate invitation." },
      { status: 500 }
    );
  }
}
