import { NextRequest, NextResponse } from "next/server";
import {
  AccountAdmissionError,
  revokeAccountInvitation,
} from "@/lib/account-admission";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const invitation = await revokeAccountInvitation(id);
    return NextResponse.json({
      invitation: {
        id: invitation.id,
        status: invitation.status,
        revokedAt: invitation.revokedAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    if (error instanceof AccountAdmissionError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: "revoke_failed", message: "Unable to revoke invitation." },
      { status: 500 }
    );
  }
}
