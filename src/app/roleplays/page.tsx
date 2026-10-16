"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  Search,
  Sparkles,
  Play,
  Target,
  Filter,
  CheckCircle2,
  X,
} from "lucide-react";

interface ScenarioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  roundelColor: string;
  visibility: string;
  starterPrompt: string;
  scenarioContext: string;
  goalsJson: string;
  completions: number;
  avgScore: number;
  persona: {
    id: string;
    name: string;
    title: string;
    company: string;
    avatarUrl: string;
    demeanor: string;
  };
}

export default function RoleplaysCatalogPage() {
  const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "ORG" | "MY" | "SHARED">("ALL");
  const [search, setSearch] = useState("");
  const [previewScenario, setPreviewScenario] = useState<ScenarioItem | null>(null);

  useEffect(() => {
    fetch("/api/roleplays")
      .then((r) => r.json())
      .then((d) => {
        if (d.scenarios) setScenarios(d.scenarios);
      });
  }, []);

  const filtered = scenarios.filter((s) => {
    if (activeTab === "ORG" && s.visibility !== "ORG") return false;
    if (activeTab === "MY" && s.visibility !== "MY") return false;
    if (activeTab === "SHARED" && s.visibility !== "PUBLIC" && s.visibility !== "SHARED") return false;
    if (
      search &&
      !s.title.toLowerCase().includes(search.toLowerCase()) &&
      !s.category.toLowerCase().includes(search.toLowerCase()) &&
      !s.persona.name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#040348]">
              AI Roleplays &amp; Scenarios
            </h1>
            <p className="text-xs text-slate-500">
              Practice high-stakes conversations with realistic AI buyer, interviewer, and direct-report personas
            </p>
          </div>
          <Link
            href="/builder"
            className="px-4 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5 w-fit shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Custom Roleplay</span>
          </Link>
        </div>

        {/* Filter Tabs + Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "ALL", label: "All roleplays" },
              { id: "ORG", label: "Organization Roleplays" },
              { id: "MY", label: "My Roleplays" },
              { id: "SHARED", label: "Shared with me" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === t.id
                    ? "bg-[#040348] text-white"
                    : "text-slate-600 hover:bg-[#F5F8FE]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roleplays or personas..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-indigo-200 text-xs"
            />
          </div>
        </div>

        {/* Roleplay Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((scen) => (
            <div
              key={scen.id}
              className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#040348]"
                    style={{ backgroundColor: scen.roundelColor }}
                  >
                    {scen.category.replace(/_/g, " ")}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {scen.difficulty} • Avg {scen.avgScore}%
                  </span>
                </div>

                <h2 className="font-bold text-base text-[#040348]">
                  {scen.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {scen.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-indigo-50">
                <div className="flex items-center gap-2.5">
                  <img
                    src={scen.persona.avatarUrl}
                    alt={scen.persona.name}
                    className="w-9 h-9 rounded-full object-cover border border-indigo-200"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#040348] truncate">
                      {scen.persona.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {scen.persona.title} • {scen.persona.demeanor}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewScenario(scen)}
                    className="flex-1 py-2 rounded-xl border border-indigo-200 hover:bg-[#F5F8FE] text-xs font-bold text-[#040348] cursor-pointer"
                  >
                    View Rubric
                  </button>
                  <Link
                    href={`/practice/conversation?scenarioId=${scen.id}`}
                    className="flex-1 py-2 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scenario Rubric Preview Modal */}
        {previewScenario && (
          <div className="fixed inset-0 z-50 bg-[#040348]/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-[#040348]"
                  style={{ backgroundColor: previewScenario.roundelColor }}
                >
                  {previewScenario.category.replace(/_/g, " ")}
                </span>
                <button
                  onClick={() => setPreviewScenario(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-extrabold text-[#040348]">
                {previewScenario.title}
              </h3>
              <p className="text-xs text-slate-600">{previewScenario.scenarioContext}</p>

              <div className="p-3.5 rounded-xl bg-[#F5F8FE] border border-indigo-100 space-y-2">
                <div className="text-xs font-bold text-[#524FFC] flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> Evaluation Rubric Goals
                </div>
                <ul className="space-y-1.5 text-xs text-[#040348]">
                  {(JSON.parse(previewScenario.goalsJson || "[]") as string[]).map((g, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0FA16D] shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setPreviewScenario(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <Link
                  href={`/practice/conversation?scenarioId=${previewScenario.id}`}
                  className="px-5 py-2 rounded-xl bg-[#524FFC] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" /> Launch Roleplay Studio
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
