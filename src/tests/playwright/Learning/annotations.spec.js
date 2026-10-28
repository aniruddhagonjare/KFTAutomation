//ts-checks
import { test, expect } from '@playwright/test';

test.fail('verify title', async ({ page }) => {
    await page.goto('https://www.google.com');
    const title = await page.title();
    console.log(`The title of the page is: ${title}`);
    expect(title).toBe('Google');

});

test.skip('verify url', async ({ page }) => {

    await page.goto('https://www.google.com');
    const url = page.url();
    console.log(`The URL of the page is: ${url}`);
    expect(url).toBe('https://www.google.com/');    
});

test.fixme('verify search functionality', async ({ page }) => {
    await page.goto('https://www.google.com');
    await page.fill('input[name="q"]', 'Playwright');
   await page.keyboard.press('Enter');
   await page.waitForNavigation();
   const url = page.url();
   console.log(`The URL of the page is: ${url}`);
   expect(url).toBe('https://www.google.com/search?q=Playwright');
});

test.only('verify logo', async ({ page }) => {
    await page.goto('https://www.google.com');
    const logo = await page.locator('img[aria-label="Google"]').first();
    console.log(`The logo is visible: ${await logo.isVisible()}`);
    expect(await logo.isVisible()).toBe(true);
});
