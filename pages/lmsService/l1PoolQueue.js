import { getBatchName, getModeName } from '../../fixtures/baseTest.js';
import { CommonFunctions } from '../commonFunctions.js';


export const l1PoolQueue =

    class l1PoolQueue {

        constructor(page) {

            this.page = page;

            this.poolQueueSideBar = page.locator('xpath=//*[@class="fa fa-object-group"]')
            const pool = `xpath=//*[contains(@data-poolnamekey, "${getBatchName()}")]`
            this.pooldynamicXpath = page.locator(pool)
            this.rundedupe = page.locator('xpath=//*[@class="btn btn-primary poolPendingQueueBtn poolRunDedupe" or text()="Run Dedupe"]')
            this.checkBoxAll = page.locator('xpath=//*[@type="checkbox" and @id="select-all"]')
            this.verifyKYC = page.locator('//*[@class="btn btn-primary poolPendingQueueBtn poolRunKYC" or text()="Verify KYC"]')
            this.runBre = page.locator('xpath=//*[@class="btn btn-primary poolPendingQueueBtn poolRunBre" or text()="Run BRE"]')
            this.processbutton = page.locator('xpath=//*[@data-nextpoolstatus="InProcess" and @data-brestatus="NoDeviation" and text()="Process"]')

            this.popupTextLocator = page.locator('//span[@id="poolRunStatus"]');
            this.popupclosebutton = page.locator('//*[@type="button" and @id="confirmationCloseBtn"]');


            this.afterrundeduppopmessageRemaingCount = page.locator('xpath=//span[contains(text(), "Remaining Count")]');
            this.afterrundeduppopmessageprocesssuccessfullymsg = page.locator('xpath=//span[contains(text(), "Process Successfully Completed")]');
            this.eyeiconformode = page.locator('xpath=(//tbody/tr/td/a/i[@class="fa fa-eye"])[1]');
            this.modetextfiled = page.locator('xpath=//label[text()="Mode"]/following-sibling::div/input[@type="text" and @readonly]')

            this.common = new CommonFunctions(page);

        }

        getPoolLocator() {

            this.pooldynamicXpath.waitFor({ state: 'visible' })
            this.pooldynamicXpath.click();
        }

        async popupCloseButton() {
            try {
                await this.popupclosebutton.waitFor({ state: 'visible' });
                await this.popupclosebutton.click();
            } catch (e) {
                console.log(`Unable to see close button else successfully clicked on CLOSE button`);
            }
        }

        async clickOnPoolQueueSideBar() {
            await this.poolQueueSideBar.waitFor({ state: 'visible' });
            await this.poolQueueSideBar.click();
        }

        async clickOnpoolfromList() {
            await this.pooldynamicXpath.waitFor({ state: 'visible' });
            await this.pooldynamicXpath.click()
        }

        async ClickOnRunDedupeButton(page) {
            await this.common.Loader1();
            await this.rundedupe.waitFor({ state: 'visible' });
            await this.rundedupe.click();

            await this.afterrundeduppopmessageprocesssuccessfullymsg.waitFor({ state: 'visible', timeout: 600000 });

            try {
                await this.afterrundeduppopmessageRemaingCount({ state: 'visible' })
                if (await this.afterrundeduppopmessageRemaingCount && await this.afterrundeduppopmessageRemaingCount.isVisible()) {
                    await this.afterrundeduppopmessageRemaingCount({ state: 'visible' })

                    const text = await page.locator(this.afterrundeduppopmessageRemaingCount).textContent();
                    console.log(`Text :-`, text);

                    await this.afterrundeduppopmessageRemaingCount({ state: 'visible' })

                    await text.click();

                    console.log(`Click on text1`);
                } else {
                    console.log(`Not display xpath after Click on RunDedup: ${this.afterrundeduppopmessageRemaingCount}`);
                }

            } catch (e) {
                console.log(`Getting error after click on run dedup: ${e.message}`);
            }


            await this.popupCloseButton();
            console.log(`Run dedup process completed..`);

        }

        async VerifyKYCButton() {
            await this.common.Loader1();
            await this.pooldynamicXpath.waitFor({ state: 'visible' });
            await this.pooldynamicXpath.click();
            await this.checkBoxAll.waitFor({ state: 'visible' });
            await this.checkBoxAll.click();
            await this.verifyKYC.waitFor({ state: 'visible' });
            await this.verifyKYC.click();
            await this.popupCloseButton();
        }

        async RunBREButton() {

            await this.common.Loader1();
            await this.pooldynamicXpath.waitFor({ state: 'visible' });
            await this.pooldynamicXpath.click();
            await this.runBre.waitFor({ state: 'visible' });
            await this.runBre.click();
            await this.popupCloseButton();
        }

        async ProcessButton() {

            await this.common.Loader1();
            await this.pooldynamicXpath.waitFor({ state: 'visible' });
            await this.pooldynamicXpath.click();
            await this.processbutton.waitFor({ state: 'visible' });
            await this.processbutton.click();
            await new Promise(resolve => setTimeout(resolve, 10000))
        }


        async listPoolselect() {
            await this.common.Loader1();
            await this.pooldynamicXpath.waitFor({ state: 'visible' });
            await this.pooldynamicXpath.click();
        }

        async ClickOnEyeIconForgetModeName() {

            await this.eyeiconformode.waitFor({ state: 'visible' });
            await this.eyeiconformode.click();
        }

        async getModeName(targetPage) {
            
            const pageContext = targetPage || this.page;

            const modeNameLocator = pageContext.locator('xpath=//label[text()="Mode"]/following-sibling::div/input[@type="text" and @readonly]');

            await modeNameLocator.waitFor({ state: 'visible' });
            const rawModeName = await modeNameLocator.inputValue();
            process.env.ModeName = rawModeName.trim();
            //console.log(`Mode Name =========================== ${getModeName()}`)
            await pageContext.close(); 
        }

    }
