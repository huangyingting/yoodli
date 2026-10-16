"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function OrgCreateProgramPage() {
  const router = useRouter();
  const [title, setTitle] = useState("FY26 Q2 New Hire AE Bootcamp Certification");
  const [dueDate, setDueDate] = useState("May 30, 2026");
  const [description, setDescription] = useState(
    "Mandatory 4-step certification for newly onboarded Enterprise Account Executives covering Value Messaging, MEDDPICC Discovery, and Security Review."
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "CREATE_PROGRAM",
        title,
        dueDate,
        description,
      }),
    });
    router.push("/org/content/programs");
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/org/content/programs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#524FFC]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Programs
        </Link>

        <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-5">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              CURRICULUM BUILDER
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Create Certification Program
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#040348] mb-1">
                  Program Title
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
                  Completion Deadline
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040348] mb-1">
                Program Description &amp; Passing Criteria
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-indigo-200 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              data-testid="save-program-btn"
              className="px-6 py-3 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{saving ? "Publishing Program..." : "Publish Certification Program"}</span>
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
