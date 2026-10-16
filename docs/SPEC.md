# Technical Specification (SPEC) — Yoodli Platform Clone

## 1. System Architecture & Technology Stack

| Layer | Technology | Version / Notes |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router, TypeScript) | Latest (`next@latest`, React 19) |
| **Authentication** | NextAuth.js / Auth.js v5 | Latest (`next-auth@beta`, `@auth/prisma-adapter`) |
| **Database ORM** | Prisma ORM | Latest (`prisma`, `@prisma/client`) |
| **Database (Local Dev)** | SQLite | `file:./dev.db` (zero-config local persistence) |
| **Database (Production)** | PostgreSQL | Switchable via `prisma/schema.postgres.prisma` |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Exact Yoodli color/gradient tokens from `bundle-0.js` |
| **Media & Speech** | WebRTC `MediaRecorder` + Web Speech API | Camera/mic capture, waveform visualization, live transcript |
| **Testing** | Playwright | End-to-end verification across all routes & interactions |

---

## 2. Prisma Data Model Specification (`prisma/schema.prisma`)

The data model captures both individual Member workflows and multi-tenant Enterprise Organization Admin entities:

### 2.1 Core Identity & Multi-Tenant Organization Models
- **`User`**:
  - `id` (String, cuid, PK)
  - `name`, `email` (unique), `passwordHash`, `image`, `jobTitle`, `department`
  - `role` (`ADMIN` | `MANAGER` | `MEMBER` | `COACH`)
  - `workspaceMode` (`MEMBER` | `ADMIN`)
  - `planTier` (`FREE` | `PRO` | `ADVANCED` | `ENTERPRISE`)
  - `yoodlisRemaining` (Int, default `46`), `dayStreak` (Int, default `5`)
  - `defaultPrivacy` (`PRIVATE` | `LINK` | `ORG`)
  - `preferredLanguage` (String, default `"en-US"`), `onboardingCompleted` (Boolean)
  - Relations: `accounts`, `sessions`, `orgMemberships`, `speeches`, `enrollments`, `comments`, `gameScores`
- **`Organization`**:
  - `id` (String, cuid, PK), `name`, `slug` (unique), `logoUrl`, `domain`
  - `planName` (`Enterprise Annual`), `seatsTotal` (Int, default `100`), `seatsUsed` (Int, default `78`)
  - `defaultSharing` (`PRIVATE` | `ORG_ADMINS` | `ORG_ALL`), `ssoEnabled` (Boolean), `scimEnabled` (Boolean)
  - `sampleDataMode` (Boolean, default `false`)
- **`OrgMember`**:
  - `id`, `orgId`, `userId`, `role` (`ADMIN` | `MANAGER` | `MEMBER` | `COACH`), `groupName`, `reportingTeam`, `yoodlisCount`, `lastActiveAt`, `joinedAt`
- **`OrgInvite`**:
  - `id`, `orgId`, `email`, `role`, `groupName`, `status` (`PENDING` | `ACCEPTED` | `EXPIRED`), `invitedBy`, `createdAt`
- **`OrgGroup`** & **`ReportingTeam`**:
  - `id`, `orgId`, `name`, `description`, `memberCount`, `leadName`, `assignedProgramsCount`

### 2.2 AI Roleplays, Personas, Custom Goals & Question Banks
- **`Persona`**:
  - `id`, `orgId`, `name`, `title`, `company`, `avatarUrl`, `demeanor` (`Skeptical`, `Analytical`, `Friendly`, `Busy Executive`, `Challenging`), `voiceName`, `bio`, `systemPrompt`, `isDefault`
- **`CustomGoal`**:
  - `id`, `orgId`, `title`, `description`, `goalType` (`BINARY` | `RATED` | `COMPOUND` | `KNOWLEDGE_BASED`), `category`, `rubricCriteriaJson` (JSON string of evaluation criteria/weights), `usageCount`
