"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { CheckCircle2, Mail, KeyRound, Copy, Check } from "lucide-react";

export default function OrgMemberInvitesPage() {
  const router = useRouter();
  const [name, setName] = useState("Elena Vance");
  const [email, setEmail] = useState("elena.vance@acmecorp.com");
  const [orgRole, setOrgRole] = useState("MEMBER");
  const [groupName, setGroupName] = useState("EMEA Strategic Accounts");
  const [reportingTeam, setReportingTeam] = useState("NA Enterprise Sales (VP: Sarah Jenkins)");
  const [invitedMsg, setInvitedMsg] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const [, tokenRes] = await Promise.all([
      fetch("/api/org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "INVITE_MEMBER",
          name,
          email,
          orgRole,
          groupName,
          reportingTeam,
        }),
      }),
      fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }),
    ]);

    if (tokenRes.ok) {
      const data = await tokenRes.json();
      setInviteUrl(data.inviteUrl || "");
    }
    setInvitedMsg(`Invitation provisioned for ${email}`);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3 text-xs font-bold">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/org/people/members"
              className="px-4 py-2 rounded-xl bg-white border border-indigo-100 text-slate-600"
            >
              Active Members
            </Link>
            <Link
              href="/org/people/members/invites"
              className="px-4 py-2 rounded-xl bg-[#524FFC] text-white"
            >
              Invite Members
            </Link>
            <Link
              href="/org/people/groups"
              className="px-4 py-2 rounded-xl bg-white border border-indigo-100 text-slate-600"
            >
              Groups &amp; Cohorts
            </Link>
            <Link
              href="/org/people/reporting-teams"
              className="px-4 py-2 rounded-xl bg-white border border-indigo-100 text-slate-600"
            >
              Reporting Teams
            </Link>
          </div>
          <Link
            href="/admin/invitations"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E6E5FF] text-[#524FFC]"
          >
            <KeyRound className="w-3.5 h-3.5" /> One-Time Invite Ledger
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-2xs space-y-5">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              INVITE-ONLY ADMISSION &amp; COHORT PROVISIONING
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Invite Organization Members
            </h1>
          </div>

          {invitedMsg && (
            <div className="p-4 rounded-2xl bg-[#DEFFF1] border border-emerald-200 text-[#0FA16D] text-xs space-y-2">
              <div className="font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {invitedMsg}
                </span>
                <button
                  type="button"
                  onClick={() => router.push("/org/people/members")}
                  className="underline font-bold cursor-pointer"
                >
                  View Member Roster →
                </button>
              </div>
              {inviteUrl && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 font-mono text-[11px] text-[#040348]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(inviteUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0FA16D] text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Invite Link"}
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleInvite} className="space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#040348] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-[#040348] mb-1">
                  Corporate Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-[#040348] mb-1">
                  Workspace Role
                </label>
                <select
                  value={orgRole}
                  onChange={(e) => setOrgRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-indigo-200 bg-white text-sm"
                >
                  <option value="MEMBER">MEMBER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#040348] mb-1">
                  Cohort / Group
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-[#040348] mb-1">
                  Reporting Team
                </label>
                <input
                  type="text"
                  value={reportingTeam}
                  onChange={(e) => setReportingTeam(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-indigo-200 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="send-invite-btn"
              className="px-6 py-3 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Send Workspace Invitation</span>
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
