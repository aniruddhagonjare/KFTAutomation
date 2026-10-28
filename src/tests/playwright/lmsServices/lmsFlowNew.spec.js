import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';
//import ExcelJS from 'exceljs';
import { BaseTest, getApplicationIdGlobal, setApplicationIdGlobal } from '../../../../fixtures/baseTest.js';


test.describe('LmS Service Flow', () => {

    test.beforeEach(async ({ page }) => {
        base = new BaseTest();
        await base.init(page);
        await new Promise(resolve => setTimeout(resolve, 500));
    });

    let base;

    test('LMS flow', async ({ context, page }) => {

        const controlPage = page;
        const relativeFilePath = path.resolve(process.cwd(), 'HTML pages/lmsJourney.html');
        const localPageUrl = `file:///${relativeFilePath.replace(/\\/g, '/')}`;

        await controlPage.goto(localPageUrl);

        await controlPage.waitForFunction(() => {
            const form = document.getElementById('appForm');
            return form && form.getAttribute('data-automation-status') === 'triggered';
        }, { timeout: 0 });

        const selectedJourney = await controlPage.locator('#losjourneyseelction').inputValue();
        const isAppIdSelected = await controlPage.locator('#selectAppId').isChecked();
        const isFileUploadSelected = await controlPage.locator('#selectFileUpload').isChecked();
        
        const rawCustomModifiers = await controlPage.locator('#userInputModifiers').inputValue();

        let capturedAppId = '';
        let capturedFilePath = '';

        const targetStorageFolder = `E:\\C02.Aniruddha Gonjare\\Git\\KFT_ScreenJourney\\fe-automations\\excelFiles`;

        if (isAppIdSelected) {
            const rawAppId = await controlPage.locator('#applicationId').inputValue();
            capturedAppId = rawAppId ? rawAppId.trim() : '';
            console.log(`🔹 Captured Application ID : ${capturedAppId}`);

        } else if (isFileUploadSelected) {
            const fakePath = await controlPage.locator('#fileUpload').inputValue();
            const uploadedFileName = fakePath.split('\\').pop().split('/').pop();

            if (!uploadedFileName) {
                console.error("❌ File Upload method was selected, but no file was attached.");
                return;
            }

            capturedFilePath = path.join(targetStorageFolder, uploadedFileName);
            console.log(`📁 Target File Path Allocation: ${capturedFilePath}`);

            console.log(`⏳ Fetching file data from browser memory for: ${uploadedFileName}...`);
            const fileBase64Data = await controlPage.evaluate(async () => {
                const fileInput = document.getElementById('fileUpload');
                if (!fileInput || fileInput.files.length === 0) return null;

                const file = fileInput.files[0];
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64String = reader.result.split(',')[1];
                        resolve(base64String);
                    };
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
            });

            if (!fileBase64Data) {
                console.error("❌ Failed to retrieve file content from the browser DOM element.");
                return;
            }

            if (!fs.existsSync(targetStorageFolder)) {
                fs.mkdirSync(targetStorageFolder, { recursive: true });
            }

            fs.writeFileSync(capturedFilePath, Buffer.from(fileBase64Data, 'base64'));
            console.log(`💾 Successfully stored uploaded file locally at: ${capturedFilePath}`);
        }

        await base.loginPage.superAdminLogin('loginCred');
        await base.sidebarMenu.LedgersEntriesSideBarOpen();
        await base.sidebarMenu.supportCheckerSideBarOpen();
        await base.sidebarMenu.CollectionUploadSideBarOpen();
        await base.sidebarMenu.EodProcessSideBarOpen();
        await base.sidebarMenu.SearchCustomerSideBarOpen();

        let parsedModifiersArray = ['PP', 'FP', '0.5', '0.0', '0.0', '0.0', '1.4', 'FC', '1.0', '0.0', '0.0', '0.0', '1.0'];
        
        const cleanRaw = rawCustomModifiers ? rawCustomModifiers.trim() : '';

        try {
            if (cleanRaw && cleanRaw !== '[]' && cleanRaw !== '') {
                const tokens = cleanRaw.split(/[\s,]+/);
                
                parsedModifiersArray = tokens.map(token => {
                    let cleanToken = token.trim();
                    return cleanToken ? cleanToken.toUpperCase() : null;
                }).filter(item => item !== null);

                
            }
        } catch (e) {
            console.error("⚠️ Failed processing modifiers layout context, utilizing base code fallbacks.", e.message);
        }

        const executionTarget = isAppIdSelected ? capturedAppId : 'File_Upload_Mode';

        const appModifiersMap = {
            [capturedAppId]: parsedModifiersArray
        };

        console.log(`\n=============================================================`);
        console.log(`🚀 Starting execution for: ${executionTarget} (Journey: ${selectedJourney})`);
        console.log(`📊 Loaded Modifiers Array context: ${JSON.stringify(parsedModifiersArray)}`);
        console.log(`=============================================================`);

        const activeModifiers = appModifiersMap[capturedAppId] || [1.0];

        for (let i = 0; i < activeModifiers.length; i++) {
            if (isAppIdSelected) {
                setApplicationIdGlobal(capturedAppId);
            }
            global.backFillLoopCounter = i;

            const currentModifier = activeModifiers[i] !== undefined ? activeModifiers[i] : 1.0;
            console.log(`\n✅ Interaction Loop ${i + 1} of ${activeModifiers.length} Activated (Modifier: ${currentModifier})`);
            

            if (selectedJourney === 'Anniversary') {
                console.log(`Executing Anniversary journey logic...`);
                { // Search Customer Page code

                    const searchCustomers = await base.commonfunction.getTabByName('Search Customer');
                    const customerPage = base.searchCustomer.onTab('');

                    await customerPage.customerSideBar();
                    await customerPage.customerSearchField(getApplicationIdGlobal());
                    await customerPage.clickSearchButton();
                    await customerPage.SOA();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await customerPage.RPS();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const repaymentTab = await base.commonfunction.getTabByName('Repayment Schedule');
                    const RpaymentTab = base.rps.onTab(repaymentTab);
                    await RpaymentTab.getDisbursementDateTextField();
                    await RpaymentTab.GetDataForFutureRPSDate();
                    await RpaymentTab.getDemandDateFromRPSPage();
                    await RpaymentTab.getEMIAmountFromTable();
                }

                await new Promise(resolve => setTimeout(resolve, 2000));

                { // support Maker process - Back Fill - BOD + EOD
                    await base.backFill.supportMakerSideBar();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const searchCustomerTab = await base.commonfunction.getTabByName('Support');

                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await base.backFill.SelectTypeDropDown();
                    await base.backFill.DropDownValueBackFill('Back Fill');
                    await base.backFill.ClickOnUploadFileCheckBox();

                    await base.backFill.FormDateFieldEodBod(i);
                    await base.backFill.ToDateFieldEodBod(i);

                    if (isAppIdSelected) {
                        await base.backFill.BackFillChooseAndUploadFileButton(isAppIdSelected);
                        await base.backFill.SelectBackFillTemplate('BOD + EOD');
                    } else if (isFileUploadSelected) {

                        await base.backFill.BackFillChooseAndUploadFileButton(capturedFilePath);
                        await base.backFill.SelectBackFillTemplate('all');
                        await base.backFill.SelectCollectionReadMethod('NewCollection');
                        await base.backFill.SelectCollectionFileSource('CollectionFeed');
                    }

                    await base.backFill.CLickOnSaveButton();

                }

                await new Promise(resolve => setTimeout(resolve, 5000));

                {   // backfill approve process
                    const activeTab = await base.sidebarMenu.supportCheckerSideBarInNewTab();
                    base.backFillRequestSupportChecker.page = activeTab;
                    await base.backFillRequestSupportChecker.backFillRequestApproveButton();
                }

                await new Promise(resolve => setTimeout(resolve, 3000));

                {//Active Process Details  
                    await base.activeprocessdetails.supportMakerSideBar();
                    const searchCustomer = await base.commonfunction.getTabByName('Support');
                    await base.activeprocessdetails.SelectTypeDropDown(searchCustomer);
                    await base.activeprocessdetails.DropDownValueActiveProcessDetails('Active Process Details');
                    await base.activeprocessdetails.BackFillButton();
                    await base.activeprocessdetails.ActiveProcessPath();
                }

                await new Promise(resolve => setTimeout(resolve, 3000));
                { // ledger page code

                    const activeTab = await base.sidebarMenu.LedgersEntriesSideBarInNewTab();
                    const ledgers = await base.commonfunction.getTabByName('Ledger Entries');

                    const ledgerpage = base.Ledgers.onTab(ledgers);
                    await ledgerpage.FromDateLedgerField();
                    await ledgerpage.ToDateLedgerField();
                    await ledgerpage.SearchField(getApplicationIdGlobal()); // ApplicationId
                    await ledgerpage.StandardViewCheckBox();
                    await ledgerpage.SearchButton();
                    await ledgerpage.getLoanDisbursalOutstandingPrincipalValue();
                }

                await new Promise(resolve => setTimeout(resolve, 3000));

                {// support Maker process - Back Fill - Demand
                    await base.backFill.supportMakerSideBar();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const searchCustomerTab = await base.commonfunction.getTabByName('Support');

                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await base.backFill.SelectTypeDropDown();
                    await base.backFill.DropDownValueBackFill('Back Fill');
                    await base.backFill.ClickOnUploadFileCheckBox();


                    if (isAppIdSelected) {
                        await base.backFill.BackFillChooseAndUploadFileButton(isAppIdSelected);
                    } else if (isFileUploadSelected) {
                        await base.backFill.BackFillChooseAndUploadFileButton(capturedFilePath);
                    }

                    await base.backFill.FormDateFieldDemand();
                    await base.backFill.ToDateFieldDemand();
                    await base.backFill.SelectBackFillTemplate('Demand');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await base.backFill.CLickOnSaveButton();
                }

                await new Promise(resolve => setTimeout(resolve, 3000));

                {// demand approve process
                    const supportChekcker = await base.commonfunction.getTabByName('Support Checker');
                    await supportChekcker.reload({ waitUntil: 'domcontentloaded' });
                    await base.backFillRequestSupportChecker.backFillRequestApproveButton(supportChekcker);
                }

                {//Active Process Details  
                    await base.activeprocessdetails.supportMakerSideBar();
                    const searchCustomer = await base.commonfunction.getTabByName('Support');
                    await base.activeprocessdetails.SelectTypeDropDown(searchCustomer);
                    await base.activeprocessdetails.DropDownValueActiveProcessDetails('Active Process Details');
                    await base.activeprocessdetails.BackFillButton();
                    await base.activeprocessdetails.ActiveProcessPath();    //check process function For Back Fill
                }

                await new Promise(resolve => setTimeout(resolve, 3000));

                { // SOA page code
                    const StatmentOfAccounts = await base.commonfunction.getTabByName('Statement Of Accounts');
                    await StatmentOfAccounts.reload({ waitUntil: 'domcontentloaded' });

                    let processedModifier = currentModifier;
                    if (currentModifier !== 'FC' && currentModifier !== 'PP' && typeof currentModifier !== 'number') {
                        processedModifier = parseFloat(currentModifier);
                    }

                    // 1. --- CONSOLE PROCESSING ENGINE ---
                    if (currentModifier === 'FC') {
                        console.log(`🔍 [SOA] Processing Full Closure (FC) for Console...`);
                        await base.soa.ConsoleOSPrincipleAmount(StatmentOfAccounts);
                    } else if (currentModifier === 'FP') {
                        console.log(`💰 [SOA - Console] Running Full Payment logic for modifier: FP`);
                        await base.soa.GetCollectionAmountConsolidatedForFP(StatmentOfAccounts, currentModifier);
                    } else if (currentModifier === 'PP') {
                        console.log(`💰 [SOA - Console] Running PART Payment logic for modifier: PP`);
                        await base.soa.GetCollectionAmountConsolidatedForPP(StatmentOfAccounts, currentModifier);
                    } else if (typeof processedModifier === 'number' && !isNaN(processedModifier)) {
                        if (processedModifier >= 1.0 && processedModifier <= 1.5) {
                            console.log(`💼 [SOA - Console] Running ADVANCED Payment logic for modifier: ${processedModifier}`);
                            await base.soa.GetCollectionAmountConsolidated(StatmentOfAccounts, processedModifier);
                        } else {
                            console.log(`ℹ️ [SOA - Console] Running Standard/Fractional logic for modifier: ${processedModifier}`);
                            await base.soa.GetCollectionAmountConsolidated(StatmentOfAccounts, processedModifier);
                        }
                    } else {
                        console.log(`⚠️ [SOA - Console] Running Fallback logic for unhandled modifier: ${processedModifier}`);
                        await base.soa.GetCollectionAmountConsolidated(StatmentOfAccounts, processedModifier);
                    }

                    await base.soa.ViewFilterDropDownUCO(StatmentOfAccounts);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    await base.commonfunction.Loader1(StatmentOfAccounts);
                    if (currentModifier === 'FC') {
                        console.log(`🔍 [SOA] Processing Full Closure (FC) for Bank...`);
                        await base.soa.BankOSPrincipleAmount(StatmentOfAccounts);
                    } else if (currentModifier === 'FP') {
                        console.log(`💰 [SOA - Bank] Running Full Payment logic for modifier: FP`);
                        await base.soa.GetCollectionAmountBankForFP(StatmentOfAccounts, currentModifier);
                    } else if (currentModifier === 'PP') {
                        console.log(`💰 [SOA - Bank] Running PART Payment logic for modifier: PP`);
                        await base.soa.GetCollectionAmountBankForPP(StatmentOfAccounts, currentModifier);
                    } else if (typeof processedModifier === 'number' && !isNaN(processedModifier)) {
                        if (processedModifier >= 1.0 && processedModifier <= 1.5) {
                            console.log(`💼 [SOA - Bank] Running ADVANCED Payment logic for modifier: ${processedModifier}`);
                            await base.soa.GetCollectionAmountBank(StatmentOfAccounts, processedModifier);
                        } else {
                            console.log(`ℹ️ [SOA - Bank] Running Standard/Fractional logic for modifier: ${processedModifier}`);
                            await base.soa.GetCollectionAmountBank(StatmentOfAccounts, processedModifier);
                        }
                    } else {

                        console.log(`⚠️ [SOA - Bank] Running Fallback logic for unhandled modifier: ${processedModifier}`);
                        await base.soa.GetCollectionAmountBank(StatmentOfAccounts, processedModifier);
                    }

                    await base.soa.GetPartnerName(StatmentOfAccounts);
                    await base.soa.GetProductName(StatmentOfAccounts);

                }
                await new Promise(resolve => setTimeout(resolve, 3000));
                {// Collection-Upload page code

                    await base.sidebarMenu.CollectionUploadSideBarInNewTab();
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    const collectionUpload = await base.commonfunction.getTabByName('Upload Collections');
                    await base.collectionUpload.clickOnManualUploadCheckBox(collectionUpload);
                    await base.collectionUpload.dropDownValuePartnerName(collectionUpload);
                    await new Promise(resolve => setTimeout(resolve, 500));
                    await base.collectionUpload.DropDownValueProductName(collectionUpload);
                    await base.collectionUpload.CollectionChooseAndUploadFileButton(collectionUpload, currentModifier);
                }
                await new Promise(resolve => setTimeout(resolve, 3000));

                { // EOD Processes 
                    await base.sidebarMenu.EodProcessSideBarInNewTab();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const taskscheduler = await base.commonfunction.getTabByName('Task Scheduler');
                    await base.eodprocess.ClickOnEODSchedulerTAB(taskscheduler);
                    await base.eodprocess.EODProcessReadCollectionGoButton(taskscheduler);
                }
                await new Promise(resolve => setTimeout(resolve, 3000));
                {// backfill for - split+leadger+EOD
                    const support = await base.commonfunction.getTabByName('Support');

                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await base.backFill.SelectTypeDropDown(support);
                    await base.backFill.DropDownValueBackFill('Back Fill');
                    await base.backFill.ClickOnUploadFileCheckBox();

                    if (isAppIdSelected) {
                        await base.backFill.BackFillChooseAndUploadFileButton(isAppIdSelected);
                    } else if (isFileUploadSelected) {
                        await base.backFill.BackFillChooseAndUploadFileButton(capturedFilePath);
                    }

                    await base.backFill.FormDateFieldDemand();
                    await base.backFill.ToDateFieldDemand();
                    await base.backFill.SelectBackFillTemplate('Split+Ledgers+EOD');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await base.backFill.CLickOnSaveButton();

                }
                await new Promise(resolve => setTimeout(resolve, 3000));
                {// Collection File approve process

                    const supportChekcker = await base.commonfunction.getTabByName('Support Checker');
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    await supportChekcker.reload({ waitUntil: 'domcontentloaded' });
                    await base.backFillRequestSupportChecker.backFillRequestApproveButton(supportChekcker);

                }

                {//SOA page code
                    const StatmentOfAccountss = await base.commonfunction.getTabByName('Statement Of Accounts');
                    await StatmentOfAccountss.reload({ waitUntil: 'domcontentloaded' });
                    await base.soa.getExcessValueConsole(StatmentOfAccountss);
                    await base.soa.ViewFilterDropDownUCO(StatmentOfAccountss);

                    await base.commonfunction.Loader1(StatmentOfAccountss);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    await base.soa.getExcessValueBank(StatmentOfAccountss);
                }

                await new Promise(resolve => setTimeout(resolve, 3000));
                console.log(`---------------- ✅ Successfully Completed LMS Journey ✅ ----------------`);

                if (currentModifier === 'FC') {
                    console.log(`\n✅ Loop stopped early at index ${i} due to 'FC'`);
                    break;
                }
            } else if (selectedJourney === 'Gold Loan') {

            } else if (selectedJourney === 'M+1') {

            } else if (selectedJourney === 'Unique') {

            } else if (selectedJourney === 'BC') {

            } else if (selectedJourney === 'Application Pool') {

            } else {
                console.log(`⚠️ Unrecognized journey type: ${selectedJourney}. No specific logic executed for this journey.`);
            }

        }
    }
    );

    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {

            const cleanTitle = testInfo.title.replace(/[^a-zA-Z0-9]/g, '_');
            const screenshotPath = `test-results/final-failure-${cleanTitle}.png`;

            await page.screenshot({
                path: screenshotPath,
                fullPage: true
            });

            console.log(`❌ Test failed. Single screenshot captured at: ${screenshotPath}`);
        }
    });
});
