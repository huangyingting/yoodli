"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Share2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Eye,
  Smile,
  Maximize2,
  Clock,
  HelpCircle,
  Send,
  Lock,
  Globe,
  Check,
  Wand2,
} from "lucide-react";
import type {
  TranscriptTurn,
  RephraseSuggestion,
  RubricScoreItem,
} from "@/lib/speech-analytics";

export interface SpeechRecord {
  id: string;
  shareSlug: string;
  userId: string;
  title: string;
  practiceType: string;
  durationSeconds: number;
  visibility: string;
  overallScore: number;
  wpmAverage: number;
  wpmSeriesJson: string;
  fillerWordCount: number;
  fillerWordPct: number;
  fillerBreakdownJson: string;
  weakWordCount: number;
  weakWordPct: number;
  weakBreakdownJson: string;
  concisenessScore: number;
  rephrasesJson: string;
  questionsAskedCount: number;
  topKeywordsJson: string;
  pausesCount: number;
  eyeContactPct: number;
  centeringPct: number;
  smilesPct: number;
  talkRatioPct: number;
  transcriptJson: string;
  aiSummary: string;
  rubricScoresJson: string;
  followUpQuestionsJson: string;
  createdAt: string;
  comments?: {
    id: string;
    authorName: string;
    authorRole: string;
    timestampSec: number;
    text: string;
    isAiCoach: boolean;
  }[];
}

