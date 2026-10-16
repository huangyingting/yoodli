"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  Sparkles,
  Wand2,
  UserCheck,
  Target,
  Plus,
  Trash2,
  Play,
} from "lucide-react";

interface PersonaOption {
  id: string;
  name: string;
  title: string;
  company: string;
  demeanor: string;
  avatarUrl: string;
}

export default function RoleplayBuilderPage() {
  const router = useRouter();
  const [aiPrompt, setAiPrompt] = useState(
    "A skeptical CISO at a Fortune 500 bank challenging our AI data retention and SOC2 Type II controls before signing a $150K contract."
  );
  const [generating, setGenerating] = useState(false);

  const [personas, setPersonas] = useState<PersonaOption[]>([]);
  const [title, setTitle] = useState("Fortune 500 CISO Data Governance & Security Review");
  const [category, setCategory] = useState("OBJECTION_HANDLING");
  const [difficulty, setDifficulty] = useState("Advanced");
  const [personaId, setPersonaId] = useState("persona-dana");
  const [starterPrompt, setStarterPrompt] = useState(
    "Walk me through exactly how your platform isolates tenant data and guarantees zero-data-retention across LLM sub-processors."
  );
  const [scenarioContext, setScenarioContext] = useState(
    "Final security architecture gate before contract signature. CISO requires SOC2 Type II, GDPR compliance, and contractual zero LLM training."
  );
  const [goals, setGoals] = useState<string[]>([
    "Validate CISO security rigor without becoming defensive",
    "Explain SOC2 Type II, AES-256 encryption, and contractual zero-data-retention",
    "Highlight Okta SCIM 2.0 RBAC and automated 90-day retention purge controls",
    "Lock in a 25-minute technical review with the Principal Security Architect",
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/roleplays")
      .then((r) => r.json())
      .then((d) => {
        if (d.personas?.length) {
          setPersonas(d.personas);
          setPersonaId(d.personas[0].id);
        }
      });
  }, []);

  const handleGenerateWithAi = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/roleplays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ai-draft", prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.draft) {
        setTitle(data.draft.title);
        setCategory(data.draft.category);
        setDifficulty(data.draft.difficulty);
        setPersonaId(data.draft.personaId);
        setStarterPrompt(data.draft.starterPrompt);
        setScenarioContext(data.draft.scenarioContext);
        setGoals(data.draft.goals);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveAndPractice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/roleplays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          difficulty,
          personaId,
          starterPrompt,
          scenarioContext,
          goals,
          visibility: "MY",
        }),
      });
      const data = await res.json();
      if (data.scenario?.id) {
        router.push(`/practice/conversation?scenarioId=${data.scenario.id}`);
      } else {
        router.push("/roleplays");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
            YOODLI AI BUILDER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#040348] mt-1">
            What&apos;s your roleplay about?
          </h1>
          <p className="text-xs text-slate-500">
            Describe any sales call, objection, interview, or difficult conversation—Yoodli AI will generate the persona, starter prompt, and scoring rubric automatically.
          </p>
        </div>

        {/* AI Generator Bar */}
        <div className="bg-yoodli-slanted rounded-2xl p-5 border border-[#C9C7FF] space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#524FFC]">
            Generate Scenario &amp; Rubric with AI
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              data-testid="builder-ai-prompt"
              placeholder="Describe the conversation scenario..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-indigo-200 text-sm text-[#040348]"
            />
            <button
              type="button"
              onClick={handleGenerateWithAi}
              disabled={generating}
              data-testid="builder-ai-generate-btn"
              className="px-5 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>{generating ? "Generating..." : "Create with AI"}</span>
            </button>
          </div>
        </div>

        {/* Scenario Configuration Form */}
        <form
          onSubmit={handleSaveAndPractice}
          className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-5"
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Scenario Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="builder-title-input"
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Scenario Type
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm bg-white"
              >
                <option value="OBJECTION_HANDLING">Objection Handling</option>
                <option value="COLD_CALL">Cold Call</option>
                <option value="INBOUND_DISCOVERY_CALL">Inbound Discovery Call</option>
                <option value="OUTBOUND_DISCOVERY_CALL">Outbound Discovery Call</option>
                <option value="BEHAVIORAL_INTERVIEW">Behavioral Interview</option>
                <option value="PITCH">Executive Pitch</option>
                <option value="MANAGER_PERF_REVIEW">Manager Performance Review</option>
              </select>
            </div>
          </div>

          {/* Persona Selector */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#524FFC]" /> Select AI Persona Partner
              </label>
              <select
                value={personaId}
                onChange={(e) => setPersonaId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm bg-white"
              >
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.title} ({p.demeanor})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm bg-white"
              >
                <option value="Beginner">Beginner (Supportive)</option>
                <option value="Intermediate">Intermediate (Realistic)</option>
                <option value="Advanced">Advanced (Skeptical &amp; Challenging)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              AI Persona Opening Line (Starter Prompt)
            </label>
            <textarea
              rows={2}
              value={starterPrompt}
              onChange={(e) => setStarterPrompt(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Deal / Scenario Context Brief
            </label>
            <textarea
              rows={2}
              value={scenarioContext}
              onChange={(e) => setScenarioContext(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 text-sm"
            />
          </div>

          {/* Rubric Goals Editor */}
          <div className="space-y-3 pt-2 border-t border-indigo-100">
            <label className="block text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#0FA16D]" /> Evaluation Rubric Goals ({goals.length})
            </label>

            <div className="space-y-2">
              {goals.map((g, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F5F8FE] border border-indigo-100 text-xs font-semibold text-[#040348]"
                >
                  <span>
                    {idx + 1}. {g}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGoals(goals.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-[#CD4631]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add another evaluation goal (e.g., Ask 2 discovery questions)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-indigo-200 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (newGoal.trim()) {
                    setGoals([...goals, newGoal.trim()]);
                    setNewGoal("");
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 text-[#524FFC] text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Goal
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-indigo-100 flex justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              data-testid="builder-save-launch-btn"
              className="px-6 py-3 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save & Start Roleplay Practice"}</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
