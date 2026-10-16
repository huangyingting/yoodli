import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { answerCoachBotQuery } from "@/lib/ai-coach";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  if (format === "csv") {
    const members = await prisma.orgMember.findMany({ orderBy: { yoodlisCount: "desc" } });
    const header = "Name,Email,Role,Group,Reporting Team,Yoodlis Completed,Avg Rubric Score (%),Last Active\n";
    const rows = members
      .map(
        (m) =>
          `"${m.name}","${m.email}","${m.role}","${m.groupName}","${m.reportingTeam}",${m.yoodlisCount},${m.avgScore},"${m.lastActiveAt.toISOString()}"`
      )
      .join("\n");

    return new NextResponse(header + rows, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="yoodli-org-analytics-report.csv"',
      },
    });
  }

  const org = await prisma.organization.findFirst({
    include: {
      members: { orderBy: { yoodlisCount: "desc" } },
      invites: { orderBy: { createdAt: "desc" } },
      groups: true,
      reportingTeams: true,
      personas: true,
      customGoals: true,
      scenarios: { include: { persona: true } },
      questionBanks: true,
      programs: true,
      courses: true,
      practiceLoops: true,
      coachBotDocs: { orderBy: { createdAt: "desc" } },
      integrations: true,
    },
  });

  return NextResponse.json({ org });
}

