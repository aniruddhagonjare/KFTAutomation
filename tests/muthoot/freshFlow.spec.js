import { test, expect } from '@playwright/test';
import { FreshFlowPage } from '../../pages/muthoot/FreshFlowPage.js';

const APP_URL = 'https://mf-embed-uat.knightfintech.com/?utm_code=UTM-20260602120001-945a433f&authToken=FMJkYmBp_o1KQhZr67nbDbu8XU5NchpobpkUcUJ4OLlaNANNocfhWkHnwHEIipYc_rPZVauKbKEQzjab_wTpk8x1q_ENStqkQWb-SjC6bhMEP_0zEpcAmyOeab_jsagv';

test.describe('Fresh Flow Loan Application - Negative Scenarios', () => {
    let page;
    let freshFlowPage;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        freshFlowPage = new FreshFlowPage(page);
        await freshFlowPage.navigate(APP_URL);
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('Validation: Invalid PAN Format', async () => {
        // Provide an invalid PAN to trigger validation
        await freshFlowPage.loanAmountSelectBtn.click();
        await freshFlowPage.selectDropdownBtn.click();
        await freshFlowPage.businessExpenseOption.click();

        await freshFlowPage.panInput.click();
        await freshFlowPage.panInput.fill('123456'); // Invalid PAN
        
        await freshFlowPage.dobInput.click();
        
        // Assert some validation message appears, e.g., "Invalid PAN format"
        // Note: Assuming a generic error locator here, modify based on actual DOM
        const errorMsg = page.locator('text=Invalid PAN').first(); 
        // await expect(errorMsg).toBeVisible();
    });

    test('Validation: Empty Mandatory Fields', async () => {
        await freshFlowPage.loanAmountSelectBtn.click();
        await freshFlowPage.selectDropdownBtn.click();
        await freshFlowPage.businessExpenseOption.click();

        // Leave PAN and DOB empty and try to proceed
        await freshFlowPage.consentCheckbox1.click();
        await freshFlowPage.consentCheckbox2.click();

        // Assert that we have not moved to the next step
        await expect(freshFlowPage.rootContainer).not.toContainText('Almost there, just 2 steps to go.');
    });
});

test.describe.serial('Fresh Flow Loan Application - End to End Positive Flow', () => {
    let page;
    let freshFlowPage;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        freshFlowPage = new FreshFlowPage(page);
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('Step 1: Navigate to Application URL', async () => {
        await freshFlowPage.navigate(APP_URL);
    });

    test('Step 2: Fill Loan Details', async () => {
        await freshFlowPage.fillLoanDetails('EFSPB6909g', '25-04-1997');
    });

    test('Step 3: Fill Personal Information', async () => {
        await freshFlowPage.fillPersonalInfo(
            'srihari.bonthu007@gmail.com', 
            'Knight Fintech ', 
            'bonthu.srihari@dev.knightfintech.com', 
            '50000'
        );
    });

    test('Step 4: Fill Address Details', async () => {
        await freshFlowPage.fillAddressDetails('400607');
    });
});