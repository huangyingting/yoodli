const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const OUT_DIR = '/home/azadmin/yoodli/screenshots/app';
fs.mkdirSync(OUT_DIR, { recursive: true });

// 1. Patch bundle-2.js (5894.83b1c26e.js) to bypass runtypes .check() validation
const b2Orig = fs.readFileSync('/home/azadmin/yoodli/scripts/bundles/bundle-2.js', 'utf8').replace(/\/\/ URL:.*\n/, '');
const rtTarget = 'function n(e){var n=t.validate(e);if(n.success)return n.value;throw new o.ValidationError(n)}';
const b2Patched = b2Orig.replace(rtTarget, () => 'function n(e){return e}');
new vm.Script(b2Patched);

// 2. Patch bundle-0.js (main.c40aba34.js)
let b0Patched = fs.readFileSync('/home/azadmin/yoodli/scripts/bundles/bundle-0.js', 'utf8').replace(/\/\/ URL:.*\n/, '');

// Patch 374257.H (currentUser)
const target374257 = 'function c(){return(0,r.xI)().currentUser}';
const replacement374257 = 'const mockUser={uid:"user-123",email:"alex.rivera@acmecorp.com",displayName:"Alex Rivera",photoURL:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",emailVerified:!0,isAnonymous:!1,metadata:{creationTime:"2024-01-01T00:00:00Z",lastSignInTime:"2025-02-25T00:00:00Z"},providerData:[{providerId:"google.com",uid:"alex.rivera@acmecorp.com",displayName:"Alex Rivera",email:"alex.rivera@acmecorp.com"}],getIdToken:async()=>"mock-jwt-token",getIdTokenResult:async()=>({token:"mock-jwt-token",claims:{}}),reload:async()=>{}};function c(){return mockUser}';
b0Patched = b0Patched.replace(target374257, () => replacement374257);

// Patch 592620 constructor so userDocs are immediately resolved with Yoodli's real defaults
const target592620Ctor = 'constructor(){this.liveUserDocsReadyPromise=new Promise(e=>{this.liveUserDocsReadyResolver=()=>{e()}}),(0,n.hg)((0,n.xI)(),()=>{this.resetLiveUserDocsOnAuthChange()})}';
const replacement592620Ctor = 'constructor(){this.setUserDocsWithDefaults({},{onboardingAnswers:{role:"Sales"},lastUserOrgProfile:"Individual"},{usedSpeeches:4,usageQuota:50},{});this.liveUserDocsReadyPromise=Promise.resolve();this.liveUserDocsReadyResolver=()=>{};}';
if (!b0Patched.includes(target592620Ctor)) throw new Error('target592620Ctor missing');
b0Patched = b0Patched.replace(target592620Ctor, () => replacement592620Ctor);

