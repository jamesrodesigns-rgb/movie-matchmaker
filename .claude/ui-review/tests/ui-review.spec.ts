import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import routes from '../config/routes-under-test.json' assert { type: 'json' };
import { injectAxe, runAxe } from '../scripts/injectAxe.js';
import { summarizeAxe } from '../scripts/accessibility.js';

const ARTIFACTS = path.resolve(__dirname, '../artifacts');
const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-');
const RUN_DIR = path.join(ARTIFACTS, RUN_ID);

test.beforeAll(async () => {
  fs.mkdirSync(RUN_DIR, { recursive: true });
});

// Collect console + pageerrors as health signals
test.beforeEach(async ({ page }, testInfo) => {
  const logPath = path.join(RUN_DIR, `${sanitize(testInfo.title)}.console.jsonl`);
  const write = (line: any) => fs.appendFileSync(logPath, JSON.stringify(line) + '\n');

  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) {
      write({ type: msg.type(), text: msg.text() });
    }
  });
  page.on('pageerror', (err) => write({ type: 'pageerror', err: String(err) }));
});

for (const route of routes as string[]) {
  test.describe(`Route ${route}`, () => {
    test(`visit ${route} → no hard errors, screenshot, optional a11y`, async ({ page, browserName }, testInfo) => {
      const url = new URL(route, testInfo.project.use?.baseURL as string).toString();
      await page.goto(url, { waitUntil: 'networkidle' });

      // Quick network health check on critical resources
      const consoleErrorsBefore = testInfo.attachments.length;

      // Smoke checks (customize as needed)
      await expect(page).toHaveURL(new RegExp(route.replace(/\//g, '\\/')));
      // Example: assert document has a landmark or main content
      const hasMain = await page.locator('main, [role="main"]').first().count();
      expect(hasMain, 'Missing <main> landmark').toBeGreaterThan(0);

      // Screenshot
      const shotName = `${sanitize(route)}_${browserName}.png`;
      await page.screenshot({ path: path.join(RUN_DIR, shotName), fullPage: true });

      // Optional axe run (set A11Y=1 env to enable)
      if (process.env.A11Y === '1') {
        await injectAxe(page);
        const a11y = await runAxe(page);
        const summary = summarizeAxe(a11y);
        const a11yPath = path.join(RUN_DIR, `${sanitize(route)}_axe.json`);
        fs.writeFileSync(a11yPath, JSON.stringify(summary, null, 2));
        testInfo.annotations.push({ type: 'a11y-violations', description: String(summary.violationCount) });
      }

      // Treat any captured page errors as failures (we can relax later)
      // (We don't fail on console warnings by default to reduce noise)
      // A per-test console file is created in beforeEach; here we assert it's either empty or warning-only.
      const logFile = path.join(RUN_DIR, `${sanitize(testInfo.title)}.console.jsonl`);
      if (fs.existsSync(logFile)) {
        const lines = fs.readFileSync(logFile, 'utf-8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
        const pageErrors = lines.filter(l => l.type === 'pageerror' || l.type === 'error');
        expect(pageErrors, `Console/page errors found on ${route}`).toEqual([]);
      }
    });
  });
}

// Utility
function sanitize(s: string) {
  return s.replace(/[^a-z0-9-_]+/gi, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
}