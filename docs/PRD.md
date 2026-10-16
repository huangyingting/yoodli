# Product Requirements Document (PRD) — Yoodli AI Roleplay & Communication Coach

## 1. Executive Summary & Vision

**Yoodli** is an AI-powered roleplay, sales enablement, interview preparation, and communication coaching platform used by individuals and enterprise revenue/L&D teams. Users practice high-stakes conversations—cold calls, objection handling, discovery calls, executive presentations, behavioral/technical interviews, and manager performance reviews—with realistic AI Personas, receiving instant, private, objective feedback on both **what they said** (custom rubric goals, discovery questions, playbook adherence) and **how they said it** (filler words, pacing/WPM, weak words, conciseness, eye contact, centering, smiles, and talk-to-listen ratio).

This PRD documents the complete feature set reverse-engineered from `https://yoodli.ai` (55 screenshots across 27 pages) and `https://app.yoodli.ai` (86 screenshots across all public, Member, Practice, Exercise, My Learning, and Enterprise Org Admin routes).

---

## 2. Target User Personas

1. **Individual Learner / Job Seeker / Speaker (`MEMBER`)**:
   - Uses Yoodli to prepare for job interviews, keynote speeches, Toastmasters talks, or tough conversations.
   - Wants instant AI feedback on filler words, pacing, conciseness, and interview question rubrics, plus fun communication games (`Spin a Yarn`, `Metaphor Mania`, `No Filler`, `Storyteller`).
2. **Enterprise Sales Rep / Enablement Trainee (`MEMBER` in Organization)**:
   - Enrolled in assigned certification **Programs** (e.g., *FY26 Q1 Enterprise Sales Pitch Certification*, *MEDDPICC Discovery*) and recurring **Loops**.
   - Practices multi-turn voice/video **Roleplays** against skeptical AI buyer personas and submits attempts for AI + Manager evaluation.
3. **Sales Manager / Coach (`MANAGER` / `COACH`)**:
   - Reviews team recordings, leaves timestamped coaching comments, tracks team skill progression across goals, and monitors reporting teams.
4. **Enterprise Enablement / L&D Administrator (`ADMIN`)**:
   - Builds custom **Roleplays**, **AI Personas**, **Custom Goals** (Binary, Rated, Compound, Knowledge-Based), **Question Banks**, **Certification Programs**, and **Coach Bot** RAG knowledge bases; manages members, invites, groups, SSO/SCIM, CRM/LMS/Call Intelligence integrations, and org-wide analytics.

---

## 3. Functional Requirements by Product Surface

### 3.1 Public Marketing Website (`https://yoodli.ai` Clone)
*Visual Reference: `screenshots/marketing/01-home-*.png` through `28-pricing-toggle-*.png`*

- **Navigation Header**:
  - Mega-menu dropdowns for **Platform** (*AI Roleplays, AI Personas, Create, AI Coaching, Measure & Analytics*), **For Business** (*Revenue Enablement, Sales, L&D, Executive Coaching, Leadership, Partner Enablement*), **Use Cases** (*Sales Training, Onboarding & Certification, Public Speaking, Interviews, Customer Support*), **Resources** (*Sample Speeches, Courses, Coach Directory, Blog, FAQ, Wall of Love*), and **Pricing**.
  - Direct CTAs: `Sign In` (`/signin`), `Get Started Free` (`/signup`), and `Talk to Sales`.
- **Landing Page (`/`)**:
  - Hero section with value proposition (*"Practice high-stakes conversations with AI roleplays"*), interactive scenario preview tabs (*Sales Cold Call*, *Objection Handling*, *Executive Pitch*, *Job Interview*), enterprise trust logos (*Google, Korn Ferry, Dale Carnegie, Toastmasters, ringcentral*), feature deep-dives, security/SOC2 badges, and customer testimonials.
- **Pricing Page (`/pricing`)**:
  - Interactive **Monthly / Annual (Save 20%)** billing toggle.
  - Tier comparison cards (`Free`, `Pro`, `Advanced`, `Enterprise`) with feature matrices and FAQ accordion.
- **Public Sample Speeches (`/sample-speeches`) & Courses (`/courses`)**:
  - Curated gallery of analyzed real-world speeches and communication courses linking directly into interactive feedback reports (`/share/[slug]`).

---

### 3.2 Authentication, Onboarding & Public Shared Speeches
*Visual Reference: `screenshots/app/01-app-root-*.png` through `16-share-metric-*.png`, `auth-onboarding.png`*

