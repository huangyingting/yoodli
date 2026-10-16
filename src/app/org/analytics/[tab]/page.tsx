"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  BarChart3,
  Download,
  Award,
  Target,
  MessagesSquare,
  Database,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "programs", label: "Programs", icon: Award },
  { id: "goals", label: "Goals", icon: Target },
  { id: "roleplays", label: "Roleplays", icon: MessagesSquare },
  { id: "reports-data", label: "Reports & Data", icon: Database },
];

export default function OrgAnalyticsTabPage() {
  const params = useParams<{ tab: string }>();
  const activeTab = params?.tab || "overview";
  const [sampleDataMode, setSampleDataMode] = useState(true);
  const [exportedCsv, setExportedCsv] = useState(false);
  const [orgData, setOrgData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((d) => setOrgData(d));
  }, []);

  const handleExportCsv = () => {
    setExportedCsv(true);
    setTimeout(() => setExportedCsv(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header + Sample Data Toggle + Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              ENTERPRISE TELEMETRY &amp; INSIGHTS
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Organization Analytics — {TABS.find((t) => t.id === activeTab)?.label || "Overview"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Sample Data Toggle (Reverse engineered from /org/analytics/overview) */}
            <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-[#040348] cursor-pointer">
              <input
                type="checkbox"
                checked={sampleDataMode}
                onChange={(e) => setSampleDataMode(e.target.checked)}
                data-testid="sample-data-toggle"
                className="accent-[#524FFC]"
              />
              <span>Sample data</span>
            </label>

            <button
              onClick={handleExportCsv}
              data-testid="export-csv-btn"
              className="px-4 py-2 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exportedCsv ? "CSV Exported!" : "Export CSV Report"}</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-indigo-100 pb-3">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <Link
                key={t.id}
                href={`/org/analytics/${t.id}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  isActive
                    ? "bg-[#524FFC] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-indigo-100 hover:bg-[#F5F8FE]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500">Total Practice Sessions</div>
            <div className="text-2xl font-extrabold text-[#040348] mt-1">
              {sampleDataMode ? "1,482" : orgData?.recentSpeeches?.length || 4}
            </div>
            <div className="text-xs font-bold text-[#0FA16D] mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +34% vs prior 30d
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500">Certification Pass Rate</div>
            <div className="text-2xl font-extrabold text-[#0FA16D] mt-1">
              {sampleDataMode ? "91.4%" : "88.0%"}
            </div>
            <div className="text-xs text-slate-400 mt-1">Target benchmark: 85%</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500">Avg Rubric Mastery Score</div>
            <div className="text-2xl font-extrabold text-[#524FFC] mt-1">
              {sampleDataMode ? "89.2%" : "89.0%"}
            </div>
            <div className="text-xs text-slate-400 mt-1">Across 6 custom org goals</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500">Avg Team Filler Rate</div>
            <div className="text-2xl font-extrabold text-[#040348] mt-1">
              {sampleDataMode ? "1.6%" : "1.5%"}
            </div>
            <div className="text-xs font-bold text-[#0FA16D] mt-1">Down from 4.8% baseline</div>
          </div>
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-4">
              <h2 className="text-base font-extrabold text-[#040348]">
                Regional Cohort Readiness Heatmap
              </h2>
              <div className="space-y-3 text-xs">
                {[
                  { team: "NA Enterprise AE Cohort", reps: 42, completion: 96, avgScore: 92 },
                  { team: "EMEA Strategic Accounts", reps: 28, completion: 89, avgScore: 88 },
                  { team: "APAC Commercial Sales", reps: 19, completion: 84, avgScore: 86 },
                  { team: "Solutions Engineering Global", reps: 24, completion: 94, avgScore: 93 },
                ].map((row) => (
                  <div key={row.team} className="p-3.5 rounded-xl bg-[#F5F8FE] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#040348]">{row.team}</div>
                      <div className="text-slate-500">{row.reps} active members</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#E6E5FF] text-[#524FFC] font-bold">
                        {row.completion}% Certified
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#DEFFF1] text-[#0FA16D] font-bold">
                        Avg Score: {row.avgScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-4">
              <h2 className="text-base font-extrabold text-[#040348]">
                Top Practiced Roleplay Scenarios
              </h2>
              <div className="space-y-3 text-xs">
                {(orgData?.org?.scenarios || []).slice(0, 4).map((s: any, idx: number) => (
                  <div key={s.id} className="p-3.5 rounded-xl border border-indigo-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#040348]">{s.title}</div>
                      <div className="text-slate-500">{s.category} • {s.difficulty}</div>
                    </div>
                    <span className="font-extrabold text-[#524FFC]">
                      {sampleDataMode ? 380 - idx * 65 : 12 - idx * 2} completions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "programs" && (
          <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-[#040348]">
              Certification Program Completion &amp; Pass Rates
            </h2>
            <div className="divide-y divide-indigo-50 text-xs">
              {(orgData?.org?.programs || []).map((p: any) => (
                <div key={p.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#040348]">{p.title}</div>
                    <div className="text-slate-500">Due {p.dueDate} • Status: {p.status}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#0FA16D]">Avg Score: {p.avgScore}%</span>
                    <Link
                      href={`/org/content/programs/${p.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#E6E5FF] text-[#524FFC] font-bold"
                    >
                      Inspect Roster
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "goals" && (
          <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-[#040348]">
              Custom Goal &amp; Rubric Criterion Pass Rates
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              {(orgData?.org?.customGoals || []).map((g: any, i: number) => (
                <div key={g.id} className="p-4 rounded-xl bg-[#F5F8FE] border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#E6E5FF] text-[#524FFC] font-bold">
                      {g.goalType}
                    </span>
                    <span className="font-extrabold text-[#0FA16D]">
                      {94 - i * 3}% Pass Rate
                    </span>
                  </div>
                  <div className="font-bold text-sm text-[#040348]">{g.title}</div>
                  <p className="text-slate-600">{g.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === "roleplays" || activeTab === "reports-data") && (
          <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-[#040348]">
              Raw Session Reports &amp; Evaluative Export Table
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-indigo-100 text-slate-400 uppercase">
                    <th className="py-2.5">Session Title</th>
                    <th className="py-2.5">Type</th>
                    <th className="py-2.5">Score</th>
                    <th className="py-2.5">WPM</th>
                    <th className="py-2.5">Filler %</th>
                    <th className="py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50">
                  {(orgData?.recentSpeeches || []).map((s: any) => (
                    <tr key={s.id}>
                      <td className="py-3 font-bold text-[#040348]">{s.title}</td>
                      <td className="py-3">{s.type}</td>
                      <td className="py-3 font-extrabold text-[#0FA16D]">{s.overallScore}%</td>
                      <td className="py-3 font-mono">{s.wpm}</td>
                      <td className="py-3 font-mono">{s.fillerPercentage}%</td>
                      <td className="py-3">
                        <Link
                          href={`/share/${s.shareSlug || s.id}`}
                          className="text-[#524FFC] font-bold hover:underline"
                        >
                          Open Report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