- **`RoleplayScenario`**:
  - `id`, `orgId`, `title`, `description`, `category` (`OBJECTION_HANDLING` | `COLD_CALL` | `INBOUND_DISCOVERY_CALL` | `OUTBOUND_DISCOVERY_CALL` | `BEHAVIORAL_INTERVIEW` | `TECHNICAL_INTERVIEW` | `PITCH` | `MANAGER_PERF_REVIEW` | `MANAGER_SKILLS_TRAINING`)
  - `difficulty` (`Beginner` | `Intermediate` | `Advanced`), `roundelColor` (Hex), `visibility` (`ORG` | `MY` | `SHARED` | `PUBLIC`)
  - `personaId` (FK -> `Persona`), `starterPrompt`, `scenarioContext`, `goalsJson` (array of rubric goals), `questionsJson` (for interview scenarios)
- **`QuestionBank`**:
  - `id`, `orgId`, `title`, `category`, `questionsJson` (JSON array of questions with ideal STAR/rubric points), `createdBy`

### 2.3 Speeches / Recordings, Transcripts, Coaching & Analytics
- **`Speech`**:
  - `id`, `shareSlug` (unique 8-char code e.g. `NHCkSatH`), `userId`, `orgId`, `scenarioId` (nullable)
  - `title`, `practiceType` (`ROLEPLAY` | `INTERVIEW` | `SPEECH` | `COACH` | `UPLOAD`)
  - `durationSeconds` (Int), `videoUrl` (nullable), `visibility` (`PRIVATE` | `SHARED_LINK` | `ORG`)
  - **Quantitative Analytics Fields**:
    - `overallScore` (Int, 0–100)
    - `wpmAverage` (Int), `wpmSeriesJson` (JSON array of `{ timeSec, wpm }`)
    - `fillerWordCount` (Int), `fillerWordPct` (Float), `fillerBreakdownJson` (JSON map e.g. `{"um": 2, "uh": 1, "like": 1}`)
    - `weakWordCount` (Int), `weakWordPct` (Float), `weakBreakdownJson` (JSON map)
    - `concisenessScore` (Int, 0–100), `rephrasesJson` (JSON array of `{ original, improved, timestampSec, reason }`)
    - `questionsAskedCount` (Int), `topKeywordsJson` (JSON array of `{ word, count }`)
    - `pausesCount` (Int), `eyeContactPct` (Int), `centeringPct` (Int), `smilesPct` (Int), `talkRatioPct` (Int)
  - **Qualitative Coaching & Transcript Fields**:
    - `transcriptJson` (JSON array of `{ id, speaker, speakerName, startSec, endSec, text, fillerWords, weakWords, isQuestion }`)
    - `aiSummary` (Text)
    - `rubricScoresJson` (JSON array of `{ goalId, title, type, passed, score, maxScore, feedback, evidenceQuote, timestampSec }`)
    - `followUpQuestionsJson` (JSON array of strings)
  - `createdAt`, `updatedAt`
- **`SpeechComment`**:
  - `id`, `speechId`, `authorName`, `authorAvatar`, `authorRole`, `timestampSec` (Int), `text`, `isAiCoach` (Boolean), `createdAt`

### 2.4 Programs, Courses, Loops, CoachBot & Integrations
- **`Program`**:
  - `id`, `orgId`, `title`, `description`, `status` (`PUBLISHED` | `DRAFT`), `dueDate`, `bannerColor`, `stepsJson` (JSON array of ordered steps: `VIDEO`, `ROLEPLAY`, `QUIZ`, `PITCH`), `enrolledCount`, `completionRate`
- **`UserProgramEnrollment`**:
  - `id`, `userId`, `programId`, `status` (`NOT_STARTED` | `IN_PROGRESS` | `COMPLETED`), `completedStepsCount`, `totalStepsCount`, `scorePct`, `StepProgressJson`, `updatedAt`
- **`Course`**:
  - `id`, `orgId`, `title`, `instructor`, `durationMinutes`, `category`, `thumbnailColor`, `lessonsJson`, `completedByUser` (Boolean)