- **Sign In (`/signin`) & Sign Up (`/signup`)**:
  - Email + password authentication, SSO buttons (Google, Microsoft, Enterprise SAML SSO), and 1-click **Demo Account Switcher** (Enterprise Admin vs. Sales Rep Member) for frictionless testing.
- **Forgot Password (`/forgot-password`)**:
  - Password reset request flow with confirmation state.
- **Onboarding Flow (`/onboarding`)**:
  - Multi-step personalization wizard selecting primary goal (*Sales & Revenue Enablement, Job Interview Prep, Public Speaking, Leadership & Management*), role, and microphone/camera check.
- **Public Shared Speech Report (`/share/[slug]`)**:
  - Read-only or comment-enabled view of any shared Yoodli recording with full video/audio playback, interactive transcript, **Coaching** tab, and **Analytics** tab.

---

### 3.3 Authenticated Shell & Global Navigation
*Visual Reference: `screenshots/app/auth-home.png`, `auth-home-start-menu.png`*

- **Left Sidebar Navigation**:
  - **Workspace Switcher Pill**: Toggle seamlessly between **Member** view (`/home`) and **Admin** view (`/org/overview`) for users with admin/manager privileges.
  - **Primary `+ Start` Button**: Opens the Practice Mode Selector modal/popover offering:
    1. `Roleplay` (`/roleplays` / `/practice/conversation`)
    2. `Interview` (`/practice/interview`)
    3. `Presentation / Speech` (`/practice/speech`)
    4. `Coaching Session` (`/practice/coach`)
    5. `Upload Recording` (upload `.mp4`/`.mp3`/`.wav` or paste transcript)
  - **Member Nav Links**:
    - `Home` (`/home`)
    - `Roleplays` (`/roleplays`)
    - `Builder` (`/builder`)
    - `Dashboard` (`/dashboard`)
    - `My Recordings` (`/library`)
    - `My Learning` collapsible section: `Programs` (`/org/resources/programs`), `Courses` (`/org/resources/courses`), `Exercises` (`/org/resources/exercises`)
  - **Plan Quota Footer Card**: Displays remaining free/pro Yoodlis (e.g., `46 Yoodlis remaining`) with an `UPGRADE` modal trigger and user profile menu (`/account`, Sign Out).

---

### 3.4 Member Workspace Features

#### A. Member Home (`/home`)
*Visual Reference: `screenshots/app/auth-home.png`*
- Personalized greeting banner (`Hi Alex!`) with quick-start cards.
- **Assigned Programs Carousel**: Shows active enterprise certification programs (e.g., *FY26 Q1 Enterprise Sales Pitch Certification*), due date badge, step progress bar (`2/4 Completed`), and `Continue Program` CTA.
- **Recommended Roleplays Grid**: Color-coded scenario cards (`OBJECTION HANDLING`, `COLD CALL`, `INBOUND DISCOVERY CALL`, `MANAGER PERF REVIEW`, `BEHAVIORAL INTERVIEW`) with AI persona avatars, difficulty badges, and `Practice` button.
- **Recent Recordings Table/Cards**: Quick access to latest analyzed speeches and roleplays with WPM, filler word %, and goal score badges.

#### B. Roleplays Directory (`/roleplays`) & AI Builder (`/builder`)
*Visual Reference: `screenshots/app/auth-roleplays.png`, `auth-builder.png`*
- **Roleplays Directory**:
  - Filter tabs: `All roleplays`, `Organization Roleplays`, `My Roleplays`, `Shared with me`.
  - Category chips (*Sales, Interviews, Leadership, Pitching, Customer Success*) and real-time search.
  - Scenario detail drawer/modal showing AI Persona bio, scenario background, hidden objections, and evaluation rubric goals before starting.
- **AI Roleplay Builder (`/builder`)**:
  - Natural-language AI prompt bar (*"What's your roleplay about? Describe a scenario and we'll generate the persona and rubric with AI"*).
  - Step-by-step configurator: Scenario Title, Category, Background Context, AI Persona selection/creation (Name, Role, Demeanor: *Skeptical, Friendly, Busy Executive, Analytical*, Voice), Starter Prompt, and Evaluation Rubric Goals.

