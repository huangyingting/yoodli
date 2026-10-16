import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import {
  Sparkles,
  Play,
  Award,
  Flame,
  Clock,
  ArrowRight,
  Mic,
  Briefcase,
  Video,
  Gamepad2,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MemberHomePage() {
  const user = await getCurrentUserOrDemo();
  const [programs, scenarios, speeches] = await Promise.all([
    prisma.program.findMany({ orderBy: { createdAt: "asc" }, take: 2 }),
    prisma.roleplayScenario.findMany({
      include: { persona: true },
      orderBy: { completions: "desc" },
      take: 6,
    }),
    prisma.speech.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const activeProgram = programs[0];

  return (
    <AppShell user={user}>
      <div className="space-y-8">
        {/* Top Greeting Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#040348]">
              Hi {user.name.split(" ")[0]}! Ready to practice?
            </h1>
            <p className="text-sm text-slate-500">
              Your private AI communication studio • Acme Corp Global Revenue
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white border border-indigo-100 flex items-center gap-2 text-xs font-bold text-[#040348] shadow-2xs">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{user.dayStreak} DAY STREAK</span>
            </div>
            <Link
              href="/builder"
              className="px-4 py-2 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create with AI</span>
            </Link>
          </div>
        </div>

        {/* Assigned Certification Program Banner */}
        {activeProgram && (
          <div className="rounded-3xl p-6 bg-yoodli-dark-hero text-white shadow-lg border border-indigo-900 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1DA9E6]/20 text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Assigned Certification Program
                </span>
                <span className="text-indigo-200 font-medium">
                  Due {activeProgram.dueDate}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold">
                {activeProgram.title}
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                {activeProgram.description}
              </p>
              <div className="pt-1 flex items-center gap-4 text-xs">
                <div className="flex-1 max-w-xs h-2 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00E676] w-3/4 rounded-full" />
                </div>
                <span className="font-bold text-emerald-300">
                  3 of 4 Steps Completed (Avg Score: 89%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/org/resources/programs/${activeProgram.id}`}
                className="px-5 py-3 rounded-xl bg-white text-[#040348] hover:bg-indigo-50 font-bold text-xs flex items-center gap-2 shadow-sm transition"
              >
                <span>Continue Certification</span>
                <ArrowRight className="w-4 h-4 text-[#524FFC]" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Practice Mode Starters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStartCard
            href="/practice/conversation"
            icon={<Mic className="w-5 h-5 text-[#524FFC]" />}
            title="AI Roleplay"
            subtitle="Sales, Cold Calls & Objections"
            bg="#F1B6EB"
          />
          <QuickStartCard
            href="/practice/interview"
            icon={<Briefcase className="w-5 h-5 text-[#040348]" />}
            title="Interview Studio"
            subtitle="STAR Behavioral & Technical"
            bg="#D9D2BB"
          />
          <QuickStartCard
            href="/practice/speech"
            icon={<Video className="w-5 h-5 text-[#065C82]" />}
            title="Presentation"
            subtitle="Keynotes & Executive Pitches"
            bg="#8ED6F3"
          />
          <QuickStartCard
            href="/org/resources/exercises"
            icon={<Gamepad2 className="w-5 h-5 text-[#0FA16D]" />}
            title="Speaking Games"
            subtitle="No Filler, Spin a Yarn & More"
            bg="#B0E0AA"
          />
        </div>

        {/* Recommended Roleplays Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#040348]">
                Recommended Roleplays for Your Team
              </h2>
              <p className="text-xs text-slate-500">
                Practice realistic multi-turn conversations with skeptical AI buyer &amp; leadership personas
              </p>
            </div>
            <Link
              href="/roleplays"
              className="text-xs font-bold text-[#524FFC] hover:underline flex items-center gap-1"
            >
              View all ({scenarios.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scenarios.map((scen) => (
              <div
                key={scen.id}
                className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#040348]"
                      style={{ backgroundColor: scen.roundelColor }}
                    >
                      {scen.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {scen.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#040348] line-clamp-2">
                    {scen.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {scen.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-indigo-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={scen.persona.avatarUrl}
                      alt={scen.persona.name}
                      className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-[#040348] truncate">
                        {scen.persona.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {scen.persona.title}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/practice/conversation?scenarioId=${scen.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Play className="w-3 h-3" />
                    <span>Practice</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Recordings */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#040348]">
                Recent Recordings &amp; AI Scorecards
              </h2>
              <p className="text-xs text-slate-500">
                Click any session to review timestamped coaching, rubric evidence, and delivery analytics
              </p>
            </div>
            <Link
              href="/library"
              className="text-xs font-bold text-[#524FFC] hover:underline flex items-center gap-1"
            >
              Open Library <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xs overflow-hidden">
            <div className="divide-y divide-indigo-50">
              {speeches.map((sp) => (
                <Link
                  key={sp.id}
                  href={`/library/${user.id}/feedback/${sp.id}`}
                  className="p-4 hover:bg-[#F5F8FE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6E5FF] text-[#524FFC]">
                        {sp.practiceType}
                      </span>
                      <span className="font-bold text-sm text-[#040348]">
                        {sp.title}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {Math.floor(sp.durationSeconds / 60)}m {sp.durationSeconds % 60}s
                      </span>
                      <span>•</span>
                      <span>{sp.wpmAverage} WPM</span>
                      <span>•</span>
                      <span>{sp.fillerWordPct}% Fillers</span>
                      <span>•</span>
                      <span>{sp.concisenessScore}% Conciseness</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Score: {sp.overallScore}%
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function QuickStartCard({
  href,
  icon,
  title,
  subtitle,
  bg,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl p-4 border border-indigo-100 hover:border-[#524FFC] shadow-2xs hover:shadow-md transition flex items-center gap-3.5"
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${bg}66` }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-sm text-[#040348] truncate">{title}</div>
        <div className="text-[11px] text-slate-500 truncate">{subtitle}</div>
      </div>
    </Link>
  );
}