- **`PracticeLoop`**:
  - `id`, `orgId`, `title`, `focusArea` (`AUTHORITY` | `LISTENING` | `PRESENCE` | `USAGE`), `cadence` (`Weekly` | `Bi-weekly` | `Daily`), `assignedGroup`, `activeParticipants`, `avgCompletionPct`, `status`
- **`CoachBotDocument`**:
  - `id`, `orgId`, `title`, `fileType` (`PDF` | `DOCX` | `URL` | `PLAYBOOK`), `fileSize`, `category` (`Battlecard` | `Playbook` | `Learning Material`), `contentSummary`, `uploadedBy`, `createdAt`
- **`OrgIntegration`**:
  - `id`, `orgId`, `providerKey` (`gong`, `chorus`, `zoom`, `salesforce`, `hubspot`, `workday`, `docebo`, `scorm`, `okta`, `mcp`), `name`, `category` (`CALL_INTELLIGENCE` | `CRM` | `LMS` | `SSO_SCIM` | `API_MCP`), `connected` (Boolean), `configJson`
- **`ExerciseAttempt`**:
  - `id`, `userId`, `exerciseSlug` (`spin-a-yarn` | `metaphor-mania` | `no-filler` | `storyteller`), `score` (Int), `durationSeconds` (Int), `wordsIncorporated` (Int), `fillerCount` (Int), `transcript` (Text), `createdAt`

---

## 3. Speech Analytics & Rubric Calculation Specification (`src/lib/speech-analytics.ts`)

Given a session's transcript turns `T` and total duration `D` (seconds):

1. **Tokenization & Word Count**:
   - Extract user turns $T_{\text{user}}$. Total user words $W = \sum \text{words}(t.text)$.
   - Total user speaking time $D_{\text{user}} = \sum (t.\text{endSec} - t.\text{startSec})$.
2. **Pacing (Words Per Minute — WPM)**:
   - $\text{WPM}_{\text{avg}} = \text{round}\left(\frac{W}{\max(D_{\text{user}}, 10) / 60}\right)$.
   - Windowed WPM series computed in 15-second intervals $[0, 15, 30, \dots, D]$.
   - Status classification:
     - `120–170 WPM`: **Ideal** (`#0FA16D`)
     - `100–119` or `171–190 WPM`: **Slightly Slow / Fast** (`#E99923`)
     - `< 100` or `> 190 WPM`: **Needs Attention** (`#CD4631`)
3. **Filler Words**:
   - Dictionary: `["um", "uh", "ah", "er", "like", "you know", "basically", "actually", "literally", "right"]`.
   - $\text{FillerPct} = \text{round}\left(\frac{\text{FillerCount}}{\max(W, 1)} \times 100, 1\right)$.
4. **Weak / Hedging Words**:
   - Dictionary: `["just", "maybe", "kind of", "sort of", "i think", "i guess", "probably", "hopefully", "try to", "sorry"]`.
   - $\text{WeakPct} = \text{round}\left(\frac{\text{WeakCount}}{\max(W, 1)} \times 100, 1\right)$.
5. **Conciseness & Rephrase Engine**:
   - Detects verbose sentences ($> 24$ words or containing $\ge 2$ filler/weak phrases) and produces a concise executive rewrite reducing word count by 25–40%.
6. **Talk-to-Listen Ratio**:
   - For multi-turn roleplays: $\text{TalkRatio} = \text{round}\left(\frac{D_{\text{user}}}{D_{\text{total}}} \times 100\right)$.

---

## 4. Complete Application Route Hierarchy

### Public & Marketing Routes
- `/` — Marketing Home (Hero, Interactive Roleplay Tabs, Platform Pillars, Enterprise Proof, CTA)
- `/pricing` — Plans (`Free`, `Pro`, `Advanced`, `Enterprise`), Monthly/Annual toggle, FAQ
- `/sample-speeches` — Public analyzed speeches gallery
- `/courses` — Public communication & sales courses overview
- `/share/[slug]` — Public/Shared Speech Feedback & Analytics Report (`NHCkSatH`, `Vh7rshS1`, `HaGmU6aj`, `WizrmFmj`, plus any newly created speech)

