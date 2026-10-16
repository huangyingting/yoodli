"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Mic,
  Sparkles,
  BarChart2,
  Folder,
  GraduationCap,
  BookOpen,
  Gamepad2,
  Award,
  Plus,
  ChevronDown,
  ChevronRight,
  Building2,
  Users,
  Settings,
  Layers,
  Repeat,
  FileText,
  Bot,
  Target,
  HelpCircle,
  Upload,
  Video,
  MessageSquare,
  Briefcase,
  X,
  Zap,
  CheckCircle2,
  LogOut,
  Plug,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    yoodlisRemaining: number;
    planTier: string;
  };
}

export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isOrgRoute =
    (pathname.startsWith("/org") && !pathname.startsWith("/org/resources")) ||
    pathname.startsWith("/admin");
  const [workspaceMode, setWorkspaceMode] = useState<"MEMBER" | "ADMIN">(
    isOrgRoute ? "ADMIN" : "MEMBER"
  );
  const [learningOpen, setLearningOpen] = useState(true);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(true);
  const [peopleOpen, setPeopleOpen] = useState(true);

  const [showStartModal, setShowStartModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadTranscript, setUploadTranscript] = useState(
    "Good afternoon team. Today I'm walking through our Q1 Enterprise Security and AI Roleplay architecture. Um, we cut new-hire ramp time by 42% and achieved SOC2 Type II compliance with zero-data-retention across all LLM sub-processors. Could we schedule our technical sign-off this Thursday at 2 PM?"
  );
  const [uploading, setUploading] = useState(false);

  const currentUser = user || {
    id: "user-alex",
    name: "Alex Rivera",
    email: "alex.rivera@acme.io",
    role: "ADMIN",
    yoodlisRemaining: 46,
    planTier: "ENTERPRISE",
  };

  const handleSwitchWorkspace = (mode: "MEMBER" | "ADMIN") => {
    setWorkspaceMode(mode);
    if (mode === "ADMIN") {
      router.push("/org/overview");
    } else {
      router.push("/home");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const res = await fetch("/api/speeches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadTitle || "Uploaded Pitch Recording",
          practiceType: "UPLOAD",
          durationSeconds: 110,
          transcriptText: uploadTranscript,
        }),
      });
      const data = await res.json();
      setShowUploadModal(false);
      if (data.speech?.id) {
        router.push(`/library/${currentUser.id}/feedback/${data.speech.id}`);
      } else {
        router.push("/library");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F6F8FF] text-[#040348]">
      {/* Left Sidebar */}
      <aside className="w-64 shrink-0 bg-white border-r border-indigo-100 flex flex-col justify-between sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Brand + Workspace Switcher */}
          <div className="flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-yoodli-gradient flex items-center justify-center text-white font-bold text-lg shadow-sm">
                y
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#040348]">
                yoodli
              </span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E6E5FF] text-[#524FFC]">
              Enterprise
            </span>
          </div>

          {/* Member / Admin Workspace Switcher Pill */}
          <div
            className="grid grid-cols-2 p-1 rounded-xl bg-[#F5F8FE] border border-indigo-100 text-xs font-semibold"
            data-testid="workspace-switcher"
          >
            <button
              onClick={() => handleSwitchWorkspace("MEMBER")}
              className={`py-1.5 rounded-lg transition ${
                workspaceMode === "MEMBER"
                  ? "bg-white text-[#524FFC] shadow-xs font-bold"
                  : "text-slate-600 hover:text-[#040348]"
              }`}
            >
              Member
            </button>
            <button
              onClick={() => handleSwitchWorkspace("ADMIN")}
              className={`py-1.5 rounded-lg transition ${
                workspaceMode === "ADMIN"
                  ? "bg-[#040348] text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-[#040348]"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Primary + Start Button */}
          <button
            onClick={() => setShowStartModal(true)}
            data-testid="sidebar-start-btn"
            className="w-full py-2.5 px-4 rounded-xl bg-[#524FFC] hover:bg-[#4E4CBB] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Start</span>
          </button>

          {/* Navigation Menu */}
          {workspaceMode === "MEMBER" ? (
            <nav className="space-y-1 text-sm">
              <SidebarLink
                href="/home"
                icon={<Home className="w-4 h-4" />}
                label="Home"
                active={pathname === "/home"}
              />
              <SidebarLink
                href="/roleplays"
                icon={<Mic className="w-4 h-4" />}
                label="Roleplays"
                active={pathname === "/roleplays"}
              />
              <SidebarLink
                href="/builder"
                icon={<Sparkles className="w-4 h-4" />}
                label="Builder"
                badge="AI"
                active={pathname === "/builder"}
              />
              <SidebarLink
                href="/dashboard"
                icon={<BarChart2 className="w-4 h-4" />}
                label="Dashboard"
                active={pathname === "/dashboard"}
              />
              <SidebarLink
                href="/library"
                icon={<Folder className="w-4 h-4" />}
                label="My Recordings"
                active={pathname.startsWith("/library")}
              />

              {/* My Learning Accordion */}
              <div className="pt-2">
                <button
                  onClick={() => setLearningOpen(!learningOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#040348]"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#524FFC]" />
                    My Learning
                  </span>
                  {learningOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
                {learningOpen && (
                  <div className="pl-3 mt-1 space-y-1 border-l-2 border-indigo-100 ml-3">
                    <SidebarLink
                      href="/org/resources/programs"
                      icon={<Award className="w-4 h-4" />}
                      label="Programs"
                      active={pathname.startsWith("/org/resources/programs")}
                    />
                    <SidebarLink
                      href="/org/resources/courses"
                      icon={<BookOpen className="w-4 h-4" />}
                      label="Courses"
                      active={pathname.startsWith("/org/resources/courses")}
                    />
                    <SidebarLink
                      href="/org/resources/exercises"
                      icon={<Gamepad2 className="w-4 h-4" />}
                      label="Exercises"
                      active={
                        pathname.startsWith("/org/resources/exercises") ||
                        pathname.startsWith("/exercises")
                      }
                    />
                  </div>
                )}
              </div>
            </nav>
          ) : (
            <nav className="space-y-1 text-sm">
              <SidebarLink
                href="/org/overview"
                icon={<Building2 className="w-4 h-4" />}
                label="Overview"
                active={pathname === "/org/overview"}
              />

              {/* Analytics Section */}
              <div>
                <button
                  onClick={() => setAnalyticsOpen(!analyticsOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#040348]"
                >
                  <span className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#524FFC]" />
                    Analytics
                  </span>
                  {analyticsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {analyticsOpen && (
                  <div className="pl-3 space-y-0.5 border-l-2 border-indigo-100 ml-3">
                    <SidebarLink href="/org/analytics/overview" label="Overview" active={pathname === "/org/analytics/overview"} />
                    <SidebarLink href="/org/analytics/programs" label="Programs" active={pathname === "/org/analytics/programs"} />
                    <SidebarLink href="/org/analytics/goals" label="Goals" active={pathname === "/org/analytics/goals"} />
                    <SidebarLink href="/org/analytics/roleplays" label="Roleplays" active={pathname === "/org/analytics/roleplays"} />
                    <SidebarLink href="/org/analytics/reports-data" label="Reports & CSV" active={pathname === "/org/analytics/reports-data"} />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div>
                <button
                  onClick={() => setContentOpen(!contentOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#040348]"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#1DA9E6]" />
                    Content
                  </span>
                  {contentOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {contentOpen && (
                  <div className="pl-3 space-y-0.5 border-l-2 border-indigo-100 ml-3">
                    <SidebarLink href="/org/content/roleplays" label="Roleplays" active={pathname.startsWith("/org/content/roleplays")} />
                    <SidebarLink href="/org/content/personas" label="Personas" active={pathname.startsWith("/org/content/personas")} />
                    <SidebarLink href="/org/content/interviews" label="Interviews" active={pathname.startsWith("/org/content/interviews")} />
                    <SidebarLink href="/org/content/question-banks" label="Question Banks" active={pathname.startsWith("/org/content/question-banks")} />
                    <SidebarLink href="/org/content/goals" label="Custom Goals" active={pathname.startsWith("/org/content/goals")} />
                    <SidebarLink href="/org/content/programs" label="Programs" active={pathname.startsWith("/org/content/programs")} />
                    <SidebarLink href="/org/content/coachbot" label="Coach Bot (RAG)" badge="AI" active={pathname.startsWith("/org/content/coachbot")} />
                    <SidebarLink href="/org/content/files" label="Files" active={pathname.startsWith("/org/content/files")} />
                    <SidebarLink href="/org/content/learning-materials" label="Learning Materials" active={pathname.startsWith("/org/content/learning-materials")} />
                  </div>
                )}
              </div>

              <SidebarLink
                href="/org/loops"
                icon={<Repeat className="w-4 h-4" />}
                label="Loops"
                active={pathname.startsWith("/org/loops")}
              />

              {/* People Section */}
              <div>
                <button
                  onClick={() => setPeopleOpen(!peopleOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#040348]"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0FA16D]" />
                    People
                  </span>
                  {peopleOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {peopleOpen && (
                  <div className="pl-3 space-y-0.5 border-l-2 border-indigo-100 ml-3">
                    <SidebarLink href="/org/people/members" label="Members" active={pathname === "/org/people/members"} />
                    <SidebarLink href="/org/people/members/invites" label="Invites" active={pathname === "/org/people/members/invites"} />
                    <SidebarLink href="/admin/invitations" label="One-Time Tokens" badge="NEW" active={pathname === "/admin/invitations"} />
                    <SidebarLink href="/org/people/groups" label="Groups (Hubs)" active={pathname === "/org/people/groups"} />
                    <SidebarLink href="/org/people/reporting-teams" label="Reporting Teams" active={pathname === "/org/people/reporting-teams"} />
                  </div>
                )}
              </div>

              <SidebarLink
                href="/org/settings"
                icon={<Settings className="w-4 h-4" />}
                label="Settings"
                active={pathname === "/org/settings"}
              />
              <SidebarLink
                href="/org/integrations"
                icon={<Plug className="w-4 h-4" />}
                label="Integrations"
                active={pathname === "/org/integrations"}
              />
            </nav>
          )}
        </div>

        {/* Bottom Quota + User Profile */}
        <div className="p-4 space-y-3 border-t border-indigo-100 bg-[#F5F8FE]/60">
          <div className="p-3 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">
                {currentUser.yoodlisRemaining} Yoodlis remaining
              </span>
              <Zap className="w-3.5 h-3.5 text-[#524FFC]" />
            </div>
            <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
              <div className="h-full bg-yoodli-gradient w-4/5 rounded-full" />
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-1.5 rounded-lg text-xs font-bold text-[#524FFC] bg-[#E6E5FF]/60 hover:bg-[#E6E5FF] transition cursor-pointer"
            >
              UPGRADE
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link href="/account" className="flex items-center gap-2.5 group min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#040348] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-[#040348] group-hover:text-[#524FFC] truncate">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Acme Corp • {currentUser.role}
                </div>
              </div>
            </Link>
            <Link
              href="/signin"
              title="Switch Account / Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#CD4631] hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* + Start Practice Selector Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 bg-[#040348]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#040348]">
                  Start a Yoodli Session
                </h3>
                <p className="text-xs text-slate-500">
                  Choose a practice mode or upload an existing recording for instant AI coaching
                </p>
              </div>
              <button
                onClick={() => setShowStartModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-3">
              <Link
                href="/practice/conversation"
                onClick={() => setShowStartModal(false)}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-indigo-100 hover:border-[#524FFC] hover:bg-[#F5F8FE] transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F1B6EB]/40 text-[#524FFC] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#040348]">Roleplay Conversation</div>
                  <div className="text-xs text-slate-500">
                    Practice cold calls, discovery, objection handling, or 1:1 reviews with an interactive AI Persona
                  </div>
                </div>
              </Link>

              <Link
                href="/practice/interview"
                onClick={() => setShowStartModal(false)}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-indigo-100 hover:border-[#524FFC] hover:bg-[#F5F8FE] transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D9D2BB]/40 text-[#040348] flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#040348]">Interview Practice</div>
                  <div className="text-xs text-slate-500">
                    Answer behavioral STAR or technical questions with live follow-up probing
                  </div>
                </div>
              </Link>

              <Link
                href="/practice/speech"
                onClick={() => setShowStartModal(false)}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-indigo-100 hover:border-[#524FFC] hover:bg-[#F5F8FE] transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#8ED6F3]/40 text-[#065C82] flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#040348]">Presentation / Speech</div>
                  <div className="text-xs text-slate-500">
                    Rehearse a keynote, board deck, or product demo with pacing & filler word coaching
                  </div>
                </div>
              </Link>

              <Link
                href="/practice/coach"
                onClick={() => setShowStartModal(false)}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-indigo-100 hover:border-[#524FFC] hover:bg-[#F5F8FE] transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#B0E0AA]/40 text-[#0FA16D] flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#040348]">Live Coaching Session</div>
                  <div className="text-xs text-slate-500">
                    Real-time private AI companion for live calls and executive dry runs
                  </div>
                </div>
              </Link>

              <button
                onClick={() => {
                  setShowStartModal(false);
                  setShowUploadModal(true);
                }}
                className="w-full text-left flex items-start gap-3.5 p-3.5 rounded-xl border border-dashed border-indigo-200 hover:border-[#524FFC] hover:bg-[#F5F8FE] transition cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#524FFC] flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#040348]">Upload Recording</div>
                  <div className="text-xs text-slate-500">
                    Upload an MP4/MP3 recording or paste a call transcript for instant AI scoring
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Recording Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-[#040348]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUploadSubmit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#040348]">Upload Recording for AI Analysis</h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Recording Title
              </label>
              <input
                type="text"
                required
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g., Q1 Enterprise Executive Pitch Dry Run"
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Transcript / Audio Content
              </label>
              <textarea
                rows={4}
                required
                value={uploadTranscript}
                onChange={(e) => setUploadTranscript(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#524FFC] hover:bg-[#4E4CBB]"
              >
                {uploading ? "Analyzing..." : "Analyze Recording"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-[#040348]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-indigo-100 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#524FFC]">
                  Yoodli Plans
                </span>
                <h3 className="text-xl font-bold text-[#040348]">
                  Unlock Unlimited AI Roleplays & Coaching
                </h3>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-indigo-100 bg-[#F5F8FE] space-y-2">
                <div className="font-bold text-[#040348]">Yoodli Pro / Advanced</div>
                <div className="text-2xl font-extrabold text-[#524FFC]">
                  $20<span className="text-xs font-normal text-slate-500"> / month</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0FA16D]" /> Unlimited AI Roleplays & Speeches</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0FA16D]" /> Custom AI Personas & Rubrics</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0FA16D]" /> Multi-language & Voice Coaching</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border-2 border-[#524FFC] bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#040348]">Enterprise Suite</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0FA16D]/10 text-[#0FA16D]">ACTIVE</span>
                </div>
                <div className="text-2xl font-extrabold text-[#040348]">
                  Custom<span className="text-xs font-normal text-slate-500"> • 100 Seats</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#524FFC]" /> Certification Programs & Loops</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#524FFC]" /> CoachBot RAG on Battlecards</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#524FFC]" /> Okta SSO/SCIM, Gong & Salesforce</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link
                href="/pricing"
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-[#524FFC] hover:bg-indigo-50"
              >
                Compare All Plans
              </Link>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#524FFC] text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  badge,
  active,
}: {
  href: string;
  icon?: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
        active
          ? "bg-[#E6E5FF] text-[#524FFC] font-semibold"
          : "text-slate-600 hover:bg-[#F5F8FE] hover:text-[#040348]"
      }`}
    >
      <span className="flex items-center gap-2.5 truncate">
        {icon && <span className={active ? "text-[#524FFC]" : "text-slate-400"}>{icon}</span>}
        <span className="truncate">{label}</span>
      </span>
      {badge && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-yoodli-gradient text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}
