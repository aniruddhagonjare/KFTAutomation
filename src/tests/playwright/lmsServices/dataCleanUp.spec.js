import { test } from '@playwright/test';
import { BaseTest, setApplicationIdGlobal } from '../../../../fixtures/baseTest.js';
import path from 'path';

test.describe('LmS Service Flow', () => {

    test.beforeEach(async ({ page }) => {
        base = new BaseTest();
        await base.init(page);
    });

    let base;

    test('Data Clean Up', async ({ page, context }) => {

        const relativeFilePath = path.resolve(process.cwd(), 'HTML pages/dataCleanUp.html');
        const localPageUrl = `file:///${relativeFilePath.replace(/\\/g, '/')}`;
        await page.goto(localPageUrl);

        await page.waitForFunction(() => {
            const form = document.getElementById('appForm');
            return form && form.getAttribute('data-automation-status') === 'triggered';
        }, { timeout: 0 });

        const appId = await page.locator('#applicationId').inputValue();
        process.env.GLOBAL_APPLICATION_ID = appId;
        
        const rawDate = await page.locator('#appDate').inputValue();
        const rebuildValue = await page.locator('#rebuild').inputValue();
        const ACCOUNT_STATUS = await page.locator('#loanStatus').inputValue();
        const BankAccountStatus = await page.locator('#bankStatus').inputValue();

        const [year, month, day] = rawDate.split('-');
        const selectDateforCleanData = `${day}/${month}/${year}`;
        const REBUILD = (rebuildValue === 'true');

        process.env.GLOBAL_APPLICATION_ID = appId;

        await base.loginPage.superAdminLogin('loginCred');
        await base.sidebarMenu.supportCheckerSideBarOpen();
        await base.backFill.supportMakerSideBar();


        const searchCustomerTab = await base.commonfunction.getTabByName('Support');
        await base.backFill.SelectTypeDropDown();
        await base.backFill.DropDownValueBackFill('Data CleanUp');

        await base.dataCleanUp.UploadFileCheckBox();
        await base.dataCleanUp.ChooseFileButton();
        await base.dataCleanUp.AllExceptDisbursal();

        if (REBUILD) {
            await base.dataCleanUp.CollectionFeedSplit_DataCleanUp(selectDateforCleanData);
        }

        await base.dataCleanUp.LedgerEntries_DataCleanUp(selectDateforCleanData);
        await base.dataCleanUp.DemandSchedule_DataCleanUp(selectDateforCleanData);
        await base.dataCleanUp.DPDHistory_DataCleanUp(selectDateforCleanData);
        await base.dataCleanUp.RevertRPS_DataCleanUp(selectDateforCleanData);
        await base.dataCleanUp.OverdueEntries_DataCleanUp(selectDateforCleanData);

        await base.dataCleanUp.RemoveDataButton();

        const supportChekcker = await base.commonfunction.getTabByName('Support Checker');
        await supportChekcker.reload({ waitUntil: 'domcontentloaded' });
        await base.backFillRequestSupportChecker.DataCleanUpRequestTab(supportChekcker);
        await base.backFillRequestSupportChecker.SearchAndClickOnApprvoveButtonAndOKButton(supportChekcker);

        console.log(`Data Successfully Cleaned Up for Application Id :- ${appId} and From Date :- ${selectDateforCleanData}`);

        if (ACCOUNT_STATUS && ACCOUNT_STATUS.trim() !== "" && BankAccountStatus && BankAccountStatus.trim() !== "") {

            const activeTab = await base.sidebarMenu.supportMakerSideBarInNewTab();
            await base.backFill.SelectTypeDropDown();
            await base.backFill.DropDownValueBackFill('Change Account Status');

            await base.changeAccountStatus.AppWiseButton();
            await base.changeAccountStatus.ApplicationIdField();

            const scenarioKey = `${ACCOUNT_STATUS}_${BankAccountStatus}`;

            const scenarioMatrix = {
                'Active_Active': { loan: 'Active', bank: 'Active', hasAlert: false },
                'Active_Matured': { loan: 'Active', bank: 'Matured', hasAlert: true, alertText: 'Account will be matured.' },
                'NPA_Active': { loan: 'NPA', bank: 'Active', hasAlert: true, alertText: 'Are you sure you want to mark this account as NPA?' },
                'NPA_NPA': { loan: 'NPA', bank: 'NPA', hasAlert: true, alertText: 'Critical state.' },
                'Matured_Active': { loan: 'Matured', bank: 'Active', hasAlert: false },
                'Matured_Matured': { loan: 'Matured', bank: 'Matured', hasAlert: false }
            };

            const currentScenario = scenarioMatrix[scenarioKey];

            if (currentScenario) {
                if (currentScenario.hasAlert) {
                    page.once('dialog', async dialog => {
                        console.log(`Browser Alert Intercepted: [${dialog.message()}]`);
                        await dialog.accept();
                        console.log(`Alert dialog accepted successfully.`);
                    });
                }
                if (ACCOUNT_STATUS !== "") await base.changeAccountStatus.SelectLoanStatus(currentScenario.loan);
                if (BankAccountStatus !== "") await base.changeAccountStatus.SelectBankStatus(currentScenario.bank);

            } else {
                console.warn(`Scenario combination not explicitly locked in configuration matrix for "${scenarioKey}".`);
                if (ACCOUNT_STATUS !== "") await base.changeAccountStatus.SelectLoanStatus(ACCOUNT_STATUS);
                if (BankAccountStatus !== "") await base.changeAccountStatus.SelectBankStatus(BankAccountStatus);
            }

            await base.changeAccountStatus.SaveStatusbutton();

            console.log(`✅ Account Status Changed Successfully! | Updated ➔ Loan Status: ${ACCOUNT_STATUS} | Bank Status: ${BankAccountStatus}`);
        } else {
            console.log("Loan Status or Bank Status is blank. Skipping 'Change Account Status' step mapping.");
        }
    });
});
