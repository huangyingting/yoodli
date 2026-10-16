# Engineering Tasks Checklist (TASKS) — Yoodli Platform Clone

## Milestone 1: Reverse Engineering & Documentation
- [x] **T-101**: Inspect workspace and `.cred` cookie format without exposing secrets.
- [x] **T-102**: Crawl `https://yoodli.ai` marketing, platform, business, use-case, pricing (Monthly/Annual toggle), sample speeches, and courses pages with Playwright (55 screenshots saved in `screenshots/marketing/`).
- [x] **T-103**: Crawl `https://app.yoodli.ai` public auth flows, shared speech reports (`/share/NHCkSatH`, `/share/Vh7rshS1`, `/share/HaGmU6aj`, `/share/WizrmFmj`), and interactive Coaching/Analytics metric tabs.
- [x] **T-104**: Reverse-engineer `app.yoodli.ai` production bundles (`bundle-0.js`, `bundle-1.js`, `bundle-2.js`) and capture all authenticated Member, Practice, Exercise, My Learning, Account, and Enterprise Org Admin routes (86 screenshots saved in `screenshots/app/`).
- [x] **T-105**: Author `docs/ADR.md`, `docs/PRD.md`, `docs/SPEC.md`, `docs/PLAN.md`, and `docs/TASKS.md`.

## Milestone 2: Next.js + NextAuth + Prisma Setup & Dual-DB Configuration
- [x] **T-201**: Initialize Next.js (App Router, TypeScript, Tailwind CSS) project in `/home/azadmin/yoodli` while preserving `/screenshots`, `/scripts`, `/docs`, and `.cred`.
- [x] **T-202**: Install latest `prisma`, `@prisma/client`, `next-auth@beta`, `@auth/prisma-adapter`, `bcryptjs`, `lucide-react`, and configure `.gitignore` to exclude `.cred`, `.env*`, `node_modules`, `.next`, and `*.db`.
- [x] **T-203**: Author `prisma/schema.prisma` (SQLite default for local dev) and `prisma/schema.postgres.prisma` + `scripts/switch-db-provider.mjs` (PostgreSQL for production).
- [x] **T-204**: Push schema to local SQLite (`npx prisma db push`) and run `prisma/seed.ts` to populate users, organization, personas, roleplays, custom goals, analyzed speeches (`NHCkSatH`, `Vh7rshS1`, `HaGmU6aj`, `WizrmFmj`), comments, programs, courses, exercises, loops, groups, reporting teams, CoachBot docs, and integrations.

## Milestone 3: Auth, Speech Analytics Engine & API Routes
- [x] **T-301**: Implement NextAuth v5 configuration (`src/auth.ts`, `/api/auth/[...nextauth]/route.ts`, `/api/auth/register/route.ts`) with Credentials & OAuth support, Invite-Only Account Admission (`src/lib/account-admission/*`), and CLI-only admin bootstrap (`scripts/bootstrap-admin.ts`).
- [x] **T-302**: Implement `src/lib/speech-analytics.ts` (WPM, 15s WPM series, filler words, weak words, conciseness rephrases, questions, keywords, pauses, eye contact, centering, smiles, talk ratio) and `src/lib/ai-coach.ts` (persona dialogue turn generator, AI roleplay builder generator, rubric goal evaluator, CoachBot RAG responder).
- [x] **T-303**: Implement REST API routes for `/api/speeches`, `/api/speeches/[id]`, `/api/speeches/[id]/comments`, `/api/roleplays`, `/api/roleplays/turn`, `/api/exercises`, `/api/admin/invitations/*`, `/api/auth/invitation`, `/api/auth/password/*`, and `/api/org/*` (personas, goals, programs, question-banks, coachbot, loops, members, invites, groups, teams, settings, integrations, reports CSV).

## Milestone 4: Frontend Routes & Interactive Features
- [x] **T-401**: Build Marketing & Public pages (`/`, `/pricing`, `/sample-speeches`, `/courses`, `/signin`, `/signup`, `/register`, `/invite/[token]`, `/forgot-password`, `/reset-password/[token]`, `/onboarding`).
- [x] **T-402**: Build Authenticated App Shell (`Member`/`Admin` workspace switcher, `+ Start` practice modal, `My Learning` accordion, quota card, `Upgrade` modal).
- [x] **T-403**: Build Member Home (`/home`), Roleplays catalog (`/roleplays`), and AI Roleplay Builder (`/builder`).
- [x] **T-404**: Build Live Practice Studios (`/practice/speech`, `/practice/interview`, `/practice/conversation`, `/practice/coach`) with live camera/mic preview, Web Speech API + interactive turn input, real-time coaching nudges, and session analysis submission.
- [x] **T-405**: Build Speech Feedback & Analytics Report (`/library/[userId]/feedback/[speechId]` & `/share/[slug]`) with synced video/transcript player, word-highlight toggles, `Coaching` tab (Summary, Rubric Scorecards, AI Rephrase, Follow-up Questions), `Analytics` tab (Word Choice & Delivery gauges/charts), and timestamped comments.
- [x] **T-406**: Build Progress Dashboard (`/dashboard`), My Recordings (`/library`), Account Settings (`/account`), My Learning (`/org/resources/programs`, `/org/resources/programs/[programId]`, `/org/resources/courses`, `/org/resources/exercises`), and all 4 interactive games (`/exercises/spin-a-yarn`, `/exercises/metaphor-mania`, `/exercises/no-filler`, `/exercises/storyteller`).
- [x] **T-407**: Build Enterprise Org Admin Suite (`/org/overview`, `/org/analytics/*`, `/org/content/*`, `/org/loops`, `/org/people/*`, `/admin/invitations`, `/org/settings`, `/org/integrations`).

## Milestone 5: Verification & E2E Testing
- [x] **T-501**: Run production build (`npm run build`) and verify zero TypeScript or Next.js build errors.
- [x] **T-502**: Run Playwright verification suite across marketing, authentication, Invite-Only registration (`scripts/verify-invite-only.mjs`), Member practice & analytics report generation, games, and Enterprise Org Admin pages, capturing 60 verification screenshots in `screenshots/clone-verified/`.
