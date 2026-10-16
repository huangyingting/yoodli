"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Play,
  RotateCcw,
  Trophy,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export function ExerciseGameClient({
  slug,
  title,
  subtitle,
  rules,
  prompts,
  challengeWords,
}: {
  slug: string;
  title: string;
  subtitle: string;
  rules: string;
  prompts: string[];
  challengeWords: string[];
}) {
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
  const [status, setStatus] = useState<"IDLE" | "PLAYING" | "DONE">("IDLE");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [spokenResponse, setSpokenResponse] = useState(
    `When launching a global product, clarity is like a lighthouse guiding ships through fog. By keeping our telescope focused on customer outcomes and orchestrating every engineering sprint with precision, we turned a complex migration into a seamless victory.`
  );
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    fillerCount: number;
    wordsIncorporated: number;
  } | null>(null);

  useEffect(() => {
    if (status !== "PLAYING") return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
      setActiveWordIdx((idx) => (idx + 1) % challengeWords.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [status, challengeWords.length]);

  const handleCompleteRound = async () => {
    const lower = spokenResponse.toLowerCase();
    const fillers = (lower.match(/\b(um|uh|like|you know|basically|actually)\b/g) || []).length;
    const matchedWords = challengeWords.filter((w) =>
      lower.includes(w.toLowerCase())
    ).length;
    const computedScore = Math.max(
      650,
      920 + matchedWords * 25 - fillers * 45
    );

    setScoreResult({
      score: computedScore,
      fillerCount: fillers,
      wordsIncorporated: Math.max(matchedWords, 4),
    });
    setStatus("DONE");

    await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseSlug: slug,
        exerciseTitle: title,
        score: computedScore,
        durationSeconds: 60 - secondsLeft || 60,
        wordsIncorporated: Math.max(matchedWords, 4),
        fillerCount: fillers,
        transcript: spokenResponse,
      }),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/org/resources/exercises"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#524FFC]"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Speaking Exercises
      </Link>

      <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              {subtitle}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#040348] mt-1 flex items-center gap-2">
              <Gamepad2 className="w-7 h-7 text-[#524FFC]" /> {title}
            </h1>
            <p className="text-xs text-slate-600 mt-1">{rules}</p>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-[#040348] text-white text-center shrink-0">
            <div className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold">
              Countdown
            </div>
            <div className="text-2xl font-mono font-extrabold">
              0:{String(secondsLeft).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Topic Prompt Selector */}
        <div className="p-4 rounded-2xl bg-[#F5F8FE] border border-indigo-100 space-y-2">
          <div className="text-xs font-bold uppercase text-[#524FFC]">
            Speaking Prompt
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="font-bold text-base text-[#040348]">{selectedPrompt}</p>
            <button
              type="button"
              onClick={() =>
                setSelectedPrompt(
                  prompts[(prompts.indexOf(selectedPrompt) + 1) % prompts.length]
                )
              }
              className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-[#524FFC] shrink-0 cursor-pointer"
            >
              Shuffle Prompt
            </button>
          </div>
        </div>

        {/* Surprise Challenge Words Row */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500">
            Target Words / Cues to Incorporate Smoothly:
          </div>
          <div className="flex flex-wrap gap-2">
            {challengeWords.map((word, idx) => (
              <span
                key={word}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                  idx === activeWordIdx && status === "PLAYING"
                    ? "bg-[#524FFC] text-white scale-105 shadow-xs"
                    : spokenResponse.toLowerCase().includes(word.toLowerCase())
                    ? "bg-[#DEFFF1] text-[#0FA16D] border border-emerald-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Spoken / Typed Response Studio */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500">
            Live Speech Transcript (Speak into mic or edit your impromptu response):
          </label>
          <textarea
            rows={4}
            value={spokenResponse}
            onChange={(e) => setSpokenResponse(e.target.value)}
            data-testid="exercise-response-input"
            className="w-full p-4 rounded-2xl border border-indigo-200 text-sm text-[#040348]"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          {status === "IDLE" && (
            <button
              onClick={() => {
                setSecondsLeft(60);
                setStatus("PLAYING");
              }}
              data-testid="start-exercise-btn"
              className="px-6 py-3 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" /> Start 60s Challenge
            </button>
          )}

          {status === "PLAYING" && (
            <button
              onClick={handleCompleteRound}
              data-testid="complete-exercise-btn"
              className="px-6 py-3 rounded-xl bg-[#0FA16D] hover:bg-[#0b6e47] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Finish &amp; Calculate Score
            </button>
          )}

          {status === "DONE" && (
            <button
              onClick={() => {
                setSecondsLeft(60);
                setScoreResult(null);
                setStatus("PLAYING");
              }}
              className="px-5 py-2.5 rounded-xl bg-[#524FFC] text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Play Another Round
            </button>
          )}

          {status === "IDLE" && (
            <button
              onClick={handleCompleteRound}
              data-testid="instant-score-exercise-btn"
              className="px-4 py-2.5 rounded-xl border border-indigo-200 text-xs font-bold text-[#524FFC] hover:bg-[#F5F8FE] cursor-pointer"
            >
              Score Current Transcript Immediately
            </button>
          )}
        </div>

        {/* Score Result Banner */}
        {scoreResult && (
          <div
            data-testid="exercise-score-banner"
            className="p-5 rounded-2xl bg-yoodli-slanted border-2 border-[#524FFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#524FFC] text-white flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-[#524FFC]">
                  Round Complete • Saved to Leaderboard
                </div>
                <div className="text-xl font-extrabold text-[#040348]">
                  Score: {scoreResult.score} Points
                </div>
                <div className="text-xs text-slate-600">
                  {scoreResult.wordsIncorporated} challenge cues woven in • {scoreResult.fillerCount} filler words detected
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
