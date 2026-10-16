"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ArrowLeft, Bot, PlusCircle } from "lucide-react";

export default function OrgCreatePersonaPage() {
  const router = useRouter();
  const [name, setName] = useState("Victoria Sterling");
  const [title, setTitle] = useState("Chief Revenue Officer");
  const [company, setCompany] = useState("Apex Cloud Global");
  const [demeanor, setDemeanor] = useState("Direct & Executive");
  const [voiceStyle, setVoiceStyle] = useState("Commanding, brisk, outcome-oriented");
  const [bio, setBio] = useState(
    "Oversees 600 global reps. Interrupts generic slide walkthroughs and insists on hearing how you will move pipeline conversion within 60 days."
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "CREATE_PERSONA",
        name,
        title,
        company,
        demeanor,
        voiceStyle,
        bio,
        avatarColor: "#524FFC",
      }),
    });
    router.push("/org/content/personas");
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/org/content/personas"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#524FFC]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to AI Personas
        </Link>

        <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-5">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              PERSONA STUDIO
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Create Custom AI Persona
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#040348] mb-1">
                  Persona Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#040348] mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#040348] mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#040348] mb-1">
                  Demeanor
                </label>
                <select
                  value={demeanor}
                  onChange={(e) => setDemeanor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm bg-white"
                >
                  <option>Direct &amp; Executive</option>
                  <option>Skeptical &amp; Analytical</option>
                  <option>Guarded &amp; Detail-Oriented</option>
                  <option>Warm &amp; Collaborative</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#040348] mb-1">
                  Voice &amp; Cadence
                </label>
                <input
                  type="text"
                  value={voiceStyle}
                  onChange={(e) => setVoiceStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040348] mb-1">
                Persona Backstory, Priorities &amp; Hidden Objections
              </label>
              <textarea
                rows={4}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-indigo-200 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              data-testid="save-persona-btn"
              className="px-6 py-3 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{saving ? "Saving Persona..." : "Create AI Persona"}</span>
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
