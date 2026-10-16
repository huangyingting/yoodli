import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { Plus, MessagesSquare, Play, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrgContentRoleplaysPage() {
  const user = await getCurrentUserOrDemo();
  const scenarios = await prisma.roleplayScenario.findMany({
    include: { persona: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              CONTENT LIBRARY • ROLEPLAY SCENARIOS
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Organization Roleplay Scenarios ({scenarios.length})
            </h1>
            <p className="text-xs text-slate-500">
              Manage buyer discovery, security review, pricing defense, and executive leadership roleplays
            </p>
          </div>

          <Link
            href="/org/content/roleplays/create"
            className="px-4 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Roleplay Scenario</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F8FE] border-b border-indigo-100 text-slate-500 uppercase">
              <tr>
                <th className="py-3.5 px-5">Scenario</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">AI Persona</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50">
              {scenarios.map((s) => (
                <tr key={s.id} className="hover:bg-[#F6F8FF]">
                  <td className="py-4 px-5">
                    <div className="font-bold text-sm text-[#040348]">{s.title}</div>
                    <div className="text-slate-500 line-clamp-1 max-w-md mt-0.5">
                      {s.description}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className="px-2.5 py-1 rounded-full font-bold text-[#040348]"
                      style={{ backgroundColor: s.roundelColor }}
                    >
                      {s.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#040348]">
                    {s.persona?.name || "AI Coach"} ({s.persona?.demeanor || "Adaptive"})
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-[#524FFC] font-bold">
                      {s.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Link
                      href={`/practice/conversation?scenarioId=${s.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#524FFC] text-white font-bold"
                    >
                      <Play className="w-3 h-3" /> Launch
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
