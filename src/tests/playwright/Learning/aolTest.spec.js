import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    const url = 'https://angelone-lamf-qa.azurewebsites.net/?payload=kgIaAe8IUx7o7g0pXEAapBeAtUdP2yUf96CKIWuxwXOTd4pGW+U+NBCdWK6+yzPd'
    await page.goto(url);

    await page.waitForTimeout(1000);
    await page.getByText('VIEW LOAN DETAILS').click();

    await page.waitForTimeout(1000);
    await page.getByText('Loan Details').click();

    await page.waitForTimeout(1000);
    await page.getByText('How is loan amount calculated').click();

    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: 'Loan DetailsHow is loan' }).nth(5).click();

    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: 'Loan DetailsEligible Loan' }).nth(5).click();

    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: 'Loan DetailsHow is loan' }).nth(5).click();

    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: /^PROCEED TO KYC$/ }).first().click();

    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: /^CONTINUE TO PLEDGE$/ }).nth(1).click();

    await page.getByRole('textbox').first().fill('1');
    await page.getByRole('textbox').nth(1).fill('2');
    await page.getByRole('textbox').nth(2).fill('3');
    await page.getByRole('textbox').nth(3).fill('4');
    await page.getByRole('textbox').nth(4).fill('5');
    await page.getByRole('textbox').nth(5).fill('6');

    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: /^SUBMIT OTP$/ }).nth(2).click();

    await page.goto('https://angelone-lamf-qa.azurewebsites.net/?payload=py/hlDge7xvKtwTWGlJmHxlzTe+5g64WLB6/A10lkXVDz9g6TTQj4KRijVxa8ft6');

    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: /^SET UP AUTOPAY$/ }).first().click();

    const page1Promise = page.waitForEvent('popup');
    await page.waitForTimeout(1000);
    await page.getByText('SET UP AUTOPAY').nth(2).click();
    const page1 = await page1Promise;

    await page1.waitForTimeout(1000);
    await page1.getByRole('checkbox', { name: 'I hereby authorize Knight' }).check();

    await page1.waitForTimeout(1000);
    await page1.getByRole('button', { name: 'UPI' }).click();

    await page1.waitForTimeout(1000);
    await page1.getByRole('textbox', { name: 'Customer VPA' }).click();
    await page1.getByRole('textbox', { name: 'Customer VPA' }).fill('test@ybl');

    await page1.waitForTimeout(1000);
    await page1.getByRole('button', { name: 'Accept' }).click();

    await page1.waitForTimeout(1000);
    await page1.getByRole('button', { name: 'Submit' }).click();

    await page.waitForTimeout(1000);
    await page.locator('.css-g5y9jx.r-1awozwy.r-z2wwpe.r-d045u9').click();

    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: /^ACCEPT & WITHDRAW$/ }).first().click();

    await page.getByRole('textbox').first().fill('3');
    await page.getByRole('textbox').nth(1).fill('8');
    await page.getByRole('textbox').nth(2).fill('9');
    await page.getByRole('textbox').nth(3).fill('8');
    await page.getByRole('textbox').nth(4).fill('2');
    await page.getByRole('textbox').nth(5).fill('3');

    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: /^CONFIRM$/ }).nth(1).click();

});