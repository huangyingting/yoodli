"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Repeat, Plus, CheckCircle2, Users } from "lucide-react";

export default function OrgLoopsPage() {
  const [loops, setLoops] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("Q2 Competitive Battlecard Rapid-Fire Drill");
  const [cadence, setCadence] = useState("Every Wednesday at 9:00 AM");
  const [targetGroup, setTargetGroup] = useState("Global Enterprise AEs");

  const loadLoops = () => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((d) => {
        if (d.org?.practiceLoops) setLoops(d.org.practiceLoops);
      });
  };

  useEffect(() => {
    loadLoops();
  }, []);

  const handleCreateLoop = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "CREATE_LOOP",
        title,
        cadence,
        targetGroup,
        scenarioTitle: "Competitor Displacement & Value Defense",
      }),
    });
    setShowCreate(false);
    loadLoops();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              CONTINUOUS REINFORCEMENT • RECURRING LOOPS
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Automated Practice Loops ({loops.length})
            </h1>
            <p className="text-xs text-slate-500">
              Schedule recurring 3-minute objection and pitch drills delivered automatically via Slack, Teams, or Email
            </p>
          </div>

          <button
            onClick={() => setShowCreate(!showCreate)}
            data-testid="open-create-loop-btn"
            className="px-4 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Recurring Loop</span>
          </button>
        </div>

        {showCreate && (
          <form
            onSubmit={handleCreateLoop}
            className="bg-white rounded-2xl p-6 border-2 border-[#524FFC] shadow-md space-y-4"
          >
            <h2 className="text-base font-extrabold text-[#040348]">
              Schedule New Practice Loop
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#040348] mb-1">
                  Loop Name
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200"
                />
              </div>
              <div>
                <label className="block font-bold text-[#040348] mb-1">
                  Cadence
                </label>
                <input
                  type="text"
                  value={cadence}
                  onChange={(e) => setCadence(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200"
                />
              </div>
              <div>
                <label className="block font-bold text-[#040348] mb-1">
                  Target Group
                </label>
                <input
                  type="text"
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200"
                />
              </div>
            </div>
            <button
              type="submit"
              data-testid="save-loop-btn"
              className="px-5 py-2 rounded-xl bg-[#524FFC] text-white text-xs font-bold cursor-pointer"
            >
              Activate Loop
            </button>
          </form>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {loops.map((loop) => (
            <div
              key={loop.id}
              className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {loop.status}
                </span>
                <span className="text-xs font-bold text-[#524FFC]">
                  {loop.completionRate}% Completion
                </span>
              </div>
              <h3 className="font-bold text-base text-[#040348] flex items-center gap-2">
                <Repeat className="w-4 h-4 text-[#524FFC]" /> {loop.title}
              </h3>
              <div className="text-xs text-slate-600 space-y-1">
                <div>
                  <strong>Cadence:</strong> {loop.cadence}
                </div>
                <div>
                  <strong>Assigned Cohort:</strong> {loop.targetGroup}
                </div>
                <div>
                  <strong>Linked Scenario:</strong> {loop.scenarioTitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
