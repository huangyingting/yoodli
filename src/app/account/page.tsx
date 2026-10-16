"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CheckCircle2, Shield, CreditCard, Settings, Calendar } from "lucide-react";

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<"GENERAL" | "BILLING">("GENERAL");
  const [name, setName] = useState("Alex Rivera");
  const [jobTitle, setJobTitle] = useState("VP of Revenue Enablement & Enterprise AE");
  const [defaultPrivacy, setDefaultPrivacy] = useState("PRIVATE");
  const [language, setLanguage] = useState("en-US");
  const [aiCoaching, setAiCoaching] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "user-account",
        name,
        jobTitle,
        defaultPrivacy,
        preferredLanguage: language,
        aiCoachingEnabled: aiCoaching,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#040348]">Account Settings</h1>
          <p className="text-xs text-slate-500">
            Manage your profile, recording privacy defaults, calendar connectors, and Enterprise seat subscription
          </p>
        </div>

        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-indigo-100 w-fit">
          <button
            onClick={() => setActiveTab("GENERAL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "GENERAL" ? "bg-[#524FFC] text-white" : "text-slate-600"
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> General Settings
          </button>
          <button
            onClick={() => setActiveTab("BILLING")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${
              activeTab === "BILLING" ? "bg-[#524FFC] text-white" : "text-slate-600"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Plan &amp; Billing
          </button>
        </div>

        {activeTab === "GENERAL" ? (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-5"
          >
            {saved && (
              <div className="p-3 rounded-xl bg-[#DEFFF1] text-[#0FA16D] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Account preferences saved!
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Default Recording Privacy
                </label>
                <select
                  value={defaultPrivacy}
                  onChange={(e) => setDefaultPrivacy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm bg-white"
                >
                  <option value="PRIVATE">Only Me (100% Private by default)</option>
                  <option value="SHARED_LINK">Anyone with Share Link</option>
                  <option value="ORG">Acme Corp Admins &amp; Managers</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Speech Recognition &amp; Coaching Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm bg-white"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish (Español)</option>
                  <option value="fr-FR">French (Français)</option>
                  <option value="de-DE">German (Deutsch)</option>
                  <option value="ja-JP">Japanese (日本語)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F8FE] border border-indigo-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-[#040348]">
                  Real-Time AI Coaching Nudges &amp; Auto-Rephrase
                </div>
                <div className="text-xs text-slate-500">
                  Show live WPM pacing and filler-word alerts during roleplay practice
                </div>
              </div>
              <input
                type="checkbox"
                checked={aiCoaching}
                onChange={(e) => setAiCoaching(e.target.checked)}
                className="w-5 h-5 accent-[#524FFC]"
              />
            </div>

            <div className="p-4 rounded-xl bg-white border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#524FFC]" />
                <div>
                  <div className="text-sm font-bold text-[#040348]">
                    Google Calendar &amp; Microsoft Outlook Connector
                  </div>
                  <div className="text-xs text-slate-500">
                    Connected to alex.rivera@acme.io for pre-call AI roleplay prep reminders
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D]">
                Connected
              </span>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-sm font-bold cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
                  ENTERPRISE ANNUAL SEAT
                </span>
                <h2 className="text-xl font-extrabold text-[#040348] mt-1">
                  Acme Corp Global Revenue — Enterprise License
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D]">
                Active • Renews Nov 2026
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F5F8FE] border border-indigo-100">
                <div className="text-slate-500">Your Role</div>
                <div className="text-base font-extrabold text-[#040348] mt-0.5">
                  Org Admin &amp; Member
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F5F8FE] border border-indigo-100">
                <div className="text-slate-500">Org Seats Used</div>
                <div className="text-base font-extrabold text-[#040348] mt-0.5">
                  78 / 100 Seats
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F5F8FE] border border-indigo-100">
                <div className="text-slate-500">Security Tier</div>
                <div className="text-base font-extrabold text-[#0FA16D] mt-0.5 flex items-center gap-1">
                  <Shield className="w-4 h-4" /> SOC2 + Zero Retention
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
