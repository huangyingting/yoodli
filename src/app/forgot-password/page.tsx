"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("alex.rivera@acme.io");
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResetUrl(data.resetUrl || null);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-yoodli-slanted flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-indigo-100 space-y-5">
          <Link
            href="/signin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#524FFC]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>

          <h1 className="text-2xl font-extrabold text-[#040348]">
            Reset your password
          </h1>

          {sent ? (
            <div className="p-4 rounded-2xl bg-[#DEFFF1] border border-emerald-200 text-xs text-[#0FA16D] space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Password reset link generated!
              </div>
              <p>
                If an account exists for <strong>{email}</strong>, you will receive reset instructions shortly.
              </p>
              {resetUrl && (
                <div className="pt-2">
                  <Link
                    href={resetUrl}
                    data-testid="dev-reset-password-link"
                    className="inline-block px-3 py-1.5 rounded-xl bg-[#0FA16D] text-white font-bold text-xs hover:bg-emerald-700"
                  >
                    Open Local Dev Reset Link →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600">
                Enter your work email address and we&apos;ll generate a one-time cryptographic password reset link.
              </p>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivera@acme.io"
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#524FFC] text-white font-bold text-sm cursor-pointer"
              >
                {loading ? "Generating Reset Token..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
