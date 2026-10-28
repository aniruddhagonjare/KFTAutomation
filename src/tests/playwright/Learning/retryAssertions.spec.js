//ts-checks
import { test, expect } from '@playwright/test';

test('Assertions_retry in Playwright', async ({ page }) => {

    await page.goto('https://seleniumbase.io/demo_page');

    const checkbox= await page.locator('//*[@type="checkbox" and @id="checkBox2"]')
    await checkbox.check();
    // Assertion with retry
    await expect(checkbox).toBeChecked(); // Retries until the checkbox is checked or timeout occurs


    // Text asserations
    const value = await page.locator('//h1[normalize-space()="Demo Page"]')
    await expect(value).toContainText('Demo Page'); // Retries until the text is correct or timeout occurs


    const link= await page.locator('//a[normalize-space()="seleniumbase.com"]')
    await expect(link).toHaveAttribute('href', 'https://seleniumbase.com'); // Retries until the link has the correct href or timeout occurs    

    const links = await page.locator('a')
    await expect(links).toHaveCount(7);

    const selectdropdown = await page.locator('#mySelect');
    await expect(selectdropdown).toHaveClass('selectClass'); // Retries until the dropdown has the correct value or timeout occurs


     // Retries until the response is OK or timeout occurs
});

