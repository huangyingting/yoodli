import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { Plus, Target, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrgGoalsPage() {
  const user = await getCurrentUserOrDemo();
  const goals = await prisma.customGoal.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              EVALUATION ENGINE • CUSTOM RUBRIC GOALS
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Custom Goals &amp; Scoring Rubrics ({goals.length})
            </h1>
            <p className="text-xs text-slate-500">
              Define Binary, Rated (1-5), Compound, and Knowledge-Based evaluation criteria applied automatically to every AI session
            </p>
          </div>

          <Link
            href="/org/content/goals/create"
            className="px-4 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Goal</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {goals.map((g) => {
            const criteria = JSON.parse(g.rubricCriteriaJson || "[]") as any[];
            return (
              <div
                key={g.id}
                className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#E6E5FF] text-[#524FFC]">
                    {g.goalType}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {g.category}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#040348]">{g.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {g.description}
                </p>

                <div className="pt-2 space-y-1.5 border-t border-indigo-50">
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    Evaluation Checklist ({criteria.length})
                  </div>
                  {criteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#040348]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0FA16D] shrink-0 mt-0.5" />
                      <span>{typeof c === "string" ? c : c.criterion || c.title || JSON.stringify(c)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