// Patch 502618 (Firestore hooks & queries)
const idx502618 = b0Patched.indexOf('502618(e,t,o){"use strict";');
const idx504787 = b0Patched.indexOf(',504787(e,t,o){"use strict";', idx502618);
const target502618 = b0Patched.slice(idx502618, idx504787);
const replacement502618 = '502618(e,t,o){"use strict";o.d(t,{$l:()=>d,LD:()=>a,VD:()=>p,W2:()=>c,XE:()=>i,f6:()=>s,iF:()=>l});function a(e){return[void 0,{loading:!1,error:void 0}]}function i(e,t,o){try{t({id:"mock-doc",data:{onboardingAnswers:{role:"Sales"},lastUserOrgProfile:"Individual"}})}catch(err){}return()=>{}}function s(e,t,o){try{t([])}catch(err){}return()=>{}}async function l(e){return{id:"mock-doc",data:{onboardingAnswers:{role:"Sales"},lastUserOrgProfile:"Individual"}}}async function c(e,t){return[]}function d(e){return[[],{loading:!1,error:void 0}]}function p(e,t,o){return[[],{loading:!1,error:void 0}]}}';
// Patch 502618 so permission-denied on private user docs/collections falls back to mock data instead of setting error
const target502618Err = 'e=>{l(e),i(!1)}';
b0Patched = b0Patched.replace(target502618Err, () => 'e=>{o({id:"user-123",data:{onboardingAnswers:{role:"Sales"},lastUserOrgProfile:"Individual"}}),i(!1)}');
b0Patched = b0Patched.replace(target502618Err, () => 'e=>{o([]),i(!1)}');
b0Patched = b0Patched.replace('e=>{d(e),l(!1)}', () => 'e=>{i([]),l(!1)}');
const target502618GetDoc = 'async function l(e){const t=await(0,r.x7)((0,r.H9)((0,r.aU)(),e));return t.exists()?{id:t.id,data:t.data()}:void 0}';
b0Patched = b0Patched.replace(target502618GetDoc, () => 'async function l(e){try{const t=await(0,r.x7)((0,r.H9)((0,r.aU)(),e));return t.exists()?{id:t.id,data:t.data()}:void 0}catch(err){return{id:"user-123",data:{onboardingAnswers:{role:"Sales"},lastUserOrgProfile:"Individual"}}}}');
const target502618GetCol = 'async function c(e,t){const o=(0,r.rJ)((0,r.aU)(),e);return(await(0,r.GG)(t?t(o):o)).docs.map(e=>({id:e.id,data:e.data()}))}';
b0Patched = b0Patched.replace(target502618GetCol, () => 'async function c(e,t){try{const o=(0,r.rJ)((0,r.aU)(),e);return(await(0,r.GG)(t?t(o):o)).docs.map(e=>({id:e.id,data:e.data()}))}catch(err){return[]}}');

// Patch Ne route guard
const idxNe = b0Patched.indexOf('const Ne=({children:e})=>{');
const idxLe = b0Patched.indexOf(';var Le=o(750954),', idxNe);
const targetNe = b0Patched.slice(idxNe, idxLe);
b0Patched = b0Patched.replace(targetNe, () => 'const Ne=({children:e})=>e');

// Patch 816041 (User speeches hook Z and async G)
const idx816041 = b0Patched.indexOf('816041(e,t,o){"use strict";');
const idx819896 = b0Patched.indexOf(',819896(e,t,o){"use strict";', idx816041);
const target816041 = b0Patched.slice(idx816041, idx819896);
const replacement816041 = '816041(e,t,o){"use strict";o.d(t,{G:()=>G,Z:()=>Z});const mockSpeeches=[{siteId:"default",userId:"user-123",speechId:"speech-1",data:{name:"Enterprise Q3 Discovery Call - Acme Corp",slug:"speech-1",lifecycleState:"created",recordedDate:Date.now()-7200000,recordingStartDate:Date.now()-7200000,totalTimeS:264,type:"roleplay",interviewType:"sales",orgId:"org-1",visibility:"private",favorite:!0,scenarioId:"scen-1",scenarioName:"Enterprise Discovery & Objection Handling",overallScore:88}},{siteId:"default",userId:"user-123",speechId:"speech-2",data:{name:"Pricing Negotiation with CFO",slug:"speech-2",lifecycleState:"created",recordedDate:Date.now()-93600000,recordingStartDate:Date.now()-93600000,totalTimeS:315,type:"roleplay",interviewType:"sales",orgId:"org-1",visibility:"org",favorite:!1,scenarioId:"scen-2",scenarioName:"Executive Pricing Negotiation",overallScore:92}},{siteId:"default",userId:"user-123",speechId:"speech-3",data:{name:"Product Keynote Practice Run",slug:"speech-3",lifecycleState:"created",recordedDate:Date.now()-259200000,recordingStartDate:Date.now()-259200000,totalTimeS:420,type:"speech",orgId:"org-1",visibility:"private",favorite:!0,overallScore:85}},{siteId:"default",userId:"user-123",speechId:"speech-4",data:{name:"Senior PM Behavioral Interview Prep",slug:"speech-4",lifecycleState:"created",recordedDate:Date.now()-432000000,recordingStartDate:Date.now()-432000000,totalTimeS:510,type:"interview",orgId:"org-1",visibility:"private",favorite:!1,overallScore:79}}];function Z(){return[mockSpeeches,{loading:!1,error:void 0},()=>{}]}async function G(){return mockSpeeches}}';
b0Patched = b0Patched.replace(target816041, () => replacement816041);

