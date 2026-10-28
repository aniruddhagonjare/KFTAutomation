import { test, expect } from '@playwright/test';

test('test', async ({ page, context }) => {
    await page.goto('https://rf-embed-auth.knightfintech.com/Account/Login?id=UtopiaFI&returnUrl=https%3a%2f%2frf-embed-dsa-app.knightfintech.com%2fAgent%2fProspectQueue');

    await page.getByRole('textbox', { name: 'Please Enter Agent ID' })
        .fill('bonthu.srihari@dev.knightfintech.com');

    await page.getByRole('textbox', { name: 'Please Enter Password' })
        .fill('Welcome@1234');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.getByRole('link', { name: ' Leads' }).click();
    await page.getByRole('link', { name: ' Dashboard' }).click();

    // If clicking Add Prospect opens a new tab
    const page1Promise = context.waitForEvent('page');
    await page.getByRole('link', { name: 'Add Prospect' }).click();

    const page1 = await page1Promise;
    await page1.waitForLoadState('networkidle');
    await page1.bringToFront();

    await page1.locator('#LoanProduct').selectOption('PersonalLoan');
    await page1.locator('#EntityType').selectOption('Individual');
    await page1.locator('#MobileNo').fill('9390845105');
    await page1.locator('#Scheme').selectOption('383765');
    await page1.locator('#FollowupDate').fill('2026-06-30');
    await page1.locator('#Remarks').fill('uhuh');

    await page1.getByRole('button', { name: 'Submit' }).click();

    await page1.locator('#CustomerName').fill('hgjkh');
    await page1.locator('#ChannelType').selectOption('DSA');
    await page1.locator('#NatureOfLead').selectOption('1');

    await page1.getByRole('button', { name: 'Submit' }).click();

    // Send Customer Link opens another tab
    const page2Promise = context.waitForEvent('page');
    await page1.getByRole('button', { name: ' Send Customer a Link' }).click();

    const page2 = await page2Promise;
    await page2.waitForLoadState('networkidle');
    await page2.bringToFront();

    console.log(await page2.title());
});