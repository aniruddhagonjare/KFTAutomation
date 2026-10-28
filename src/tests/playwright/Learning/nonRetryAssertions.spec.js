//ts-checks
import { test, expect } from '@playwright/test';

test('non retry Assertions in Playwright', async ({ page }) => {        

    await page.goto('https://seleniumbase.io/demo_page');

    const title= await page.title();
    expect(title).toBe('Web Testing Page'); // Non-retry assertion, checks the title once and fails if it doesn't match

    const pageUrl= await page.url();
    expect(pageUrl).toContain('demo_page'); // Non-retry assertion, checks the URL once and fails if it doesn't match

    const AllCheckbox= await page.locator('//input[@type="checkbox"]').count();
    expect(AllCheckbox).toBeGreaterThanOrEqual(5); // Non-retry assertion, checks the count of checkboxes once and fails if it doesn't match

    const elementLength= await page.locator('//h1[text()="Demo Page"]').textContent();
    expect(elementLength).toHaveLength(9); // Non-retry assertion, checks the length of the text content once and fails if it doesn't match
});