// import { test, expect } from '@playwright/test';
import { ENV_DATA } from '../../src/config/credential.config.js';
import { URLS } from '../../src/config/urls.config.js';
import { test, expect, getCustomerId, setApplicationId, getApplicationId,getModeName } from '../../fixtures/baseTest.js';
import { get } from 'node:http';
import { loginPage } from '../losService/loginPage.js';

export const applicationQueue =

    class applicationQueue {

        constructor(page) {

            this.attach(page);
        }
        attach(page) {
            this.page = page;
            this.clickonapplicationqueue = page.locator('xpath=//h2[contains(text(),"Application Queue(Pool)")]');
            this.clickonapplicationactive = page.locator('xpath=//h2[contains(text(),"Applications Active")]');
            this.clickonrevertedapplication = page.locator('xpath=//h2[contains(text(),"Reverted Applications")]');
            this.clickonapplicationapproved = page.locator('xpath=//h2[contains(text(),"Applications Approved")]');
            this.clickonapplicationrejected = page.locator('xpath=//h2[contains(text(),"Applications Rejected")]');
            this.clickonholdapplication = page.locator('xpath=//h2[contains(text(),"Hold Applications")]');

            this.applicationqueueSidebar = page.locator('//a[@class="nav-link" and .//i[@class="fa fa-sitemap"] and .//span[@class="nav-link-text"]]'); //a[@class="nav-link" and .//i[@class="fa fa-sitemap"] and .//span[@class="nav-link-text"]]

            this.runededupbutton = page.locator('xpath=//*[@id="dedupe" and contains(text(), "Run Dedupe")]');
            this.textmessageafterclickonruneDedup = page.locator('//*[@for="DedupeFlag" and contains(text(), "Customer is")]');

            this.runebrebutton = page.locator('//*[contains(text(), "Run BRE")]');
            this.fetchfromoriginator = '//input[@type="button" and @value="Fetch from Originator"]';
            this.onbrepagefinaleligibilitytab = '//*[@class="tablinks nav-link" and contains(text(), "Final Eligibility")]';
            this.confirmbrebutton = '//input[@type="button" and @id="btnConfirmBRE" and @value="Confirm BRE"]';

            this.remarkstextarefield = page.locator('//textarea[@placeholder="Enter Remarks" or @placeholder="Enter Remarks" or @id="txtRemarks"]');
            this.credirvettingcompletedbutton = page.locator('//button[@type="button" and @id="L1AppBtn" and contains(text(),"Credit Vetting Completed")]');
            this.recommendforapprovetol3Button = page.locator('//button[@type="button" and contains(text(),"Recommend for Approval(To L3)")]');

            this.searchfield = page.locator('xpath=//*[@type="search" and @id="pendingSearch"]');
            this.loader1 = 'xpath=//div[@id="status"]';
        }


        async CLickOnApplicationQueueSideBar() {
            await this.applicationqueueSidebar.waitFor({ state: 'visible' });
            await this.applicationqueueSidebar.click();
        }

        async ClickOnApplicationQueueHeading() {
            await this.clickonapplicationqueue.waitFor({ state: 'visible' });
            await this.clickonapplicationqueue.click();

            await this.SearchFieldInApplicationQueue();
            await this.Loader1();
        }

        async ClickOnFirstLeadFromApplicationQueue() {

            await this.Loader1();

            const firstCell = this.page.locator('tr td:nth-child(2)');

            await firstCell.waitFor({ state: 'visible', timeout: 30000 });
            const ApplicationId = await firstCell.innerText();
            process.env.GLOBAL_APPLICATION_ID = ApplicationId;

            const firstRowAction = await this.page.locator('tbody tr').first().locator('a.btn');
            await firstRowAction.waitFor({ state: 'visible' });
            await firstRowAction.click();

            //console.log(`Clicked on the first lead in Application Queue with Application ID: ${getApplicationId()}`);

            // Getting Mode name :---------
            const modeNameLocator = this.page.locator('xpath=//label[text()="Mode"]/following-sibling::div/input[@type="text" and @readonly]');

            await modeNameLocator.waitFor({ state: 'visible' });
            const rawModeName = await modeNameLocator.inputValue();
            process.env.ModeName = rawModeName.trim();
            console.log(`Mode Name ===========================>>  ${getModeName()}`)
        }

        async ClickOnApplicationsActiveHeading() {
            await this.clickonapplicationactive.waitFor({ state: 'visible' });
            await this.clickonapplicationactive.click();
        }

        async ClickOnRevertedApplicationsHeading() {
            await this.clickonrevertedapplication.waitFor({ state: 'visible' });
            await this.clickonrevertedapplication.click();
        }

        async ClickOnApplicationsApprovedHeading() {
            await this.clickonapplicationapproved.waitFor({ state: 'visible' });
            await this.clickonapplicationapproved.click();
        }

        async ClickOnApplicationsRejectedHeading() {
            await this.clickonapplicationrejected.waitFor({ state: 'visible' });
            await this.clickonapplicationrejected.click();
        }

        async ClickOnHoldApplicationsHeading() {
            await this.clickonholdapplication.waitFor({ state: 'visible' });
            await this.clickonholdapplication.click();
        }

        async ClickOnRunDedupButton() {
            await this.runededupbutton.waitFor({ state: 'visible' })
            await this.runededupbutton.click();
        }

        async TextMessageAFterClickOnRunDedupButton() {
            try {
                await this.textmessageafterclickonruneDedup.waitFor({ state: 'visible' });
                const dedupmessage = await this.textmessageafterclickonruneDedup.textContent();
            } catch (e) {
                console.log(`Unable to display message after click on Run Dedup button or element did not appeared)`);
            }
        }

        async ClickOnRunBREButton() {
            await this.runebrebutton.waitFor({ state: 'visible' })
            await this.runebrebutton.click();
        }

        async OnBrePageClickOnFetchFromOriginatorButton(targetPage) {

            const originatorButton = targetPage.locator(this.fetchfromoriginator);
            await originatorButton.waitFor({ state: 'visible' })
            await originatorButton.click();
        }


        async OnBrePageFinalEligibilityTAB(targetPage) {
            const FinalelgibiltyTAB = targetPage.locator(this.onbrepagefinaleligibilitytab);
            await FinalelgibiltyTAB.waitFor({ state: 'visible' });
            await FinalelgibiltyTAB.click();
        }

        async ClickOnConfirmBREButton(targetPage) {
            const confirmbre = targetPage.locator(this.confirmbrebutton);
            await confirmbre.waitFor({ state: 'visible' });
            await confirmbre.click();
        }

        async CreditVettingCompletedButton() {
            await this.RemarksTextAreaField();
            await this.credirvettingcompletedbutton.waitFor({ state: 'visible' })
            await this.credirvettingcompletedbutton.click();

        }

        async RecommendedForApprovalToL3Button(loginPage, lmsurl, EnterLoginCredentials) {

            if (await this.recommendforapprovetol3Button.isDisabled()) {

                await loginPage.gotolmsURL(lmsurl);
                await loginPage.loginL2User(EnterLoginCredentials);
                console.log(`Started L2 User functionality...`);
            } else {

                await this.RemarksTextAreaField();
                await this.recommendforapprovetol3Button.waitFor({ state: 'visible' })
                await this.recommendforapprovetol3Button.click();
            }
        }

        async RemarksTextAreaField() {
            await this.remarkstextarefield.waitFor({ state: 'visible' })
            await this.remarkstextarefield.fill('Automation Test Remarks');

        }

        async Loader1(targetPage) {
            const currentPage = targetPage || this.page;
            const currentLoader = currentPage.locator(this.loader1);
            try {
                await currentLoader.waitFor({ state: 'visible', timeout: 15000 });
                await currentLoader.waitFor({ state: 'hidden', timeout: 15000 });
            } catch (error) {
                console.log("Loader did not appear within 30 seconds. Skipping loader wait.");
            }
        }

        async SearchFieldInApplicationQueue() {
            await this.searchfield.waitFor({ state: 'visible' });
            await this.searchfield.fill(getCustomerId());
            await this.searchfield.press('Enter');
        }
    }