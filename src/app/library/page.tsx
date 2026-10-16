"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  Search,
  Play,
  Share2,
  Trash2,
  Clock,
  CheckCircle2,
  Plus,
} from "lucide-react";

interface SpeechListItem {
  id: string;
  shareSlug: string;
  userId: string;
  title: string;
  practiceType: string;
  durationSeconds: number;
  visibility: string;
  overallScore: number;
  wpmAverage: number;
  fillerWordPct: number;
  concisenessScore: number;
  createdAt: string;
}

export default function LibraryPage() {
  const [speeches, setSpeeches] = useState<SpeechListItem[]>([]);
  const [filterType, setFilterType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/speeches")
      .then((r) => r.json())
      .then((d) => {
        if (d.speeches) setSpeeches(d.speeches);
      });
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/speeches/${id}`, { method: "DELETE" });
    setSpeeches((prev) => prev.filter((s) => s.id !== id));
  };

  const filtered = speeches.filter((s) => {
    if (filterType !== "ALL" && s.practiceType !== filterType) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#040348]">
              My Recordings &amp; Speeches
            </h1>
            <p className="text-xs text-slate-500">
              All your private and shared roleplays, interview simulations, presentations, and uploaded calls
            </p>
          </div>

          <Link
            href="/practice/conversation"
            className="px-4 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>New Practice Session</span>
          </Link>
        </div>

        {/* Filters + Search */}
        <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {["ALL", "ROLEPLAY", "INTERVIEW", "SPEECH", "UPLOAD"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === t
                    ? "bg-[#040348] text-white"
                    : "text-slate-600 hover:bg-[#F5F8FE]"
                }`}
              >
                {t === "ALL" ? "All Recordings" : t}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recordings by title..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-indigo-200 text-xs"
            />
          </div>
        </div>

        {/* Recordings Table */}
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-indigo-100 bg-[#F5F8FE] text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3.5 px-5">Session Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Rubric Score</th>
                <th className="py-3.5 px-4">Pacing (WPM)</th>
                <th className="py-3.5 px-4">Filler Rate</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50 text-sm">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F5F8FE]/60 transition">
                  <td className="py-4 px-5">
                    <Link
                      href={`/library/${s.userId || "user-alex"}/feedback/${s.id}`}
                      className="font-bold text-[#040348] hover:text-[#524FFC] block"
                    >
                      {s.title}
                    </Link>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {Math.floor(s.durationSeconds / 60)}m {s.durationSeconds % 60}s • Share code: {s.shareSlug}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
                      {s.practiceType}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {s.overallScore}%
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-xs text-[#040348]">
                    {s.wpmAverage} WPM
                  </td>
                  <td className="py-4 px-4 font-semibold text-xs text-[#040348]">
                    {s.fillerWordPct}%
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/library/${s.userId || "user-alex"}/feedback/${s.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#524FFC] text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" /> Report
                      </Link>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(`${window.location.origin}/share/${s.shareSlug}`).catch(() => {});
                          setCopiedSlug(s.shareSlug);
                          setTimeout(() => setCopiedSlug(null), 2000);
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-indigo-200 text-xs font-semibold text-[#040348] hover:bg-indigo-50 cursor-pointer"
                      >
                        {copiedSlug === s.shareSlug ? "Copied!" : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#CD4631] hover:bg-red-50 cursor-pointer"
                        title="Delete recording"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
