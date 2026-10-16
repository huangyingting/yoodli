import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUT_DIR = path.join(process.cwd(), "screenshots", "clone-verified");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function runVerification() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const results = [];
  const checkRoute = async (routePath, label, interactionFn) => {
    const url = `${BASE_URL}${routePath}`;
    const res = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    const status = res ? res.status() : 0;
    await page.waitForTimeout(250);
    if (interactionFn) {
      await interactionFn(page);
      await page.waitForTimeout(250);
    }
    const safeName = label.replace(/[^a-z0-9-_]/gi, "_").toLowerCase();
    const shotPath = path.join(OUT_DIR, `${safeName}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`✓ [${status}] ${routePath} -> ${label}`);
    if (status >= 400) {
      throw new Error(`Route ${routePath} returned HTTP ${status}`);
    }
    results.push({ routePath, label, status, screenshot: shotPath });
  };

  try {
    // 1. Marketing & Public Pages
    await checkRoute("/", "01_marketing_home");
    await checkRoute("/pricing", "02_marketing_pricing", async (p) => {
      const btn = p.locator("button:has-text('Annual')");
      if (await btn.count()) await btn.first().click();
    });
    await checkRoute("/sample-speeches", "03_sample_speeches");
    await checkRoute("/courses", "04_public_courses");

    // 2. Public Shared Speech Report & Interactive Analytics Tabs
    await checkRoute("/share/NHCkSatH", "05_share_speech_report", async (p) => {
      await p.click("[data-testid='tab-analytics']");
      await p.waitForSelector("[data-testid='analytics-panel']");
    });

    // 3. Auth & Onboarding Flows
    await checkRoute("/signin", "06_auth_signin");
    await checkRoute("/signup", "07_auth_signup");
    await checkRoute("/forgot-password", "08_auth_forgot_password");
    await checkRoute("/onboarding", "09_onboarding_wizard");

    // 4. Member Workspace Core Routes
    await checkRoute("/home", "10_member_home");
    await checkRoute("/roleplays", "11_member_roleplays");
    await checkRoute("/builder", "12_ai_roleplay_builder", async (p) => {
      await p.click("[data-testid='builder-ai-generate-btn']");
      await p.waitForTimeout(300);
    });
    await checkRoute("/dashboard", "13_member_dashboard");
    await checkRoute("/library", "14_member_library");
    await checkRoute(
      "/library/user-alex/feedback/speech-nhck",
      "15_member_speech_feedback",
      async (p) => {
        await p.click("[data-testid='tab-coaching']");
        await p.waitForSelector("[data-testid='coaching-panel']");
      }
    );
    await checkRoute("/account", "16_account_settings");

    // 5. All 4 Practice Studios + Live AI Turn & Speech Analytics Evaluation
    await checkRoute(
      "/practice/conversation",
      "17_practice_conversation_studio",
      async (p) => {
        await p.click("[data-testid='send-turn-btn']");
        await p.waitForTimeout(400);
      }
    );
    await checkRoute("/practice/interview", "18_practice_interview_studio");
    await checkRoute("/practice/speech", "19_practice_speech_studio");
    await checkRoute("/practice/coach", "20_practice_coach_studio");

    // 6. My Learning & 4 Interactive Speaking Games
    await checkRoute("/org/resources/programs", "21_my_learning_programs");
    await checkRoute(
      "/org/resources/programs/prog-fy26-sales",
      "22_my_learning_program_detail"
    );
    await checkRoute("/org/resources/courses", "23_my_learning_courses");
    await checkRoute("/org/resources/exercises", "24_my_learning_exercises");
    await checkRoute("/exercises/spin-a-yarn", "25_game_spin_a_yarn", async (p) => {
      await p.click("[data-testid='instant-score-exercise-btn']");
      await p.waitForSelector("[data-testid='exercise-score-banner']");
    });
    await checkRoute("/exercises/metaphor-mania", "26_game_metaphor_mania");
    await checkRoute("/exercises/no-filler", "27_game_no_filler");
    await checkRoute("/exercises/storyteller", "28_game_storyteller");

    // 7. Enterprise Organization Admin Suite (/org/*)
    await checkRoute("/org/overview", "29_org_admin_overview");
    await checkRoute("/org/analytics/overview", "30_org_analytics_overview", async (p) => {
      await p.click("[data-testid='export-csv-btn']");
    });
    await checkRoute("/org/analytics/programs", "31_org_analytics_programs");
    await checkRoute("/org/analytics/goals", "32_org_analytics_goals");
    await checkRoute("/org/analytics/roleplays", "33_org_analytics_roleplays");
    await checkRoute("/org/analytics/reports-data", "34_org_analytics_reports_data");

    await checkRoute("/org/content/roleplays", "35_org_content_roleplays");
    await checkRoute("/org/content/roleplays/create", "36_org_content_roleplays_create");
    await checkRoute("/org/content/personas", "37_org_content_personas");
    await checkRoute("/org/content/personas/create", "38_org_content_personas_create");
    await checkRoute("/org/content/interviews", "39_org_content_interviews");
    await checkRoute("/org/content/question-banks", "40_org_content_question_banks");
    await checkRoute("/org/content/goals", "41_org_content_goals");
    await checkRoute("/org/content/goals/create", "42_org_content_goals_create");
    await checkRoute("/org/content/programs", "43_org_content_programs");
    await checkRoute("/org/content/programs/create", "44_org_content_programs_create");
    await checkRoute(
      "/org/content/programs/prog-fy26-sales",
      "45_org_content_program_detail"
    );
    await checkRoute("/org/content/coachbot", "46_org_content_coachbot", async (p) => {
      await p.click("[data-testid='ask-coachbot-btn']");
      await p.waitForSelector("[data-testid='coachbot-answer-box']");
    });
    await checkRoute("/org/content/files", "47_org_content_files");
    await checkRoute(
      "/org/content/learning-materials",
      "48_org_content_learning_materials"
    );
    await checkRoute("/org/loops", "49_org_loops");
    await checkRoute("/org/people/members", "50_org_people_members");
    await checkRoute("/org/people/members/invites", "51_org_people_invites");
    await checkRoute("/org/people/groups", "52_org_people_groups");
    await checkRoute(
      "/org/people/reporting-teams",
      "53_org_people_reporting_teams"
    );
    await checkRoute("/org/settings", "54_org_settings");
    await checkRoute("/org/integrations", "55_org_integrations");

    fs.writeFileSync(
      path.join(OUT_DIR, "verification-manifest.json"),
      JSON.stringify(results, null, 2)
    );
    console.log(`\n🎉 Successfully verified all ${results.length} routes and interactive flows!`);
  } finally {
    await browser.close();
  }
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
