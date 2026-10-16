import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingNav";
import { BookOpen, Clock, ArrowRight, PlayCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PublicCoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FF]">
      <MarketingNav />

      <main className="flex-1 py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-[#E6E5FF] text-[#524FFC] text-xs font-bold uppercase">
            Yoodli Academy
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#040348]">
            Master MEDDPICC Discovery, Executive Presence &amp; STAR Interviews
          </h1>
          <p className="text-slate-600 text-sm">
            Every Yoodli course pairs bite-sized expert video modules with hands-on AI Roleplay simulations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl overflow-hidden border border-indigo-100 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div
                  className="h-28 p-5 flex flex-col justify-between text-white"
                  style={{ backgroundColor: c.thumbnailColor }}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full w-fit">
                    {c.category}
                  </span>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {c.durationMinutes} mins • {c.totalLessons} Modules
                  </div>
                </div>
                <div className="p-5 space-y-2.5">
                  <h2 className="text-lg font-extrabold text-[#040348]">{c.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
                  <div className="text-xs font-semibold text-[#524FFC] pt-1">
                    Instructor: {c.instructor} ({c.instructorRole})
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href="/org/resources/courses"
                  className="w-full py-2.5 rounded-xl bg-[#F5F8FE] hover:bg-[#E6E5FF] text-[#524FFC] font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Course in Studio</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
