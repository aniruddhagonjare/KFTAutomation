import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    let url = 'https://angelone-lamf-qa.azurewebsites.net/?payload=z8kDKGAnd4DCVSVMqdSpPcDnIOSZIr0qEE8w2/jCgGkRge4dKYHnkQKQ+2IihSWK'
    await page.goto(url);
    await page.getByText('VIEW LOAN DETAILS').click();
    await page.getByText('Loan Details', { exact: true }).click();
    await page.locator('div').filter({ hasText: 'Loan DetailsEligible Loan' }).nth(5).click();
    await page.locator('div').filter({ hasText: 'Loan DetailsHow is loan' }).nth(5).click();
    await page.locator('div').filter({ hasText: /^PROCEED TO KYC$/ }).first().click();
    await page.locator('div').filter({ hasText: /^CONTINUE TO PLEDGE$/ }).nth(1).click();
    await page.getByRole('textbox').first().fill('1');
    await page.getByRole('textbox').nth(1).fill('2');
    await page.getByRole('textbox').nth(2).fill('3');
    await page.getByRole('textbox').nth(3).fill('4');
    await page.getByRole('textbox').nth(4).fill('5');
    await page.getByRole('textbox').nth(5).fill('6');
    await page.locator('div').filter({ hasText: /^SUBMIT OTP$/ }).nth(2).click();
    await page.getByText('SET UP AUTOPAY').click();
    const page1Promise = context.waitForEvent('page');
    const page1 = await page1Promise;

    await page1.waitForLoadState('domcontentloaded');
    await page1.getByRole('button', { name: 'UPI' }).click();
    await page1.getByRole('textbox', { name: 'Customer VPA' }).click();
    await page1.getByRole('textbox', { name: 'Customer VPA' }).fill('test@ybl');
    await page1.getByRole('button', { name: 'Verify' }).click();
    await page1.getByRole('checkbox', { name: 'I hereby authorize Knight' }).check();
    await page1.getByRole('button', { name: 'Submit' }).click();
    await page1.getByRole('button', { name: 'Accept' }).click();
    await page1.getByRole('button', { name: 'Submit' }).click();
    // await page1.goto('https://angelone-lamf-qa.azurewebsites.net/?payload=yT3rCFU9NsJ4ls1g0UYOltzI5W3+sMCdWdetIKVFayX7L6szfjsQ3k4hd5Tu926F&&platform=&&build=&&theme=light&status=success&digio_doc_id=ENA26071319130262731V8OXN24FNWNUP&message=UPI%20Mandate%20Signed%20Successfully');
    // await page.goto('https://angelone-lamf-qa.azurewebsites.net/?payload=yT3rCFU9NsJ4ls1g0UYOltzI5W3+sMCdWdetIKVFayX7L6szfjsQ3k4hd5Tu926F');
    await page.locator('.css-g5y9jx.r-1ifxtd0 > .css-g5y9jx.r-1i6wzkk > .css-g5y9jx').click();
    await page.locator('div').filter({ hasText: /^ACCEPT & WITHDRAW$/ }).first().click();
    await page.getByRole('textbox').first().fill('1');
    await page.getByRole('textbox').nth(1).fill('3');
    await page.getByRole('textbox').nth(2).fill('8');
    await page.getByRole('textbox').nth(3).fill('0');
    await page.getByRole('textbox').nth(4).fill('5');
    await page.getByRole('textbox').nth(5).fill('0');
    await page.locator('div').filter({ hasText: /^CONFIRM$/ }).nth(1).click();
    await page.goto('https://angelone-lamf-qa.azurewebsites.net/?payload=yT3rCFU9NsJ4ls1g0UYOltzI5W3+sMCdWdetIKVFayX7L6szfjsQ3k4hd5Tu926F');
});