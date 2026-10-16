import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { HelpCircle, Play, ListChecks } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrgInterviewsPage() {
  const user = await getCurrentUserOrDemo();
  const banks = await prisma.questionBank.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              CONTENT LIBRARY • INTERVIEW SIMULATIONS
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Structured Interview Tracks
            </h1>
            <p className="text-xs text-slate-500">
              Standardized hiring, promotion readiness, and technical architecture interview templates
            </p>
          </div>

          <Link
            href="/org/content/question-banks"
            className="px-4 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <ListChecks className="w-4 h-4" />
            <span>Manage Question Banks</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {banks.map((b) => {
            const qs = JSON.parse(b.questionsJson || "[]") as string[];
            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6E5FF] text-[#524FFC]">
                    {b.category}
                  </span>
                  <h3 className="font-bold text-base text-[#040348]">{b.title}</h3>
                  <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                    {qs.slice(0, 3).map((q, i) => (
                      <li key={i} className="line-clamp-1">
                        • {q}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/practice/interview"
                  className="w-full py-2.5 rounded-xl bg-[#524FFC] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" /> Start Interview Track
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