b0Patched = b0Patched.replace('let Va=!1;', () => 'let Va=!0;');
b0Patched = b0Patched.replace('function x(e){let t=0;for(let o=0;o<e.length;o++)', () => 'function x(e=""){e=String(e||"");let t=0;for(let o=0;o<e.length;o++)');
new vm.Script(b0Patched);
console.log('Both bundles patched and verified via vm.Script!');

const mockScenarios = [
  {
    id: 'scen-1',
    org_id: 'org-1',
    space_id: 'space-1',
    title: 'Enterprise Discovery & Objection Handling',
    name: 'Enterprise Discovery & Objection Handling',
    description: 'Practice uncovering key business pain points and handling budget and security objections from a skeptical VP of Engineering.',
    tagline: 'Uncover pain points and handle tough budget objections',
    type: 'roleplay',
    scenarioTypeId: 'objection_handling',
    scenario_type_id: 'objection_handling',
    category: 'Sales',
    difficulty: 'Intermediate',
    enabled: true,
    isTemplate: false,
    is_template: false,
    visibility: 'org',
    created_date: '2025-02-01T10:00:00Z',
    updated_date: '2025-02-15T10:00:00Z',
    tags: ['Sales', 'Discovery', 'Objection Handling'],
    member_data: { has_practiced: true, num_practices: 3, last_practiced_date: '2025-02-24T10:00:00Z' },
    persona: {
      id: 'pers-1',
      name: 'Marcus Vance',
      role: 'VP of Engineering',
      job_title: 'VP of Engineering at GlobalTech',
      demeanor: 'Skeptical & Analytical',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      profile_picture_signed_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      voice_id: 'en-US-Neural2-D'
    },
    personas: [{
      id: 'pers-1',
      name: 'Marcus Vance',
      job_title: 'VP of Engineering at GlobalTech',
      demeanor: 'Skeptical & Analytical',
      profile_picture_signed_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
    }],
    goals: [
      { id: 'g-1', title: 'Ask at least 3 open-ended discovery questions', name: 'Open-ended Discovery', description: 'Uncover current workflow bottlenecks before pitching.' },
      { id: 'g-2', title: 'Address SOC2 & data privacy concerns clearly', name: 'Security Assurance', description: 'Explain enterprise encryption and zero-retention policies.' },
      { id: 'g-3', title: 'Secure commitment for a technical deep-dive', name: 'Next Steps Commitment', description: 'Lock in a calendar invite with the security architect.' }
    ]
  },
  {
    id: 'scen-2',
    org_id: 'org-1',
    space_id: 'space-1',
    title: 'Executive Pricing & Renewal Negotiation',
    name: 'Executive Pricing & Renewal Negotiation',
    description: 'Defend value and negotiate a multi-year enterprise renewal with a cost-conscious Chief Financial Officer.',
    tagline: 'Defend value and close a multi-year enterprise renewal',
    type: 'roleplay',
    scenarioTypeId: 'cold_call',
    scenario_type_id: 'cold_call',
    category: 'Sales',
    difficulty: 'Advanced',
    enabled: true,
    isTemplate: false,
    is_template: false,
    visibility: 'org',
    created_date: '2025-02-03T10:00:00Z',
    updated_date: '2025-02-18T10:00:00Z',
    tags: ['Negotiation', 'Renewal', 'Executive'],
    member_data: { has_practiced: true, num_practices: 2, last_practiced_date: '2025-02-23T14:00:00Z' },
    persona: {
      id: 'pers-2',
      name: 'Elena Rostova',
      role: 'Chief Financial Officer',
      job_title: 'CFO at FinServe Corp',
      demeanor: 'Direct & Numbers-Driven',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      profile_picture_signed_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      voice_id: 'en-US-Neural2-F'
    },
    personas: [{
      id: 'pers-2',
      name: 'Elena Rostova',
      job_title: 'CFO at FinServe Corp',
      demeanor: 'Direct & Numbers-Driven',
      profile_picture_signed_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'
    }],
    goals: [
      { id: 'g-4', title: 'Quantify ROI from the past 12 months', name: 'Quantify ROI', description: 'Anchor the conversation on measurable productivity gains.' },
      { id: 'g-5', title: 'Protect margin by trading multi-year term for discount', name: 'Protect Margin', description: 'Do not concede more than 10% without a 24-month commitment.' }
    ]
  },
  {
    id: 'scen-3',
    org_id: 'org-1',
    space_id: 'space-1',
    title: 'Difficult Manager Performance Feedback',
    name: 'Difficult Manager Performance Feedback',
    description: 'Deliver constructive, empathetic feedback to a high-potential team member who has missed recent sprint deadlines.',
    tagline: 'Deliver candid, empathetic coaching to a direct report',
    type: 'roleplay',
    scenarioTypeId: 'manager_perf_review',
    scenario_type_id: 'manager_perf_review',
    category: 'Leadership',
    difficulty: 'Intermediate',
    enabled: true,
    isTemplate: false,
    is_template: false,
    visibility: 'org',
    created_date: '2025-02-05T10:00:00Z',
    updated_date: '2025-02-19T10:00:00Z',
    tags: ['Leadership', 'Management', 'Feedback'],
    member_data: { has_practiced: false, num_practices: 0 },
    persona: {
      id: 'pers-3',
      name: 'Jordan Taylor',
      role: 'Senior Software Engineer',
      job_title: 'Senior Software Engineer',
      demeanor: 'Defensive & Overwhelmed',
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
      profile_picture_signed_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
      voice_id: 'en-US-Neural2-J'
    },
    personas: [{
      id: 'pers-3',
      name: 'Jordan Taylor',
      job_title: 'Senior Software Engineer',
      demeanor: 'Defensive & Overwhelmed',
      profile_picture_signed_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200'
    }],
    goals: [
      { id: 'g-6', title: 'Cite specific examples using the SBI framework', name: 'SBI Framework', description: 'Describe Situation, Behavior, and Impact objectively.' },
      { id: 'g-7', title: 'Co-create an actionable recovery plan', name: 'Action Plan', description: 'Agree on clear milestones for the next two weeks.' }
    ]
  }
];

