import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAiRoleplayDraft } from "@/lib/ai-coach";

export async function GET() {
  const [scenarios, personas, goals] = await Promise.all([
    prisma.roleplayScenario.findMany({
      include: { persona: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.persona.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.customGoal.findMany({ orderBy: { usageCount: "desc" } }),
  ]);

  return NextResponse.json({ scenarios, personas, goals });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (body.action === "ai-draft") {
    const draft = generateAiRoleplayDraft(body.prompt || "");
    return NextResponse.json({ draft });
  }

  const org = await prisma.organization.findFirst();
  const defaultPersona = await prisma.persona.findFirst();

  const colors: Record<string, string> = {
    OBJECTION_HANDLING: "#F1B6EB",
    COLD_CALL: "#8ED6F3",
    INBOUND_DISCOVERY_CALL: "#F6D99B",
    OUTBOUND_DISCOVERY_CALL: "#8EAAFF",
    BEHAVIORAL_INTERVIEW: "#D9D2BB",
    TECHNICAL_INTERVIEW: "#D9D2BB",
    PITCH: "#F5B9B0",
    MANAGER_PERF_REVIEW: "#B0E0AA",
  };

  const category = body.category || "OBJECTION_HANDLING";
  const scenario = await prisma.roleplayScenario.create({
    data: {
      orgId: org?.id || "org-acme",
      personaId: body.personaId || defaultPersona?.id || "persona-dana",
      title: body.title || "Custom Enterprise Roleplay",
      description:
        body.description ||
        body.scenarioContext ||
        "Custom AI roleplay scenario with rubric evaluation.",
      category,
      difficulty: body.difficulty || "Intermediate",
      roundelColor: colors[category] || "#D3A7FF",
      visibility: body.visibility || "ORG",
      starterPrompt:
        body.starterPrompt ||
        "Thanks for joining today. Walk me through your proposal and how you justify the ROI for our team.",
      scenarioContext:
        body.scenarioContext ||
        "Custom scenario created via Yoodli Builder.",
      goalsJson: JSON.stringify(
        Array.isArray(body.goals) && body.goals.length > 0
          ? body.goals
          : [
              "Uncover quantified business pain with open-ended discovery questions",
              "Address stakeholder objections with concrete proof points",
              "Lock in a specific, time-bound next step",
            ]
      ),
      questionsJson: JSON.stringify(body.questions || []),
      createdBy: body.createdBy || "Alex Rivera",
    },
    include: { persona: true },
  });

  return NextResponse.json({ scenario }, { status: 201 });
}
