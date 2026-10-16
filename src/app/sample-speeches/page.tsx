import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingNav";
import { Play, Clock, Sparkles, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SampleSpeechesPage() {
  const speeches = await prisma.speech.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FF]">
      <MarketingNav />

      <main className="flex-1 py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-[#E6E5FF] text-[#524FFC] text-xs font-bold uppercase">
            Public Speech &amp; Roleplay Gallery
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#040348]">
            Explore Real AI-Analyzed Speeches, Sales Roleplays &amp; Interviews
          </h1>
          <p className="text-slate-600 text-sm">
            Click any recording below to inspect its interactive transcript, AI Coaching rubric scorecards, WPM pacing timeline, and filler word breakdown.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {speeches.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
                    {s.practiceType}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D]">
                    Overall Score: {s.overallScore}%
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-[#040348]">{s.title}</h2>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {s.aiSummary}
                </p>
              </div>

              <div className="pt-4 border-t border-indigo-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 font-semibold">
                  <span>{s.wpmAverage} WPM</span>
                  <span>•</span>
                  <span>{s.fillerWordPct}% Fillers</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {Math.floor(s.durationSeconds / 60)}m {s.durationSeconds % 60}s
                  </span>
                </div>
                <Link
                  href={`/share/${s.shareSlug}`}
                  className="px-3.5 py-2 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-bold flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Open Report</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
