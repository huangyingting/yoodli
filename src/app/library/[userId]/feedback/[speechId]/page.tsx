import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { SpeechFeedbackView } from "@/components/feedback/SpeechFeedbackView";

export const dynamic = "force-dynamic";

export default async function LibrarySpeechFeedbackPage({
  params,
}: {
  params: Promise<{ userId: string; speechId: string }>;
}) {
  const { speechId } = await params;
  const user = await getCurrentUserOrDemo();

  const speech =
    (await prisma.speech.findFirst({
      where: { OR: [{ id: speechId }, { shareSlug: speechId }] },
      include: { comments: { orderBy: { timestampSec: "asc" } } },
    })) ??
    (await prisma.speech.findFirst({
      include: { comments: { orderBy: { timestampSec: "asc" } } },
      orderBy: { createdAt: "desc" },
    }));

  if (!speech) {
    return (
      <AppShell user={user}>
        <div className="p-8 bg-white rounded-2xl border border-indigo-100 text-center">
          <h1 className="text-xl font-bold">Recording not found</h1>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell user={user}>
      <SpeechFeedbackView
        speech={{
          ...speech,
          createdAt: speech.createdAt.toISOString(),
        }}
      />
    </AppShell>
  );
}
