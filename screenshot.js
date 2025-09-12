import { chromium } from 'playwright';

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://jamesrobertsondesign.com');
  await page.waitForLoadState('networkidle');
  
  await page.screenshot({ 
    path: 'james-robertson-design-screenshot.png',
    fullPage: true 
  });
  
  await browser.close();
  console.log('Screenshot saved as james-robertson-design-screenshot.png');
}

takeScreenshot().catch(console.error);