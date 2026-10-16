# Architecture Decision Records (ADR) — Yoodli Platform Clone

## Overview

This document captures the foundational architectural decisions made while reverse-engineering `https://yoodli.ai` (Marketing & Public Resources) and `https://app.yoodli.ai` (Member Practice Studio, Speech Coaching & Analytics Engine, My Learning, and Enterprise Organization Admin Platform) and re-implementing the complete platform in a modern unified full-stack codebase.

---

## ADR-001: Unified Full-Stack Framework with Next.js (Latest App Router)

- **Status**: Accepted
- **Context**:
  The original Yoodli platform separates its marketing site (`https://yoodli.ai`, built on Webflow/custom static pages) from its web application (`https://app.yoodli.ai`, a Webpack-bundled React SPA communicating with Go/Python REST & GraphQL microservices on GCP/Firebase). Maintaining separate repositories and build pipelines introduces deployment overhead and duplicated design tokens.
- **Decision**:
  Use the **latest Next.js (App Router, React 19, TypeScript)** to serve both the public marketing pages (`/`, `/pricing`, `/roleplays-info`, `/sample-speeches`, `/courses`, `/use-cases/*`) and the authenticated application (`/home`, `/roleplays`, `/builder`, `/practice/*`, `/library/*`, `/dashboard`, `/exercises/*`, `/org/*`, `/share/*`) within a single cohesive deployment using Next.js Route Groups:
  - `(marketing)`: Public marketing, platform showcase, pricing with monthly/annual toggle, sample speeches, and use-case pages.
  - `(auth)`: `/signin`, `/signup`, `/forgot-password`, `/onboarding`.
  - `(app)`: Authenticated Member & Enterprise Organization Admin routes with persistent sidebar, workspace switcher (`Member` vs `Admin`), and `Start` practice modal.
  - `api/*`: REST API routes for authentication, recordings, speech analytics computation, AI roleplay conversation turns, rubric evaluation, org admin CRUD, and CSV report generation.
- **Consequences**:
  - Zero CORS issues between frontend and backend APIs.
  - Shared TypeScript types between Prisma models, API handlers, and React Client/Server Components.
  - Instant SSR/SSG for marketing and shared recording pages (`/share/[slug]`) while preserving rich client-side interactivity for WebRTC recording and analytics charts.

---

## ADR-002: Authentication & Multi-Tenant RBAC via Latest NextAuth (Auth.js v5)

- **Status**: Accepted
- **Context**:
  Yoodli uses Firebase Authentication (`indexedDB.firebaseLocalStorageDb`) paired with a backend session lookup (`/v1/user/current` and `/v1/organization/*`) that resolves the user's global status (`ACTIVE`), organization memberships, and role (`ORG_ROLE_ADMIN`, `ORG_ROLE_MANAGER`, `ORG_ROLE_MEMBER`, `ORG_ROLE_COACH`). The user explicitly requested using the **latest NextAuth** version.
