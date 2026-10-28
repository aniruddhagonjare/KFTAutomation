import { test, expect } from '@playwright/test';
import { BaseTest } from '../../../../fixtures/baseTest.js';


test.describe('Screen Journey', () => {

    test.beforeEach(async ({ page }) => {
        base = new BaseTest();
        await base.init(page);
        await new Promise(resolve => setTimeout(resolve, 500));
    });

    let base;

    test('Screen Journey', async ({  }) => {


        await base.loginpagescreenjourney.SuperAdminLogin_ScreenJourny();

        await base.createapplication.clickOnLoanApplication();
        await base.createapplication.DedupPage();

        await base.createapplication.CreateNewLeadButton();
        await base.createapplication.SelectLoanTypeGold();

        await base.createapplication.ProductSelectionPNGGold();

        await base.createapplication.EntityTypeSelectionIndividual();
// started
        await base.createapplication.PrimaryInformation();
        await base.createapplication.Co_BorrowerDetails();

        await base.createapplication.LoanDetails();

        await base.createapplication.BusinessDetails();

        await base.createapplication.CollateralDetails();

        await base.createapplication.BankDetails();

        await base.createapplication.FinancialDetails();

        await base.createapplication.BlendedROI();

        await base.createapplication.PreviewAndSubmit();

        await base.createapplication.getApplicationNumber();

        await new Promise(resolve => setTimeout(resolve, 15000));
    
    })

});