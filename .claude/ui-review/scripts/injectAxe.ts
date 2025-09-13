import { Page } from '@playwright/test';
import axe from 'axe-core';

export async function injectAxe(page: Page) {
  // @ts-ignore - we inline axe into the page
  await page.addScriptTag({ content: axe.source });
}

export async function runAxe(page: Page) {
  // Limit rules for speed; we can expand later
  return await page.evaluate(async () => {
    // @ts-ignore
    return await (window as any).axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    });
  });
}