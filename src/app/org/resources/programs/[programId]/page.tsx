import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import {
  Award,
  CheckCircle2,
  Play,
  ArrowLeft,
  Video,
  Mic,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MemberProgramDetailPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  const user = await getCurrentUserOrDemo();

  const program =
    (await prisma.program.findUnique({ where: { id: programId } })) ??
    (await prisma.program.findFirst());

  if (!program) {
    return (
      <AppShell user={user}>
        <div className="p-8 bg-white rounded-2xl">Program not found</div>
      </AppShell>
    );
  }

  const steps = JSON.parse(program.stepsJson || "[]") as {
    stepNumber: number;
    title: string;
    type: string;
    scenarioId?: string;
    speechId?: string;
    durationMin: number;
    status: string;
    score: number | null;
    description: string;
  }[];

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <Link
          href="/org/resources/programs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#524FFC]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Programs
        </Link>

        {/* Program Banner */}
        <div className="rounded-3xl p-6 bg-yoodli-dark-hero text-white space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1DA9E6]/20 text-cyan-300 font-bold">
              CERTIFICATION CURRICULUM
            </span>
            <span className="text-indigo-200">Due {program.dueDate}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{program.title}</h1>
          <p className="text-sm text-indigo-200 max-w-3xl">{program.description}</p>
        </div>

        {/* Ordered Curriculum Steps */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-[#040348]">
            Program Modules &amp; Required Simulations ({steps.length})
          </h2>

          {steps.map((step) => {
            const isDone = step.status === "COMPLETED";
            return (
              <div
                key={step.stepNumber}
                className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isDone
                        ? "bg-[#DEFFF1] text-[#0FA16D]"
                        : "bg-[#E6E5FF] text-[#524FFC]"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : step.stepNumber}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-[#524FFC]">
                        {step.type}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {step.durationMin} mins
                      </span>
                      {step.score && (
                        <span className="text-xs font-bold text-[#0FA16D]">
                          Score: {step.score}%
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-[#040348]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600">{step.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {step.speechId && (
                    <Link
                      href={`/library/${user.id}/feedback/${step.speechId}`}
                      className="px-3.5 py-2 rounded-xl border border-indigo-200 text-xs font-bold text-[#040348] hover:bg-[#F5F8FE]"
                    >
                      View Scorecard
                    </Link>
                  )}
                  <Link
                    href={
                      step.scenarioId
                        ? `/practice/conversation?scenarioId=${step.scenarioId}`
                        : "/org/resources/courses"
                    }
                    className="px-4 py-2 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    {step.type === "VIDEO" ? (
                      <>
                        <Video className="w-3.5 h-3.5" /> Watch
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" /> {isDone ? "Practice Again" : "Start Roleplay"}
                      </>
                    )}
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
