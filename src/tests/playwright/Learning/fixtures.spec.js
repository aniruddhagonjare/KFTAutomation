//@ts-check

import { test, expect } from '@playwright/test';

test('Open fixture', async ({ browser }) => {

    const page = await browser.newPage();

    const context = await browser.newContext();

    await page.goto('https://www.saucedemo.com/');
    await page.waitForTimeout(15000);
    await context.close();

});