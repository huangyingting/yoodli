"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingNav";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Mic,
  BarChart3,
  Award,
  Play,
  Users,
  Zap,
  Bot,
} from "lucide-react";

const HERO_DEMOS = [
  {
    id: "ciso",
    badge: "OBJECTION HANDLING",
    color: "#F1B6EB",
    title: "Enterprise CISO Security & AI Privacy Objection",
    persona: "Dana Sterling • VP of InfoSec & CISO",
    quote:
      "\"My security architecture team flagged your platform because our reps discuss confidential M&A details. How can I approve an AI tool that records our people?\"",
    metrics: { wpm: "146 WPM", fillers: "1.2% Fillers", score: "92% Rubric Score" },
    shareSlug: "NHCkSatH",
    scenarioId: "scen-objection-sec",
  },
  {
    id: "cfo",
    badge: "COLD CALL",
    color: "#8ED6F3",
    title: "Outbound CFO Value Pitch During SaaS Freeze",
    persona: "Marcus Vance • Chief Financial Officer",
    quote:
      "\"You caught me between board prep meetings and we have a strict freeze on new SaaS tools right now. What is this regarding?\"",
    metrics: { wpm: "154 WPM", fillers: "1.9% Fillers", score: "86% Rubric Score" },
    shareSlug: "Vh7rshS1",
    scenarioId: "scen-cold-cfo",
  },
  {
    id: "interview",
    badge: "BEHAVIORAL INTERVIEW",
    color: "#D9D2BB",
    title: "Staff Product & GTM Leader STAR Interview",
    persona: "Liam O'Connor • VP of Product",
    quote:
      "\"Tell me about a time you had to align two senior leaders with conflicting priorities around a high-stakes launch.\"",
    metrics: { wpm: "139 WPM", fillers: "0.9% Fillers", score: "90% Rubric Score" },
    shareSlug: "HaGmU6aj",
    scenarioId: "scen-interview-pm",
  },
  {
    id: "keynote",
    badge: "EXECUTIVE PITCH",
    color: "#F5B9B0",
    title: "FY26 Q1 Revenue Kickoff Keynote Rehearsal",
    persona: "Solo Presentation Studio",
    quote:
      "\"Why do elite athletes spend 90% of their time practicing and only 10% in the game, while enterprise sales teams practice live on prospects?\"",
    metrics: { wpm: "141 WPM", fillers: "0.7% Fillers", score: "89% Rubric Score" },
    shareSlug: "WizrmFmj",
    scenarioId: "scen-discovery-inbound",
  },
];

