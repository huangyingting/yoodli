"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Sparkles, ArrowLeft, PlusCircle } from "lucide-react";

export default function OrgCreateRoleplayPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(
    "Create an enterprise renewal negotiation with a skeptical VP of Procurement demanding a 15% discount while expanding seats."
  );
  const [title, setTitle] = useState("FY26 Multi-Year Renewal Negotiation");
  const [category, setCategory] = useState("Closing & Renewal");
  const [difficulty, setDifficulty] = useState("Hard");
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/roleplays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, title, category, difficulty }),
    });
    router.push("/org/content/roleplays");
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/org/content/roleplays"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#524FFC]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Roleplay Library
        </Link>

        <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-5">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              ADMIN SCENARIO AUTHORING
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Create Enterprise Roleplay Scenario
            </h1>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#040348] mb-1">
                Scenario Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#040348] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm bg-white"
                >
                  <option>Sales Discovery</option>
                  <option>Closing &amp; Renewal</option>
                  <option>Technical Sales</option>
                  <option>Leadership</option>
                  <option>Interview</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#040348] mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm bg-white"
                >
                  <option>Medium</option>
                  <option>Hard</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040348] mb-1">
                AI Scenario Context, Buyer Objections &amp; Rubric Prompt
              </label>
              <textarea
                rows={4}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-indigo-200 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              data-testid="admin-save-roleplay-btn"
              className="px-6 py-3 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{saving ? "Publishing Scenario..." : "Publish Roleplay to Organization"}</span>
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
