"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2, Mic, Video, ArrowRight } from "lucide-react";

const GOALS = [
  {
    id: "Sales & Revenue Enablement",
    title: "Sales & Revenue Enablement",
    desc: "Practice cold calls, MEDDPICC discovery, and CISO/CFO objection handling",
  },
  {
    id: "Job Interview Preparation",
    title: "Job Interview Preparation",
    desc: "Master STAR behavioral and technical architecture interviews",
  },
  {
    id: "Executive Presentations & Keynotes",
    title: "Executive Presentations & Keynotes",
    desc: "Deliver crisp board pitches with < 2% filler words and 140 WPM pacing",
  },
  {
    id: "Leadership & Manager 1:1s",
    title: "Leadership & Manager 1:1s",
    desc: "Coach direct reports and navigate difficult performance conversations",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(GOALS[0].id);
  const [demeanorPref, setDemeanorPref] = useState("Skeptical & Challenging");

  const handleFinish = async () => {
    await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "user-account",
        primaryGoal: selectedGoal,
        onboardingCompleted: true,
      }),
    });
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-yoodli-slanted flex flex-col justify-center py-12 px-4">
      <div className="max-w-xl w-full mx-auto bg-white rounded-3xl p-8 shadow-xl border border-indigo-100 space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-[#524FFC]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Yoodli Personalization Wizard
          </span>
          <span>Step {step} of 2</span>
        </div>

        {step === 1 ? (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-extrabold text-[#040348]">
                What would you like to practice first?
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                We&apos;ll tailor your recommended AI Personas, roleplays, and rubric goals
              </p>
            </div>

            <div className="grid gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGoal(g.id)}
                  className={`text-left p-4 rounded-2xl border transition cursor-pointer ${
                    selectedGoal === g.id
                      ? "border-2 border-[#524FFC] bg-[#F5F8FE]"
                      : "border-indigo-100 hover:border-indigo-300"
                  }`}
                >
                  <div className="font-bold text-sm text-[#040348] flex items-center justify-between">
                    <span>{g.title}</span>
                    {selectedGoal === g.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#524FFC]" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{g.desc}</div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-[#524FFC] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next: Configure AI Coach Style</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-extrabold text-[#040348]">
                Choose your default AI Persona demeanor &amp; studio setup
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                You can customize personas per scenario at any time
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Skeptical & Challenging",
                "Analytical & ROI-Driven",
                "Warm & Supportive Coach",
                "Busy Executive (Rapid-Fire)",
              ].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setDemeanorPref(style)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                    demeanorPref === style
                      ? "border-2 border-[#524FFC] bg-[#F5F8FE] text-[#524FFC]"
                      : "border-indigo-100 text-[#040348]"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F8FE] border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-[#0FA16D]">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#040348]">
                    Camera &amp; Microphone Ready
                  </div>
                  <div className="text-[11px] text-slate-500">
                    WebRTC + Real-Time Speech Analytics enabled
                  </div>
                </div>
              </div>
              <Video className="w-5 h-5 text-[#524FFC]" />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl border border-indigo-200 text-xs font-bold text-slate-600"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Yoodli Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
