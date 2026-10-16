import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ExerciseGameClient } from "@/components/practice/ExerciseGameClient";

export default function NoFillerPage() {
  return (
    <AppShell>
      <ExerciseGameClient
        slug="no-filler"
        title="No Filler Survival"
        subtitle="ZERO FILLER WORD CHALLENGE"
        rules="Speak for 60 seconds without saying 'um', 'uh', 'like', 'you know', or 'basically'. Use deliberate power pauses instead!"
        prompts={[
          "Deliver a 60-second executive summary of your #1 priority this quarter with zero filler words.",
          "Defend your annual pricing when a procurement director asks for a 25% discount.",
          "Introduce yourself and your superpower to a new executive leadership team.",
        ]}
        challengeWords={["clarity", "outcomes", "precision", "commitment", "impact"]}
      />
    </AppShell>
  );
}
