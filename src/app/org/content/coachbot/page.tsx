"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Bot, Upload, Send, FileText, CheckCircle2, Sparkles } from "lucide-react";

export default function OrgCoachBotPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [question, setQuestion] = useState(
    "What is our SOC2 Type II zero-data-retention policy and how do we defend against passive call recorders?"
  );
  const [ragResponse, setRagResponse] = useState<{
    answer: string;
    citations: string[];
  } | null>(null);
  const [asking, setAsking] = useState(false);

  const [newTitle, setNewTitle] = useState("FY26 Enterprise Security & GDPR Addendum.pdf");
  const [newContent, setNewContent] = useState(
    "All customer audio and transcripts are encrypted with AES-256 at rest and TLS 1.3 in transit with zero third-party LLM training retention."
  );

  const loadDocs = () => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((d) => {
        if (d.org?.coachBotDocs) setDocs(d.org.coachBotDocs);
      });
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setAsking(true);
    const res = await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ASK_COACHBOT", question }),
    });
    const data = await res.json();
    setRagResponse(data);
    setAsking(false);
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPLOAD_DOC",
        title: newTitle,
        fileType: "PDF",
        fileSize: "1.9 MB",
        category: "Security & Compliance",
        contentSummary: newContent,
      }),
    });
    setNewTitle("");
    loadDocs();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
            KNOWLEDGE RAG ENGINE • COACHBOT PLAYBOOKS
          </span>
          <h1 className="text-2xl font-extrabold text-[#040348] mt-1">
            CoachBot Knowledge Base &amp; RAG Grounding
          </h1>
          <p className="text-xs text-slate-500">
            Index sales battlecards, security whitepapers, and pricing sheets to ground AI Personas and Knowledge-Based Rubrics
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Interactive CoachBot RAG Playground */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-indigo-100 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-[#040348] flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#524FFC]" />
              Test CoachBot RAG Copilot
            </h2>

            <form onSubmit={handleAsk} className="space-y-3">
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                data-testid="coachbot-question-input"
                className="w-full p-3.5 rounded-2xl border border-indigo-200 text-xs text-[#040348]"
              />
              <button
                type="submit"
                disabled={asking}
                data-testid="ask-coachbot-btn"
                className="px-5 py-2.5 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{asking ? "Querying Knowledge Base..." : "Ask CoachBot"}</span>
              </button>
            </form>

            {ragResponse && (
              <div
                data-testid="coachbot-answer-box"
                className="p-4 rounded-2xl bg-[#F5F8FE] border border-indigo-100 space-y-2 text-xs"
              >
                <div className="font-bold text-[#524FFC] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Grounded Answer
                </div>
                <p className="text-[#040348] whitespace-pre-line leading-relaxed">
                  {ragResponse.answer}
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {(ragResponse.citations || (ragResponse as any).sources || []).map((c: string) => (
                    <span
                      key={c}
                      className="px-2.5 py-0.5 rounded-full bg-[#E6E5FF] text-[#524FFC] text-[10px] font-bold"
                    >
                      Source: {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Index New Document Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-indigo-100 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-[#040348] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#524FFC]" />
              Index New Playbook Document
            </h2>
            <form onSubmit={handleUploadDoc} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#040348] mb-1">
                  Document Filename
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200"
                />
              </div>
              <div>
                <label className="block font-bold text-[#040348] mb-1">
                  Extracted Playbook Knowledge Summary
                </label>
                <textarea
                  rows={3}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-indigo-200"
                />
              </div>
              <button
                type="submit"
                data-testid="upload-coachbot-doc-btn"
                className="w-full py-2.5 rounded-xl bg-[#040348] hover:bg-[#524FFC] text-white font-bold cursor-pointer"
              >
                Index Document into Vector Store
              </button>
            </form>
          </div>
        </div>

        {/* Indexed Documents List */}
        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-4">
          <h2 className="text-base font-extrabold text-[#040348]">
            Indexed Knowledge Base Documents ({docs.length})
          </h2>
          <div className="divide-y divide-indigo-50 text-xs">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#524FFC]" />
                    <span className="font-bold text-sm text-[#040348]">
                      {doc.title}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-[#524FFC] font-bold text-[10px]">
                      {doc.fileType} • {doc.fileSize}
                    </span>
                  </div>
                  <p className="text-slate-600 pl-6">{doc.contentSummary}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#DEFFF1] text-[#0FA16D] font-bold flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
