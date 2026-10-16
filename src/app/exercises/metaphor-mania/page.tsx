import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ExerciseGameClient } from "@/components/practice/ExerciseGameClient";

export default function MetaphorManiaPage() {
  return (
    <AppShell>
      <ExerciseGameClient
        slug="metaphor-mania"
        title="Metaphor Mania"
        subtitle="ANALOGY & CLARITY DRILL"
        rules="Explain a complex enterprise or technical concept using vivid everyday analogies."
        prompts={[
          "Explain Zero-Data-Retention LLM encryption to a non-technical board member using a real-world analogy.",
          "Compare passive post-call recording vs. pre-call AI roleplay practice to sports or aviation.",
          "Explain technical debt and microservices refactoring using a city infrastructure metaphor.",
        ]}
        challengeWords={["lighthouse", "vault", "cockpit", "symphony", "blueprint"]}
      />
    </AppShell>
  );
}
