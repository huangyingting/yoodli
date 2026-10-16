import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ExerciseGameClient } from "@/components/practice/ExerciseGameClient";

export default function SpinAYarnPage() {
  return (
    <AppShell>
      <ExerciseGameClient
        slug="spin-a-yarn"
        title="Spin a Yarn"
        subtitle="IMPROMPTU AGILITY GAME"
        rules="Speak for 60 seconds on the prompt while smoothly incorporating the surprise challenge words below."
        prompts={[
          "Pitch why your team deserves double the R&D budget while weaving in every surprise word.",
          "Tell the story of the most unexpected customer call of your career.",
          "Explain how AI will transform work over the next 5 years.",
        ]}
        challengeWords={["lighthouse", "telescope", "espresso", "orchestra", "quantum", "velvet"]}
      />
    </AppShell>
  );
}
