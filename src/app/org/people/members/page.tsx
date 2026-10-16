"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Users, UserPlus, ShieldCheck } from "lucide-react";

export default function OrgMembersPage() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((d) => {
        if (d.org?.members) setMembers(d.org.members);
      });
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              PEOPLE &amp; ACCESS • ORGANIZATION DIRECTORY
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              Organization Members ({members.length})
            </h1>
          </div>

          <div className="flex gap-2">
            <Link
              href="/org/people/members/invites"
              className="px-4 py-2.5 rounded-xl bg-[#524FFC] text-white text-xs font-bold flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Members</span>
            </Link>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="flex flex-wrap gap-2 border-b border-indigo-100 pb-3 text-xs font-bold">
          <Link
            href="/org/people/members"
            className="px-4 py-2 rounded-xl bg-[#524FFC] text-white"
          >
            Active Members ({members.length})
          </Link>
          <Link
            href="/org/people/members/invites"
            className="px-4 py-2 rounded-xl bg-white border border-indigo-100 text-slate-600"
          >
            Pending Invites
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

        <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F8FE] border-b border-indigo-100 text-slate-500 uppercase">
              <tr>
                <th className="py-3.5 px-5">Member</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Group / Cohort</th>
                <th className="py-3.5 px-4">Reporting Manager</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="py-4 px-5">
                    <div className="font-bold text-sm text-[#040348]">
                      {m.name || m.user?.name}
                    </div>
                    <div className="text-slate-500">{m.email || m.user?.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-[#E6E5FF] text-[#524FFC]">
                      {m.role || m.orgRole}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#040348]">
                    {m.groupName}
                  </td>
                  <td className="py-4 px-4 text-slate-600">{m.reportingTeam}</td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#DEFFF1] text-[#0FA16D] font-bold">
                      ACTIVE ({m.avgScore || 88}% Avg)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
