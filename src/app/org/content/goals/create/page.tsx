"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ArrowLeft, PlusCircle, Target } from "lucide-react";

const GOAL_TYPES = [
  {
    id: "BINARY",
    title: "Binary (Pass / Fail)",
    desc: "Evaluates whether the speaker explicitly fulfilled a required statement or behavior.",
  },
  {
    id: "RATED",
    title: "Rated (1–5 Scale)",
    desc: "Grades quality of execution from 1 (Needs Coaching) to 5 (Executive Mastery).",
  },
  {
    id: "COMPOUND",
    title: "Compound Multi-Part Rubric",
    desc: "Combines multiple weighted sub-criteria into a single composite percentage.",
  },
  {
    id: "KNOWLEDGE_BASED",
    title: "Knowledge-Based (RAG Verified)",
    desc: "Cross-checks speaker accuracy against uploaded CoachBot product & security documents.",
  },
];

export default function OrgCreateGoalPage() {
  const router = useRouter();
  const [title, setTitle] = useState("Multi-Threading Champion & Economic Buyer Alignment");
  const [goalType, setGoalType] = useState("COMPOUND");
  const [category, setCategory] = useState("Sales Methodology");
  const [description, setDescription] = useState(
    "Evaluates whether the rep identifies both the day-to-day champion and the C-level budget holder and secures a joint calendar next step."
  );
  const [criteriaText, setCriteriaText] = useState(
    "Ask how the evaluation committee is structured\nQuantify the cost of delaying the initiative by one quarter\nSecure a firm date for an executive alignment review"
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const criteria = criteriaText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "CREATE_GOAL",
        title,
        goalType,
        category,
        description,
        criteria,
      }),
    });
    router.push("/org/content/goals");
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/org/content/goals"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#524FFC]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Custom Goals
        </Link>

        <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-5">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              RUBRIC BUILDER • 4 EVALUATION TYPES
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Create Custom Evaluation Goal
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Goal Type Selector Cards (Reverse engineered from /org/content/goals/create) */}
            <div className="grid sm:grid-cols-2 gap-3">
              {GOAL_TYPES.map((gt) => (
                <button
                  key={gt.id}
                  type="button"
                  onClick={() => setGoalType(gt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    goalType === gt.id
                      ? "border-[#524FFC] bg-[#F5F8FE] ring-2 ring-[#524FFC]/20"
                      : "border-indigo-100 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-bold text-xs text-[#040348]">{gt.title}</div>
                  <p className="text-[11px] text-slate-500 mt-1">{gt.desc}</p>
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#040348] mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#040348] mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040348] mb-1">
                Goal Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-indigo-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040348] mb-1">
                Scoring Criteria (One criterion per line)
              </label>
              <textarea
                rows={4}
                value={criteriaText}
                onChange={(e) => setCriteriaText(e.target.value)}
                className="w-full p-3 rounded-xl border border-indigo-200 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              data-testid="save-goal-btn"
              className="px-6 py-3 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{saving ? "Saving Goal..." : "Save Custom Goal"}</span>
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
