import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { Plus, Award, Users, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrgContentProgramsPage() {
  const user = await getCurrentUserOrDemo();
  const programs = await prisma.program.findMany({
    include: { enrollments: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              CONTENT LIBRARY • CERTIFICATION PROGRAMS
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Admin Programs &amp; Certifications ({programs.length})
            </h1>
            <p className="text-xs text-slate-500">
              Design multi-step certification curricula combining video modules, roleplays, and pitch evaluations
            </p>
          </div>

          <Link
            href="/org/content/programs/create"
            className="px-4 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Certification Program</span>
          </Link>
        </div>

        <div className="grid gap-5">
          {programs.map((p) => {
            const steps = JSON.parse(p.stepsJson || "[]") as any[];
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D]">
                      {p.status}
                    </span>
                    <span className="text-xs text-slate-500">Due {p.dueDate}</span>
                    <span className="text-xs font-bold text-[#524FFC]">
                      {steps.length} Curriculum Modules
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-[#040348]">{p.title}</h2>
                  <p className="text-xs text-slate-600">{p.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/org/content/programs/${p.id}`}
                    className="px-4 py-2.5 rounded-xl bg-[#524FFC] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Manage Roster &amp; Steps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
