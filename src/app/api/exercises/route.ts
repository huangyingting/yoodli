import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";

export async function GET() {
  const attempts = await prisma.exerciseAttempt.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ attempts });
}

export async function POST(req: Request) {
  const body = await req.json();
  const user = await getCurrentUserOrDemo();

  const attempt = await prisma.exerciseAttempt.create({
    data: {
      userId: user.id,
      exerciseSlug: body.exerciseSlug || "spin-a-yarn",
      exerciseTitle: body.exerciseTitle || "Spin a Yarn",
      score: Number(body.score) || 900,
      durationSeconds: Number(body.durationSeconds) || 60,
      wordsIncorporated: Number(body.wordsIncorporated) || 5,
      fillerCount: Number(body.fillerCount) || 0,
      transcript: body.transcript || "Completed interactive speaking drill.",
    },
  });

  return NextResponse.json({ attempt }, { status: 201 });
}
