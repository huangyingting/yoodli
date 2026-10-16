import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { PracticeStudioClient } from "@/components/practice/PracticeStudioClient";

export const dynamic = "force-dynamic";

export default async function PracticeConversationPage({
  searchParams,
}: {
  searchParams: Promise<{ scenarioId?: string }>;
}) {
  const { scenarioId } = await searchParams;
  const user = await getCurrentUserOrDemo();
  const scenarios = await prisma.roleplayScenario.findMany({
    include: { persona: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell user={user}>
      <PracticeStudioClient
        mode="ROLEPLAY"
        scenarios={scenarios}
        initialScenarioId={scenarioId}
        userId={user.id}
      />
    </AppShell>
  );
}
