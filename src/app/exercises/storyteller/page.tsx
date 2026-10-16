import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ExerciseGameClient } from "@/components/practice/ExerciseGameClient";

export default function StorytellerPage() {
  return (
    <AppShell>
      <ExerciseGameClient
        slug="storyteller"
        title="Storyteller Arc"
        subtitle="STAR & EXECUTIVE NARRATIVE"
        rules="Structure a compelling turnaround story hitting Situation, Conflict, Decisive Action, and Quantified Victory."
        prompts={[
          "Tell the story of a deal or project that was on the brink of failure and how you turned it around.",
          "Share a moment when customer feedback completely changed your product strategy.",
          "Describe a leadership lesson you learned the hard way.",
        ]}
        challengeWords={["turning point", "obstacle", "breakthrough", "customer", "victory"]}
      />
    </AppShell>
  );
}