#### C. Live Practice Studio (`/practice/speech`, `/practice/interview`, `/practice/conversation`, `/practice/coach`)
*Visual Reference: `screenshots/app/auth-practice-speech.png`, `auth-practice-interview.png`, `auth-practice-conversation.png`, `auth-practice-coach.png`*
- **Camera & Microphone Preview**: Live WebRTC video feed (with toggleable camera/mic, framing guide overlay for centering/eye contact, and animated audio level visualizer).
- **Multi-Turn AI Conversation Mode (`/practice/conversation` & `/practice/interview`)**:
  - Displays the AI Persona card (avatar, name, title, current emotional/receptivity state).
  - Real-time turn-by-turn dialogue: AI Persona speaks (Web Speech Synthesis + text bubble), user responds via microphone (Web Speech Recognition + MediaRecorder) or quick-type input, and AI dynamically replies with realistic follow-ups or objections.
  - Live real-time nudge chips during recording (e.g., *Slow down (178 WPM)*, *Filler word detected: "um"*, *Good open-ended question!*).
- **Finish & Analyze**: Clicking `Done / End Session` saves the recording, runs the Speech Analytics & Rubric Evaluation engine, and redirects to `/library/[userId]/feedback/[speechId]`.

#### D. Speech Feedback & Analytics Report (`/library/[userId]/feedback/[speechId]` & `/share/[slug]`)
*Visual Reference: `screenshots/app/10-share-NHCkSatH-vp.png` through `16-share-metric-Eye-Contact.png`, `speech-feedback-analytics-tab.png`*
- **Header Bar**: Editable speech title, date/duration, privacy badge (`Private` / `Shared with Link` / `Shared with Org`), `Share` modal, `Download`, and `Practice Again` CTA.
- **Left Column — Media Player & Interactive Transcript**:
  - Video/audio player with playback speed controls and visual timeline markers for filler words, pauses, questions, and coaching comments.
  - Speaker-diarized transcript (User vs. AI Persona) with clickable word timestamps, toggleable highlights for **Filler Words** (purple), **Weak Words** (amber), and **Questions** (blue), plus search.
  - Timestamped user/manager comments thread at the bottom.
- **Right Column — Tab 1: `Coaching`**:
  - **AI Executive Summary**: Overall qualitative synthesis of strengths and areas for improvement.
  - **Goal / Rubric Scorecards**: Evaluates each scenario goal (e.g., *Uncover Budget & Timeline — 4/5*, *Address Security Objection — Passed*, *Confirm Next Steps — 3/5*) with expandable rationale and exact transcript evidence quotes.
  - **AI Rephrase ("How to say it better")**: Side-by-side comparison of what the user said vs. a sharper, more concise AI-rewritten version.
  - **Follow-Up Questions**: Suggested questions the speaker could have asked or might be asked next.
- **Right Column — Tab 2: `Analytics`**:
  - **Word Choice Section**:
    1. `Filler Words`: Total count & percentage (e.g., `4 (2.1%)`), status badge (`Great` < 3%, `Watch out` 3–6%, `High` > 6%), and bar chart breakdown by word (`um`, `uh`, `like`, `you know`).
    2. `Weak Words`: Hedging words count & percentage (`just`, `kind of`, `I think`, `maybe`) with transcript links.
    3. `Conciseness`: Conciseness score % and excess wordiness highlights.
    4. `Top Keywords`: Keyword frequency pills and word cloud badges.
    5. `Questions Asked`: Count of open-ended vs. closed questions asked during the session.
  - **Delivery Section**:
    1. `Pacing`: Average Words Per Minute gauge (`142 WPM — Ideal 120–170 WPM`) + interactive WPM over time line chart.
    2. `Pauses`: Total intentional pauses and longest pause duration.
    3. `Eye Contact`: Percentage gauge (`88% — Good`).
    4. `Centering`: Camera framing score (`94% — Centered`).
    5. `Smiles`: Facial warmth/positivity metric (`62%`).
    6. `Talk-to-Listen Ratio`: Interactive bar showing User talk time % vs. AI Persona talk time %.

#### E. Progress Dashboard (`/dashboard`) & My Recordings Library (`/library`)
*Visual Reference: `screenshots/app/auth-dashboard.png`, `auth-library.png`*
- **Dashboard (`/dashboard`)**:
  - `DAY STREAK` counter and weekly practice calendar.
  - **Skill Snapshot / Trend Graph**: Interactive time-series chart across all past sessions filterable by metric (`All`, `Filler Words`, `Pacing`, `Questions`, `Weak Words`, `Conciseness`, `Centering`, `Smiles`).
  - **Before & After Comparison Card**: Compares the user's baseline recording against their latest recording.
- **My Recordings (`/library`)**:
  - Searchable, filterable table/grid of all user recordings (`All`, `Roleplays`, `Speeches`, `Interviews`, `Uploads`, `Shared with me`), bulk delete, share toggle, and new upload button.

