"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("alex.rivera@acme.io");
  const [password, setPassword] = useState("Yoodli2026!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password. Try demo: alex.rivera@acme.io / Yoodli2026!");
      } else {
        router.push("/home");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickSignIn = async (demoEmail: string, targetPath: string) => {
    setLoading(true);
    await signIn("credentials", {
      email: demoEmail,
      password: "DEMO_BYPASS",
      redirect: false,
    });
    router.push(targetPath);
  };

  return (
    <div className="min-h-screen bg-yoodli-slanted flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-yoodli-gradient flex items-center justify-center text-white font-bold text-xl shadow-md">
            y
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-[#040348]">
            yoodli
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-[#040348] pt-2">
          Sign in to your Yoodli workspace
        </h1>
        <p className="text-xs text-slate-500">
          AI Roleplays, Speech Coaching &amp; Enterprise Enablement
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-indigo-100 space-y-6">
          {/* 1-Click Demo Persona Buttons */}
          <div className="p-3.5 rounded-2xl bg-[#F5F8FE] border border-indigo-100 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#524FFC] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Instant Demo Access (Pre-Seeded Account)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="demo-member-login"
                onClick={() => handleDemoQuickSignIn("alex.rivera@acme.io", "/home")}
                className="py-2 px-3 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold transition cursor-pointer"
              >
                Member Studio (Alex)
              </button>
              <button
                type="button"
                data-testid="demo-admin-login"
                onClick={() => handleDemoQuickSignIn("alex.rivera@acme.io", "/org/overview")}
                className="py-2 px-3 rounded-xl bg-[#040348] hover:bg-indigo-950 text-white text-xs font-bold transition cursor-pointer"
              >
                Enterprise Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#CD4631] font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-indigo-200 text-sm text-[#040348]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#524FFC] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-indigo-200 text-sm text-[#040348]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="signin-submit-btn"
              className="w-full py-3 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-indigo-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-400">Or continue with Enterprise SSO</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoQuickSignIn("alex.rivera@acme.io", "/home")}
              className="py-2.5 px-3 rounded-xl border border-indigo-200 hover:bg-[#F5F8FE] text-xs font-bold text-[#040348] cursor-pointer"
            >
              Google Workspace
            </button>
            <button
              type="button"
              onClick={() => handleDemoQuickSignIn("alex.rivera@acme.io", "/org/overview")}
              className="py-2.5 px-3 rounded-xl border border-indigo-200 hover:bg-[#F5F8FE] text-xs font-bold text-[#040348] flex items-center justify-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#524FFC]" />
              Okta SAML SSO
            </button>
          </div>

          <p className="text-center text-xs text-slate-500">
            Invite-only workspace •{" "}
            <Link href="/register" className="font-bold text-[#524FFC] hover:underline">
              Have an invitation link?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
