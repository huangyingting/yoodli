"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingNav, MarketingFooter } from "@/components/layout/MarketingNav";
import { CheckCircle2, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"ANNUAL" | "MONTHLY">("ANNUAL");

  const plans = [
    {
      name: "Free",
      desc: "For individuals exploring AI speech & interview coaching.",
      price: "$0",
      period: "forever",
      cta: "Start Free",
      href: "/signup",
      popular: false,
      features: [
        "5 free Yoodli practice sessions",
        "AI Speech Analytics (WPM, Fillers, Pauses)",
        "Behavioral Interview question bank",
        "Communication games (Spin a Yarn, No Filler)",
        "Private-by-default recordings",
      ],
    },
    {
      name: "Pro",
      desc: "For job seekers, speakers, and individual account executives.",
      price: billingCycle === "ANNUAL" ? "$16" : "$20",
      period: "per user / month",
      cta: "Start Pro Trial",
      href: "/signup",
      popular: false,
      features: [
        "50 Yoodli AI Roleplay & Speech sessions / mo",
        "Custom AI Persona & Scenario Builder",
        "AI Rephrase ('How to say it better')",
        "Progress Dashboard & Skill Snapshot trends",
        "Timestamped peer & coach sharing",
      ],
    },
    {
      name: "Advanced",
      desc: "Unlimited practice and custom rubrics for power users & coaches.",
      price: billingCycle === "ANNUAL" ? "$36" : "$45",
      period: "per user / month",
      cta: "Get Advanced",
      href: "/signup",
      popular: true,
      features: [
        "Unlimited AI Roleplays, Interviews & Speeches",
        "Custom Binary & Rated Rubric Goals",
        "Multi-language voice & accent coaching",
        "Real-time live meeting coaching nudges",
        "Priority LLM & HD video storage",
      ],
    },
    {
      name: "Enterprise",
      desc: "For revenue enablement, L&D, and global GTM organizations.",
      price: "Custom",
      period: "annual seat license",
      cta: "Explore Enterprise Admin",
      href: "/org/overview",
      popular: false,
      features: [
        "Multi-step Certification Programs & Loops",
        "CoachBot RAG grounded on your battlecards",
        "Knowledge-Based & Compound Custom Goals",
        "Okta SAML 2.0 SSO, SCIM 2.0 & RBAC Groups",
        "Gong, Zoom, Salesforce, Workday & SCORM 1.2",
        "SOC2 Type II & Contractual Zero LLM Retention",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FF]">
      <MarketingNav />

      <main className="flex-1 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-[#E6E5FF] text-[#524FFC] text-xs font-bold uppercase tracking-wider">
            Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#040348]">
            Plans that scale from individual interview prep to global revenue teams
          </h1>

          {/* Monthly / Annual Billing Toggle */}
          <div className="pt-4 inline-flex items-center p-1.5 rounded-2xl bg-white border border-indigo-200 shadow-2xs">
            <button
              onClick={() => setBillingCycle("MONTHLY")}
              data-testid="billing-monthly-btn"
              className={`px-5 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
                billingCycle === "MONTHLY"
                  ? "bg-[#040348] text-white"
                  : "text-slate-600 hover:text-[#040348]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("ANNUAL")}
              data-testid="billing-annual-btn"
              className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                billingCycle === "ANNUAL"
                  ? "bg-[#524FFC] text-white"
                  : "text-slate-600 hover:text-[#040348]"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#00E676] text-[#040348] font-extrabold">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-6 bg-white flex flex-col justify-between space-y-6 ${
                p.popular
                  ? "border-2 border-[#524FFC] shadow-xl relative"
                  : "border border-indigo-100 shadow-xs"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-yoodli-gradient text-white text-[11px] font-extrabold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#040348]">{p.name}</h2>
                  <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{p.desc}</p>
                </div>

                <div className="pt-2 border-t border-indigo-50">
                  <div className="text-4xl font-extrabold text-[#040348]">{p.price}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{p.period}</div>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs text-slate-700">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0FA16D] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={p.href}
                className={`w-full py-3 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-1.5 transition ${
                  p.popular
                    ? "bg-[#524FFC] hover:bg-[#4E4CBB] text-white"
                    : "bg-[#F5F8FE] hover:bg-[#E6E5FF] text-[#524FFC]"
                }`}
              >
                <span>{p.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
