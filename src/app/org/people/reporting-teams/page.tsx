import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ShieldCheck, Users } from "lucide-react";

const TEAMS = [
  {
    team: "NA Enterprise Sales (VP: Sarah Jenkins)",
    manager: "Sarah Jenkins",
    directReports: 14,
    certRate: "96%",
  },
  {
    team: "EMEA Enterprise Revenue (VP: Henrik Lindqvist)",
    manager: "Henrik Lindqvist",
    directReports: 11,
    certRate: "91%",
  },
  {
    team: "Global Solutions Architecture (VP: David Park)",
    manager: "David Park",
    directReports: 12,
    certRate: "94%",
  },
];

export default function OrgReportingTeamsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
            PEOPLE &amp; ACCESS • MANAGER HIERARCHY
          </span>
          <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
            Manager Reporting Teams
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
            className="px-4 py-2 rounded-xl bg-white border border-indigo-100 text-slate-600"
          >
            Groups &amp; Cohorts
          </Link>
          <Link
            href="/org/people/reporting-teams"
            className="px-4 py-2 rounded-xl bg-[#524FFC] text-white"
          >
            Reporting Teams
          </Link>
        </div>

        <div className="space-y-4">
          {TEAMS.map((t) => (
            <div
              key={t.team}
              className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-base text-[#040348]">{t.team}</h3>
                <p className="text-xs text-slate-500">
                  Team Lead: {t.manager} • {t.directReports} direct reports
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#DEFFF1] text-[#0FA16D] text-xs font-bold">
                {t.certRate} Certified
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
