import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { PracticeStudioClient } from "@/components/practice/PracticeStudioClient";

export const dynamic = "force-dynamic";

export default async function PracticeSpeechPage() {
  const user = await getCurrentUserOrDemo();
  const scenarios = await prisma.roleplayScenario.findMany({
    include: { persona: true },
    take: 3,
  });

  return (
    <AppShell user={user}>
      <PracticeStudioClient
        mode="SPEECH"
        scenarios={scenarios}
        userId={user.id}
      />
    </AppShell>
  );
}
