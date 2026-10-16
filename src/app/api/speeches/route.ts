import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { analyzeTranscriptAndDelivery } from "@/lib/speech-analytics";

export async function GET() {
  const speeches = await prisma.speech.findMany({
    include: {
      scenario: { include: { persona: true } },
      comments: { orderBy: { timestampSec: "asc" } },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ speeches });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await getCurrentUserOrDemo();
    const org = await prisma.organization.findFirst();

    const scenario = body.scenarioId
      ? await prisma.roleplayScenario.findUnique({
          where: { id: body.scenarioId },
          include: { persona: true },
        })
      : null;

    const goals: string[] = scenario?.goalsJson
      ? JSON.parse(scenario.goalsJson)
      : body.goals || [
          "State a clear, audience-centric value proposition",
          "Support claims with concrete metrics and proof points",
          "Maintain < 3% filler words and 120–170 WPM executive pacing",
          "Lock in a concrete, time-bound next step",
        ];

    const rawTurns = Array.isArray(body.turns) && body.turns.length > 0
      ? body.turns
      : [
          {
            speaker: "USER" as const,
            speakerName: user.name,
            startSec: 0,
            endSec: body.durationSeconds || 60,
            text:
              body.transcriptText ||
              "Thanks for meeting today. Our AI roleplay platform helps revenue teams practice high-stakes objections before live customer calls, cutting ramp time by 42% and boosting win rates by 28%. Could we schedule a 25-minute review this Thursday at 2 PM?",
          },
        ];

    const computed = analyzeTranscriptAndDelivery({
      rawTurns,
      durationSeconds: Number(body.durationSeconds) || 75,
      practiceType: body.practiceType || "ROLEPLAY",
      scenarioTitle: body.title || scenario?.title || "Practice Session",
      goals,
    });

    const shareSlug =
      body.shareSlug ||
      Math.random().toString(36).substring(2, 6) +
        Math.random().toString(36).substring(2, 6).toUpperCase();

    const speech = await prisma.speech.create({
      data: {
        shareSlug,
        userId: user.id,
        orgId: org?.id || "org-acme",
        scenarioId: scenario?.id || null,
        title: body.title || scenario?.title || "AI Practice Session",
        practiceType: body.practiceType || "ROLEPLAY",
        durationSeconds: Number(body.durationSeconds) || 75,
        visibility: body.visibility || "SHARED_LINK",
        overallScore: computed.overallScore,
        wpmAverage: computed.wpmAverage,
        wpmSeriesJson: JSON.stringify(computed.wpmSeries),
        fillerWordCount: computed.fillerWordCount,
        fillerWordPct: computed.fillerWordPct,
        fillerBreakdownJson: JSON.stringify(computed.fillerBreakdown),
        weakWordCount: computed.weakWordCount,
        weakWordPct: computed.weakWordPct,
        weakBreakdownJson: JSON.stringify(computed.weakBreakdown),
        concisenessScore: computed.concisenessScore,
        rephrasesJson: JSON.stringify(computed.rephrases),
        questionsAskedCount: computed.questionsAskedCount,
        topKeywordsJson: JSON.stringify(computed.topKeywords),
        pausesCount: computed.pausesCount,
        eyeContactPct: computed.eyeContactPct,
        centeringPct: computed.centeringPct,
        smilesPct: computed.smilesPct,
        talkRatioPct: computed.talkRatioPct,
        transcriptJson: JSON.stringify(computed.transcript),
        aiSummary: computed.aiSummary,
        rubricScoresJson: JSON.stringify(computed.rubricScores),
        followUpQuestionsJson: JSON.stringify(computed.followUpQuestions),
      },
    });

    await prisma.speechComment.create({
      data: {
        speechId: speech.id,
        authorName: "Yoodli AI Coach",
        authorRole: "AI Coach",
        timestampSec: 12,
        text: `Analyzed session at ${computed.wpmAverage} WPM with ${computed.fillerWordPct}% filler words and ${computed.overallScore}% overall rubric score.`,
        isAiCoach: true,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        yoodlisRemaining: Math.max(0, user.yoodlisRemaining - 1),
      },
    });

    return NextResponse.json({ speech }, { status: 201 });
  } catch (err) {
    console.error("Create speech error:", err);
    return NextResponse.json({ error: "Failed to save and analyze speech" }, { status: 500 });
  }
}