#### F. My Learning: Programs (`/org/resources/programs`), Courses (`/org/resources/courses`), and Communication Games (`/org/resources/exercises` & `/exercises/*`)
*Visual Reference: `screenshots/app/auth-org_resources_programs.png`, `auth-org_resources_programs_prog-1.png`, `auth-org_resources_courses.png`, `auth-org_resources_exercises.png`, `auth-exercise-spin-a-yarn.png` through `auth-exercise-storyteller.png`*
- **Programs**: View enrolled multi-step training programs, expand individual modules (Video Lesson, Knowledge Check, Practice Roleplay, Certification Pitch), view pass criteria, and launch attempts.
- **Courses**: Watch structured coaching video modules (e.g., *MEDDPICC Sales Mastery*, *Executive Presence Fundamentals*, *Behavioral Interview STAR Method*) with completion tracking.
- **Interactive Exercises / Games**:
  1. `Spin a Yarn` (`/exercises/spin-a-yarn`): Speak for 60 seconds while smoothly incorporating random surprise words that pop up every 10 seconds; scored on transitions and fluency.
  2. `Metaphor Mania` (`/exercises/metaphor-mania`): Explain complex concepts using creative analogies under a countdown timer.
  3. `No Filler` (`/exercises/no-filler`): 60-second impromptu speaking survival challenge where any filler word (`um`, `uh`, `like`) triggers a buzzer/penalty; tracks personal high score streak.
  4. `Storyteller` (`/exercises/storyteller`): Build a structured narrative around random visual/topic prompts using the STAR/Hero's Journey arc.

---

### 3.5 Enterprise Organization Admin Suite (`/org/*`)
*Visual Reference: `screenshots/app/auth-org_overview.png` through `auth-org_integrations.png`*

- **Admin Overview (`/org/overview`)**:
  - 30-day KPI cards (`Yoodlis Started`, `Minutes Recorded`, `Active Learners`, `Seat Utilization: 78/100 seats used`).
  - Quick links to create a Program, Roleplay, or Invite Members, plus top-performing members and active programs leaderboard.
- **Admin Analytics (`/org/analytics/overview`, `/programs`, `/goals`, `/roleplays`, `/reports-data`)**:
  - Interactive `Sample data` toggle banner.
  - Charts for Monthly Active Users, Total Recordings, Most Practiced Goals, Program Completion Funnel, and Goal Pass Rate heatmap.
  - One-click **CSV Report Export** (`/org/analytics/reports-data`) for user activity, program completions, and rubric scores.
- **Admin Content Management (`/org/content/*`)**:
  - `Roleplays` (`/org/content/roleplays` & `/create`): Create, edit, publish, or archive organization roleplays.
  - `Personas` (`/org/content/personas` & `/create`): Configure custom buyer/interviewer AI personas with avatar, voice, personality traits, and objection style.
  - `Interviews` (`/org/content/interviews`) & `Question Banks` (`/org/content/question-banks`): Manage structured interview templates and reusable question pools.
  - `Custom Goals` (`/org/content/goals` & `/create`): Create reusable AI evaluation rubrics across 4 Yoodli goal types:
    - **Binary** (Pass / Fail criteria)
    - **Rated** (1–5 scale with anchor descriptions)
    - **Compound** (Weighted combination of sub-criteria)
    - **Knowledge-Based** (Evaluated against uploaded product battlecards/docs)
  - `Programs` (`/org/content/programs`, `/create`, `/[programId]`): Build multi-step certification programs, assign to groups/members, set due dates, and inspect member completion matrices.
  - `Coach Bot` (`/org/content/coachbot`): Interactive RAG knowledge assistant where admins upload battlecards/playbooks and test Q&A or live coaching retrieval.
  - `Files` (`/org/content/files`) & `Learning Materials` (`/org/content/learning-materials`): Asset repository for PDFs, slides, and reference videos.
- **Practice Loops (`/org/loops`)**:
  - Configure recurring automated micro-drills mapped to Focus Areas (`Authority`, `Listening`, `Presence`, `Usage`).
- **People Management (`/org/people/members`, `/invites`, `/groups`, `/reporting-teams`)**:
  - Search/filter members by role (`Admin`, `Manager`, `Member`, `Coach`) and group, invite new users via email/CSV, organize **Groups (Hubs)**, and assign **Reporting Teams**.
- **Organization Settings (`/org/settings`) & Integrations (`/org/integrations`)**:
  - Customize organization name, logo, default recording privacy, AI coaching toggles, and configure integrations (Gong, Chorus, Zoom, Salesforce, HubSpot, Workday, Docebo, SCORM 1.2, Okta SSO/SCIM, API/MCP keys).
