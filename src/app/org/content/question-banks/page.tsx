"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Plus, ListChecks, CheckCircle2 } from "lucide-react";

export default function OrgQuestionBanksPage() {
  const [banks, setBanks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("Q2 Competitive Objection Question Bank");
  const [category, setCategory] = useState("Sales Enablement");
  const [questionsText, setQuestionsText] = useState(
    "How do we differentiate our SOC2 Type II zero-data-retention architecture?\nWhat is your response when a CFO says they already use a passive call recorder?\nWalk me through a 90-second MEDDPICC executive summary."
  );

  const loadBanks = () => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((d) => {
        if (d.org?.questionBanks) setBanks(d.org.questionBanks);
      });
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const handleCreateBank = async (e: React.FormEvent) => {
    e.preventDefault();
    const questions = questionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "CREATE_QUESTION_BANK",
        title,
        category,
        questions,
      }),
    });
    setShowModal(false);
    loadBanks();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              CONTENT LIBRARY • QUESTION BANKS
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Question Banks ({banks.length})
            </h1>
            <p className="text-xs text-slate-500">
              Reusable prompt pools for structured interviews, oral exams, and randomized objection drills
            </p>
          </div>

          <button
            onClick={() => setShowModal(!showModal)}
            data-testid="open-create-question-bank-btn"
            className="px-4 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Question Bank</span>
          </button>
        </div>

        {showModal && (
          <form
            onSubmit={handleCreateBank}
            className="bg-white rounded-2xl p-6 border-2 border-[#524FFC] shadow-md space-y-4"
          >
            <h2 className="text-base font-extrabold text-[#040348]">
              New Question Bank
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#040348] mb-1">
                  Bank Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-sm"
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
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#040348] mb-1">
                Questions (One per line)
              </label>
              <textarea
                rows={4}
                value={questionsText}
                onChange={(e) => setQuestionsText(e.target.value)}
                className="w-full p-3 rounded-xl border border-indigo-200 text-xs"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                data-testid="save-question-bank-btn"
                className="px-5 py-2 rounded-xl bg-[#524FFC] text-white text-xs font-bold cursor-pointer"
              >
                Save Question Bank
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {banks.map((b) => {
            const qs = JSON.parse(b.questionsJson || "[]") as string[];
            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-[#524FFC]" />
                    <h3 className="font-bold text-base text-[#040348]">{b.title}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
                    {b.category} • {qs.length} Questions
                  </span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600">
                  {qs.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
