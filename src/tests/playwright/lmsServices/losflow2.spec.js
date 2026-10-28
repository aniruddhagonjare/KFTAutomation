import { test, expect } from '@playwright/test';
import { BrowserUtils } from '../../../../src/utils/losServiceUtils/BrowserUtlis.js';
import path from 'path';
import { page, BaseTest, setBatchName, getBatchName, getApplicationBatchName, getApplicationId, getModeName } from '../../../../fixtures/baseTest.js';


test.describe.configure({ mode: 'serial' });
test.describe('LOS Service Positive Flow', () => {

    const base = new BaseTest();
    let journey = '';
    test.beforeAll(async ({ browser }) => {

        const setupPage = await browser.newPage();
        await base.init(setupPage);
        await new Promise(resolve => setTimeout(resolve, 500));

        const relativeFilePath = path.resolve(process.cwd(), 'HTML pages/journey-selector.html');
        const localPageUrl = `file:///${relativeFilePath.replace(/\\/g, '/')}`;
        await setupPage.goto(localPageUrl, { waitUntil: 'domcontentloaded' });

        await setupPage.evaluate(() => {
            const form = document.getElementById('appForm');
            if (form) {
                form.setAttribute('data-automation-status', 'idle');
            }
        });

        await setupPage.waitForFunction(() => {
            const form = document.querySelector('#appForm');
            if (!form) return false;
            return form.getAttribute('data-automation-status') === 'submitted';
        }, {}, { timeout: 0 });

        const dropdownValue = await setupPage.locator('id=losjourneyseelction').inputValue();

        if (dropdownValue === 'Application Pool') {
            journey = await setupPage.locator('id=applicationSubJourney').inputValue();
            console.log(` Select Application Type >>>>>>>>>>>>>>>>>>>${journey}`);
        } else {
            journey = 'DebtPool';
        }

        console.log(`🎯 Extracted path strategy selection: "${dropdownValue}" -> Operating as: [${journey}]`);

        if (journey === 'DebtPool') {
            const columnVariants = ['Loan No', 'LOAN_NUMBER', 'Loan_Number', 'LoanNo', 'REF_NUMBER'];
            base.excelutils.updateExcelDataDebtPool(`Files/${journey}.xlsx`, columnVariants, 'LoanId');
            console.log(`✅ successfully updated DebtPool excel file`);
        }
        else if (journey === 'ApplicationUpload') {
            base.excelutils.updateExcelDataApplication(`Files/${journey}.xlsx`);
            console.log(`✅ successfully updated ${journey} excel file`);
        }
        else if (journey === 'ApplicationUploadCLM2') {
            base.excelutils.updateExcelDataApplication(`Files/${journey}.xlsx`);
            console.log(`✅ successfully updated ${journey} excel file`);
        }
        else {
            console.log(`⚠️ Journey does not match any expected flows: ${journey}`);
        }
        await setupPage.close();
    });

    test.beforeEach(async ({ page }) => {
        await base.init(page);
    });

    test('L0 User flow', async () => {

        if (journey === 'DebtPool') {        // --------------Debt Pool Journey-------------- //

            console.log(`Started Debt Pool Journey For L0`);

            await base.loginPage.gotolosURL();
            await base.loginPage.loginL0UserPoolQueue('loginCred');

            await base.selectPools.selectDebtPool();

            await base.upload.uploadPool();
            const batchName = await base.upload.enterPoolBatchName();
            setBatchName(batchName);
            await base.upload.clickProcessButton();

            const page1Promise = base.page.waitForEvent('popup');

            await base.managePoupwindow.ValidLeaduploaded();

            const page1 = await page1Promise;

            await base.poolqueue.poolQueueSelectAllCheckBox(page1);
            await base.poolqueue.clickShowSummaryButton(page1);
            await base.poolqueue.EnterSummaryPoolName(page1);
            await base.poolqueue.PushToBankButtonDebtPool(page1);

            await base.poolqueue.ClickOnClickHereButton(page1);
            console.log(`Successfully completed L0 user flow (Debt Pool) with batchName:- ${getBatchName()}`);


        } else if (['ApplicationUpload', 'ApplicationUploadCLM2'].includes(journey)) {       // --------------Application Journey-------------- //

            console.log(`Started ApplicationUpload Journey For L0`);
            await base.loginPage.gotolosURL();
            await base.loginPage.loginL0UserApplicationQueue('loginCred');

            await base.selectPools.selectApplicationUpload();

            await base.upload.ApplicationUploadFileField(journey);
            await base.upload.EnterApplicationBatchName();
            await base.upload.ClickOnApplicationPoolProcessButton();

            const page1Promise = base.page.waitForEvent('popup');
            await base.managePoupwindow.ValidLeaduploaded();

            const page1 = await page1Promise;
            await page1.waitForURL(url => url.href.includes('GetBatchRecords'), { waitUntil: 'load' });
            await base.poolqueue.PushToBankButton(page1);

            await base.poolqueue.ClickOnClickHereButton(page1);
            console.log(`Successfully completed L0 user flow (Application Pool) with batchName:- ${getApplicationBatchName()}`);
            await new Promise(resolve => setTimeout(resolve, 5000))

        } else {
            console.log(`Journey does not match any expected flows: ${journey}`);
        }
    });

    test('L1 User flow', async () => {

        if (journey === 'DebtPool') {        // --------------Debt Pool Journey-------------- //

            console.log(`Started Debt Pool Journey For L1`);
            await base.loginPage.gotolmsURL();
            await base.loginPage.loginL1User('loginCred');

            await base.l1poolqueue.clickOnPoolQueueSideBar();

            await base.l1poolqueue.listPoolselect();

            // await base.l1poolqueue.ClickOnEyeIconForgetModeName();
            // const mode = await base.commonfunction.getTabByName('Application Detail');
            // await base.l1poolqueue.getModeName(mode);

            await base.l1poolqueue.ClickOnRunDedupeButton(page);

            await base.l1poolqueue.VerifyKYCButton();

            await base.l1poolqueue.RunBREButton();

            await base.l1poolqueue.ProcessButton();
            console.log(`------------------ BatchName :-  ${getBatchName()} -----------------`);

        } else if (['ApplicationUpload', 'ApplicationUploadCLM2'].includes(journey)) {               // --------------Application pool Journey-------------- //

            console.log(`Started ApplicationUpload Journey For L1`);

            await base.loginPage.gotolmsURL();
            await base.loginPage.loginL1User('loginCred');

            await base.applicationqueue.CLickOnApplicationQueueSideBar();
            await base.applicationqueue.ClickOnApplicationQueueHeading();
            await base.applicationqueue.ClickOnFirstLeadFromApplicationQueue(page);
            await base.applicationqueue.ClickOnRunDedupButton();

            await base.applicationqueue.TextMessageAFterClickOnRunDedupButton();

            const newTabPromise = base.page.context().waitForEvent('page');
            await base.applicationqueue.ClickOnRunBREButton();
            const page1 = await BrowserUtils.waitForNewTabAndVerifyUrl(newTabPromise, 'BREOutput');
            await expect(page1).toHaveTitle(/BRE Output/);

            await base.applicationqueue.OnBrePageClickOnFetchFromOriginatorButton(page1);
            await new Promise(resolve => setTimeout(resolve, 8000))
            await base.applicationqueue.OnBrePageFinalEligibilityTAB(page1);
            await base.applicationqueue.ClickOnConfirmBREButton(page1);

            page1.on('dialog', async dialog => {
                await dialog.accept();
            });

            await new Promise(resolve => setTimeout(resolve, 8000))
            await page1.close();

            await new Promise(resolve => setTimeout(resolve, 10000))
            await BrowserUtils.defaultReload(base.page);
            await base.applicationqueue.CreditVettingCompletedButton();

            await new Promise(resolve => setTimeout(resolve, 5000));
            await BrowserUtils.defaultReload(base.page);
            await base.applicationqueue.RecommendedForApprovalToL3Button(base.loginPage, 's0', 'loginCred');

            console.log(`------------------ BatchName :-  ${getApplicationBatchName()} -----------------`)
            console.log(`------------------ ApplicationId :- ${getApplicationId()} -----------------`)

            await new Promise(resolve => setTimeout(resolve, 10000))
        } else {
            console.log(`Journey does not match any expected flows: ${journey}`);
        }

    });


    test('L3 User flow', async () => {

        if (journey === 'DebtPool') {               // --------------Debt Pool Journey-------------- //
            console.log(`Started Debt Pool Journey For L3`);

            await base.loginPage.gotolmsURL();
            await base.loginPage.loginL3User('loginCred');

            await base.l3poolqueue.clickOnPoolQueueSideBar();

            await base.l3poolqueue.clickOnpoolfromList();                 // batchName

            await base.l3poolqueue.clickOnApproveALLButton();
            await new Promise(resolve => setTimeout(resolve, 1000))

            await base.l3poolqueue.ClickOnApprovalPendingTAB();

            await base.l3poolqueue.clickOnpoolfromList();                 // batchName

            await base.l3poolqueue.ClickOnFetchFromAPIButton();

            await new Promise(resolve => setTimeout(resolve, 5000))

            await base.l3poolqueue.ClickOnAssignedTAB();

            await base.l3poolqueue.clickOnpoolfromList();                             // batchName

            await base.l3poolqueue.ClickOnGenerateInternalLAButton();

            await base.l3poolqueue.ConfirmModalCloseButton();

            await base.l3poolqueue.ClickOnAssignedTAB();

            await base.l3poolqueue.clickOnpoolfromList();                     // batchName

            await base.l3poolqueue.ClickOnProcessToDisbursedButton();

            await new Promise(resolve => setTimeout(resolve, 2000))

            await base.l3poolqueue.ModalOkButtonAfterAssignedTAB();

            await new Promise(resolve => setTimeout(resolve, 1000))
            await base.l3poolqueue.ModalCloseButtonAfterAssignedTAB();

            await new Promise(resolve => setTimeout(resolve, 2000))

            await base.l3poolqueue.ClickOnDisbursedTAB();

            await base.l3poolqueue.clickOnpoolfromList();                                 // batchName

            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log(`Successfully Disbursed the cases :- ${getBatchName()}`);
            console.log(`Application Number: ${getApplicationId()}`);

            await base.commonfunction.getMultipleDatafromTable('8');

        } else if (['ApplicationUpload', 'ApplicationUploadCLM2'].includes(journey)) {

            console.log(`Started ApplicationUpload Journey For L3`);
            await base.loginPage.gotolmsURL();
            await base.loginPage.loginL3User('loginCred');

            const modeName = getModeName();
            if (modeName === 'CLM 1') {

                console.log('Started CLM 1 flow ====================');
                await base.applicationqueueL3.clickOnApplicationQueueSideBarL3();

                await base.applicationqueueL3.ClickOnPendingForApprovaHeadingL3();
                await base.applicationqueueL3.ClickOnApplicationQueueFirstLeadFromApplicationQueueL3();
                await base.applicationqueueL3.ClickOnL3ApproveButton();

                await base.applicationqueueL3.ClickOnSanctionButton();

                await base.loginPage.LogoutUserLMS();

                await base.applicationqueueL3.ClickOnSanctionAndDisbursalHeadingL3SideBar();
                await base.applicationQueueL0.ClickOnFirstLeadFromApplicationQueue();

                await base.applicationQueueL0.ClickOnSaveButton();

                await base.applicationqueueL3.ClickOnSanctionAndDisbursalHeadingL3SideBar();
                await base.applicationQueueL0.ClickOnFirstLeadFromApplicationQueue();

                await base.applicationQueueL0.SelectBeneficiaryType('Borrower');
                await base.applicationQueueL0.SelectBeneficiaryName('Sham');

                await base.applicationQueueL0.benificeryAmount();
                await base.applicationQueueL0.ClickOnSaveButton();

                await base.loginPage.logoutUser();

                await base.loginPage.gotolmsURL();
                await base.loginPage.loginL3User('loginCred');
                await base.applicationqueueL3.ClickOnSanctionAndDisbursalHeadingL3SideBar();
                await base.applicationqueueL3.DisbursementPendingTAB();
                await base.applicationqueueL3.ClickOnDisbursementPendingFirstLeadFromApplicationQueueL3();

                await base.applicationqueueL3.ClickOnOpenLoanAccountButton();
                await base.applicationqueueL3.ClickOnOpenVirtualAccountButton();

                await base.applicationqueueL3.ClickOnSanctionAndDisbursalHeadingL3SideBar();
                await base.applicationqueueL3.DisbursementPendingTAB();
                await base.applicationqueueL3.ClickOnDisbursementPendingFirstLeadFromApplicationQueueL3();

                // await base.applicationqueueL3.ClickOnRepaymentScheduleButton();
                await base.applicationqueueL3.ClickOnAfterRepaymentScheduleSaveButton();
                await base.applicationqueueL3.ClickOnDisburseLoanButton();

                await base.applicationqueueL3.ClickOnDisbursementStatusText();

                console.log(`Loan successfully disbursed with ApplicationId:- ${getApplicationId()}`)

            } else {

                console.log('Started CLM 2 flow ====================');
                await base.applicationqueueL3.clickOnApplicationQueueSideBarL3();
                await base.applicationqueueL3.clickOnApplicationQueueHeadingL3();
                await base.applicationqueueL3.ClickOnApplicationQueueFirstLeadFromApplicationQueueL3();
                await base.applicationqueueL3.ClickOnL3ApproveButton();

                await base.applicationqueueL3.ClickOnSanctionButton();

                await base.applicationqueueL3.ClickOnSanctionAndDisbursalHeadingL3SideBar();
                await base.applicationqueueL3.DisbursementPendingTAB();
                await base.applicationqueueL3.ClickOnDisbursementPendingFirstLeadFromApplicationQueueL3();

                await base.applicationqueueL3.ClickOnOpenLoanAccountButton();
                await base.applicationqueueL3.ClickOnOpenVirtualAccountButton();
                await base.applicationqueueL3.ClickOnRepaymentScheduleButton();
                await base.applicationqueueL3.ClickOnAfterRepaymentScheduleSaveButton();
                await base.applicationqueueL3.ClickOnDisburseLoanButton();

                await base.applicationqueueL3.ClickOnDisbursementStatusText();

                console.log(`Loan successfully disbursed with ApplicationId For CLM 1 :- ${getApplicationId()}`)
            }
            await new Promise(resolve => setTimeout(resolve, 10000));

        } else {
            console.log(`Journey does not match any expected flows: ${journey}`);
        }
    });
}); 
