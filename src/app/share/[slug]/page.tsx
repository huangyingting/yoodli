import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SpeechFeedbackView } from "@/components/feedback/SpeechFeedbackView";
import { ArrowLeft, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SharedSpeechPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const speech =
    (await prisma.speech.findFirst({
      where: { OR: [{ shareSlug: slug }, { id: slug }] },
      include: { comments: { orderBy: { timestampSec: "asc" } } },
    })) ??
    (await prisma.speech.findFirst({
      include: { comments: { orderBy: { timestampSec: "asc" } } },
    }));

  if (!speech) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold">Shared Recording Not Found</h1>
          <Link href="/" className="text-[#524FFC] font-semibold underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FF]">
      {/* Top Public Share Banner */}
      <header className="bg-white border-b border-indigo-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-yoodli-gradient flex items-center justify-center text-white font-bold">
                y
              </div>
              <span className="text-xl font-extrabold text-[#040348]">yoodli</span>
            </Link>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5F8FE] border border-indigo-100 text-slate-600">
              Shared AI Coaching Report • /share/{speech.shareSlug}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sample-speeches"
              className="text-xs font-bold text-slate-600 hover:text-[#040348] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> More Sample Speeches
            </Link>
            <Link
              href="/home"
              className="px-4 py-2 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Try Yoodli Free
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SpeechFeedbackView
          speech={{
            ...speech,
            createdAt: speech.createdAt.toISOString(),
          }}
          isPublicShare={false}
        />
      </main>
    </div>
  );
}
