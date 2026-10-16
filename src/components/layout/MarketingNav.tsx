"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronDown,
  Mic,
  BarChart3,
  Users,
  ShieldCheck,
  Award,
  BookOpen,
  PlayCircle,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

export function MarketingNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-yoodli-gradient flex items-center justify-center text-white font-bold text-xl shadow-sm">
              y
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#040348]">
              yoodli
            </span>
          </Link>

          {/* Desktop Navigation Dropdowns */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#040348]/80">
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu("platform")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="flex items-center gap-1 py-2 hover:text-[#524FFC] transition">
                Platform <ChevronDown className="w-4 h-4" />
              </button>
              {openMenu === "platform" && (
                <div className="absolute left-0 top-full w-80 bg-white rounded-2xl shadow-xl border border-indigo-100 p-4 grid gap-3">
                  <Link href="/roleplays" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F5F8FE]">
                    <Mic className="w-5 h-5 text-[#524FFC] mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#040348]">AI Roleplays & Personas</div>
                      <div className="text-xs text-slate-500">Multi-turn voice & video simulations with skeptical buyers</div>
                    </div>
                  </Link>
                  <Link href="/builder" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F5F8FE]">
                    <Sparkles className="w-5 h-5 text-[#1DA9E6] mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#040348]">AI Scenario Builder</div>
                      <div className="text-xs text-slate-500">Generate custom scenarios & rubrics in 30 seconds</div>
                    </div>
                  </Link>
                  <Link href="/share/NHCkSatH" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F5F8FE]">
                    <BarChart3 className="w-5 h-5 text-[#0FA16D] mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#040348]">Speech & Rubric Analytics</div>
                      <div className="text-xs text-slate-500">Instant feedback on WPM, filler words, and MEDDPICC goals</div>
                    </div>
                  </Link>
                  <Link href="/org/overview" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F5F8FE]">
                    <ShieldCheck className="w-5 h-5 text-[#524FFC] mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#040348]">Enterprise Admin & Certification</div>
                      <div className="text-xs text-slate-500">Programs, CoachBot RAG, Loops, and org-wide reporting</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setOpenMenu("usecases")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="flex items-center gap-1 py-2 hover:text-[#524FFC] transition">
                Use Cases <ChevronDown className="w-4 h-4" />
              </button>
              {openMenu === "usecases" && (
                <div className="absolute left-0 top-full w-72 bg-white rounded-2xl shadow-xl border border-indigo-100 p-4 grid gap-2.5">
                  <Link href="/roleplays" className="p-2 rounded-xl hover:bg-[#F5F8FE] flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#524FFC]" />
                    <span className="font-semibold text-[#040348]">Sales & Revenue Enablement</span>
                  </Link>
                  <Link href="/org/resources/programs" className="p-2 rounded-xl hover:bg-[#F5F8FE] flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#1DA9E6]" />
                    <span className="font-semibold text-[#040348]">Onboarding & Pitch Certification</span>
                  </Link>
                  <Link href="/practice/interview" className="p-2 rounded-xl hover:bg-[#F5F8FE] flex items-center gap-2.5">
                    <PlayCircle className="w-4 h-4 text-[#0FA16D]" />
                    <span className="font-semibold text-[#040348]">Behavioral & Technical Interviews</span>
                  </Link>
                  <Link href="/practice/speech" className="p-2 rounded-xl hover:bg-[#F5F8FE] flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#524FFC]" />
                    <span className="font-semibold text-[#040348]">Executive Presentations & Keynotes</span>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/sample-speeches" className="hover:text-[#524FFC] transition">
              Sample Speeches
            </Link>
            <Link href="/courses" className="hover:text-[#524FFC] transition">
              Courses
            </Link>
            <Link href="/pricing" className="hover:text-[#524FFC] transition">
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/signin"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#040348] hover:bg-indigo-50 transition"
          >
            Sign In
          </Link>
          <Link
            href="/home"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#524FFC] text-[#524FFC] hover:bg-[#F5F8FE] transition"
          >
            Launch Studio
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#524FFC] hover:bg-[#4E4CBB] shadow-sm flex items-center gap-1.5 transition"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-[#040348]"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-indigo-100 px-4 py-4 space-y-3">
          <Link href="/roleplays" className="block py-2 font-semibold text-[#040348]">AI Roleplays</Link>
          <Link href="/sample-speeches" className="block py-2 font-semibold text-[#040348]">Sample Speeches</Link>
          <Link href="/courses" className="block py-2 font-semibold text-[#040348]">Courses</Link>
          <Link href="/pricing" className="block py-2 font-semibold text-[#040348]">Pricing</Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/signin" className="w-full py-2.5 text-center rounded-xl border border-indigo-200 font-semibold">
              Sign In
            </Link>
            <Link href="/home" className="w-full py-2.5 text-center rounded-xl bg-[#524FFC] text-white font-semibold">
              Open Yoodli App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="bg-[#040348] text-white py-16 border-t border-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-yoodli-gradient flex items-center justify-center text-white font-bold text-lg">
              y
            </div>
            <span className="text-2xl font-extrabold tracking-tight">yoodli</span>
          </div>
          <p className="text-indigo-200 text-sm max-w-sm leading-relaxed">
            AI-powered roleplays, sales enablement certification, and real-time communication coaching trusted by Fortune 500 GTM teams and professionals worldwide.
          </p>
          <div className="flex items-center gap-3 text-xs text-indigo-300 pt-2">
            <span className="px-2.5 py-1 rounded-full bg-white/10">SOC2 Type II Certified</span>
            <span className="px-2.5 py-1 rounded-full bg-white/10">GDPR Compliant</span>
            <span className="px-2.5 py-1 rounded-full bg-white/10">Zero LLM Retention</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-indigo-300 mb-4">Platform</h4>
          <ul className="space-y-2.5 text-sm text-indigo-100">
            <li><Link href="/roleplays" className="hover:text-white">AI Roleplays</Link></li>
            <li><Link href="/builder" className="hover:text-white">AI Scenario Builder</Link></li>
            <li><Link href="/share/NHCkSatH" className="hover:text-white">Speech Analytics</Link></li>
            <li><Link href="/org/content/coachbot" className="hover:text-white">CoachBot RAG</Link></li>
            <li><Link href="/org/loops" className="hover:text-white">Practice Loops</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-indigo-300 mb-4">Resources</h4>
          <ul className="space-y-2.5 text-sm text-indigo-100">
            <li><Link href="/sample-speeches" className="hover:text-white">Sample Speeches</Link></li>
            <li><Link href="/courses" className="hover:text-white">Enablement Courses</Link></li>
            <li><Link href="/org/resources/exercises" className="hover:text-white">Speaking Games</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing & Enterprise</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-indigo-300 mb-4">Workspace</h4>
          <ul className="space-y-2.5 text-sm text-indigo-100">
            <li><Link href="/home" className="hover:text-white">Member Home</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">My Progress Dashboard</Link></li>
            <li><Link href="/org/overview" className="hover:text-white">Enterprise Org Admin</Link></li>
            <li><Link href="/signin" className="hover:text-white">Sign In / SSO</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-indigo-300">
        <p>© 2026 Yoodli Inc. All rights reserved.</p>
        <p>Built with Next.js, NextAuth v5 & Prisma (SQLite Local / PostgreSQL Production)</p>
      </div>
    </footer>
  );
}
