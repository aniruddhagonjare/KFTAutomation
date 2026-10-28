import { test, expect } from '@playwright/test';

import {  getBatchName } from '../../fixtures/baseTest.js';
// import { baseTest, batchName, getApplicationId, getBatchName, setApplicationId } from '../../fixtures/baseTest.js';
import { CommonFunctions } from '../commonFunctions.js';


export const l3PoolQueue =
    class l3PoolQueue {

        constructor(page) {

            this.page = page;

            //Inprocess TAB
            this.poolQueueSideBar = page.locator('xpath=//*[@title="Pool" or text()="Pool Queue" and @class="fa fa-object-group"]')
            const pool = `xpath=//*[contains(@data-poolnamekey, "${getBatchName()}")]`;
            // const pool = `xpath=//*[contains(@data-poolnamekey, "TestDebtPool1")]`;
            this.dynamicXpath = page.locator(pool);
            this.approveallbtn = page.locator('xpath=//*[@data-nextpoolstatus="Approve" and text()="Approve All"]')

            //ApprovalPending TAB
            this.clickonapprovaltab = page.locator('xpath=//*[@id="approvedPool-tab" and text()="Approval Pending"]')
            this.clickonFetchFromApibutton = page.locator('xpath=//*[contains(text(), "Fetch from API")]')

            //Assigned TAB
            this.clickOnAssignedTab = page.locator('xpath=//*[@id="assignedPool-tab" and text()="Assigned" and @role="tab"]')
            this.clickOnGenerateInternalLA = page.locator('xpath=//button[contains(text(), "Generate Internal LA")]')

            this.confirmationCloseBtnafterLAcreation = page.locator('xpath=//*[@type="button" and @id="confirmationCloseBtn" and text()="Close"]')

            this.processToDisbursedButton = page.locator('xpath=//button[contains(text(), "Process to Disbursed")]')
            this.modalOkButton = page.locator('xpath=//*[@id="confirmationModalOk" and text()="Ok"]')
            this.modalCloseButton = page.locator('xpath=//*[@id="confirmationCloseBtn" and text()="Close"]')

            //Disbursed TAB
            this.clickOnDisbursedTab = page.locator('xpath=//*[@id="disbursedPool-tab" and text()="Disbursed" and @role="tab"]')

            this.common = new CommonFunctions(page);
        }


        async clickOnPoolQueueSideBar() {

            await this.poolQueueSideBar.waitFor({ state: 'visible' });
            await this.poolQueueSideBar.click();

        }

        async clickOnpoolfromList() {

            await this.common.Loader1();
            await this.dynamicXpath.waitFor({ state: 'visible' });
            await this.dynamicXpath.click();

        }

        async clickOnApproveALLButton() {

            await this.approveallbtn.waitFor({ state: 'visible' });
            await this.approveallbtn.click();

        }

        async ClickOnApprovalPendingTAB() {

            await this.common.Loader1();
            await this.clickonapprovaltab.waitFor({ state: 'visible' });
            await this.clickonapprovaltab.click();


        }

        async ClickOnFetchFromAPIButton() {


            await this.clickonFetchFromApibutton.waitFor({ state: 'visible' })
            await this.clickonFetchFromApibutton.click();

        }

        async ClickOnAssignedTAB() {

            await this.common.Loader1();
            await this.clickOnAssignedTab.waitFor({ state: 'visible' });
            await this.clickOnAssignedTab.click();

        }

        async ClickOnDisbursedTAB() {

            await this.common.Loader1();
            await this.clickOnDisbursedTab.waitFor({ state: 'visible' });
            await this.clickOnDisbursedTab.click();

        }

        async ModalOkButtonAfterAssignedTAB() {

            await this.modalOkButton.waitFor({ state: 'visible' })
            await this.modalOkButton.click();
        }

        async ModalCloseButtonAfterAssignedTAB() {

            await this.modalCloseButton.waitFor({ state: 'visible' })
            await this.modalCloseButton.click();
        }

        async ClickOnGenerateInternalLAButton() {
            await this.clickOnGenerateInternalLA.waitFor({ state: 'visible' })
            await this.clickOnGenerateInternalLA.click();
        }

        // async ClickOnProcessToDisbursedButton() {

        //     console.log(`Fetching application Number from Debt Pool journey`);


        //     const firstRowElement = this.page.locator('tbody tr').first().locator('td').last();
        //     await firstRowElement.waitFor({ state: 'visible' });
        //     const firstCellText = await firstRowElement.innerText();
        //     const match = firstCellText.match(/\d+/);

        //     if (match) {
        //         const applicationNumber = match[0];
        //         process.env.GLOBAL_APPLICATION_ID = applicationNumber;

        //     } else {
        //         throw new Error(`Failed to extract application number from text: "${firstCellText}"`);
        //     }
        //     await new Promise(resolve => setTimeout(resolve, 10000) )

        //     await this.processToDisbursedButton.waitFor({ state: 'visible' })
        //     await this.processToDisbursedButton.click();
        // }

        async ClickOnProcessToDisbursedButton() {
            console.log(`Fetching application Number from Debt Pool journey`);

            const firstRowElement = this.page.locator('tbody tr').first().locator('td').last();

            await expect(firstRowElement, 'First row grid data cell did not appear').toBeVisible();

            const firstCellText = await firstRowElement.innerText();
            const match = firstCellText.match(/\d+/);

            expect(match, `Failed to extract application number from text: "${firstCellText}"`).toBeTruthy();

            const applicationNumber = match[0];
            process.env.GLOBAL_APPLICATION_ID = applicationNumber;

            await expect(this.processToDisbursedButton, 'Process to Disbursed button is missing or un-clickable').toBeVisible();
            await this.processToDisbursedButton.click();
        }

        async ConfirmModalCloseButton() {
            await this.confirmationCloseBtnafterLAcreation.waitFor({ state: 'visible' })
            await this.confirmationCloseBtnafterLAcreation.click();
        }

    }