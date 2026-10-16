import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { ArrowLeft, CheckCircle2, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrgAdminProgramDetailPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  const user = await getCurrentUserOrDemo();
  const program =
    (await prisma.program.findUnique({
      where: { id: programId },
      include: { enrollments: { include: { user: true } } },
    })) ??
    (await prisma.program.findFirst({
      include: { enrollments: { include: { user: true } } },
    }));

  if (!program) {
    return (
      <AppShell user={user}>
        <div className="p-8 bg-white rounded-2xl">Program not found</div>
      </AppShell>
    );
  }

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <Link
          href="/org/content/programs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#524FFC]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Programs
        </Link>

        <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-2xs space-y-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
            ADMIN ROSTER &amp; SCORECARD • DUE {program.dueDate}
          </span>
          <h1 className="text-2xl font-extrabold text-[#040348]">{program.title}</h1>
          <p className="text-xs text-slate-600">{program.description}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-4">
          <h2 className="text-base font-extrabold text-[#040348] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#524FFC]" />
            Enrolled Cohort Progress ({program.enrollments.length})
          </h2>

          <div className="divide-y divide-indigo-50 text-xs">
            {program.enrollments.map((enr) => (
              <div
                key={enr.id}
                className="py-3.5 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#040348]">{enr.user.name}</div>
                  <div className="text-slate-500">{enr.user.email} • {enr.user.jobTitle}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2.5 py-1 rounded-lg bg-[#E6E5FF] text-[#524FFC] font-bold">
                    {enr.completedStepsCount}/{enr.totalStepsCount} Steps ({enr.status})
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#DEFFF1] text-[#0FA16D] font-bold">
                    Score: {enr.scorePct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