- **Decision**:
  Adopt **NextAuth v5 (`next-auth@beta` / Auth.js v5)** integrated with `@auth/prisma-adapter` and JWT session strategy enriched with organization and role claims:
  - **Providers**:
    1. `Credentials` provider (email + password with `bcryptjs` verification, plus 1-click Demo Persona login for Member and Enterprise Org Admin accounts).
    2. `Google` and `MicrosoftEntraID` / `Okta` SSO provider configurations (gracefully enabled via environment variables, matching Yoodli's `/signin` and `/org/settings` SSO flows).
  - **Session Enrichment**:
    `auth()` session callbacks attach `user.id`, `user.role` (`ADMIN`, `MANAGER`, `MEMBER`, `COACH`), `user.activeOrgId`, `user.activeWorkspaceMode` (`MEMBER` | `ADMIN`), and `user.yoodlisRemaining`.
- **Consequences**:
  - Works seamlessly in Next.js App Router Server Components, Route Handlers, and Middleware without external Firebase dependencies.
  - Supports instant switching between **Member View** and **Admin View** in the top-left sidebar pill, mirroring `app.yoodli.ai`.

---

## ADR-003: Dual-Database Strategy with Latest Prisma (SQLite Local Dev, PostgreSQL Production)

- **Status**: Accepted
- **Context**:
  The user required using the **latest Prisma version** with **SQLite for local development** and **PostgreSQL for production deployment**.
- **Decision**:
  Use **Prisma ORM** (`prisma` & `@prisma/client`) with:
  - `prisma/schema.prisma`: Configured with `provider = "sqlite"` and `url = env("DATABASE_URL")` (`file:./dev.db`) out of the box so local development, seeding, and E2E Playwright tests run immediately with zero external container dependencies.
  - `prisma/schema.postgres.prisma` and `scripts/switch-db-provider.mjs`: Production PostgreSQL schema and automated provider switcher (`npm run db:use:postgres` / `npm run db:use:sqlite`) for seamless production deployment on PostgreSQL.
  - Structured JSON fields (serialized cleanly in both SQLite and PostgreSQL) for high-density speech telemetry: word-level timestamps, WPM time-series buckets, filler word instances, rubric goal scores, and timestamped coaching comments.
- **Consequences**:
  - Local setup requires only `npx prisma db push && npx prisma db seed`.
  - Production deployments get full PostgreSQL concurrency, indexing, and connection pooling.

---

## ADR-004: Hybrid Real-Time Speech Capture, Multi-Turn AI Roleplay & Deterministic + LLM Analytics Engine

- **Status**: Accepted
- **Context**:
  Yoodli's core value proposition rests on two interactive pillars:
  1. **Practice Studio**: Live webcam/microphone capture (`MediaRecorder` + `getUserMedia`) during solo speeches, interviews, or multi-turn AI Persona conversations (`/practice/speech`, `/practice/interview`, `/practice/conversation`, `/practice/coach`), plus file uploads.
  2. **Post-Session Coaching & Analytics Report**: Synchronized video/audio player, interactive transcript with highlighted filler/weak words, AI Coaching rubric evaluation, and quantitative Delivery & Word Choice metrics (`Filler Words`, `Weak Words`, `Top Keywords`, `Conciseness`, `Questions Asked`, `Pacing / WPM`, `Pauses`, `Eye Contact`, `Centering`, `Smiles`, `Talk-to-Listen Ratio`).
- **Decision**:
  Implement a **Hybrid Speech & Roleplay Engine**:
  - **Client Capture**: Browser `navigator.mediaDevices.getUserMedia` (with graceful simulated camera/waveform fallback for headless or camera-less environments) + Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) + interactive text/voice turn simulator so every practice mode works both with live microphone input and with interactive text/simulated speech input.
  - **Deterministic Speech Analytics Module (`src/lib/speech-analytics.ts`)**:
    Computes exact quantitative metrics from any transcript + duration:
    - **Filler Words**: Detects and timestamps `um`, `uh`, `like`, `you know`, `actually`, `basically`, `literally`, `right`, `so` with per-word counts and percentage.
    - **Weak Words**: Detects hedging/weak language (`just`, `maybe`, `kind of`, `sort of`, `I think`, `probably`, `hopefully`, `try to`).
    - **Conciseness & AI Rephrase**: Identifies verbose clauses and generates tighter executive rewrites.
    - **Pacing & Pauses**: Calculates overall WPM, 15-second windowed WPM time-series points (ideal range `120–170 WPM`), and pause counts/durations.
    - **Delivery Presence**: Computes or extracts Eye Contact %, Centering %, Smiles %, and Talk-to-Listen Ratio %.
  - **AI Roleplay & Rubric Evaluator (`src/lib/ai-coach.ts`)**:
    Uses OpenAI-compatible LLM endpoints when `OPENAI_API_KEY` is provided, and falls back automatically to a context-aware persona dialogue & rubric scoring engine that evaluates custom organization goals (`Binary`, `Rated 1–5`, `Compound`, `Knowledge-Based`) with exact transcript evidence quotes.
- **Consequences**:
  - Every practice session generates a complete, persistent, interactive Speech Feedback & Analytics Report in Prisma immediately upon completion.
  - Works 100% offline/locally in automated Playwright tests while supporting live LLM keys in production.

---

## ADR-005: Reverse-Engineered Yoodli Design System & Color Tokens

- **Status**: Accepted
- **Context**:
  Inspecting `bundle-0.js` module `261748` and the 141 captured screenshots revealed Yoodli's exact design tokens:
  - **Primary Brand Indigo**: `#524FFC` (hover `#4E4CBB`, light surface `#F5F8FE`, border `#C9C7FF`)
  - **Secondary Cyan**: `#1DA9E6` (light `#E8F6FC`)
  - **Deep Navy Heading (`purple3`)**: `#040348`
  - **Gradients**:
    - Default CTA/Accent: `linear-gradient(90deg, #1DA9E6 0%, #6966FE 82%)`
    - Slanted Banner: `linear-gradient(72deg, #EFF5FD 0%, #EEEEFE 79%)`
    - Dark Hero: `linear-gradient(72deg, #040348 0%, #05045d 100%)`
  - **Roleplay Scenario Roundel Pastels**:
    - Objection Handling: `#F1B6EB`
    - Cold Call: `#8ED6F3`
    - Inbound Discovery: `#F6D99B`
    - Outbound Discovery: `#8EAAFF`
    - Behavioral / Technical Interview: `#D9D2BB`
    - Pitch: `#F5B9B0`
    - Manager Skills: `#B0E0AA`
  - **Typography**: `Poppins` for headings/display and `Inter` for UI/body/transcripts.
