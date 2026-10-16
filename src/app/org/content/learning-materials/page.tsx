import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { BookOpen, Clock, PlayCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrgLearningMaterialsPage() {
  const user = await getCurrentUserOrDemo();
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              CONTENT LIBRARY • LEARNING MATERIALS
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Courses &amp; Enablement Modules ({courses.length})
            </h1>
            <p className="text-xs text-slate-500">
              Manage video lessons and exemplar gold-standard pitches available to members
            </p>
          </div>

          <Link
            href="/org/resources/courses"
            className="px-4 py-2.5 rounded-xl bg-[#524FFC] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Preview Member Course Player</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6E5FF] text-[#524FFC]">
                  {c.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {c.durationMinutes}m
                </span>
              </div>
              <h3 className="font-bold text-base text-[#040348]">{c.title}</h3>
              <p className="text-xs text-slate-600">{c.description}</p>
              <div className="text-xs text-slate-400 pt-1">
                Instructor: <strong className="text-[#040348]">{c.instructor}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
