"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAttemptDirectRegister(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(
          data.message ||
            "A valid invitation link is required to create a Yoodli account."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-yoodli-slanted flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-yoodli-gradient flex items-center justify-center text-white font-bold text-lg shadow-sm">
                y
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-[#040348]">
                yoodli
              </span>
            </Link>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E6E5FF] text-[#524FFC] text-[11px] font-bold">
              <KeyRound className="w-3 h-3" /> Invite-Only Mode
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-[#040348]">
              Invitation-Only Registration
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              This Yoodli workspace is operating in{" "}
              <strong className="text-[#040348]">invitation-only</strong>{" "}
              account admission mode. New accounts can only be created via a
              one-time invitation link issued by a workspace administrator.
            </p>
          </div>

          <div className="rounded-2xl bg-[#F5F8FE] border border-indigo-100 p-4 space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#524FFC] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#040348]">Have an invitation link?</strong>{" "}
                Open the <code className="text-[#524FFC] font-mono">/invite/&lt;token&gt;</code>{" "}
                URL sent by your administrator to set your password and activate your account.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-[#524FFC] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#040348]">Deploying a new instance?</strong>{" "}
                Provision your first administrator from the host shell with{" "}
                <code className="font-mono text-[#040348]">npm run bootstrap:admin</code>.
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/invite/demo-invite-token-2026"
              data-testid="try-demo-invite-link"
              className="w-full py-3 px-4 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try Pre-Seeded Demo Invitation (invited@acme.io)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/signin"
                className="py-2.5 px-4 rounded-xl border border-indigo-200 hover:bg-[#F5F8FE] text-xs font-bold text-[#040348] text-center"
              >
                Sign In
              </Link>
              <Link
                href="/admin/invitations"
                className="py-2.5 px-4 rounded-xl border border-indigo-200 hover:bg-[#F5F8FE] text-xs font-bold text-[#524FFC] text-center"
              >
                Admin Invitations
              </Link>
            </div>
          </div>

          {/* Direct Registration Enforcement Verifier */}
          <div className="pt-4 border-t border-indigo-100 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Verify Direct Registration Policy (Enforces 403 Invitation Required)
            </p>
            {errorMsg && (
              <div
                data-testid="register-error-banner"
                className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-[#CD4631] font-semibold"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            <form onSubmit={handleAttemptDirectRegister} className="space-y-2.5">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs"
              />
              <input
                type="email"
                required
                placeholder="uninvited@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs"
              />
              <input
                type="password"
                required
                placeholder="Password (12+ chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs"
              />
              <button
                type="submit"
                disabled={submitting}
                data-testid="attempt-uninvited-register-btn"
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#040348] text-xs font-bold cursor-pointer"
              >
                {submitting
                  ? "Checking Admission Policy..."
                  : "Attempt Uninvited Registration"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
