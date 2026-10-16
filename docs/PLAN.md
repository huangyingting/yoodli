# Implementation Plan (PLAN) — Yoodli Platform Clone

## Phase 1: Reverse Engineering, Visual Capture & Architecture Documentation (Completed)
1. **Marketing Website Capture (`https://yoodli.ai`)**:
   - Crawled 27 marketing, platform, business, use-case, sample-speeches, courses, and pricing pages via Playwright; saved 55 viewport and full-page screenshots to `screenshots/marketing/`.
2. **Application Reverse Engineering (`https://app.yoodli.ai`)**:
   - Extracted Webpack route trees, Redux actions, API schemas, and design tokens (`bundle-0.js`, `bundle-1.js`, `bundle-2.js`).
   - Built Playwright authentication & API mock harness (`scripts/test_auth_harness.cjs`) and captured 86 screenshots across all public, shared speech report, Member, Practice, Exercise, My Learning, Account, and Enterprise Org Admin pages in `screenshots/app/`.
3. **Engineering Documentation**:
   - Authored `docs/ADR.md`, `docs/PRD.md`, `docs/SPEC.md`, `docs/PLAN.md`, and `docs/TASKS.md`.

---

## Phase 2: Project Scaffolding, Prisma Schema & Database Seeding
1. Initialize the application in `/home/azadmin/yoodli` with the **latest Next.js (App Router, TypeScript, Tailwind CSS)**, **latest NextAuth (`next-auth@beta`)**, and **latest Prisma (`prisma`, `@prisma/client`)**.
2. Configure `prisma/schema.prisma` for **SQLite** (`file:./dev.db`) in local development and create `prisma/schema.postgres.prisma` + `scripts/switch-db-provider.mjs` for **PostgreSQL** production deployment.
3. Build `prisma/seed.ts` to populate rich, realistic data matching the captured Yoodli screenshots:
   - Demo users: `alex.rivera@acme.io` (Enterprise Admin & Rep), `sarah.chen@acme.io` (VP Sales Manager), `marcus.johnson@acme.io` (Account Executive), `priya.patel@acme.io` (Solutions Engineer).
   - Organization: `Acme Corp Global Revenue` (`78/100 seats used`).
   - 8 AI Personas (e.g., *Dana Sterling — VP of IT Security*, *Marcus Vance — CFO*, *Elena Rostova — Head of Engineering*, *Jordan Blake — Procurement Director*).
   - 10 Roleplay Scenarios across Sales, Objection Handling, Cold Call, Inbound/Outbound Discovery, Behavioral/Technical Interviews, Executive Pitch, and Manager Perf Review.
   - 8 Custom Rubric Goals across all 4 types (`BINARY`, `RATED`, `COMPOUND`, `KNOWLEDGE_BASED`).
   - 6 analyzed Speeches/Recordings (including exact share slugs `NHCkSatH`, `Vh7rshS1`, `HaGmU6aj`, `WizrmFmj`) with word-level timestamped transcripts, WPM series, filler/weak word breakdowns, AI rephrases, rubric evaluations, and coaching comments.
   - 3 Certification Programs (`FY26 Q1 Enterprise Sales Pitch Certification`, `MEDDPICC Discovery Accreditation`, `New Manager Coaching Bootcamp`), Courses, Practice Loops, Question Banks, CoachBot documents, Groups, Reporting Teams, and Enterprise Integrations.

---

## Phase 3: Core Backend Engines & API Layer
1. **Authentication (`src/auth.ts` & `/api/auth/[...nextauth]`)**:
   - Configure NextAuth v5 with Credentials provider + Google/SSO support, session callbacks for role/workspace state, and 1-click demo login helper.
2. **Speech Analytics & AI Coaching Engine (`src/lib/speech-analytics.ts` & `src/lib/ai-coach.ts`)**:
   - Deterministic calculation of WPM, 15s WPM series, filler words, weak words, conciseness score, questions asked, top keywords, pauses, eye contact, centering, smiles, and talk-to-listen ratio.
   - Multi-turn AI Persona dialogue engine and rubric goal scorer with transcript evidence extraction.
3. **REST API Endpoints (`src/app/api/*`)**:
   - `/api/speeches` (GET, POST) & `/api/speeches/[id]` (GET, PATCH, DELETE) & `/api/speeches/[id]/comments` (POST)
   - `/api/roleplays` (GET, POST) & `/api/roleplays/ai-generate` (POST — AI Builder generator) & `/api/roleplays/turn` (POST — live AI Persona conversational turn)
   - `/api/exercises` (GET, POST — save game scores & transcripts)
   - `/api/org/*` (CRUD for Personas, Custom Goals, Question Banks, Programs, CoachBot RAG chat & docs, Loops, Members, Invites, Groups, Reporting Teams, Settings, Integrations, and CSV Report export).

---

## Phase 4: Frontend Implementation — Marketing, Member Workspace, Practice Studio & Org Admin
1. **Shared Design System & App Shell (`src/components/layout/*`)**:
   - Yoodli Sidebar with `Member` / `Admin` workspace switcher, `+ Start` practice modal (`Roleplay`, `Interview`, `Presentation`, `Coaching session`, `Upload Recording`), `My Learning` accordion, quota card (`46 Yoodlis remaining`), and `Upgrade` modal.
2. **Marketing & Public Pages**:
   - `/`, `/pricing` (with Monthly/Annual billing toggle), `/sample-speeches`, `/courses`, `/signin`, `/signup`, `/forgot-password`, `/onboarding`, and `/share/[slug]`.
3. **Member Pages & Interactive Studios**:
   - `/home`, `/roleplays`, `/builder`, `/practice/speech`, `/practice/interview`, `/practice/conversation`, `/practice/coach`, `/library`, `/library/[userId]/feedback/[speechId]`, `/dashboard`, `/org/resources/programs`, `/org/resources/programs/[programId]`, `/org/resources/courses`, `/org/resources/exercises`, `/exercises/spin-a-yarn`, `/exercises/metaphor-mania`, `/exercises/no-filler`, `/exercises/storyteller`, `/account`.
4. **Enterprise Org Admin Pages (`/org/*`)**:
   - `/org/overview`, `/org/analytics/*` (`overview`, `programs`, `goals`, `roleplays`, `reports-data`), `/org/content/*` (`roleplays`, `roleplays/create`, `personas`, `personas/create`, `interviews`, `question-banks`, `goals`, `goals/create`, `programs`, `programs/create`, `programs/[programId]`, `coachbot`, `files`, `learning-materials`), `/org/loops`, `/org/people/*` (`members`, `members/invites`, `groups`, `reporting-teams`), `/org/settings`, `/org/integrations`.

---

## Phase 5: End-to-End Verification & Playwright Testing
1. Run `npm run build` to verify TypeScript compilation and Next.js production build.
2. Start the server and run a comprehensive Playwright E2E test suite verifying:
   - Marketing pages, pricing toggle, and public shared speech reports (`/share/NHCkSatH`).
   - Authentication (`/signin` -> `/home`) and Workspace switcher (`Member` <-> `Admin`).
   - Creating a custom roleplay in `/builder`, running a live multi-turn roleplay practice session in `/practice/conversation`, completing the session, and verifying the newly generated Speech Feedback & Analytics report (`Coaching` + `Analytics` tabs).
   - Playing communication games (`/exercises/no-filler`, `/exercises/spin-a-yarn`).
   - Enterprise Org Admin workflows (`/org/overview`, `/org/analytics/overview`, `/org/content/goals/create`, `/org/content/coachbot`, `/org/people/members`).