const mockPrograms = [
  {
    id: 'prog-1',
    org_id: 'org-1',
    space_id: 'space-1',
    name: 'FY26 Q1 Enterprise Sales Pitch Certification',
    title: 'FY26 Q1 Enterprise Sales Pitch Certification',
    description: 'Master our updated enterprise value proposition, discovery framework, and competitive objection handling.',
    state: 'published',
    status: 'in_progress',
    created_date: '2025-01-15T10:00:00Z',
    published_date: '2025-01-20T10:00:00Z',
    due_date: '2026-04-30T23:59:59Z',
    banner_image_signed_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
    num_enrolled: 48,
    num_completed: 34,
    hub_ids: ['hub-1', 'hub-2'],
    user_counts: { completed: 34, in_progress: 10, not_started: 4, total: 48 },
    user_activity: [
      { state: 'not_started', num_users: 4 },
      { state: 'in_progress', num_users: 10 },
      { state: 'completed', num_users: 34 }
    ],
    leaders: [{ user_id: 'user-123', email: 'alex.rivera@acmecorp.com', display_name: 'Alex Rivera', name: 'Alex Rivera' }],
    plan_steps: [
      { id: 'step-1', title: 'Watch Executive Pitch Messaging Overview', type: 'video', required: true },
      { id: 'step-2', title: 'Enterprise Discovery & Objection Handling Roleplay', type: 'roleplay', scenario_id: 'scen-1', required: true },
      { id: 'step-3', title: 'Executive Pricing Negotiation Roleplay', type: 'roleplay', scenario_id: 'scen-2', required: true }
    ],
    plan_step_results: [
      { step_id: 'step-1', state: 'completed', completed_date: '2025-02-10T12:00:00Z', attempts: 1 },
      { step_id: 'step-2', state: 'in_progress', attempts: 2 }
    ]
  },
  {
    id: 'prog-2',
    org_id: 'org-1',
    space_id: 'space-1',
    name: 'New Manager Coaching & Difficult Conversations Bootcamp',
    title: 'New Manager Coaching & Difficult Conversations Bootcamp',
    description: 'Build confidence in 1:1 performance reviews, empathetic listening, and executive presence.',
    state: 'published',
    status: 'completed',
    created_date: '2025-01-05T10:00:00Z',
    published_date: '2025-01-10T10:00:00Z',
    due_date: '2026-03-31T23:59:59Z',
    banner_image_signed_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
    num_enrolled: 24,
    num_completed: 22,
    hub_ids: ['hub-1'],
    user_counts: { completed: 22, in_progress: 2, not_started: 0, total: 24 },
    user_activity: [
      { state: 'not_started', num_users: 0 },
      { state: 'in_progress', num_users: 2 },
      { state: 'completed', num_users: 22 }
    ],
    leaders: [{ user_id: 'user-123', email: 'alex.rivera@acmecorp.com', display_name: 'Alex Rivera', name: 'Alex Rivera' }],
    plan_steps: [
      { id: 'step-4', title: 'Difficult Manager Performance Feedback', type: 'roleplay', scenario_id: 'scen-3', required: true }
    ],
    plan_step_results: [
      { step_id: 'step-4', state: 'completed', completed_date: '2025-02-14T15:30:00Z', attempts: 1 }
    ]
  }
];

