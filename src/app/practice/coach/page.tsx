import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { PracticeStudioClient } from "@/components/practice/PracticeStudioClient";

export const dynamic = "force-dynamic";

export default async function PracticeCoachPage() {
  const user = await getCurrentUserOrDemo();
  const scenarios = await prisma.roleplayScenario.findMany({
    include: { persona: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AppShell user={user}>
      <PracticeStudioClient
        mode="COACH"
        scenarios={scenarios}
        initialScenarioId="scen-objection-sec"
        userId={user.id}
      />
    </AppShell>
  );
}
