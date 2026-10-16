import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { Gamepad2, Sparkles, Zap, Trophy, Play } from "lucide-react";

export const dynamic = "force-dynamic";

const GAMES = [
  {
    slug: "spin-a-yarn",
    title: "Spin a Yarn",
    subtitle: "Impromptu Agile Thinking",
    description:
      "Speak for 60 seconds on a prompt while smoothly weaving in random surprise words that pop up every 10 seconds.",
    color: "#F1B6EB",
    href: "/exercises/spin-a-yarn",
  },
  {
    slug: "no-filler",
    title: "No Filler Survival",
    subtitle: "Eliminate 'Um', 'Uh' & 'Like'",
    description:
      "Deliver a 60-second impromptu pitch without using a single filler word—replace hesitation with deliberate power pauses.",
    color: "#8ED6F3",
    href: "/exercises/no-filler",
  },
  {
    slug: "metaphor-mania",
    title: "Metaphor Mania",
    subtitle: "Creative Analogies Under Pressure",
    description:
      "Explain complex technical or financial concepts using vivid, everyday analogies before the countdown expires.",
    color: "#F6D99B",
    href: "/exercises/metaphor-mania",
  },
  {
    slug: "storyteller",
    title: "Storyteller Arc",
    subtitle: "Structured Executive Narrative",
    description:
      "Build a compelling Hero's Journey or STAR turnaround story incorporating visual cues and emotional contrast.",
    color: "#B0E0AA",
    href: "/exercises/storyteller",
  },
];

export default async function MemberExercisesHubPage() {
  const user = await getCurrentUserOrDemo();
  const attempts = await prisma.exerciseAttempt.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <AppShell user={user}>
      <div className="space-y-8">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
            MY LEARNING • IMPROMPTU SPEAKING GAMES
          </span>
          <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
            Communication Exercises &amp; Drills
          </h1>
          <p className="text-xs text-slate-500">
            Warm up your voice, eliminate filler words, and sharpen mental agility in 60-second interactive drills
          </p>
        </div>

        {/* 4 Interactive Game Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {GAMES.map((g) => (
            <div
              key={g.slug}
              className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-extrabold text-[#040348]"
                    style={{ backgroundColor: g.color }}
                  >
                    {g.subtitle}
                  </span>
                  <Gamepad2 className="w-5 h-5 text-[#524FFC]" />
                </div>
                <h2 className="text-xl font-extrabold text-[#040348]">{g.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {g.description}
                </p>
              </div>

              <Link
                href={g.href}
                className="w-full py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Play {g.title}</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Recent High Scores */}
        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-4">
          <h2 className="text-base font-extrabold text-[#040348] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Recent Exercise Scores &amp; Personal Bests
          </h2>
          <div className="divide-y divide-indigo-50 text-xs">
            {attempts.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-[#040348]">{a.exerciseTitle}</span>
                  <p className="text-slate-500 mt-0.5">{a.transcript}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-extrabold text-sm text-[#524FFC]">{a.score} pts</div>
                  <div className="text-[10px] text-slate-400">
                    {a.fillerCount} fillers • {a.durationSeconds}s
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