export default function MarketingHomePage() {
  const [activeDemo, setActiveDemo] = useState(HERO_DEMOS[0]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FF]">
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-yoodli-slanted border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 text-xs font-bold text-[#524FFC] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Roleplays for Revenue Enablement, Interviews & Leadership</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#040348] tracking-tight leading-[1.1]">
              Practice high-stakes conversations{" "}
              <span className="bg-yoodli-gradient bg-clip-text text-transparent">
                before they happen.
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Don&apos;t practice live on million-dollar prospects. Roleplay cold calls, CISO security objections, executive pitches, and behavioral interviews with realistic AI Personas—and get instant rubric & delivery coaching.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/home"
                className="px-6 py-3.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-bold text-sm shadow-md flex items-center gap-2 transition"
              >
                <span>Start Practicing Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/share/${activeDemo.shareSlug}`}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-indigo-50 text-[#040348] border border-indigo-200 font-bold text-sm flex items-center gap-2 transition"
              >
                <Play className="w-4 h-4 text-[#524FFC]" />
                <span>Explore Live Feedback Report</span>
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0FA16D]" /> 42% Faster Rep Ramp
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0FA16D]" /> 28% Win-Rate Lift
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#524FFC]" /> SOC2 Type II & Zero-Retention
              </span>
            </div>
          </div>

          {/* Interactive Scenario Preview Card */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {HERO_DEMOS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveDemo(d)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeDemo.id === d.id
                      ? "bg-[#040348] text-white shadow-xs"
                      : "bg-white text-[#040348] border border-indigo-100 hover:border-[#524FFC]"
                  }`}
                >
                  {d.badge}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-100 space-y-5">
              <div className="flex items-center justify-between">
                <span
                  className="px-3 py-1 rounded-full text-xs font-extrabold text-[#040348]"
                  style={{ backgroundColor: activeDemo.color }}
                >
                  {activeDemo.badge}
                </span>
                <span className="text-xs font-bold text-[#0FA16D] bg-[#DEFFF1] px-2.5 py-1 rounded-full">
                  {activeDemo.metrics.score}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#040348]">
                  {activeDemo.title}
                </h3>
                <p className="text-xs font-semibold text-[#524FFC]">
                  AI Partner: {activeDemo.persona}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#040348] text-white space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-cyan-300 font-bold">
                  AI Persona Challenge
                </div>
                <p className="text-sm text-indigo-100 italic leading-relaxed">
                  {activeDemo.quote}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#F5F8FE] border border-indigo-100">
                  <div className="text-xs text-slate-500">Pacing</div>
                  <div className="font-extrabold text-sm text-[#040348]">
                    {activeDemo.metrics.wpm}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F8FE] border border-indigo-100">
                  <div className="text-xs text-slate-500">Word Choice</div>
                  <div className="font-extrabold text-sm text-[#0FA16D]">
                    {activeDemo.metrics.fillers}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F8FE] border border-indigo-100">
                  <div className="text-xs text-slate-500">Evaluation</div>
                  <div className="font-extrabold text-sm text-[#524FFC]">
                    {activeDemo.metrics.score}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
                <Link
                  href={`/practice/conversation?scenarioId=${activeDemo.scenarioId}`}
                  className="text-xs font-bold text-[#524FFC] hover:underline flex items-center gap-1"
                >
                  <Mic className="w-3.5 h-3.5" /> Practice This Scenario Live
                </Link>
                <Link
                  href={`/share/${activeDemo.shareSlug}`}
                  className="text-xs font-bold text-[#040348] hover:text-[#524FFC] flex items-center gap-1"
                >
                  View Full Analytics Report <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Logos */}
      <section className="py-10 bg-white border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Trusted by Category-Leading Enterprise Revenue, L&amp;D &amp; Coaching Organizations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 items-center text-lg font-extrabold text-slate-400">
            <span>Google Cloud</span>
            <span>Korn Ferry</span>
            <span>Dale Carnegie</span>
            <span>Toastmasters</span>
            <span>RingCentral</span>
            <span>Bain &amp; Co</span>
          </div>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#524FFC]">
            Complete Enablement &amp; Coaching Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#040348]">
            Everything you need to build, coach, certify, and measure communication at scale
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Mic className="w-6 h-6 text-[#524FFC]" />}
            badge="1. AI ROLEPLAYS & PERSONAS"
            title="Multi-Turn Voice & Video Simulations"
            description="Practice against skeptical CISOs, analytical CFOs, and procurement directors that dynamically push back on your answers."
            href="/roleplays"
            cta="Browse Roleplays"
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6 text-[#1DA9E6]" />}
            badge="2. SPEECH & RUBRIC ANALYTICS"
            title="Objective Scoring + Delivery Telemetry"
            description="Instant evaluation on Binary, Rated, Compound, and Knowledge-Based custom goals—plus WPM pacing, filler words, weak language, and eye contact."
            href="/share/NHCkSatH"
            cta="Inspect Sample Report"
          />
          <FeatureCard
            icon={<Award className="w-6 h-6 text-[#0FA16D]" />}
            badge="3. ENTERPRISE ADMIN & PROGRAMS"
            title="Certification Tracks, Loops & CoachBot RAG"
            description="Assign multi-step pitch certifications, upload battlecards to CoachBot, run weekly micro-loops, and sync scores with Gong & Salesforce."
            href="/org/overview"
            cta="Open Enterprise Admin"
          />
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function FeatureCard({
  icon,
  badge,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-5">
      <div className="space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#F5F8FE] border border-indigo-100 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#524FFC]">
          {badge}
        </div>
        <h3 className="text-xl font-bold text-[#040348]">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#524FFC] hover:text-[#4E4CBB]"
      >
        <span>{cta}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
