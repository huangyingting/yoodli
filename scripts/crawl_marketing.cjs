const { chromium } = require('playwright');
const fs = require('fs');

const PAGES = [
  { path: '/', name: '01-home' },
  { path: '/platform/roleplays', name: '02-platform-roleplays' },
  { path: '/platform/personas', name: '03-platform-personas' },
  { path: '/platform/create', name: '04-platform-create' },
  { path: '/platform/coach', name: '05-platform-coach' },
  { path: '/platform/measure', name: '06-platform-measure' },
  { path: '/pricing', name: '07-pricing' },
  { path: '/for-business/revenue-teams', name: '08-business-revenue-teams' },
  { path: '/for-business/sales', name: '09-business-sales' },
  { path: '/for-business/learning-and-development', name: '10-business-lnd' },
  { path: '/for-business/corporate-communications', name: '11-business-exec-coaching' },
  { path: '/for-business/leadership', name: '12-business-leadership' },
  { path: '/for-business/engineering', name: '13-business-engineering' },
  { path: '/use-cases/sales-training', name: '14-usecase-sales-training' },
  { path: '/use-cases/onboarding-certification', name: '15-usecase-onboarding' },
  { path: '/use-cases/partner-enablement', name: '16-usecase-partner-enablement' },
  { path: '/use-cases/customer-support', name: '17-usecase-customer-support' },
  { path: '/use-cases/public-speaking', name: '18-usecase-public-speaking' },
  { path: '/use-cases/speech-coaches', name: '19-usecase-speech-coaches' },
  { path: '/sample-speeches', name: '20-sample-speeches' },
  { path: '/courses', name: '21-courses' },
  { path: '/coach-directory', name: '22-coach-directory' },
  { path: '/talk-to-sales', name: '23-talk-to-sales' },
  { path: '/about', name: '24-about' },
  { path: '/faq', name: '25-faq' },
  { path: '/wall-of-love', name: '26-wall-of-love' },
  { path: '/feature-announcements', name: '27-feature-announcements' },
];

(async () => {
  const rawCreds = JSON.parse(fs.readFileSync('/home/azadmin/yoodli/.cred', 'utf8'));
  const cookies = rawCreds.map(c => ({
    name: c.name,
    value: c.value,
    domain: c.domain,
    path: c.path || '/',
    secure: Boolean(c.secure),
    httpOnly: Boolean(c.httpOnly),
    sameSite: c.sameSite ? (String(c.sameSite).toLowerCase() === 'strict' ? 'Strict' : 'Lax') : 'Lax',
  }));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });
  await context.addCookies(cookies);
  const page = await context.newPage();

  const metadata = [];

  for (const item of PAGES) {
    const url = `https://yoodli.ai${item.path}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      // Dismiss cookie banner if visible
      const acceptBtn = page.locator('button:has-text("Accept All"), .cky-btn-accept');
      if (await acceptBtn.count() > 0 && await acceptBtn.first().isVisible().catch(() => false)) {
        await acceptBtn.first().click().catch(() => {});
        await page.waitForTimeout(500);
      }
      await page.screenshot({ path: `/home/azadmin/yoodli/screenshots/marketing/${item.name}.png`, fullPage: false });
      await page.screenshot({ path: `/home/azadmin/yoodli/screenshots/marketing/${item.name}-full.png`, fullPage: true });
      const info = await page.evaluate(() => ({
        title: document.title,
        h1: Array.from(document.querySelectorAll('h1')).map(e => e.innerText.trim()),
        h2: Array.from(document.querySelectorAll('h2')).map(e => e.innerText.trim()).slice(0, 12),
        tabsOrButtons: Array.from(document.querySelectorAll('[role="tab"], button')).map(e => e.innerText.trim()).filter(Boolean).slice(0, 20)
      }));
      console.log(`Captured ${item.name}: ${info.title}`);
      metadata.push({ ...item, url: page.url(), ...info });
    } catch (e) {
      console.error(`Failed ${item.name}:`, e.message);
    }
  }

  // Also test interactive tabs on home page and pricing page
  try {
    await page.goto('https://yoodli.ai/pricing', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    const toggles = page.locator('[role="tab"], button');
    const count = await toggles.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const t = toggles.nth(i);
      const txt = (await t.innerText().catch(() => '')).trim();
      if (/monthly|annual|individual|business|enterprise/i.test(txt) && await t.isVisible().catch(() => false)) {
        await t.click().catch(() => {});
        await page.waitForTimeout(800);
        const safe = txt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
        await page.screenshot({ path: `/home/azadmin/yoodli/screenshots/marketing/07-pricing-toggle-${safe}.png`, fullPage: false });
      }
    }
  } catch (e) {}

  fs.writeFileSync('/home/azadmin/yoodli/screenshots/marketing/metadata.json', JSON.stringify(metadata, null, 2));
  await browser.close();
})();
