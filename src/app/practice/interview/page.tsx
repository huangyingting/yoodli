import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { PracticeStudioClient } from "@/components/practice/PracticeStudioClient";

export const dynamic = "force-dynamic";

export default async function PracticeInterviewPage() {
  const user = await getCurrentUserOrDemo();
  const scenarios = await prisma.roleplayScenario.findMany({
    include: { persona: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AppShell user={user}>
      <PracticeStudioClient
        mode="INTERVIEW"
        scenarios={scenarios}
        initialScenarioId="scen-interview-pm"
        userId={user.id}
      />
    </AppShell>
  );
}