### Authentication & Onboarding Routes
- `/signin` — Email/password + SSO + 1-click Demo Login (`Alex Rivera — Enterprise Admin & Rep`)
- `/signup` — Account registration
- `/forgot-password` — Password recovery
- `/onboarding` — Interactive 3-step onboarding wizard

### Member Workspace Routes
- `/home` — Member Home (Assigned Program banner, Recommended Roleplays, Recent Recordings)
- `/roleplays` — Roleplays catalog (`All`, `Organization Roleplays`, `My Roleplays`, `Shared with me`)
- `/builder` — AI Roleplay Builder (AI prompt generator + custom Persona & Goal configurator)
- `/practice/speech` — Presentation / Speech Recorder Studio
- `/practice/interview` — AI Interview Practice Studio (Question bank selector + live AI interviewer)
- `/practice/conversation` — Multi-Turn AI Persona Roleplay Studio (`?scenarioId=...`)
- `/practice/coach` — Live Coaching / Meeting Companion Studio
- `/library` — My Recordings library (Search, Filter, Upload Recording, Share, Delete)
- `/library/[userId]/feedback/[speechId]` — Full Speech Coaching & Analytics Report
- `/dashboard` — Progress Dashboard (Day Streak, Skill Snapshot Trend Chart, Before & After)
- `/org/resources/programs` — My Learning: Enrolled Programs list
- `/org/resources/programs/[programId]` — My Learning: Program detail & interactive steps
- `/org/resources/courses` — My Learning: Video Courses & player
- `/org/resources/exercises` — My Learning: Communication Games hub
- `/exercises/spin-a-yarn` — Interactive Game: Spin a Yarn
- `/exercises/metaphor-mania` — Interactive Game: Metaphor Mania
- `/exercises/no-filler` — Interactive Game: No Filler Challenge
- `/exercises/storyteller` — Interactive Game: Storyteller
- `/account` — Account Settings (`General Settings`, `Plan & Billing`)

### Enterprise Organization Admin Routes (`/org/*`)
- `/org/overview` — Admin Overview (30-day engagement, Seat utilization, Top Members & Programs)
- `/org/analytics/overview` — Org Analytics: Overview tab + `Sample data` toggle
- `/org/analytics/programs` — Org Analytics: Programs performance tab
- `/org/analytics/goals` — Org Analytics: Custom Goals pass-rate analytics
- `/org/analytics/roleplays` — Org Analytics: Roleplay adoption & scores
- `/org/analytics/reports-data` — Org Analytics: Downloadable CSV Reports
- `/org/content/roleplays` & `/org/content/roleplays/create` — Manage & Create Org Roleplays
- `/org/content/personas` & `/org/content/personas/create` — Manage & Create AI Personas
- `/org/content/interviews` — Manage Interview Templates
- `/org/content/question-banks` — Manage Question Banks
- `/org/content/goals` & `/org/content/goals/create` — Manage & Create Custom Goals (`Binary`, `Rated`, `Compound`, `Knowledge-Based`)
- `/org/content/programs`, `/org/content/programs/create`, `/org/content/programs/[programId]` — Manage & Create Certification Programs
- `/org/content/coachbot` — Interactive AI Coach Bot RAG Playground & Knowledge Base
- `/org/content/files` — Organization Knowledge Files manager
- `/org/content/learning-materials` — Enablement Learning Materials manager
- `/org/loops` — Recurring Practice Loops manager
- `/org/people/members` — Organization Members table, role editor, and Invite modal
- `/org/people/members/invites` — Pending Invites manager
- `/org/people/groups` — Groups (Hubs) manager
- `/org/people/reporting-teams` — Manager Reporting Teams hierarchy
- `/org/settings` — Organization Branding, Privacy & AI Settings
- `/org/integrations` — Enterprise Integrations hub (Gong, Chorus, Zoom, Salesforce, HubSpot, Workday, Docebo, SCORM 1.2, Okta SSO, MCP/API)
