"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Plug, CheckCircle2, RefreshCw } from "lucide-react";

export default function OrgIntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);

  const loadIntegrations = () => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((d) => {
        if (d.org?.integrations) setIntegrations(d.org.integrations);
      });
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleToggle = async (id: string) => {
    await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "TOGGLE_INTEGRATION",
        integrationId: id,
      }),
    });
    loadIntegrations();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
            ECOSYSTEM CONNECTORS • CRM, CALL INTELLIGENCE &amp; LMS
          </span>
          <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
            Enterprise Integrations ({integrations.length})
          </h1>
          <p className="text-xs text-slate-500">
            Sync Yoodli certification scores and roleplay completions directly to Salesforce, Gong, Zoom, Slack, and Workday
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {integrations.map((intg) => {
            const isConnected = Boolean(intg.connected || intg.status === "CONNECTED");
            return (
              <div
                key={intg.id}
                className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6E5FF] text-[#524FFC]">
                      {intg.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        isConnected
                          ? "bg-[#DEFFF1] text-[#0FA16D]"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isConnected && <CheckCircle2 className="w-3 h-3" />}
                      {isConnected ? "CONNECTED" : "AVAILABLE"}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#040348] flex items-center gap-2">
                    <Plug className="w-4 h-4 text-[#524FFC]" /> {intg.name}
                  </h3>
                  <p className="text-xs text-slate-600">{intg.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-indigo-50 text-xs">
                  <span className="text-slate-400">
                    {intg.lastSyncedAt || "Ready for OAuth connection"}
                  </span>
                  <button
                    onClick={() => handleToggle(intg.id)}
                    data-testid={`toggle-integration-${intg.providerKey || intg.id}`}
                    className={`px-4 py-1.5 rounded-xl font-bold cursor-pointer transition ${
                      isConnected
                        ? "border border-indigo-200 text-slate-600 hover:bg-slate-50"
                        : "bg-[#524FFC] text-white hover:bg-[#4E4CBB]"
                    }`}
                  >
                    {isConnected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
