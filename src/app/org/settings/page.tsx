"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Settings, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export default function OrgSettingsPage() {
  const [name, setName] = useState("Acme Corp Global Revenue");
  const [customBrandingColor, setCustomBrandingColor] = useState("#524FFC");
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [zeroDataRetention, setZeroDataRetention] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_ORG_SETTINGS",
        name,
        customBrandingColor,
        ssoEnabled,
        zeroDataRetention,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
            ENTERPRISE GOVERNANCE • SECURITY &amp; BRANDING
          </span>
          <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
            Organization Settings
          </h1>
          <p className="text-xs text-slate-500">
            Configure SAML 2.0 SSO, Zero-Data-Retention LLM privacy, and workspace branding
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-2xs space-y-5"
        >
          {saved && (
            <div className="p-3.5 rounded-xl bg-[#DEFFF1] text-[#0FA16D] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Organization settings updated and persisted!
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#040348] mb-1">
                Organization Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#040348] mb-1">
                Brand Accent Color (Hex)
              </label>
              <input
                type="text"
                value={customBrandingColor}
                onChange={(e) => setCustomBrandingColor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm font-mono"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-indigo-50 text-xs">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F8FE] cursor-pointer">
              <div>
                <div className="font-bold text-[#040348] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#524FFC]" /> Enforce SAML 2.0 / Okta Enterprise SSO
                </div>
                <p className="text-slate-500 mt-0.5">
                  Require all `@acmecorp.com` members to authenticate via corporate identity provider.
                </p>
              </div>
              <input
                type="checkbox"
                checked={ssoEnabled}
                onChange={(e) => setSsoEnabled(e.target.checked)}
                className="accent-[#524FFC] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F8FE] cursor-pointer">
              <div>
                <div className="font-bold text-[#040348] flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#0FA16D]" /> Zero-Data-Retention LLM Processing
                </div>
                <p className="text-slate-500 mt-0.5">
                  Guarantee zero third-party model training on customer transcripts or roleplay audio.
                </p>
              </div>
              <input
                type="checkbox"
                checked={zeroDataRetention}
                onChange={(e) => setZeroDataRetention(e.target.checked)}
                className="accent-[#524FFC] w-4 h-4"
              />
            </label>
          </div>

          <button
            type="submit"
            data-testid="save-org-settings-btn"
            className="px-6 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold cursor-pointer"
          >
            Save Enterprise Settings
          </button>
        </form>
      </div>
    </AppShell>
  );
}
