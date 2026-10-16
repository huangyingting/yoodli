import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const speech = await prisma.speech.findFirst({
    where: {
      OR: [{ id }, { shareSlug: id }],
    },
    include: {
      scenario: { include: { persona: true } },
      comments: { orderBy: { timestampSec: "asc" } },
      user: true,
    },
  });

  if (!speech) {
    return NextResponse.json({ error: "Speech not found" }, { status: 404 });
  }

  return NextResponse.json({ speech });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const speech = await prisma.speech.update({
    where: { id },
    data: {
      ...(body.title ? { title: body.title } : {}),
      ...(body.visibility ? { visibility: body.visibility } : {}),
    },
  });

  return NextResponse.json({ speech });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await prisma.speech.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
