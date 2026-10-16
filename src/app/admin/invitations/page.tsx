"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  Check,
  Copy,
  KeyRound,
  MailPlus,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";

interface InvitationRow {
  id: string;
  email: string;
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
  expiresAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  invitedBy: { id: string; name: string | null; email: string } | null;
  acceptedBy: { id: string; name: string | null; email: string } | null;
}

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<InvitationRow[]>([]);
  const [mode, setMode] = useState<string>("invitation-only");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [latestGrant, setLatestGrant] = useState<{
    email: string;
    inviteUrl: string;
    token: string;
  } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  async function loadInvitations() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invitations");
      const data = await res.json();
      setInvitations(data.invitations || []);
      setMode(data.mode || "invitation-only");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvitations();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setCreating(true);
    setError("");
    setLatestGrant(null);

    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create invitation.");
      } else {
        setLatestGrant({
          email: data.invitation.email,
          inviteUrl: data.inviteUrl,
          token: data.token,
        });
        setEmail("");
        await loadInvitations();
      }
    } catch {
      setError("Failed to create invitation.");
    } finally {
      setCreating(false);
    }
  }

  async function handleRotate(id: string) {
    setError("");
    const res = await fetch(`/api/admin/invitations/${id}/rotate`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Failed to rotate invitation.");
      return;
    }
    setLatestGrant({
      email: data.invitation.email,
      inviteUrl: data.inviteUrl,
      token: data.token,
    });
    await loadInvitations();
  }

  async function handleRevoke(id: string) {
    setError("");
    const res = await fetch(`/api/admin/invitations/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Failed to revoke invitation.");
      return;
    }
    await loadInvitations();
  }

  function copyGrantLink() {
    if (!latestGrant) return;
    navigator.clipboard.writeText(latestGrant.inviteUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6E5FF] text-[#524FFC] text-xs font-bold mb-2">
              <KeyRound className="w-3.5 h-3.5" /> Admission Mode:{" "}
              <span className="uppercase">{mode}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#040348]">
              Invite-Only Account Admission
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Issue one-time cryptographic registration links (`SHA-256` hashed at rest), rotate expiring grants, or revoke pending invitations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/invite/demo-invite-token-2026"
              className="px-4 py-2 rounded-xl border border-indigo-200 bg-white hover:bg-[#F5F8FE] text-xs font-bold text-[#524FFC]"
            >
              Preview Demo Invite Page
            </Link>
            <Link
              href="/org/people/members/invites"
              className="px-4 py-2 rounded-xl bg-[#040348] text-white text-xs font-bold"
            >
              Org Member Directory
            </Link>
          </div>
        </div>

        {/* Create Invitation Card */}
        <div className="bg-white rounded-3xl border border-indigo-100 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#040348] flex items-center gap-2">
            <MailPlus className="w-4 h-4 text-[#524FFC]" /> Issue a New Account Invitation
          </h2>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              data-testid="invite-email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1 px-4 py-2.5 rounded-xl border border-indigo-200 text-sm focus:outline-none focus:border-[#524FFC]"
            />
            <button
              type="submit"
              disabled={creating}
              data-testid="issue-invite-btn"
              className="px-6 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-sm font-bold transition cursor-pointer disabled:opacity-50"
            >
              {creating ? "Generating Token..." : "Generate Invite Link"}
            </button>
          </form>

          {error && (
            <div
              data-testid="invite-error-banner"
              className="flex items-center gap-2 text-xs text-[#CD4631] bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 font-semibold"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {latestGrant && (
            <div
              data-testid="latest-grant-card"
              className="rounded-2xl border border-emerald-200 bg-[#DEFFF1]/60 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0FA16D] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> One-time invitation link ready for{" "}
                  {latestGrant.email}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">
                  Shown only once — raw token is never stored in DB
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  data-testid="generated-invite-url"
                  value={latestGrant.inviteUrl}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-mono text-[#040348]"
                />
                <button
                  type="button"
                  onClick={copyGrantLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0FA16D] text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  {copiedUrl ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedUrl ? "Copied" : "Copy Link"}
                </button>
                <Link
                  href={`/invite/${latestGrant.token}`}
                  data-testid="open-generated-invite-link"
                  className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-[#040348] hover:bg-emerald-50"
                >
                  Open Link
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Invitations Ledger */}
        <div className="bg-white rounded-3xl border border-indigo-100 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#040348]">
              Account Invitations ({invitations.length})
            </h2>
            <span className="text-xs text-slate-400">
              Bootstrap CLI:{" "}
              <code className="font-mono text-[#040348]">
                npm run bootstrap:admin -- --email admin@acme.io --password-stdin
              </code>
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Loading invitations...
            </div>
          ) : invitations.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No invitations issued yet.
            </div>
          ) : (
            <div className="divide-y divide-indigo-50">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  data-testid={`invitation-row-${inv.email}`}
                  className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 hover:bg-[#F5F8FE]/60"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-[#040348]">
                        {inv.email}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          inv.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : inv.status === "ACCEPTED"
                            ? "bg-[#DEFFF1] text-[#0FA16D]"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      <span>
                        Created {new Date(inv.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        Expires {new Date(inv.expiresAt).toLocaleDateString()}
                      </span>
                      {inv.acceptedBy && (
                        <>
                          <span>•</span>
                          <span className="text-[#0FA16D] font-semibold">
                            Accepted by {inv.acceptedBy.name || inv.acceptedBy.email}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {inv.status === "PENDING" && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRotate(inv.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 text-xs font-bold text-[#040348] hover:bg-[#F5F8FE] cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Rotate Link
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRevoke(inv.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-xs font-bold text-[#CD4631] hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Revoke
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
