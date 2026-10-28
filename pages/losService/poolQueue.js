import { expect, _baseTest } from '@playwright/test'
import { getBatchName, setCustomerId } from '../../fixtures/baseTest';
import { CommonFunctions } from '../commonFunctions.js';

export const poolQueue =

    class poolQueue {

        constructor(page) {
            this.attach(page);
        }

        attach(page) {

            this.page = page

            this.selectAllLead = this.page.locator('xpath=//input[@class="form-checkbox" or @id="select-all"]');
            this.selectAllLeadSelector = '//input[@class="form-checkbox" or @id="select-all"]';
            this.showSummaryButton = '//*[@class="btn btn-primary" and @id="btnShowSummary"]';

            this.enterSummeryPoolName = '//*[@id="poolName" or @name="poolName" or @placeholder="Enter Pool Name"]';

            this.pushToBankButton = '//*[@type="button" and @id="btnPushToBank"]';
            this.randomElementforNewPage = page.locator('xpath=//*[@class="beacon-title" or @id="PoolHeader"]')

            this.clickonClickherebutton = '//*[@id="pushedBankStatusChk"]//a[contains(text(),"click here")]';

            this.loader1 = page.locator('xpath=//div[@id="status"]')
            this.loader2 = page.locator('xpath=//div[@class="lds-ring"]')

            this.common = new CommonFunctions(page);
        }

        async poolQueueSelectAllCheckBox(targetPage) {

            await this.common.waitForUrlFragment(targetPage, 'GetBatchRecords');

            await this.common.Loader1();
            await new Promise(resolve => setTimeout(resolve, 4000));
            const selectAllLeads = targetPage.locator('//input[@class="form-checkbox" or @id="select-all"]');
            await expect(selectAllLeads, 'Select All Leads checkbox buttons did not appear on page').toBeVisible();
            await selectAllLeads.click();
        }

        async clickShowSummaryButton(targetPage1) {
            await new Promise(resolve => setTimeout(resolve, 4000));
            const selectShowSummary = targetPage1.locator(this.showSummaryButton);
            await expect(selectShowSummary, 'Show Summary button did not appear on page').toBeVisible();
            await selectShowSummary.click();
        }

        async EnterSummaryPoolName(targetPage2) {
            const enterSummaryPoolName = targetPage2.locator(this.enterSummeryPoolName);
            await expect(enterSummaryPoolName, 'Enter Summary Pool Name field did not appear on page').toBeVisible();
            await enterSummaryPoolName.fill(getBatchName());
        }

        async PushToBankButtonDebtPool(targetPage) {

            const pushtoBank = targetPage.locator(this.pushToBankButton);
            await expect(pushtoBank, 'Push to Bank button did not appear on page').toBeVisible();
            await pushtoBank.click();
        }

        async PushToBankButton(targetPage) {

            const customerId = await targetPage.locator('tr td:first-child').innerText();
            setCustomerId(customerId);

            const pushtoBank = targetPage.locator(this.pushToBankButton);
            await expect(pushtoBank, 'Push to Bank button did not appear on page').toBeVisible();
            await pushtoBank.click();
        }

        async ClickOnClickHereButton(targetPage1) {

            try {
                await this.common.waitForUrlFragment(targetPage1, 'PushBankConfirmation');

                const clickherebutton = targetPage1.locator(this.clickonClickherebutton);
                await expect(clickherebutton, 'Click Here button did not appear on page').toBeVisible();
                await clickherebutton.click();
                await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (e) {
                console.log(`Unable to click on CLICK HERE ${e}`)
            }
        }
    }
