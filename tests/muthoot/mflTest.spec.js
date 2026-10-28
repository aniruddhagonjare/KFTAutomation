import { chromium ,test} from '@playwright/test';
import { generateEmbeddedUrl } from '../../src/tests/embedded/urlGeneration.js';
import { muthootBaseUrl } from '../../src/config/urls.js';


test('Muthoot Embedded URL Generation Test', async ({ page }) => {

    let url = await generateEmbeddedUrl(muthootBaseUrl, "9876543210", "Test01", "UTM-20260602120001-945a433f");
    // console.log("Generated URL: ", url);
    // const context = await browser.newContext();
    // const page = await context.newPage();
    await page.goto(url);
    await page.locator('div').filter({ hasText: /^Accept$/ }).first().click();
  
});


// await page.getByText('Wedding Expense').click();
//     await page.getByRole('textbox', { name: 'Enter PAN Number' }).click();
//     await page.getByRole('textbox', { name: 'Enter PAN Number' }).fill('EFSPB6909g');
//     await page.getByRole('textbox', { name: 'DD-MM-YYYY' }).click();
//     await page.getByRole('textbox', { name: 'DD-MM-YYYY' }).fill('25-04-1997');
//     await page.locator('.css-175oi2r.r-1awozwy.r-1777fci.r-w7s2jr').click();
//     await page.getByRole('textbox', { name: 'Enter Email' }).click();
//     await page.getByRole('textbox', { name: 'Enter Email' }).fill('srihari.bonthu007@gmail.com');
//     await page.getByText('Select', { exact: true }).click();
//     await page.getByText('Undergraduate / Bachelor’s').click();
//     await page.getByText('Self Employed').click();
//     await page.getByText('Salaried').click();
//     await page.getByRole('textbox', { name: 'Enter Company Name' }).click();
//     await page.getByRole('textbox', { name: 'Enter Company Name' }).fill('KFT');
//     await page.getByRole('textbox', { name: 'Enter Company Email' }).click();
//     await page.getByRole('textbox', { name: 'Enter Company Email' }).fill('Srihari.bonthu007@gmail.com');
//     await page.getByText('Select▼').click();
//     await page.getByText('Bank Transfer').click();
//     await page.getByRole('textbox', { name: 'Enter Net Monthly Income' }).click();
//     await page.getByRole('textbox', { name: 'Enter Net Monthly Income' }).fill('5666666');
//     await page.getByText('Continue').click();
//     await page.getByRole('textbox', { name: 'House/Flat No., Building Name' }).first().click();
//     await page.getByRole('textbox', { name: 'House/Flat No., Building Name' }).first().fill('oirjgiortgjio');
//     await page.getByRole('textbox', { name: 'House/Flat No., Building Name' }).first().press('Tab');
//     await page.getByRole('textbox', { name: 'Street, Area, Locality' }).first().fill('iojiojiohiohi');
//     await page.getByRole('textbox', { name: 'Enter 6-digit pincode' }).first().click();
//     await page.getByRole('textbox', { name: 'Enter 6-digit pincode' }).first().fill('500084');
//     await page.locator('.css-175oi2r.r-1awozwy.r-1w15a45.r-z2wwpe').click();
//     await page.locator('div').filter({ hasText: /^Continue$/ }).nth(4).click();
//     await page.locator('div').filter({ hasText: /^Allow Location$/ }).nth(1).click();

  // ---------------------
    // await context.close();
    // await browser.close();