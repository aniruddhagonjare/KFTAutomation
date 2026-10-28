//@ts-check

import { test, expect, devices } from '@playwright/test';

test.describe('Verify device emulation functionality', () => {

    test.use({
        // viewport: { width: 1284, height: 780 }, // iPhone 15 Pro Max landscape dimensions
        geolocation: { longitude: 77.5946, latitude: 12.9716 }, // Example geolocation (Bangalore, India)
        permissions: ['geolocation'], // Grant geolocation permission
    });

    test('Verify geolocation', async ({ page }) => {
        await page.goto('https://www.googlemaps.com');
        await expect(page).toHaveTitle('Google Maps');
        await page.locator('').click(); // Click on the "Allow" button in the geolocation permission prompt
        await page.waitForTimeout(10000); // Wait for 10 seconds to observe the emulation
    });
}); 