const mockOrg = {
  id: 'org-1',
  name: 'Acme Corp',
  tier: 'enterprise',
  type: 'enterprise',
  subscription_type: 'prepaid',
  license_count: 100,
  num_members: 48,
  effective_role: 'org_owner',
  role: 'org_owner',
  admin_translations_enabled: true,
  has_controller_processor_dpa: true,
  coach_bot_enabled: true,
  hubs: [
    { id: 'hub-1', name: 'Enterprise Sales', hub_role: 'hub_admin', org_default: true, is_default: true, num_members: 32, creation_date: '2025-01-01T00:00:00Z' },
    { id: 'hub-2', name: 'Solutions Engineering', hub_role: 'hub_admin', org_default: false, is_default: false, num_members: 16, creation_date: '2025-01-05T00:00:00Z' }
  ]
};

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    permissions: ['microphone', 'camera']
  });

  await context.route('**/static/js/5894.83b1c26e.js*', async route => {
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: b2Patched });
  });

  await context.route('**/static/js/main.c40aba34.js*', async route => {
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: b0Patched });
  });

  await context.route('**/api/**', async route => {
    const url = route.request().url();
    const u = new URL(url);
    const p = u.pathname;

    if (p.endsWith('/users/me')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-123',
          email: 'alex.rivera@acmecorp.com',
          display_name: 'Alex Rivera',
          onboarding_complete: true,
          show_org_admin_ux: true,
          site_admin_roles: ['developer_admin'],
          admin_enterprise_ids: ['ent-1'],
          pending_org_invites: [],
          default_org_info: {
            org_id: 'org-1',
            org_name: 'Acme Corp',
            org_tier: 'enterprise',
            org_type: 'enterprise',
            effective_role: 'org_owner',
            show_org_admin_ux: true,
            allow_yoodli_support: true,
            use_custom_help_page: false,
            default_sharing_visibility: 'org',
            sign_up_notice_accepted: true,
            scim_awaiting_group: false
          },
          feature_flags: {
            interview_enabled: true,
            presentation_enabled: true,
            roleplay_enabled: true,
            roleplay_discovery_enabled: true,
            roleplay_sharing_enabled: true,
            zoodli_for_users_enabled: true,
            member_builder_enabled: true,
            video_upload_enabled: true,
            goals_enabled: true,
            tavus_enabled: true,
            anam_enabled: true,
            learning_journeys_beta_enabled: true,
            loops_visibility: 'other_materials',
            call_ingestion_configured: true
          }
        })
      });
    }

    if (p.includes('/users/me/programs')) {
      const memberPrograms = mockPrograms.map(pr => ({
        ...pr,
        state: pr.status,
        plan_step_results: [
          { step_id: 'step-1', type: 'file', state: 'completed', completed_date: '2025-02-10T12:00:00Z', attempts: [] },
          { step_id: 'step-2', type: 'scenario', state: 'in_progress', attempts: [{ speech_id: 'speech-1', score: 88 }] }
        ]
      }));
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ programs: memberPrograms, contentArray: memberPrograms })
      });
    }

    if (p.includes('/programs/prog-1')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPrograms[0])
      });
    }

    if (p.includes('/programs')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ programs: mockPrograms, contentArray: mockPrograms })
      });
    }

    if (p.includes('/scenarios') || p.includes('/shared_scenarios') || p.includes('/scenario_shares')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          contentArray: mockScenarios,
          scenarios: mockScenarios,
          shares: []
        })
      });
    }

    if (p.includes('/persona')) {
      const personas = mockScenarios.map(s => s.persona);
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ contentArray: personas, personas })
      });
    }

    if (p.includes('/custom_goals') || p.includes('/default_goals') || p.includes('/goals')) {
      const goals = mockScenarios.flatMap(s => s.goals);
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ contentArray: goals, goals, default_goals: goals })
      });
    }

    if (p.includes('/interview_bank')) {
      const banks = [
        { id: 'qb-1', org_id: 'org-1', space_id: 'space-1', title: 'Enterprise Account Executive Interview Bank', name: 'Enterprise AE Questions', questions: ['Tell me about the most complex enterprise deal you closed.', 'How do you handle a prospect going dark after a proposal?'], num_questions: 8, enabled: true },
        { id: 'qb-2', org_id: 'org-1', space_id: 'space-1', title: 'Engineering Leadership Behavioral Questions', name: 'Engineering Leadership Questions', questions: ['Describe a time you had to resolve a conflict between two senior engineers.', 'How do you balance technical debt against product deadlines?'], num_questions: 6, enabled: true }
      ];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ contentArray: banks, interview_banks: banks, banks })
      });
    }

    if (p.includes('/content_member_view') || p.includes('/courses')) {
      const courses = [
        {
          id: 'course-1',
          org_id: 'org-1',
          space_id: 'space-1',
          name: 'MEDDPICC Sales Mastery',
          title: 'MEDDPICC Sales Mastery',
          description: 'Learn how to qualify enterprise opportunities and win complex deals.',
          state: 'ready',
          videos: [
            { id: 'vid-1', title: 'Identifying the Economic Buyer', state: 'ready', duration_seconds: 210 }
          ]
        }
      ];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ courses, demo_videos: [{ id: 'demo-1', title: 'Best-in-Class Discovery Call Demo', state: 'ready', duration_seconds: 185 }] })
      });
    }

    if (p.match(/\/orgs\/org-1\/spaces\/[^/]+$/)) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'space-1',
          name: 'Global Revenue Enablement',
          is_default: true,
          is_global: false,
          admins: [{ user_id: 'user-123', email: 'alex.rivera@acmecorp.com', display_name: 'Alex Rivera' }],
          groups: [
            { id: 'hub-1', name: 'Enterprise Sales', num_members: 32 },
            { id: 'hub-2', name: 'Solutions Engineering', num_members: 16 }
          ]
        })
      });
    }

    if (p.endsWith('/orgs/org-1/spaces')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          spaces: [
            { id: 'space-1', name: 'Global Revenue Enablement', is_default: true, is_global: false, admins: [], num_groups: 2, num_roleplays: 6 },
            { id: 'space-2', name: 'Leadership & Management', is_default: false, is_global: false, admins: [], num_groups: 1, num_roleplays: 3 }
          ]
        })
      });
    }

    if (p.endsWith('/orgs/org-1/hubs_summary')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { hub_id: 'hub-1', id: 'hub-1', name: 'Enterprise Sales', is_default: true, num_members: 32, num_programs: 2 },
          { hub_id: 'hub-2', id: 'hub-2', name: 'Solutions Engineering', is_default: false, num_members: 16, num_programs: 1 }
        ])
      });
    }

    if (p.includes('/orgs/org-1/users') || p.includes('/hubs/hub-1/users')) {
      const users = [
        { user_id: 'user-123', id: 'user-123', email: 'alex.rivera@acmecorp.com', name: 'Alex Rivera', display_name: 'Alex Rivera', first_name: 'Alex', last_name: 'Rivera', effective_role: 'org_owner', role: 'org_owner', num_started_speeches: 24, num_completed_programs: 2, date_joined: '2024-01-10T00:00:00Z', date_last_activity: '2025-02-25T14:20:00Z', last_active_date: '2025-02-25T14:20:00Z', expiration_date: null, seat_inactive: false, hubs: [{ hub_id: 'hub-1', id: 'hub-1', name: 'Enterprise Sales', role: 'hub_admin' }] },
        { user_id: 'user-124', id: 'user-124', email: 'sarah.chen@acmecorp.com', name: 'Sarah Chen', display_name: 'Sarah Chen', first_name: 'Sarah', last_name: 'Chen', effective_role: 'org_admin', role: 'org_admin', num_started_speeches: 19, num_completed_programs: 2, date_joined: '2024-02-15T00:00:00Z', date_last_activity: '2025-02-24T18:10:00Z', last_active_date: '2025-02-24T18:10:00Z', expiration_date: null, seat_inactive: false, hubs: [{ hub_id: 'hub-1', id: 'hub-1', name: 'Enterprise Sales', role: 'hub_admin' }] },
        { user_id: 'user-125', id: 'user-125', email: 'marcus.johnson@acmecorp.com', name: 'Marcus Johnson', display_name: 'Marcus Johnson', first_name: 'Marcus', last_name: 'Johnson', effective_role: 'hub_member', role: 'hub_member', num_started_speeches: 15, num_completed_programs: 1, date_joined: '2024-03-01T00:00:00Z', date_last_activity: '2025-02-23T09:45:00Z', last_active_date: '2025-02-23T09:45:00Z', expiration_date: null, seat_inactive: false, hubs: [{ hub_id: 'hub-1', id: 'hub-1', name: 'Enterprise Sales', role: 'hub_member' }] },
        { user_id: 'user-126', id: 'user-126', email: 'priya.patel@acmecorp.com', name: 'Priya Patel', display_name: 'Priya Patel', first_name: 'Priya', last_name: 'Patel', effective_role: 'hub_member', role: 'hub_member', num_started_speeches: 12, num_completed_programs: 1, date_joined: '2024-04-12T00:00:00Z', date_last_activity: '2025-02-22T16:30:00Z', last_active_date: '2025-02-22T16:30:00Z', expiration_date: null, seat_inactive: false, hubs: [{ hub_id: 'hub-2', id: 'hub-2', name: 'Solutions Engineering', role: 'hub_member' }] }
      ];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ users, total: 48, next: false })
      });
    }

    if (p.includes('/invites')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          invites: [
            { id: 'inv-1', email: 'david.kim@acmecorp.com', role: 'hub_member', created_date: '2025-02-20T10:00:00Z', hubs: [{ hub_id: 'hub-1', id: 'hub-1', name: 'Enterprise Sales' }] }
          ],
          total: 1,
          next: false
        })
      });
    }

    if (p.includes('/reports')) {
      const reportDataJson = JSON.stringify([
        {
          active_users: 44,
          total_users: 48,
          total_speeches: 312,
          avg_speeches_per_user: 6.5,
          avg_score: 86,
          num_active_users_current_window: 44,
          num_active_users_prior_window: 36,
          num_total_recordings_current_window: 312,
          num_total_recordings_prior_window: 245,
          most_practiced_goal_name: 'Open-ended Discovery',
          num_most_practiced_goal_unique_members: 38,
          program_id: 'prog-1',
          program_name: 'FY26 Q1 Enterprise Sales Pitch Certification',
          goal_id: 'g-1',
          goal_name: 'Open-ended Discovery',
          avg_score_percentage_current_window: 88,
          avg_score_percentage_prior_window: 74
        }
      ]);
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: reportDataJson,
          reports: [
            {
              id: 'rep-1',
              report_type: 'engagement_overview',
              state: 'rendered',
              created_date: '2025-02-25T00:00:00Z',
              data: reportDataJson
            }
          ]
        })
      });
    }

    if (p.includes('/speeches')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          speeches: [
            { id: 'speech-1', speech_id: 'speech-1', title: 'Enterprise Q3 Discovery Call - Acme Corp', name: 'Enterprise Q3 Discovery Call - Acme Corp', user_id: 'user-123', user_name: 'Alex Rivera', user_email: 'alex.rivera@acmecorp.com', recorded_date: '2025-02-25T10:00:00Z', duration: 264, total_time_s: 264, type: 'roleplay', scenario_name: 'Enterprise Discovery & Objection Handling', score: 88 },
            { id: 'speech-2', speech_id: 'speech-2', title: 'Pricing Negotiation with CFO', name: 'Pricing Negotiation with CFO', user_id: 'user-124', user_name: 'Sarah Chen', user_email: 'sarah.chen@acmecorp.com', recorded_date: '2025-02-24T15:30:00Z', duration: 315, total_time_s: 315, type: 'roleplay', scenario_name: 'Executive Pricing & Renewal Negotiation', score: 92 }
          ],
          total: 2,
          next: false
        })
      });
    }

    if (p.includes('/reportCard/analytics') || p.includes('/dashboard/analytics')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          skill_snapshot: {
            overall_score: 88,
            conciseness: 85,
            pacing: 92,
            filler_words: 90,
            clarity: 87
          },
          before_after: {
            filler_percentage_before: 6.2,
            filler_percentage_after: 1.8,
            pacing_before: 178,
            pacing_after: 148
          }
        })
      });
    }

    if (p.includes('/loop_configs') || p.includes('/loops')) {
      const loops = [
        {
          loop_config_id: 'loop-1',
          id: 'loop-1',
          org_id: 'org-1',
          space_id: 'space-1',
          name: 'Weekly Competitor Battlecard Drill',
          description: 'Quick 3-minute rapid-fire objection drill on new competitor positioning.',
          state: 'published',
          status: 'ready',
          enabled: true,
          created_date: '2025-02-10T10:00:00Z',
          created_by_display_name: 'Alex Rivera',
          active_focus_area_name: 'Objection Handling & Competitive Positioning',
          focus_area_info: [
            { id: 'fa-1', name: 'Objection Handling & Competitive Positioning', duration_days: 14, goal_names: ['Open-ended Discovery', 'Security Assurance'] }
          ],
          hub_info: [
            { id: 'hub-1', name: 'Enterprise Sales' }
          ]
        }
      ];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ loop_configs: loops, loops })
      });
    }

    if (p.endsWith('/orgs/org-1')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrg)
      });
    }

    if (p.endsWith('/v2/orgs') || p.endsWith('/orgs')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ orgs: [mockOrg] })
      });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'ok',
        data: [],
        items: [],
        results: [],
        files: [],
        coachbots: [],
        coachBots: [
          {
            botId: 'bot-1',
            id: 'bot-1',
            name: 'Acme Enterprise Sales CoachBot',
            description: 'Trained on Acme MEDDPICC playbooks, competitive battlecards, and pricing sheets.',
            isDefault: true,
            status: 'ready',
            createdDate: '2025-02-01T10:00:00Z'
          }
        ],
        teams: [],
        courses: [],
        demo_videos: [],
        integrations: [],
        urls: [
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400'
        ]
      })
    });
  });

  await context.addInitScript(() => {
    try {
      localStorage.setItem('analytics_show_sample_data', 'true');
      localStorage.setItem('manager_dashboard_show_sample_data', 'true');
    } catch (e) {}
  });

  const page = await context.newPage();
  page.on('pageerror', err => console.log('PAGEERROR:', err.message));
  page.on('console', msg => { if (msg.type() === 'error' && !msg.text().includes('Content Security Policy') && !msg.text().includes('Fetch API cannot load')) console.log('CONSOLE_ERR:', msg.text()); });

  const routesToTest = [
    '/org/loops',
    '/org/resources/programs/prog-1'
  ];

  for (const r of routesToTest) {
    try {
      await page.goto('https://app.yoodli.ai' + r, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(4500);
      const url = page.url();
      const text = await page.evaluate(() => document.body ? document.body.innerText.replace(/\s+/g, ' ').slice(0, 350) : '');
      console.log(`ROUTE ${r} -> ${url}`);
      console.log(`  TEXT: ${text}`);
      const slug = r.replace(/^\//, '').replace(/[\/?=&]/g, '_');
      await page.screenshot({ path: path.join(OUT_DIR, `auth-${slug}.png`) });
    } catch (e) {
      console.log(`ERR ${r}: ${e.message}`);
    }
  }

  await browser.close();
})();
