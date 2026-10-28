//@ts-check

import { test, expect, devices } from '@playwright/test';

test.describe('Verify device emulation functionality', () => {


    test.use({
        viewport: { width: 1284, height: 780 }, // iPhone 15 Pro Max landscape dimensions
    });


    test('Emulate iPhone 15 Pro Max', async ({ page }) => {
        await page.goto('https://www.example.com');
        await expect(page).toHaveTitle('Example Domain');

        await page.waitForTimeout(10000); // Wait for 12 seconds to observe the emulation
    });
});