import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const user = await getCurrentUserOrDemo();

  const comment = await prisma.speechComment.create({
    data: {
      speechId: id,
      authorName: body.authorName || user.name,
      authorRole: body.authorRole || user.jobTitle,
      timestampSec: Number(body.timestampSec) || 0,
      text: body.text || "Great delivery at this moment!",
      isAiCoach: Boolean(body.isAiCoach),
    },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
