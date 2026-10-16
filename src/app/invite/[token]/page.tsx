"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  User,
} from "lucide-react";

interface InvitationInspection {
  id: string;
  status: "pending" | "accepted" | "revoked" | "expired" | "invalid";
  maskedEmail: string | null;
  email: string | null;
  expiresAt: string | null;
}

export default function AcceptInvitationPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = params.token;

  const [inspection, setInspection] = useState<InvitationInspection | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState(
    "Sales & Revenue Enablement"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/invitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data: InvitationInspection) => {
        setInspection(data);
        if (data.email) {
          setEmail(data.email);
        }
        setLoading(false);
      })
      .catch(() => {
        setInspection({
          id: "",
          status: "invalid",
          maskedEmail: null,
          email: null,
          expiresAt: null,
        });
        setLoading(false);
      });
  }, [token]);

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name,
          email,
          password,
          primaryGoal,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Unable to complete registration.");
        setSubmitting(false);
        return;
      }

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      }).catch(() => null);

      router.push("/onboarding");
    } catch {
      setError("An unexpected error occurred.");
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
              <KeyRound className="w-3 h-3" /> Invitation Only
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-slate-400">
              Verifying cryptographic invitation token...
            </div>
          ) : !inspection || inspection.status !== "pending" ? (
            <div
              data-testid="invitation-status-unavailable"
              className="space-y-4 py-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#CD4631]">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-[#040348]">
                  Invitation {inspection?.status || "invalid"}
                </h1>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {inspection?.status === "accepted"
                    ? "This one-time invitation has already been used to create a Yoodli account."
                    : inspection?.status === "expired"
                    ? "This invitation link has expired. Ask a workspace administrator to rotate or issue a new invitation."
                    : inspection?.status === "revoked"
                    ? "This invitation was revoked by a workspace administrator."
                    : "This invitation token is not valid."}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/signin"
                  className="px-4 py-2.5 rounded-xl bg-[#524FFC] text-white text-xs font-bold hover:bg-[#4E4CBB]"
                >
                  Go to Sign In
                </Link>
                <Link
                  href="/admin/invitations"
                  className="px-4 py-2.5 rounded-xl border border-indigo-200 text-xs font-bold text-[#040348] hover:bg-[#F5F8FE]"
                >
                  Admin Invitations
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-extrabold text-[#040348]">
                  Accept your invitation
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Complete your profile for{" "}
                  <span className="font-bold text-[#040348]">
                    {inspection.maskedEmail}
                  </span>{" "}
                  to join the Acme Corp Global Sales workspace.
                </p>
              </div>

              {error && (
                <div
                  data-testid="invite-accept-error"
                  className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-[#CD4631] font-semibold"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleAccept} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      data-testid="invite-name-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jordan Taylor"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm text-[#040348]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Invited Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      data-testid="invite-email-confirm-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={inspection.maskedEmail || "you@company.com"}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm text-[#040348]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Create Password (12–128 characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      minLength={12}
                      maxLength={128}
                      data-testid="invite-password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 12 characters"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm text-[#040348]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Primary Use Case
                  </label>
                  <select
                    value={primaryGoal}
                    onChange={(e) => setPrimaryGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm bg-white text-[#040348]"
                  >
                    <option>Sales &amp; Revenue Enablement</option>
                    <option>Job Interview Preparation</option>
                    <option>Executive Presentations &amp; Keynotes</option>
                    <option>Manager &amp; Leadership Coaching</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="accept-invitation-submit-btn"
                  className="w-full py-3 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {submitting
                      ? "Activating Account..."
                      : "Accept Invitation & Create Account"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-2 border-t border-indigo-50 flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-[#0FA16D] shrink-0" />
                <span>
                  One-time cryptographic token verified • Expires{" "}
                  {inspection.expiresAt
                    ? new Date(inspection.expiresAt).toLocaleDateString()
                    : "soon"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
