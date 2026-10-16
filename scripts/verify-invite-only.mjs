import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3105";
const OUT_DIR = path.resolve("screenshots/clone-verified");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("1. Verifying /register blocks uninvited direct registration (403 invitation_required)...");
  await page.goto(`${BASE_URL}/register`, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(OUT_DIR, "56-register-invite-only-policy.png"),
    fullPage: true,
  });

  const uninvitedRes = await page.request.post(`${BASE_URL}/api/auth/register`, {
    data: {
      name: "Uninvited User",
      email: "uninvited@acme.io",
      password: "UninvitedPassword2026!",
    },
  });
  const uninvitedBody = await uninvitedRes.json();
  if (uninvitedRes.status() !== 403 || uninvitedBody.error !== "invitation_required") {
    throw new Error(
      `Expected 403 invitation_required, got ${uninvitedRes.status()}: ${JSON.stringify(uninvitedBody)}`
    );
  }
  console.log("   ✓ Direct uninvited POST /api/auth/register rejected with 403 invitation_required");

  console.log("2. Verifying pre-seeded demo invitation page (/invite/demo-invite-token-2026)...");
  await page.goto(`${BASE_URL}/invite/demo-invite-token-2026`, {
    waitUntil: "networkidle",
  });
  await page.waitForSelector('[data-testid="accept-invitation-submit-btn"]');
  await page.screenshot({
    path: path.join(OUT_DIR, "57-invite-accept-demo-token.png"),
    fullPage: true,
  });
  console.log("   ✓ Demo invitation token inspected and rendered for invited@acme.io");

  console.log("3. Verifying /admin/invitations: creating a new one-time invitation...");
  await page.goto(`${BASE_URL}/admin/invitations`, { waitUntil: "networkidle" });
  const testEmail = `ae.invited.${Date.now()}@acme.io`;
  await page.fill('[data-testid="invite-email-input"]', testEmail);
  await page.click('[data-testid="issue-invite-btn"]');
  await page.waitForSelector('[data-testid="latest-grant-card"]');
  await page.screenshot({
    path: path.join(OUT_DIR, "58-admin-invitations-grant-issued.png"),
    fullPage: true,
  });

  const inviteUrl = await page
    .locator('[data-testid="generated-invite-url"]')
    .inputValue();
  console.log(`   ✓ Issued one-time invite URL: ${inviteUrl}`);

  console.log("4. Accepting the newly issued one-time invitation and registering account...");
  await page.click('[data-testid="open-generated-invite-link"]');
  await page.waitForSelector('[data-testid="invite-name-input"]');
  await page.fill('[data-testid="invite-name-input"]', "Jordan Taylor (Invited AE)");
  await page.fill('[data-testid="invite-password-input"]', "YoodliInvited2026!");
  await page.click('[data-testid="accept-invitation-submit-btn"]');
  await page.waitForURL("**/onboarding", { timeout: 15000 });
  await page.screenshot({
    path: path.join(OUT_DIR, "59-invite-accepted-onboarding.png"),
    fullPage: true,
  });
  console.log("   ✓ Invitation accepted, user registered + signed in, redirected to /onboarding");

  console.log("5. Verifying single-use token consumption (re-visiting used invite link)...");
  await page.goto(inviteUrl, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="invitation-status-unavailable"]');
  await page.screenshot({
    path: path.join(OUT_DIR, "60-invite-single-use-consumed.png"),
    fullPage: true,
  });
  console.log("   ✓ Consumed invitation token properly shows unavailable/accepted status");

  await browser.close();
  console.log("All invite-only account admission E2E checks passed!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
