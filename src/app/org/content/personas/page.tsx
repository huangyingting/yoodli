import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrDemo } from "@/lib/session";
import { AppShell } from "@/components/layout/AppShell";
import { Plus, Bot, Volume2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrgPersonasPage() {
  const user = await getCurrentUserOrDemo();
  const personas = await prisma.persona.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              CONTENT LIBRARY • AI BUYER &amp; STAKEHOLDER PERSONAS
            </span>
            <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
              AI Personas ({personas.length})
            </h1>
            <p className="text-xs text-slate-500">
              Configure realistic buyer personalities, objections, hidden motivations, and neural voice tones
            </p>
          </div>

          <Link
            href="/org/content/personas/create"
            className="px-4 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create AI Persona</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {personas.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl text-white font-extrabold flex items-center justify-center text-sm bg-[#524FFC]"
                  >
                    {p.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#040348]">{p.name}</h3>
                    <p className="text-xs text-slate-500">
                      {p.title} • {p.company}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6E5FF] text-[#524FFC]">
                    {p.demeanor}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> {p.voiceName}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{p.bio}</p>
              </div>

              <Link
                href="/roleplays"
                className="block text-center py-2 rounded-xl bg-[#F5F8FE] hover:bg-[#E6E5FF] text-[#524FFC] text-xs font-bold transition"
              >
                Use in Roleplay
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
