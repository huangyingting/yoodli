import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import {
  Building2,
  CheckCircle2,
  Users,
  MessagesSquare,
  Target,
  Award,
  BarChart3,
  ArrowRight,
  Sparkles,
  Bot,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrgOverviewPage() {
  const user = await getCurrentUserOrDemo();
  const [org, speechCount, scenarioCount, personaCount, goalCount, programCount, memberCount] =
    await Promise.all([
      prisma.organization.findFirst(),
      prisma.speech.count(),
      prisma.roleplayScenario.count(),
      prisma.persona.count(),
      prisma.customGoal.count(),
      prisma.program.count(),
      prisma.orgMember.count(),
    ]);

  const onboardingSteps = [
    {
      step: "1. Setup",
      title: "Configure Workspace & SSO",
      desc: "Invite reps, define reporting teams, and connect Salesforce, Gong, or Zoom.",
      href: "/org/people/members",
      done: true,
    },
    {
      step: "2. Create",
      title: "Build Personas, Rubrics & Scenarios",
      desc: "Author custom AI buyer personas, 4-type rubric goals, and CoachBot playbooks.",
      href: "/org/content/roleplays",
      done: true,
    },
    {
      step: "3. Assign",
      title: "Launch Programs & Recurring Loops",
      desc: "Enroll sales and leadership cohorts in certification tracks and weekly practice loops.",
      href: "/org/content/programs",
      done: true,
    },
    {
      step: "4. Practice",
      title: "Simulate High-Stakes Calls",
      desc: "Members complete voice/video roleplays and receive instant rubric & delivery feedback.",
      href: "/roleplays",
      done: true,
    },
    {
      step: "5. Analyze",
      title: "Measure Readiness & Export Data",
      desc: "Track team completion, goal mastery heatmaps, and rep score distributions.",
      href: "/org/analytics/overview",
      done: true,
    },
  ];

  return (
    <AppShell user={user}>
      <div className="space-y-8">
        {/* Enterprise Hero */}
        <div className="rounded-3xl p-7 bg-yoodli-dark-hero text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-cyan-300">
              <Building2 className="w-3.5 h-3.5" />
              <span>ENTERPRISE ADMIN CONTROL CENTER • {org?.planName || "ENTERPRISE"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {org?.name || "Acme Corp Global Revenue"}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Orchestrate AI Roleplays, custom evaluation rubrics, CoachBot RAG playbooks, and certification programs across your entire revenue and leadership organization.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/org/content/roleplays/create"
              className="px-4 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Roleplay</span>
            </Link>
            <Link
              href="/org/analytics/overview"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Org Analytics</span>
            </Link>
          </div>
        </div>

        {/* 5-Stage Admin Lifecycle Stepper (Reverse engineered from /org/overview) */}
        <div className="space-y-3">
          <h2 className="text-base font-extrabold text-[#040348]">
            Enterprise Enablement Workflow (5-Step Rollout Blueprint)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {onboardingSteps.map((s) => (
              <Link
                key={s.step}
                href={s.href}
                className="bg-white rounded-2xl p-4 border border-indigo-100 hover:border-[#524FFC] shadow-2xs transition flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E6E5FF] text-[#524FFC]">
                      {s.step}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[#0FA16D]" />
                  </div>
                  <h3 className="font-bold text-sm text-[#040348] group-hover:text-[#524FFC]">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                <span className="text-xs font-bold text-[#524FFC] flex items-center gap-1">
                  Configure <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Live Organization Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Active Members", value: memberCount, href: "/org/people/members", icon: Users },
            { label: "Roleplay Scenarios", value: scenarioCount, href: "/org/content/roleplays", icon: MessagesSquare },
            { label: "AI Personas", value: personaCount, href: "/org/content/personas", icon: Bot },
            { label: "Custom Rubric Goals", value: goalCount, href: "/org/content/goals", icon: Target },
            { label: "Certifications", value: programCount, href: "/org/content/programs", icon: Award },
            { label: "Analyzed Sessions", value: speechCount, href: "/org/analytics/reports-data", icon: BarChart3 },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-white rounded-2xl p-4 border border-indigo-100 hover:border-[#524FFC] shadow-2xs space-y-1.5 transition"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>{stat.label}</span>
                  <Icon className="w-4 h-4 text-[#524FFC]" />
                </div>
                <div className="text-2xl font-extrabold text-[#040348]">
                  {stat.value}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
