import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { Award, CheckCircle2, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MemberProgramsPage() {
  const user = await getCurrentUserOrDemo();
  const programs = await prisma.program.findMany({
    include: { enrollments: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
            MY LEARNING • CERTIFICATION TRACKS
          </span>
          <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
            Assigned Programs &amp; Certifications
          </h1>
          <p className="text-xs text-slate-500">
            Complete structured learning modules, AI roleplays, and pitch simulations to earn your organization credentials
          </p>
        </div>

        <div className="grid gap-5">
          {programs.map((prog) => {
            const steps = JSON.parse(prog.stepsJson || "[]") as {
              stepNumber: number;
              title: string;
              status: string;
              score: number | null;
            }[];
            const completedCount = steps.filter((s) => s.status === "COMPLETED").length;
            const pct = Math.round((completedCount / Math.max(steps.length, 1)) * 100);

            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: prog.bannerColor }}
                    >
                      {pct === 100 ? "COMPLETED" : "IN PROGRESS"}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Due {prog.dueDate}
                    </span>
                    <span className="text-xs font-bold text-[#0FA16D]">
                      Team Avg Score: {prog.avgScore}%
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-[#040348]">
                    {prog.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-56 h-2 bg-indigo-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#524FFC] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#040348]">
                      {completedCount} / {steps.length} Steps Completed ({pct}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/org/resources/programs/${prog.id}`}
                    className="px-5 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                  >
                    <span>Open Program</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
