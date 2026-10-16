import { NextResponse } from "next/server";
import { generatePersonaReply } from "@/lib/ai-coach";

export async function POST(req: Request) {
  const body = await req.json();
  const result = generatePersonaReply({
    personaName: body.personaName || "Dana Sterling",
    personaTitle: body.personaTitle || "VP of Information Security",
    demeanor: body.demeanor || "Skeptical",
    scenarioTitle: body.scenarioTitle || "Enterprise Roleplay",
    userMessage: body.userMessage || "",
    turnIndex: Number(body.turnIndex) || 0,
  });

  return NextResponse.json(result);
}
