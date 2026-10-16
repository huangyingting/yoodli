import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { FileText, CheckCircle2, Bot } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrgFilesPage() {
  const user = await getCurrentUserOrDemo();
  const docs = await prisma.coachBotDocument.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              CONTENT LIBRARY • FILES &amp; COLLATERAL
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Uploaded Organization Files ({docs.length})
            </h1>
            <p className="text-xs text-slate-500">
              Slide decks, battlecards, and compliance whitepapers attached to scenarios and rubrics
            </p>
          </div>

          <Link
            href="/org/content/coachbot"
            className="px-4 py-2.5 rounded-xl bg-[#524FFC] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4" />
            <span>Open CoachBot RAG Indexer</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {docs.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6E5FF] text-[#524FFC]">
                  {d.category}
                </span>
                <span className="text-xs text-[#0FA16D] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> INDEXED ({d.fileSize})
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#040348] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#524FFC]" /> {d.title}
              </h3>
              <p className="text-xs text-slate-600">{d.contentSummary}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
