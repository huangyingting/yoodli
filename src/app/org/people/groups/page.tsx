import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Users, CheckCircle2 } from "lucide-react";

const GROUPS = [
  {
    name: "NA Enterprise AE Cohort",
    members: 42,
    assignedPrograms: "FY26 Q1 Enterprise Sales Pitch Certification",
    avgScore: 92,
  },
  {
    name: "EMEA Strategic Accounts",
    members: 28,
    assignedPrograms: "MEDDPICC Discovery & Value Selling Accreditation",
    avgScore: 88,
  },
  {
    name: "Global Solutions Engineering",
    members: 24,
    assignedPrograms: "CISO Zero-Trust Security Architecture Defense",
    avgScore: 93,
  },
  {
    name: "Frontline Revenue Managers",
    members: 16,
    assignedPrograms: "Frontline Sales Manager Coaching Certification",
    avgScore: 90,
  },
];

export default function OrgGroupsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
            PEOPLE &amp; ACCESS • COHORT GROUPS
          </span>
          <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
            Organization Groups &amp; Cohorts
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-indigo-100 pb-3 text-xs font-bold">
          <Link
            href="/org/people/members"
            className="px-4 py-2 rounded-xl bg-white border border-indigo-100 text-slate-600"
          >
            Active Members
          </Link>
          <Link
            href="/org/people/members/invites"
            className="px-4 py-2 rounded-xl bg-white border border-indigo-100 text-slate-600"
          >
            Invite Members
          </Link>
          <Link
            href="/org/people/groups"
            className="px-4 py-2 rounded-xl bg-[#524FFC] text-white"
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

        <div className="grid md:grid-cols-2 gap-5">
          {GROUPS.map((g) => (
            <div
              key={g.name}
              className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#040348] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#524FFC]" /> {g.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D]">
                  Avg Score: {g.avgScore}%
                </span>
              </div>
              <p className="text-xs text-slate-500">
                <strong>{g.members} members</strong> • Assigned: {g.assignedPrograms}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