export async function POST(req: Request) {
  const body = await req.json();
  const org = await prisma.organization.findFirst();
  const orgId = org?.id || "org-acme";

  const actionType = body.entity || body.action;

  switch (actionType) {
    case "persona":
    case "CREATE_PERSONA": {
      const persona = await prisma.persona.create({
        data: {
          orgId,
          name: body.name || "Taylor Morgan",
          title: body.title || "VP of Operations",
          company: body.company || "Enterprise Holdings",
          avatarUrl:
            body.avatarUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
          demeanor: body.demeanor || "Skeptical",
          voiceName: body.voiceName || "Nova (Executive Female)",
          bio: body.bio || "Focused on operational efficiency, security compliance, and measurable ROI.",
          systemPrompt: body.systemPrompt || "Challenge the speaker on timeline, ROI, and risk mitigation.",
        },
      });
      return NextResponse.json({ persona }, { status: 201 });
    }

    case "goal":
    case "CREATE_GOAL": {
      const goal = await prisma.customGoal.create({
        data: {
          orgId,
          title: body.title || "Custom Evaluation Rubric Goal",
          description: body.description || "Evaluates speaker clarity, proof points, and objection resolution.",
          goalType: body.goalType || "RATED",
          category: body.category || "Sales Enablement",
          rubricCriteriaJson: JSON.stringify(
            body.criteria || [
              "Clearly state value proposition and business impact",
              "Cite specific customer evidence or metric",
              "Confirm next step with stakeholder",
            ]
          ),
          passThreshold: Number(body.passThreshold) || 80,
        },
      });
      return NextResponse.json({ goal }, { status: 201 });
    }

    case "program":
    case "CREATE_PROGRAM": {
      const program = await prisma.program.create({
        data: {
          orgId,
          title: body.title || "New Enterprise Certification Program",
          description: body.description || "Structured multi-step roleplay and pitch certification track.",
          status: body.status || "PUBLISHED",
          dueDate: body.dueDate || "Dec 31, 2026",
          bannerColor: body.bannerColor || "#524FFC",
          assignedGroups: body.assignedGroups || "Enterprise Sales NA",
          stepsJson: JSON.stringify(
            body.steps || [
              {
                stepNumber: 1,
                title: "Executive Narrative & Playbook Overview",
                type: "VIDEO",
                durationMin: 10,
                status: "NOT_STARTED",
                score: null,
                description: "Watch the enablement kickoff walkthrough.",
              },
              {
                stepNumber: 2,
                title: "AI Roleplay Certification Simulation",
                type: "ROLEPLAY",
                scenarioId: "scen-objection-sec",
                durationMin: 15,
                status: "NOT_STARTED",
                score: null,
                description: "Achieve 80%+ on the AI Persona objection simulation.",
              },
            ]
          ),
        },
      });
      return NextResponse.json({ program }, { status: 201 });
    }

    case "question-bank":
    case "CREATE_QUESTION_BANK": {
      const questionBank = await prisma.questionBank.create({
        data: {
          orgId,
          title: body.title || "Custom Discovery & Interview Question Bank",
          category: body.category || "Sales Discovery",
          description: body.description || "Curated questions for structured practice sessions.",
          questionsJson: JSON.stringify(
            body.questions || [
              "What is the #1 business priority for your team this quarter?",
              "How are you currently measuring the cost of manual workflows?",
            ]
          ),
        },
      });
      return NextResponse.json({ questionBank }, { status: 201 });
    }

    case "loop":
    case "CREATE_LOOP": {
      const loop = await prisma.practiceLoop.create({
        data: {
          orgId,
          title: body.title || "Weekly Rapid Objection Micro-Drill",
          description: body.description || "Recurring 3-minute practice loop to build muscle memory.",
          focusArea: body.focusArea || "AUTHORITY",
          cadence: body.cadence || "Weekly",
          assignedGroup: body.assignedGroup || "Enterprise Sales NA",
          goalTitle: body.goalTitle || "Uncover Quantified Business Pain",
        },
      });
      return NextResponse.json({ loop }, { status: 201 });
    }

    case "document":
    case "UPLOAD_DOC": {
      const doc = await prisma.coachBotDocument.create({
        data: {
          orgId,
          title: body.title || "New Enterprise Enablement Asset.pdf",
          fileType: body.fileType || "PDF",
          fileSize: body.fileSize || "2.1 MB",
          category: body.category || "Battlecard",
          contentSummary:
            body.contentSummary ||
            "Uploaded enablement playbook indexed for CoachBot RAG and Knowledge-Based Rubric Goals.",
          uploadedBy: "Alex Rivera",
        },
      });
      return NextResponse.json({ doc }, { status: 201 });
    }

    case "coachbot-ask":
    case "ASK_COACHBOT": {
      const docs = await prisma.coachBotDocument.findMany({ where: { orgId } });
      const response = answerCoachBotQuery(body.question || "", docs);
      return NextResponse.json(response);
    }

    case "invite":
    case "INVITE_MEMBER": {
      const invite = await prisma.orgInvite.create({
        data: {
          orgId,
          email: body.email || "new.rep@acme.io",
          role: body.role || "MEMBER",
          groupName: body.groupName || "Enterprise Sales NA",
          status: "PENDING",
          invitedBy: "Alex Rivera",
        },
      });
      return NextResponse.json({ invite }, { status: 201 });
    }

    case "group": {
      const group = await prisma.orgGroup.create({
        data: {
          orgId,
          name: body.name || "New Enablement Hub",
          description: body.description || "Cohort group for targeted roleplay programs.",
          leadName: body.leadName || "Alex Rivera",
          memberCount: Number(body.memberCount) || 12,
        },
      });
      return NextResponse.json({ group }, { status: 201 });
    }

    case "team": {
      const team = await prisma.reportingTeam.create({
        data: {
          orgId,
          name: body.name || "New Regional Sales Pod",
          managerName: body.managerName || "Sarah Chen",
          managerEmail: body.managerEmail || "sarah.chen@acme.io",
          directReports: Number(body.directReports) || 8,
        },
      });
      return NextResponse.json({ team }, { status: 201 });
    }

    case "toggle-integration":
    case "TOGGLE_INTEGRATION": {
      const existing = await prisma.orgIntegration.findUnique({
        where: { id: body.id || body.integrationId },
      });
      if (existing) {
        const updated = await prisma.orgIntegration.update({
          where: { id: existing.id },
          data: {
            connected: !existing.connected,
            lastSyncedAt: !existing.connected ? "Just now" : null,
          },
        });
        return NextResponse.json({ integration: updated });
      }
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    case "settings": {
      const updatedOrg = await prisma.organization.update({
        where: { id: orgId },
        data: {
          ...(body.name !== undefined ? { name: body.name } : {}),
          ...(body.domain !== undefined ? { domain: body.domain } : {}),
          ...(body.defaultSharing !== undefined ? { defaultSharing: body.defaultSharing } : {}),
          ...(body.ssoEnabled !== undefined ? { ssoEnabled: Boolean(body.ssoEnabled) } : {}),
          ...(body.scimEnabled !== undefined ? { scimEnabled: Boolean(body.scimEnabled) } : {}),
          ...(body.sampleDataMode !== undefined ? { sampleDataMode: Boolean(body.sampleDataMode) } : {}),
        },
      });
      return NextResponse.json({ org: updatedOrg });
    }

    case "user-account": {
      const user = await prisma.user.findFirst({ where: { id: body.userId || "user-alex" } });
      if (user) {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            ...(body.name !== undefined ? { name: body.name } : {}),
            ...(body.jobTitle !== undefined ? { jobTitle: body.jobTitle } : {}),
            ...(body.defaultPrivacy !== undefined ? { defaultPrivacy: body.defaultPrivacy } : {}),
            ...(body.preferredLanguage !== undefined ? { preferredLanguage: body.preferredLanguage } : {}),
            ...(body.aiCoachingEnabled !== undefined ? { aiCoachingEnabled: Boolean(body.aiCoachingEnabled) } : {}),
            ...(body.workspaceMode !== undefined ? { workspaceMode: body.workspaceMode } : {}),
            ...(body.onboardingCompleted !== undefined ? { onboardingCompleted: Boolean(body.onboardingCompleted) } : {}),
            ...(body.primaryGoal !== undefined ? { primaryGoal: body.primaryGoal } : {}),
          },
        });
        return NextResponse.json({ user: updatedUser });
      }
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    default:
      return NextResponse.json({ error: "Unknown entity action" }, { status: 400 });
  }
}
