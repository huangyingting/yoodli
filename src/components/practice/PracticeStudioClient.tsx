"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Sparkles,
  Send,
  CheckCircle2,
  StopCircle,
  Play,
  Volume2,
  ShieldAlert,
  Target,
  Clock,
} from "lucide-react";

interface ScenarioOption {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  starterPrompt: string;
  scenarioContext: string;
  goalsJson: string;
  persona: {
    id: string;
    name: string;
    title: string;
    company: string;
    avatarUrl: string;
    demeanor: string;
    voiceName: string;
  };
}

export function PracticeStudioClient({
  mode,
  scenarios,
  initialScenarioId,
  userId = "user-alex",
}: {
  mode: "ROLEPLAY" | "INTERVIEW" | "SPEECH" | "COACH";
  scenarios: ScenarioOption[];
  initialScenarioId?: string;
  userId?: string;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const selectedScenario =
    scenarios.find((s) => s.id === initialScenarioId) || scenarios[0];

  const [activeScenarioId, setActiveScenarioId] = useState(
    selectedScenario?.id || ""
  );
  const currentScenario =
    scenarios.find((s) => s.id === activeScenarioId) || selectedScenario;

  const goals: string[] = currentScenario?.goalsJson
    ? JSON.parse(currentScenario.goalsJson)
    : [
        "State a clear value proposition",
        "Back claims with concrete metrics",
        "Lock in a specific next step",
      ];

  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [hasHardwareStream, setHasHardwareStream] = useState(false);

  const [turns, setTurns] = useState<
    {
      speaker: "USER" | "AI_PERSONA";
      speakerName: string;
      startSec: number;
      endSec: number;
      text: string;
    }[]
  >([]);

  const [userDraft, setUserDraft] = useState(
    "Dana, I completely respect your security rigor. We are SOC2 Type II and GDPR certified with strict tenant isolation and contractual zero-data-retention across all LLM endpoints. Could we schedule a 25-minute technical architecture review this Thursday at 11 AM EST?"
  );
  const [coachingNudge, setCoachingNudge] = useState(
    "Ready when you are! Click 'Start Session' to begin recording and speaking with the AI Persona."
  );
  const [aiThinking, setAiThinking] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // Initialize starter turn when scenario changes
  useEffect(() => {
    if (currentScenario && mode !== "SPEECH") {
      setTurns([
        {
          speaker: "AI_PERSONA",
          speakerName: `${currentScenario.persona.name} (${currentScenario.persona.title})`,
          startSec: 0,
          endSec: 15,
          text: currentScenario.starterPrompt,
        },
      ]);
      setElapsedSec(15);
    } else {
      setTurns([]);
      setElapsedSec(0);
    }
  }, [activeScenarioId, mode]);

  // Timer interval while recording
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  // Request webcam preview if available (gracefully falls back in headless Playwright)
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraEnabled && typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          setHasHardwareStream(true);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setHasHardwareStream(false);
        });
    }
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraEnabled]);

  const handleStartSession = () => {
    setIsRecording(true);
    setCoachingNudge(
      "Live Coaching Active: Target 135–160 WPM, keep filler words below 2%, and address the rubric goals on the right."
    );
  };

  const handleSendUserTurn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDraft.trim()) return;

    const startSec = elapsedSec;
    const endSec = elapsedSec + 25;
    const userMessage = userDraft.trim();

    const updatedTurns = [
      ...turns,
      {
        speaker: "USER" as const,
        speakerName: "Alex Rivera",
        startSec,
        endSec,
        text: userMessage,
      },
    ];
    setTurns(updatedTurns);
    setElapsedSec(endSec);
    setUserDraft("");

    if (mode === "SPEECH") {
      setCoachingNudge(
        "Great delivery segment! Add another section or click 'Finish & View AI Feedback' to generate your full report."
      );
      return;
    }

    setAiThinking(true);
    try {
      const userTurnCount = updatedTurns.filter((t) => t.speaker === "USER").length - 1;
      const res = await fetch("/api/roleplays/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaName: currentScenario?.persona.name || "Dana Sterling",
          personaTitle: currentScenario?.persona.title || "VP of Information Security",
          demeanor: currentScenario?.persona.demeanor || "Skeptical",
          scenarioTitle: currentScenario?.title || "Enterprise Roleplay",
          userMessage,
          turnIndex: userTurnCount,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setTurns((prev) => [
          ...prev,
          {
            speaker: "AI_PERSONA",
            speakerName: `${currentScenario?.persona.name || "Dana Sterling"} (${
              currentScenario?.persona.title || "VP"
            })`,
            startSec: endSec + 1,
            endSec: endSec + 18,
            text: data.reply,
          },
        ]);
        setElapsedSec(endSec + 18);
      }
      if (data.coachingNudge) {
        setCoachingNudge(data.coachingNudge);
      }
    } finally {
      setAiThinking(false);
    }
  };

  const handleFinishSession = async () => {
    setFinishing(true);
    setIsRecording(false);
    try {
      const finalTurns =
        turns.some((t) => t.speaker === "USER")
          ? turns
          : [
              ...turns,
              {
                speaker: "USER" as const,
                speakerName: "Alex Rivera",
                startSec: elapsedSec,
                endSec: elapsedSec + 35,
                text:
                  userDraft.trim() ||
                  "We are SOC2 Type II certified with contractual zero-data-retention on all LLM calls, and our enterprise deployments reduce rep ramp time by 42%. Let's schedule a technical review this Thursday at 11 AM EST.",
              },
            ];

      const res = await fetch("/api/speeches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: currentScenario?.id,
          title:
            mode === "SPEECH"
              ? "Executive Keynote & Value Pitch Rehearsal"
              : `${currentScenario?.title || "Practice Session"}`,
          practiceType: mode,
          durationSeconds: Math.max(elapsedSec, 65),
          turns: finalTurns,
          goals,
        }),
      });
      const data = await res.json();
      if (data.speech?.id) {
        router.push(`/library/${userId}/feedback/${data.speech.id}`);
      } else {
        router.push("/library");
      }
    } finally {
      setFinishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Top Bar */}
      <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              {mode} STUDIO
            </span>
            {isRecording && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-[#CD4631] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#CD4631] animate-ping" />
                REC • {Math.floor(elapsedSec / 60)}:{String(elapsedSec % 60).padStart(2, "0")}
              </span>
            )}
          </div>
          <h1 className="text-xl font-extrabold text-[#040348]">
            {mode === "SPEECH"
              ? "Presentation & Keynote Practice Studio"
              : currentScenario?.title || "AI Roleplay Studio"}
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {scenarios.length > 1 && mode !== "SPEECH" && (
            <select
              value={activeScenarioId}
              onChange={(e) => setActiveScenarioId(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-indigo-200 text-xs font-semibold bg-white text-[#040348]"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.persona.name})
                </option>
              ))}
            </select>
          )}

          {!isRecording ? (
            <button
              onClick={handleStartSession}
              data-testid="start-recording-btn"
              className="px-5 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Start Session</span>
            </button>
          ) : (
            <button
              onClick={handleFinishSession}
              disabled={finishing}
              data-testid="finish-session-btn"
              className="px-5 py-2.5 rounded-xl bg-[#0FA16D] hover:bg-[#0b6e47] text-white text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <StopCircle className="w-4 h-4" />
              <span>{finishing ? "Analyzing..." : "Finish & View AI Feedback"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time AI Coaching Nudge Banner */}
      <div className="bg-yoodli-slanted rounded-2xl p-4 border border-[#C9C7FF] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#524FFC] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#524FFC]">
              Real-Time Yoodli AI Coach Nudge
            </div>
            <div className="text-sm font-semibold text-[#040348]">{coachingNudge}</div>
          </div>
        </div>
        <button
          onClick={handleFinishSession}
          disabled={finishing}
          data-testid="quick-complete-btn"
          className="px-4 py-2 rounded-xl bg-white hover:bg-indigo-50 text-[#524FFC] border border-indigo-200 text-xs font-bold shrink-0 cursor-pointer"
        >
          {finishing ? "Scoring..." : "Complete & Score Now"}
        </button>
      </div>

      {/* Studio Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Video Stage + Live Turn Input */}
        <div className="lg:col-span-7 space-y-5">
          {/* Dual Camera / AI Partner Stage */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* User Camera Feed */}
            <div className="relative aspect-video rounded-2xl bg-[#040348] overflow-hidden border border-indigo-900 flex flex-col justify-between p-4 text-white">
              {hasHardwareStream && cameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="my-auto text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-yoodli-gradient mx-auto flex items-center justify-center text-xl font-extrabold shadow-lg">
                    AR
                  </div>
                  <div className="text-xs font-semibold">Alex Rivera (You)</div>
                  <div className="text-[11px] text-emerald-300">
                    Framing: 95% Centered • Eye Contact: 91%
                  </div>
                </div>
              )}

              <div className="relative z-10 flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-black/50 backdrop-blur">
                  You • {micEnabled ? "Mic Active" : "Muted"}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMicEnabled(!micEnabled)}
                    className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70"
                  >
                    {micEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-red-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                    className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70"
                  >
                    {cameraEnabled ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5 text-red-400" />}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Persona Card */}
            {mode !== "SPEECH" && currentScenario && (
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#131168] to-[#040348] p-4 text-white flex flex-col justify-between border border-indigo-900">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-300 font-semibold">
                    {currentScenario.persona.demeanor} Persona
                  </span>
                  <span className="flex items-center gap-1 text-indigo-200">
                    <Volume2 className="w-3.5 h-3.5 text-[#1DA9E6]" />
                    {currentScenario.persona.voiceName}
                  </span>
                </div>

                <div className="my-auto flex items-center gap-3.5">
                  <img
                    src={currentScenario.persona.avatarUrl}
                    alt={currentScenario.persona.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#1DA9E6]"
                  />
                  <div>
                    <div className="font-bold text-base">{currentScenario.persona.name}</div>
                    <div className="text-xs text-indigo-200">{currentScenario.persona.title}</div>
                    <div className="text-[11px] text-indigo-300">{currentScenario.persona.company}</div>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {aiThinking ? "Persona is formulating response..." : "Listening to your response"}
                </div>
              </div>
            )}
          </div>

          {/* Live Conversation Transcript & Spoken Turn Input */}
          <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#040348]">
              Live Session Dialogue & Transcript Stream
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {turns.map((t, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl text-sm ${
                    t.speaker === "USER"
                      ? "bg-[#F5F8FE] border border-indigo-200 ml-6"
                      : "bg-slate-50 border border-slate-200 mr-6"
                  }`}
                >
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className={t.speaker === "USER" ? "text-[#524FFC]" : "text-[#040348]"}>
                      {t.speakerName}
                    </span>
                    <span className="font-mono text-slate-400">
                      {Math.floor(t.startSec / 60)}:{String(t.startSec % 60).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendUserTurn} className="space-y-2 pt-2 border-t border-indigo-100">
              <label className="block text-xs font-bold text-slate-500">
                Speak into microphone or type/edit your spoken turn below:
              </label>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={userDraft}
                  onChange={(e) => setUserDraft(e.target.value)}
                  data-testid="practice-turn-input"
                  placeholder="Speak or type your response to the AI Persona..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-indigo-200 text-sm"
                />
                <button
                  type="submit"
                  disabled={aiThinking}
                  data-testid="send-turn-btn"
                  className="px-4 py-2 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{aiThinking ? "..." : "Respond"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 5 Cols: Scenario Brief & Evaluation Rubric Checklist */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-base text-[#040348] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#524FFC]" />
              Scenario Brief & Context
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentScenario?.scenarioContext ||
                "Deliver a high-impact executive presentation with clear metrics, < 2% filler words, and 130–165 WPM pacing."}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-base text-[#040348] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#0FA16D]" />
              Evaluation Rubric Goals ({goals.length})
            </h3>
            <p className="text-xs text-slate-500">
              Yoodli AI will score your session against these goals upon completion:
            </p>
            <ul className="space-y-2.5">
              {goals.map((g, i) => (
                <li
                  key={i}
                  className="p-3 rounded-xl bg-[#F5F8FE] border border-indigo-100 text-xs font-semibold text-[#040348] flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#524FFC] shrink-0 mt-0.5" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
