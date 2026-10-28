import { test } from '@playwright/test';
import { BaseTest } from '../../../../fixtures/baseTest.js';
import path from 'path';
import fs from 'fs';

test.describe('LmS Service Flow', () => {
    let base;

    test.beforeEach(async ({ page }) => {
        base = new BaseTest();
        await base.init(page);
    });


    test('Data Clean & Rebuild Process', async ({ page }) => {

        const relativeFilePath = path.resolve(process.cwd(), 'HTML pages/dataCleanUp_Rebuild.html');
        const localPageUrl = `file:///${relativeFilePath.replace(/\\/g, '/')}`;
        await page.goto(localPageUrl, { waitUntil: 'domcontentloaded' });

        await page.waitForFunction(() => {
            const form = document.getElementById('appForm');
            return form && form.getAttribute('data-automation-status') === 'triggered';
        }, { timeout: 5000 });

        page.on('dialog', async dialog => {
            //console.log(`💬 Browser dialog intercepted: [${dialog.message()}]`);
            await dialog.accept();
        });

        //console.log("⏳ STANDBY: Fill all form fields in the browser window and click the orange 'Submit' button...");

        await page.waitForFunction(() => {
            const form = document.getElementById('appForm');
            return form && form.getAttribute('data-automation-status') === 'submitted';
        }, { timeout: 0 });

        //console.log("🚀 Submit action caught in time! Reading input elements out of sandbox storage...");

        const htmlDataCleanInput = page.locator('id=datacleanup_Upload');
        const htmlBackfillInput = page.locator('id=backfill_Upload');
        const htmlCollectionInput = page.locator('id=collectionfileupload');

        const datacleanupData = await htmlDataCleanInput.evaluate(async (input) => {
            if (!input.files || input.files.length === 0) return null;
            const file = input.files[0];
            const buffer = await file.arrayBuffer();
            const uint8 = new Uint8Array(buffer);
            let binaryString = '';
            const chunkSize = 0xffff;
            for (let i = 0; i < uint8.length; i += chunkSize) {
                binaryString += String.fromCharCode.apply(null, uint8.subarray(i, i + chunkSize));
            }
            return { name: file.name, base64: btoa(binaryString) };
        });

        const backfillData = await htmlBackfillInput.evaluate(async (input) => {
            if (!input.files || input.files.length === 0) return null;
            const file = input.files[0];
            const buffer = await file.arrayBuffer();
            const uint8 = new Uint8Array(buffer);
            let binaryString = '';
            const chunkSize = 0xffff;
            for (let i = 0; i < uint8.length; i += chunkSize) {
                binaryString += String.fromCharCode.apply(null, uint8.subarray(i, i + chunkSize));
            }
            return { name: file.name, base64: btoa(binaryString) };
        });

        const collectionData = await htmlCollectionInput.evaluate(async (input) => {
            if (!input.files || input.files.length === 0) return null;
            const file = input.files[0];
            const buffer = await file.arrayBuffer();
            const uint8 = new Uint8Array(buffer);
            let binaryString = '';
            const chunkSize = 0xffff;
            for (let i = 0; i < uint8.length; i += chunkSize) {
                binaryString += String.fromCharCode.apply(null, uint8.subarray(i, i + chunkSize));
            }
            return { name: file.name, base64: btoa(binaryString) };
        });

        const targetFolder = path.resolve(process.cwd(), 'excelFiles');
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
            //console.log(`📁 Created new directory folder: "${targetFolder}"`);
        }

        let savedDataCleanPath = '';
        let savedBackfillPath = '';
        let savedCollectionPath = '';

        if (datacleanupData) {
            savedDataCleanPath = path.join(targetFolder, datacleanupData.name);
            fs.writeFileSync(savedDataCleanPath, Buffer.from(datacleanupData.base64, 'base64'));
            //console.log(`💾 Data Clean file physically stored at: "${savedDataCleanPath}"`);
        }

        if (backfillData) {
            savedBackfillPath = path.join(targetFolder, backfillData.name);
            fs.writeFileSync(savedBackfillPath, Buffer.from(backfillData.base64, 'base64'));
            //console.log(`💾 BackFill file physically stored at: "${savedBackfillPath}"`);
        }

        if (collectionData) {
            savedCollectionPath = path.join(targetFolder, collectionData.name);
            fs.writeFileSync(savedCollectionPath, Buffer.from(collectionData.base64, 'base64'));
            //console.log(`💾 Collection file physically stored at: "${savedCollectionPath}"`);
        }

        const rebuildValue = await page.locator('#rebuild').inputValue();
        const isHidden = rebuildValue !== 'true';

        const storedUserData = {
            datacleanupFile: datacleanupData ? datacleanupData.name : "No file chosen",
            backfillFile: backfillData ? backfillData.name : "No file chosen",
            collectionFile: collectionData ? collectionData.name : "No file chosen",
            fromDate: await page.locator('id=rebuildFromDate').inputValue(),
            toDate: await page.locator('id=rebuildToDate').inputValue(),
            datacleanupdate: await page.locator('id=appDate').inputValue(),
            partnerValue: isHidden ? "Hidden (Not Required)" : await page.$eval('#partnerSelect', sel => sel.options[sel.selectedIndex].text),
            productValue: isHidden ? "Hidden (Not Required)" : await page.$eval('#productSelect', sel => sel.options[sel.selectedIndex].text),
            rebuildValue: rebuildValue === "" ? "Unselected" : rebuildValue,
            // loan_status: await page.locator('#loanStatus').inputValue(),
            // BankAccountStatus: await page.locator('#bankStatus').inputValue()
        };

        const [year, month, day] = storedUserData.datacleanupdate.split('-');
        const selectDateforCleanData = `${day}/${month}/${year}`;
        const REBUILD = (rebuildValue === 'true');

        console.log("\n=======================================================");
        console.log("📊 REPORT: COMPARED OBJECT AND DIRECTORY STORAGE METRICS:");
        console.log("=======================================================");
        console.log(`📂 Saved Folder Name    : excelFiles/`);
        console.log(`📂 Saved change account status File: ${storedUserData.datacleanupFile}`);
        console.log(`📂 Saved BackFill File  : ${storedUserData.backfillFile}`);
        console.log(`📂 Saved Collection File: ${storedUserData.collectionFile}`);
        console.log(`📅 From Date Parameter  : ${storedUserData.fromDate}`);
        console.log(`📅 To Date Parameter    : ${storedUserData.toDate}`);
        console.log(`📅 Clean Up Date Value  : ${storedUserData.datacleanupdate}`);
        console.log(`🏢 Selected Partner ID  : ${storedUserData.partnerValue}`);
        console.log(`📦 Selected Product Code: ${storedUserData.productValue}`);
        console.log(`🔄 Rebuild Value        : ${storedUserData.rebuildValue}`);
        //console.log(`💰 Loan Status          : ${storedUserData.loan_status}`);
        //console.log(`🏦 Bank Loan Status     : ${storedUserData.BankAccountStatus}`);
        console.log("=======================================================\n");

        await base.loginPage.superAdminLogin('loginCred');
        await base.sidebarMenu.supportCheckerSideBarOpen();
        await new Promise(resolve => setTimeout(resolve, 2000));
        await base.backFill.supportMakerSideBar();

        if (storedUserData.collectionFile && storedUserData.collectionFile.trim() !== "") {
            await base.sidebarMenu.CollectionUploadSideBarInNewTab();
            await base.sidebarMenu.EodProcessSideBarInNewTab();
        }

        // DataCleanUp & Loan Status change
        const searchCustomerTabb = await base.commonfunction.getTabByName('Support');
        await base.backFill.SelectTypeDropDown();
        await base.backFill.DropDownValueBackFill('Data CleanUp');

        await base.dataCleanUp.UploadFileCheckBox();
        await base.dataCleanUp.ChooseFileButtonviaUserInput(storedUserData.backfillFile);
        await base.dataCleanUp.AllExceptDisbursal();


        await base.dataCleanUp.DemandSchedule_DataCleanUp(selectDateforCleanData);
        await base.dataCleanUp.DPDHistory_DataCleanUp(selectDateforCleanData);
        await base.dataCleanUp.RevertRPS_DataCleanUp(selectDateforCleanData);
        await base.dataCleanUp.OverdueEntries_DataCleanUp(selectDateforCleanData);

        await base.dataCleanUp.RemoveDataButton(); if (REBUILD) {
            //console.log(`🔄 Rebuild flag is active. Triggering Collection Feed Split data clean-up for date: ${selectDateforCleanData}...`);
            await base.dataCleanUp.CollectionFeedSplit_DataCleanUp(selectDateforCleanData);
        }

        await base.dataCleanUp.LedgerEntries_DataCleanUp(selectDateforCleanData);

        const supportChekcker = await base.commonfunction.getTabByName('Support Checker');
        await supportChekcker.reload({ waitUntil: 'domcontentloaded' });
        await base.backFillRequestSupportChecker.DataCleanUpRequestTab(supportChekcker);

        // await new Promise(resolve => setTimeout(resolve, 5000));
        await base.backFillRequestSupportChecker.SearchAndClickOnApprvoveButtonAndOKButton(supportChekcker, storedUserData.backfillFile);

        // await new Promise(resolve => setTimeout(resolve, 5000));
        console.log(`Data Successfully Cleaned Up as per From Date :- \x1b[36m${selectDateforCleanData}\x1b[0m`);

        if (storedUserData.datacleanupFile && storedUserData.datacleanupFile.trim() !== "") {

            const activeTab = await base.sidebarMenu.supportMakerSideBarInNewTab();
            await base.backFill.SelectTypeDropDown();
            await base.backFill.DropDownValueBackFill('Change Account Status');

            await base.changeAccountStatus.uploadFileLocator.waitFor({ state: 'attached', timeout: 3000 }).catch(() => { });
            if (await base.changeAccountStatus.uploadFileLocator.isVisible()) {
                await base.changeAccountStatus.clickUploadFileButton();
                //console.log("Yee, Upload file status change process started");

                const normalizedPath = storedUserData.datacleanupFile.replace(/\\/g, '/');

                const absolutePath = path.resolve(process.cwd(), normalizedPath);
                await base.changeAccountStatus.ChooseFileButton(absolutePath);
                await base.changeAccountStatus.ProcessButton();

                console.log(`\x1b[32m✔ SUCCESS: Account Status successfully changed as per file upload ➔ [${normalizedPath}]\x1b[0m`);

            } else {
                await base.changeAccountStatus.AppWiseButton();
                await base.changeAccountStatus.ApplicationIdField();

                const scenarioKey = `${storedUserData.loan_status}_${storedUserData.BankAccountStatus}`;

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
                            //console.log(`Browser Alert Intercepted: [${dialog.message()}]`);
                            await dialog.accept();
                            //console.log(`Alert dialog accepted successfully.`);
                        });
                    }
                    if (storedUserData.loan_status !== "") await base.changeAccountStatus.SelectLoanStatus(currentScenario.loan);
                    if (storedUserData.BankAccountStatus !== "") await base.changeAccountStatus.SelectBankStatus(currentScenario.bank);

                } else {
                    console.warn(`Scenario combination not explicitly locked in configuration matrix for "${scenarioKey}".`);
                    if (storedUserData.loan_status !== "") await base.changeAccountStatus.SelectLoanStatus(storedUserData.loan_status);
                    if (storedUserData.BankAccountStatus !== "") await base.changeAccountStatus.SelectBankStatus(storedUserData.BankAccountStatus);
                }

                await base.changeAccountStatus.SaveStatusbutton();
                console.log(`✅ Account Status Changed Successfully! | Updated ➔ Loan Status: ${storedUserData.loan_status} | Bank Status: ${storedUserData.BankAccountStatus}`);
            }

        } else {
            console.log("\x1b[33m%s\x1b[0m", "Loan Status or Bank Status is blank. Skipping 'Change Account Status' step mapping.");
        }


        //Rebuild process started from here
        const searchCustomerTab = await base.commonfunction.getTabByName('Support');
        await base.backFill.SelectTypeDropDown();
        await base.backFill.DropDownValueBackFill('Back Fill');
        await base.backFill.ClickOnUploadFileCheckBox();

        await base.backFill.CollectiopnRebuild_BackFillFileUpload(storedUserData.backfillFile);

        await base.backFill.CollectiopnRebuild_FormDateFieldEodBod(storedUserData.fromDate);
        await base.backFill.CollectiopnRebuild_ToDateFieldEodBod(storedUserData.toDate);

        await base.backFill.SelectBackFillTemplate('all');
        await base.backFill.SelectCollectionReadMethod('NewCollection');
        await base.backFill.SelectCollectionFileSource('CollectionFeed');
        await new Promise(resolve => setTimeout(resolve, 2000));

        await base.backFill.CLickOnSaveButton();
        await new Promise(resolve => setTimeout(resolve, 10000));

        {   // backfill approve process
            const activeTab = await base.sidebarMenu.supportCheckerSideBarInNewTab();
            base.backFillRequestSupportChecker.page = activeTab;
            await base.backFillRequestSupportChecker.Collectionrebuild_backFillRequestApproveButton(activeTab, storedUserData.backfillFile);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        {//Active Process Details  
            await base.activeprocessdetails.supportMakerSideBar();
            const searchCustomer = await base.commonfunction.getTabByName('Support');
            await base.activeprocessdetails.SelectTypeDropDown(searchCustomer);
            await base.activeprocessdetails.DropDownValueActiveProcessDetails('Active Process Details');
            await base.activeprocessdetails.BackFillButton();
            await base.activeprocessdetails.ActiveProcessPath(storedUserData.backfillFile);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        const hasValidCollectionFile =
            storedUserData.collectionFile &&
            storedUserData.collectionFile.trim() !== "" &&
            storedUserData.collectionFile !== "No file chosen";

        if (hasValidCollectionFile && !storedUserData.isCollectionFeedChecked) {

            { // Collection-Upload page code
                await base.sidebarMenu.CollectionUploadSideBarInNewTab();
                await new Promise(resolve => setTimeout(resolve, 2000));
                const collectionUpload = await base.commonfunction.getTabByName('Upload Collections');
                await base.collectionUpload.clickOnManualUploadCheckBox(collectionUpload);
                await base.collectionUpload.ColelctionRebuild_dropDownValuePartnerName(collectionUpload, storedUserData.partnerValue);
                await new Promise(resolve => setTimeout(resolve, 500));
                await base.collectionUpload.CollectionRebuild_DropDownValueProductName(collectionUpload, storedUserData.productValue);
                await base.collectionUpload.CollectionRebuild_CollectionChooseAndUploadFileButton(collectionUpload, storedUserData.collectionFile);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }

            { // EOD Processes 
                await base.sidebarMenu.EodProcessSideBarInNewTab();
                const taskscheduler = await base.commonfunction.getTabByName('Task Scheduler');
                await base.eodprocess.ClickOnEODSchedulerTAB(taskscheduler);
                await base.eodprocess.EODProcessReadCollectionGoButton(taskscheduler);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }

        } else {
            console.log("\x1b[33m%s\x1b[0m", `Collection file not selected. Skipping Upload and EOD processes.`);
        }

        console.log("\x1b[32m%s\x1b[0m", "✅ Rebuild process successfully completed...! ✅");
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    test.afterAll(async () => {

        const targetFolder = path.resolve(process.cwd(), 'excelFiles');
        try {
            if (fs.existsSync(targetFolder)) {
                fs.rmSync(targetFolder, { recursive: true, force: true });
                console.log("\x1b[36m%s\x1b[0m", `🧹 CLEANUP: Successfully deleted the uploaded files from directory: "${targetFolder}"`);
            }
        } catch (error) {
            console.error(`❌ Cleanup failed: Could not clear the excelFiles folder:`, error.message);
        }
    });

});
