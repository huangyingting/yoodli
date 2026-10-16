"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PlayCircle, CheckCircle2, Clock, Mic } from "lucide-react";

interface CourseItem {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorRole: string;
  durationMinutes: number;
  category: string;
  thumbnailColor: string;
  lessonsJson: string;
}

export default function MemberCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [activeLesson, setActiveLesson] = useState<string>(
    "1. Implicating Pain vs. Pitching Features"
  );

  useEffect(() => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((d) => {
        if (d.org?.courses) setCourses(d.org.courses);
      });
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
            MY LEARNING • VIDEO COURSES
          </span>
          <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
            Communication &amp; Sales Enablement Courses
          </h1>
          <p className="text-xs text-slate-500">
            Watch bite-sized masterclass lessons and immediately apply each skill in an AI Roleplay
          </p>
        </div>

        {/* Active Video Lesson Player Banner */}
        <div className="bg-[#040348] rounded-3xl p-6 text-white grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 aspect-video rounded-2xl bg-gradient-to-br from-[#524FFC] to-[#040348] border border-indigo-700 p-6 flex flex-col justify-between">
            <span className="px-3 py-1 rounded-full bg-black/30 text-xs font-bold w-fit">
              Now Playing Lesson
            </span>
            <div className="space-y-2">
              <PlayCircle className="w-12 h-12 text-[#1DA9E6]" />
              <h2 className="text-xl font-extrabold">{activeLesson}</h2>
              <p className="text-xs text-indigo-200">
                Learn how to quantify operational pain in the first 3 minutes of discovery and transition cleanly to executive proof points.
              </p>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#00E676] w-2/3 rounded-full" />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Practice What You Learned
            </span>
            <h3 className="text-xl font-bold">
              Ready to test this framework against an AI Persona?
            </h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Launch a 3-minute MEDDPICC discovery simulation with SVP Engineering Elena Rostova or CFO Marcus Vance.
            </p>
            <Link
              href="/practice/conversation?scenarioId=scen-discovery-inbound"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold"
            >
              <Mic className="w-4 h-4" />
              <span>Practice Lesson in AI Studio</span>
            </Link>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => {
            const lessons = JSON.parse(course.lessonsJson || "[]") as {
              id: string;
              title: string;
              duration: string;
              completed: boolean;
            }[];

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: course.thumbnailColor }}
                    >
                      {course.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.durationMinutes}m
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#040348]">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600">{course.description}</p>

                  <div className="space-y-1.5 pt-2">
                    {lessons.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setActiveLesson(l.title)}
                        className="w-full text-left p-2 rounded-xl hover:bg-[#F5F8FE] border border-indigo-50 flex items-center justify-between text-xs cursor-pointer"
                      >
                        <span className="flex items-center gap-2 font-medium text-[#040348] truncate">
                          {l.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0FA16D] shrink-0" />
                          ) : (
                            <PlayCircle className="w-3.5 h-3.5 text-[#524FFC] shrink-0" />
                          )}
                          <span className="truncate">{l.title}</span>
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-2">
                          {l.duration}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
