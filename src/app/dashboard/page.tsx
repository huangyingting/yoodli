"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  Flame,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowUpRight,
  Play,
} from "lucide-react";

const METRIC_FILTERS = [
  "All",
  "Filler Words",
  "Pacing",
  "Questions",
  "Weak Words",
  "Conciseness",
  "Centering",
  "Smiles",
];

export default function DashboardPage() {
  const [selectedMetric, setSelectedMetric] = useState("All");
  const [speeches, setSpeeches] = useState<
    {
      id: string;
      title: string;
      overallScore: number;
      wpmAverage: number;
      fillerWordPct: number;
      concisenessScore: number;
      eyeContactPct: number;
      centeringPct: number;
      smilesPct: number;
      questionsAskedCount: number;
      weakWordPct: number;
      createdAt: string;
    }[]
  >([]);

  useEffect(() => {
    fetch("/api/speeches")
      .then((r) => r.json())
      .then((d) => {
        if (d.speeches) setSpeeches(d.speeches);
      });
  }, []);

  const baseline = speeches[speeches.length - 1] || {
    id: "speech-4",
    title: "Baseline Pitch Recording (Week 1)",
    overallScore: 76,
    wpmAverage: 168,
    fillerWordPct: 4.8,
    concisenessScore: 78,
  };
  const latest = speeches[0] || {
    id: "speech-1",
    title: "Latest Enterprise CISO Roleplay",
    overallScore: 92,
    wpmAverage: 146,
    fillerWordPct: 1.2,
    concisenessScore: 94,
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header + Streak Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#040348]">
              My Communication &amp; Skill Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Track your longitudinal improvement across pacing, filler words, conciseness, and rubric mastery
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-indigo-100 shadow-2xs flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <div>
                <div className="text-sm font-extrabold text-[#040348]">7 DAY STREAK</div>
                <div className="text-[10px] text-slate-500">Top 5% in Acme Corp</div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Avg Rubric Score"
            value="90%"
            delta="+14% vs last month"
            good
          />
          <StatCard
            label="Avg Filler Rate"
            value="1.2%"
            delta="-3.6% reduction"
            good
          />
          <StatCard
            label="Conversational Pacing"
            value="145 WPM"
            delta="Ideal (120–170 WPM)"
            good
          />
          <StatCard
            label="Conciseness & Presence"
            value="93%"
            delta="+15% improvement"
            good
          />
        </div>

        {/* Skill Snapshot / Focus Analytics Trend Graph */}
        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#040348] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#524FFC]" />
                Skill Snapshot &amp; Focus Analytics Over Time
              </h2>
              <p className="text-xs text-slate-500">
                Select any metric pill to inspect your session-by-session progression
              </p>
            </div>
          </div>

          {/* Metric Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {METRIC_FILTERS.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMetric(m)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedMetric === m
                    ? "bg-[#524FFC] text-white"
                    : "bg-[#F5F8FE] text-[#040348] hover:bg-[#E6E5FF]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Visual Progression Chart */}
          <div className="p-5 rounded-2xl bg-[#F5F8FE] border border-indigo-100">
            <div className="flex items-end justify-between gap-4 h-44 pt-6 px-4">
              {[...speeches].reverse().map((s, idx) => {
                const value =
                  selectedMetric === "Filler Words"
                    ? Math.max(20, 100 - s.fillerWordPct * 15)
                    : selectedMetric === "Pacing"
                    ? Math.min(100, Math.round((s.wpmAverage / 170) * 100))
                    : selectedMetric === "Conciseness"
                    ? s.concisenessScore
                    : selectedMetric === "Centering"
                    ? s.centeringPct
                    : selectedMetric === "Smiles"
                    ? s.smilesPct
                    : s.overallScore;

                return (
                  <Link
                    key={s.id}
                    href={`/library/user-alex/feedback/${s.id}`}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <span className="text-xs font-extrabold text-[#040348] group-hover:text-[#524FFC]">
                      {selectedMetric === "Filler Words"
                        ? `${s.fillerWordPct}%`
                        : selectedMetric === "Pacing"
                        ? `${s.wpmAverage} WPM`
                        : `${value}%`}
                    </span>
                    <div className="w-full max-w-[64px] bg-indigo-100 rounded-t-xl h-28 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-yoodli-gradient rounded-t-xl transition-all group-hover:opacity-90"
                        style={{ height: `${Math.max(25, Math.min(100, value))}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 text-center line-clamp-1 max-w-[120px]">
                      Session #{idx + 1}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Before & After Comparison Card */}
        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#040348]">
                Before &amp; After Transformation
              </h2>
              <p className="text-xs text-slate-500">
                Comparing your baseline session against your most recent certification simulation
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D]">
              +16 Pts Readiness Lift
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase text-slate-400">
                Before (Baseline Session)
              </div>
              <div className="font-bold text-sm text-[#040348]">{baseline.title}</div>
              <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-slate-400">Fillers</div>
                  <div className="font-bold text-[#CD4631]">4.8%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-slate-400">Pacing</div>
                  <div className="font-bold text-[#E99923]">168 WPM</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-slate-400">Conciseness</div>
                  <div className="font-bold text-slate-700">78%</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F8FE] border-2 border-[#524FFC] space-y-2">
              <div className="text-xs font-bold uppercase text-[#524FFC] flex items-center justify-between">
                <span>After (Latest Recording)</span>
                <Link
                  href={`/library/user-alex/feedback/${latest.id}`}
                  className="underline flex items-center gap-1"
                >
                  Open Report <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="font-bold text-sm text-[#040348]">{latest.title}</div>
              <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                  <div className="text-slate-400">Fillers</div>
                  <div className="font-bold text-[#0FA16D]">{latest.fillerWordPct}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                  <div className="text-slate-400">Pacing</div>
                  <div className="font-bold text-[#0FA16D]">{latest.wpmAverage} WPM</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                  <div className="text-slate-400">Conciseness</div>
                  <div className="font-bold text-[#524FFC]">{latest.concisenessScore}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  delta,
  good,
}: {
  label: string;
  value: string;
  delta: string;
  good: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs space-y-1.5">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="text-2xl font-extrabold text-[#040348]">{value}</div>
      <div className={`text-xs font-bold ${good ? "text-[#0FA16D]" : "text-amber-600"}`}>
        {delta}
      </div>
    </div>
  );
}