export function SpeechFeedbackView({
  speech,
  isPublicShare = false,
}: {
  speech: SpeechRecord;
  isPublicShare?: boolean;
}) {
  const [activeRightTab, setActiveRightTab] = useState<"COACHING" | "ANALYTICS">("COACHING");
  const [activeMetricTab, setActiveMetricTab] = useState<
    "FILLER" | "WEAK" | "CONCISENESS" | "KEYWORDS" | "QUESTIONS" | "PACING" | "DELIVERY"
  >("FILLER");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(20);
  const [playbackRate, setPlaybackRate] = useState(1);

  const [highlightFillers, setHighlightFillers] = useState(true);
  const [highlightWeak, setHighlightWeak] = useState(true);
  const [highlightQuestions, setHighlightQuestions] = useState(true);

  const [copiedShare, setCopiedShare] = useState(false);
  const [comments, setComments] = useState(speech.comments || []);
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const transcript: TranscriptTurn[] = safeParse(speech.transcriptJson, []);
  const rephrases: RephraseSuggestion[] = safeParse(speech.rephrasesJson, []);
  const rubricScores: RubricScoreItem[] = safeParse(speech.rubricScoresJson, []);
  const followUpQuestions: string[] = safeParse(speech.followUpQuestionsJson, []);
  const wpmSeries: { timeSec: number; wpm: number }[] = safeParse(speech.wpmSeriesJson, []);
  const fillerBreakdown: Record<string, number> = safeParse(speech.fillerBreakdownJson, {});
  const weakBreakdown: Record<string, number> = safeParse(speech.weakBreakdownJson, {});
  const topKeywords: { word: string; count: number }[] = safeParse(speech.topKeywordsJson, []);

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/share/${speech.shareSlug}`;
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/speeches/${speech.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestampSec: currentTime,
          text: newCommentText.trim(),
        }),
      });
      const data = await res.json();
      if (data.comment) {
        setComments((prev) => [...prev, data.comment]);
        setNewCommentText("");
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6E5FF] text-[#524FFC]">
              {speech.practiceType}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D]">
              Score: {speech.overallScore}%
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {formatTime(speech.durationSeconds)}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              {speech.visibility === "PRIVATE" ? (
                <>
                  <Lock className="w-3.5 h-3.5" /> Private
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-[#1DA9E6]" /> Shared Link ({speech.shareSlug})
                </>
              )}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#040348]">
            {speech.title}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleCopyShareLink}
            data-testid="share-speech-btn"
            className="px-4 py-2 rounded-xl border border-indigo-200 bg-white hover:bg-[#F5F8FE] text-sm font-semibold text-[#040348] flex items-center gap-2 transition cursor-pointer"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-[#0FA16D]" />
                <span>Copied `/share/{speech.shareSlug}`</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#524FFC]" />
                <span>Share</span>
              </>
            )}
          </button>

          <Link
            href="/practice/conversation"
            className="px-4 py-2 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white text-sm font-semibold flex items-center gap-2 shadow-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </Link>
        </div>
      </div>

      {/* Main Two-Column Split: Left (Player + Transcript + Comments) | Right (Coaching & Analytics Tabs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Simulated Video / Audio Studio Player */}
          <div className="bg-[#040348] rounded-2xl overflow-hidden shadow-md border border-indigo-950 text-white">
            <div className="relative aspect-video bg-gradient-to-br from-[#040348] via-[#131168] to-[#1E1E3A] flex flex-col justify-between p-5">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                  AI Analyzed Recording
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 font-mono">
                  {formatTime(currentTime)} / {formatTime(speech.durationSeconds)}
                </span>
              </div>

              {/* Dual Avatar Speaker Stage */}
              <div className="my-auto flex items-center justify-center gap-6">
                <div className="text-center space-y-1.5">
                  <div className="w-16 h-16 rounded-2xl bg-yoodli-gradient p-0.5 mx-auto shadow-lg">
                    <div className="w-full h-full rounded-[14px] bg-[#040348] flex items-center justify-center text-lg font-bold">
                      AR
                    </div>
                  </div>
                  <div className="text-xs font-semibold">Alex Rivera</div>
                  <div className="text-[10px] text-indigo-300">Speaker • {speech.wpmAverage} WPM</div>
                </div>

                {speech.practiceType !== "SPEECH" && (
                  <div className="text-center space-y-1.5">
                    <div className="w-16 h-16 rounded-2xl border-2 border-[#1DA9E6] bg-indigo-950 flex items-center justify-center text-lg font-bold mx-auto">
                      AI
                    </div>
                    <div className="text-xs font-semibold">AI Persona Partner</div>
                    <div className="text-[10px] text-cyan-300">Interactive Roleplay</div>
                  </div>
                )}
              </div>

              {/* Live Subtitle Overlay */}
              <div className="bg-black/45 backdrop-blur-xs rounded-xl p-2.5 text-xs text-indigo-100 line-clamp-2 text-center">
                {transcript.find((t) => currentTime >= t.startSec && currentTime <= t.endSec)?.text ||
                  transcript[0]?.text ||
                  "Click play or select any transcript turn below to jump to that timestamp."}
              </div>
            </div>

            {/* Player Timeline & Controls */}
            <div className="p-4 bg-[#0A0A2A] space-y-3">
              {/* Scrubber with Filler & Comment Markers */}
              <div className="relative">
                <input
                  type="range"
                  min={0}
                  max={speech.durationSeconds}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="w-full accent-[#1DA9E6] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] flex items-center justify-center text-white cursor-pointer"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <span className="font-mono text-indigo-200">
                    {formatTime(currentTime)} / {formatTime(speech.durationSeconds)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[1, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setPlaybackRate(rate)}
                      className={`px-2 py-1 rounded-md font-semibold ${
                        playbackRate === rate
                          ? "bg-[#524FFC] text-white"
                          : "bg-white/10 text-indigo-200 hover:bg-white/20"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Transcript Card */}
          <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-bold text-base text-[#040348]">Interactive Transcript</h2>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setHighlightFillers(!highlightFillers)}
                  className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                    highlightFillers
                      ? "bg-[#E6E5FF] text-[#524FFC]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Filler Words ({speech.fillerWordCount})
                </button>
                <button
                  onClick={() => setHighlightWeak(!highlightWeak)}
                  className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                    highlightWeak
                      ? "bg-[#FFFAEF] text-[#B8520B] border border-amber-200"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Weak Words ({speech.weakWordCount})
                </button>
                <button
                  onClick={() => setHighlightQuestions(!highlightQuestions)}
                  className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                    highlightQuestions
                      ? "bg-[#E8F6FC] text-[#065C82]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Questions ({speech.questionsAskedCount})
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {transcript.map((turn) => (
                <div
                  key={turn.id}
                  onClick={() => setCurrentTime(turn.startSec)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    currentTime >= turn.startSec && currentTime <= turn.endSec
                      ? "border-[#524FFC] bg-[#F5F8FE]"
                      : "border-slate-100 hover:border-indigo-200 bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span
                      className={`font-bold ${
                        turn.speaker === "USER" ? "text-[#524FFC]" : "text-[#065C82]"
                      }`}
                    >
                      {turn.speakerName}
                    </span>
                    <span className="font-mono text-slate-400">
                      {formatTime(turn.startSec)}
                    </span>
                  </div>
                  <p className="text-sm text-[#040348] leading-relaxed">
                    {turn.text}
                  </p>
                  {(turn.fillerWords.length > 0 || turn.weakWords.length > 0 || turn.isQuestion) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {highlightFillers &&
                        turn.fillerWords.map((fw, i) => (
                          <span
                            key={`fw-${i}`}
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#E6E5FF] text-[#524FFC]"
                          >
                            Filler: &ldquo;{fw}&rdquo;
                          </span>
                        ))}
                      {highlightWeak &&
                        turn.weakWords.map((ww, i) => (
                          <span
                            key={`ww-${i}`}
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FFFAEF] text-[#B8520B]"
                          >
                            Weak: &ldquo;{ww}&rdquo;
                          </span>
                        ))}
                      {highlightQuestions && turn.isQuestion && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#E8F6FC] text-[#065C82]">
                          Question Asked
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timestamped Coaching Comments */}
          <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-[#040348] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#524FFC]" />
              Timestamped Comments ({comments.length})
            </h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {comments.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCurrentTime(c.timestampSec)}
                  className="p-3 rounded-xl bg-[#F5F8FE] border border-indigo-100/80 text-xs space-y-1 cursor-pointer hover:border-[#524FFC]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#040348] flex items-center gap-1.5">
                      {c.authorName}
                      {c.isAiCoach && (
                        <span className="px-1.5 py-0.5 rounded bg-[#524FFC] text-white text-[10px]">
                          AI Coach
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-[#524FFC] font-semibold">
                      @{formatTime(c.timestampSec)}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            {!isPublicShare && (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={`Add comment at ${formatTime(currentTime)}...`}
                  className="flex-1 px-3 py-2 rounded-xl border border-indigo-200 text-xs"
                />
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="px-3.5 py-2 rounded-xl bg-[#524FFC] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column (7 cols) — Coaching & Analytics Tabs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Primary Right Tab Switcher: Coaching | Analytics */}
          <div className="bg-white rounded-2xl p-1.5 border border-indigo-100 shadow-2xs grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveRightTab("COACHING")}
              data-testid="tab-coaching"
              className={`py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                activeRightTab === "COACHING"
                  ? "bg-[#524FFC] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#040348] hover:bg-[#F5F8FE]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Coaching</span>
            </button>
            <button
              onClick={() => setActiveRightTab("ANALYTICS")}
              data-testid="tab-analytics"
              className={`py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                activeRightTab === "ANALYTICS"
                  ? "bg-[#524FFC] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#040348] hover:bg-[#F5F8FE]"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>

          {activeRightTab === "COACHING" ? (
            <div className="space-y-5" data-testid="coaching-panel">
              {/* AI Executive Summary Card */}
              <div className="bg-yoodli-slanted rounded-2xl p-6 border border-[#C9C7FF] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#524FFC]">
                    <Sparkles className="w-4 h-4" /> AI Executive Coaching Summary
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-[#040348]">
                    Overall Readiness: {speech.overallScore}%
                  </span>
                </div>
                <p className="text-sm text-[#040348] leading-relaxed">
                  {speech.aiSummary}
                </p>
              </div>

              {/* Rubric / Goal Scorecards */}
              <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-[#040348]">
                      Scenario Goals & Rubric Evaluation
                    </h3>
                    <p className="text-xs text-slate-500">
                      Objective evaluation of each custom goal with verbatim transcript evidence
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D]">
                    {rubricScores.filter((r) => r.passed).length} / {rubricScores.length} Goals Passed
                  </span>
                </div>

                <div className="space-y-3">
                  {rubricScores.map((item) => (
                    <div
                      key={item.goalId}
                      className="p-4 rounded-xl border border-indigo-100 bg-[#F5F8FE]/50 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {item.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-[#0FA16D] shrink-0" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-[#E99923] shrink-0" />
                          )}
                          <span className="font-bold text-sm text-[#040348]">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-[#524FFC]">
                            {item.type}
                          </span>
                          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white border border-indigo-200 text-[#040348]">
                            {item.score} / {item.maxScore}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 pl-7">{item.feedback}</p>
                      {item.evidenceQuote && (
                        <div
                          onClick={() => setCurrentTime(item.timestampSec)}
                          className="ml-7 p-2.5 rounded-lg bg-white border-l-4 border-[#524FFC] text-xs italic text-slate-700 cursor-pointer hover:bg-indigo-50/40"
                        >
                          &ldquo;{item.evidenceQuote}&rdquo;{" "}
                          <span className="not-italic font-mono text-[#524FFC] font-semibold ml-1">
                            ({formatTime(item.timestampSec)})
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Rephrase ("How to Say It Better") */}
              <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-[#524FFC]" />
                  <div>
                    <h3 className="font-bold text-base text-[#040348]">
                      Rephrase with AI — Conciseness & Authority
                    </h3>
                    <p className="text-xs text-slate-500">
                      Side-by-side comparison of your phrasing vs. a tighter executive rewrite
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {rephrases.map((rep, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-indigo-100 space-y-3 bg-slate-50/50"
                    >
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-[#FFEAE9]/50 border border-red-200/70 space-y-1">
                          <div className="text-[10px] font-bold uppercase text-[#CD4631]">
                            What You Said (@{formatTime(rep.timestampSec)})
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            &ldquo;{rep.original}&rdquo;
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#DEFFF1]/60 border border-emerald-200 space-y-1">
                          <div className="text-[10px] font-bold uppercase text-[#0FA16D]">
                            AI Executive Rewrite
                          </div>
                          <p className="text-xs font-medium text-[#040348] leading-relaxed">
                            &ldquo;{rep.improved}&rdquo;
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#524FFC]" />
                        <span>{rep.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up Questions to Prepare For */}
              <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-3">
                <h3 className="font-bold text-base text-[#040348] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#1DA9E6]" />
                  Recommended Follow-Up Questions to Practice Next
                </h3>
                <ul className="space-y-2">
                  {followUpQuestions.map((q, i) => (
                    <li
                      key={i}
                      className="p-3 rounded-xl bg-[#F5F8FE] border border-indigo-100 text-xs font-medium text-[#040348] flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#524FFC] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* ANALYTICS TAB: Word Choice & Delivery Metrics */
            <div className="space-y-5" data-testid="analytics-panel">
              {/* Top Metric Selector Pills */}
              <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-2xs space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Word Choice & Delivery Metrics
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "FILLER", label: `Filler Words (${speech.fillerWordPct}%)` },
                    { id: "PACING", label: `Pacing (${speech.wpmAverage} WPM)` },
                    { id: "CONCISENESS", label: `Conciseness (${speech.concisenessScore}%)` },
                    { id: "WEAK", label: `Weak Words (${speech.weakWordCount})` },
                    { id: "KEYWORDS", label: "Top Keywords" },
                    { id: "QUESTIONS", label: `Questions (${speech.questionsAskedCount})` },
                    { id: "DELIVERY", label: `Eye Contact & Presence (${speech.eyeContactPct}%)` },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMetricTab(m.id as typeof activeMetricTab)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        activeMetricTab === m.id
                          ? "bg-[#040348] text-white"
                          : "bg-[#F5F8FE] text-[#040348] hover:bg-[#E6E5FF]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Word Choice Overview Grid */}
              <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#040348]">
                    Word Choice Breakdown
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DEFFF1] text-[#0FA16D]">
                    {speech.fillerWordPct <= 3 ? "Great (< 3% Fillers)" : "Watch Filler Rate"}
                  </span>
                </div>

                <div className="grid sm:grid-cols-4 gap-3">
                  <MetricSummaryBox
                    label="Filler Words"
                    value={`${speech.fillerWordCount} (${speech.fillerWordPct}%)`}
                    status="Ideal < 3%"
                    good={speech.fillerWordPct <= 3}
                  />
                  <MetricSummaryBox
                    label="Weak Words"
                    value={`${speech.weakWordCount} (${speech.weakWordPct}%)`}
                    status="Ideal < 2%"
                    good={speech.weakWordPct <= 2}
                  />
                  <MetricSummaryBox
                    label="Conciseness"
                    value={`${speech.concisenessScore}%`}
                    status="Executive Clarity"
                    good={speech.concisenessScore >= 80}
                  />
                  <MetricSummaryBox
                    label="Questions Asked"
                    value={`${speech.questionsAskedCount}`}
                    status="Discovery Depth"
                    good={speech.questionsAskedCount >= 2}
                  />
                </div>

                {/* Filler Words & Weak Words Bars */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#F5F8FE] border border-indigo-100 space-y-2.5">
                    <div className="text-xs font-bold text-[#040348]">
                      Filler Words Detected
                    </div>
                    {Object.keys(fillerBreakdown).length === 0 ? (
                      <div className="text-xs text-[#0FA16D] font-semibold">
                        Zero filler words detected!
                      </div>
                    ) : (
                      Object.entries(fillerBreakdown).map(([word, count]) => (
                        <div key={word} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-[#524FFC]">&ldquo;{word}&rdquo;</span>
                            <span className="font-bold">{count}x</span>
                          </div>
                          <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#524FFC] rounded-full"
                              style={{ width: `${Math.min(100, count * 25)}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-[#F5F8FE] border border-indigo-100 space-y-2.5">
                    <div className="text-xs font-bold text-[#040348]">
                      Weak / Hedging Language & Top Keywords
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(weakBreakdown).map(([word, count]) => (
                        <span
                          key={word}
                          className="px-2.5 py-1 rounded-lg bg-[#FFFAEF] border border-amber-200 text-xs font-semibold text-[#B8520B]"
                        >
                          {word} ({count})
                        </span>
                      ))}
                      {topKeywords.map((kw) => (
                        <span
                          key={kw.word}
                          className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-xs font-semibold text-[#040348]"
                        >
                          #{kw.word} ({kw.count})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery & Pacing Chart Card */}
              <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-2xs space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-[#040348]">
                      Delivery, Pacing & Camera Presence
                    </h3>
                    <p className="text-xs text-slate-500">
                      Words Per Minute timeline (Ideal conversational range: 120–170 WPM)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F6FC] text-[#065C82]">
                    Avg: {speech.wpmAverage} WPM
                  </span>
                </div>

                {/* WPM Time-Series Visual Bars */}
                <div className="p-4 rounded-xl bg-[#F5F8FE] border border-indigo-100 space-y-3">
                  <div className="flex items-end justify-between gap-2 h-32 pt-4 px-2">
                    {wpmSeries.map((pt, i) => {
                      const heightPct = Math.min(100, Math.max(25, Math.round((pt.wpm / 200) * 100)));
                      const isIdeal = pt.wpm >= 120 && pt.wpm <= 170;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                          <span className="text-[10px] font-bold text-[#040348]">{pt.wpm}</span>
                          <div className="w-full bg-indigo-100 rounded-t-lg h-20 flex items-end overflow-hidden">
                            <div
                              className={`w-full rounded-t-lg transition-all ${
                                isIdeal ? "bg-[#524FFC]" : "bg-[#FFCA42]"
                              }`}
                              style={{ height: `${heightPct}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {formatTime(pt.timeSec)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Visual Delivery Gauges: Eye Contact, Centering, Smiles, Pauses, Talk-to-Listen */}
                <div className="grid sm:grid-cols-5 gap-3">
                  <div className="p-3.5 rounded-xl border border-indigo-100 bg-slate-50/70 text-center space-y-1">
                    <Eye className="w-4 h-4 text-[#524FFC] mx-auto" />
                    <div className="text-lg font-extrabold text-[#040348]">{speech.eyeContactPct}%</div>
                    <div className="text-[11px] font-semibold text-slate-500">Eye Contact</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-indigo-100 bg-slate-50/70 text-center space-y-1">
                    <Maximize2 className="w-4 h-4 text-[#1DA9E6] mx-auto" />
                    <div className="text-lg font-extrabold text-[#040348]">{speech.centeringPct}%</div>
                    <div className="text-[11px] font-semibold text-slate-500">Centering</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-indigo-100 bg-slate-50/70 text-center space-y-1">
                    <Smile className="w-4 h-4 text-[#0FA16D] mx-auto" />
                    <div className="text-lg font-extrabold text-[#040348]">{speech.smilesPct}%</div>
                    <div className="text-[11px] font-semibold text-slate-500">Smiles & Warmth</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-indigo-100 bg-slate-50/70 text-center space-y-1">
                    <Clock className="w-4 h-4 text-[#524FFC] mx-auto" />
                    <div className="text-lg font-extrabold text-[#040348]">{speech.pausesCount}</div>
                    <div className="text-[11px] font-semibold text-slate-500">Power Pauses</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-indigo-100 bg-slate-50/70 text-center space-y-1">
                    <MessageSquare className="w-4 h-4 text-[#065C82] mx-auto" />
                    <div className="text-lg font-extrabold text-[#040348]">{speech.talkRatioPct}%</div>
                    <div className="text-[11px] font-semibold text-slate-500">Talk Ratio</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricSummaryBox({
  label,
  value,
  status,
  good,
}: {
  label: string;
  value: string;
  status: string;
  good: boolean;
}) {
  return (
    <div className="p-3.5 rounded-xl border border-indigo-100 bg-[#F5F8FE]/60 space-y-1">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="text-lg font-extrabold text-[#040348]">{value}</div>
      <div
        className={`text-[11px] font-bold ${
          good ? "text-[#0FA16D]" : "text-[#E99923]"
        }`}
      >
        {status}
      </div>
    </div>
  );
}

function safeParse<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}