- **Decision**:
  Encode these exact tokens into Tailwind CSS custom theme variables and reusable UI components (`Sidebar`, `TopHeader`, `StartPracticeModal`, `MetricGauge`, `TranscriptViewer`, `RubricCard`, `RoleplayCard`).
- **Consequences**:
  - High visual fidelity matching `https://yoodli.ai` and `https://app.yoodli.ai`.

---

## ADR-006: Enterprise Organization Admin, Programs, Loops, and CoachBot RAG Architecture

- **Status**: Accepted
- **Context**:
  Reverse-engineering `app.yoodli.ai` uncovered a comprehensive Enterprise Org Admin suite under `/org/*`:
  - `/org/overview`: Seat utilization (`78 / 100 seats used`), 30-day engagement metrics, top members, and active programs.
  - `/org/analytics/*`: Multi-tab analytics (`Overview`, `Programs`, `Goals`, `Roleplays`, `Reports` with CSV export and `Sample data` toggle).
  - `/org/content/*`: CRUD management for `Roleplays`, `Personas`, `Interviews`, `Question Banks`, `Custom Goals` (Binary, Rated, Compound, Knowledge-Based), `Programs` (multi-step certification tracks), `Coach Bot` (RAG assistant grounded on uploaded playbooks/battlecards), `Files`, and `Learning Materials`.
  - `/org/loops`: Recurring micro-practice drills with Focus Areas (`Authority`, `Listening`, `Presence`, `Usage`).
  - `/org/people/*`: `Members`, `Invites`, `Groups` (Hubs), and `Reporting Teams`.
  - `/org/settings` & `/org/integrations`: Enterprise branding, privacy defaults, Call Intelligence (Gong, Chorus, Zoom), LMS (Workday, Docebo, SCORM 1.2), CRM (Salesforce, HubSpot), SCIM, SSO, and API/MCP settings.
- **Decision**:
  Model all Enterprise entities directly in Prisma (`Organization`, `OrgMember`, `OrgInvite`, `OrgGroup`, `ReportingTeam`, `RoleplayScenario`, `Persona`, `CustomGoal`, `QuestionBank`, `Program`, `ProgramStep`, `UserProgramEnrollment`, `CoachBotDocument`, `PracticeLoop`, `OrgIntegration`) and expose full interactive CRUD, filtering, modals, and live CSV downloads across all `/org/*` routes.
- **Consequences**:
  - Both the Member experience and the Enterprise Admin experience are first-class citizens backed by real database state.

---

## ADR-007: Invite-Only Account Admission & CLI-Only Bootstrap Admin

- **Status**: Accepted
- **Context**:
  Account registration is governed by the `src/lib/account-admission/*` subsystem (`ACCOUNT_ADMISSION_MODE="invitation-only"` by default).
- **Decision**:
  1. **One-Time Cryptographic Invitation Tokens**: Invitations use 256-bit random tokens (`randomBytes(32).toString('base64url')`) whose SHA-256 hash (`tokenHash`) is stored in `AccountInvitation`. Raw tokens are never persisted at rest and are returned only once upon creation or rotation.
  2. **Strict Invitation Enforcement**: In `invitation-only` mode, `POST /api/auth/register` without a valid pending token returns `403 invitation_required`, and social OAuth logins without an existing account or active invitation redirect to `/signin?error=InvitationRequired`.
  3. **Scrypt Password Credentials**: Passwords (12–128 characters) are hashed with Node `crypto.scrypt` (`scrypt$16384$8$1$<salt>$<hash>`) and verified in constant time with `timingSafeEqual`.
  4. **CLI-Only Admin Bootstrap**: No HTTP bootstrap admin endpoint is exposed. Initial administrator accounts are provisioned exclusively from the deployment host shell via `npm run bootstrap:admin -- --email <email> --password-stdin` (`scripts/bootstrap-admin.ts`).

