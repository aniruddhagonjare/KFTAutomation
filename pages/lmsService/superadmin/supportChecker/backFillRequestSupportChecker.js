import { stat } from "node:fs";
import { page, getApplicationId, getFirstDateRPS, getbackFillFileName } from "../../../../fixtures/baseTest.js";
import { BrowserUtils } from '../../../../src/utils/losServiceUtils/BrowserUtlis.js';


export class backFillRequestSupportChecker {

    constructor(page) {
        this.attach(page);
    }

    attach(page) {

        this.page = page;
        this.supportcheckersidebar = page.locator('xpath=//li[@title="Support" and @checker]');

        this.checkformdate = page.locator('xpath=//table[@id="tblGridBackFillAudits"]//tbody//tr[1]//td[6]')
        this.backfillrequestapprovebutton = 'xpath=//table[@id="tblGridBackFillAudits"]//tbody//tr[1]//button[contains(text(),"Approve")]';
        //    //*[@class="d-flex align-items-center"]//button[@type="button" and contains(text(),"Approve")]

        this.datacleanuprequestTab = '//a[@id="Data-CleanUp-tab" and @role="tab" and contains(text(),"Data CleanUp Requests")]';
        this.searchinputfield = 'xpath=//input[@type="search" and @id="dt-search-0"]';
        this.searchinputfieldDataCleanuUp = 'xpath=//input[@type="search" and @id="dt-search-1"]';

        this.ApproveButtonDatClenUp = 'xpath=(//button[contains(@class, "ApprovebtnforDataCleanUp") and @type="button"])[1]';
    }


    async supportCheckerSideBar() {
        await this.supportcheckersidebar.waitFor({ State: 'visible' })
        await this.supportcheckersidebar.click();
    }

    async backFillRequestApproveButton(targetPage) {
        const currentPage = targetPage || this.page;

        await BrowserUtils.defaultReload(this.page);

        // console.log(`Started BackFill Approve process :- Test`);
        const field = currentPage.locator(this.searchinputfield);
        await field.waitFor({ state: 'visible' });
        await field.click();
        await field.fill(getbackFillFileName());

        const field2 = currentPage.locator(this.backfillrequestapprovebutton);
        await field2.waitFor({ State: 'visible' });
        await field2.click();

        const okButton = currentPage.locator('//button[@type="button" and contains(text(),"Ok")]');
        await okButton.waitFor({ state: 'visible' });
        await okButton.click();
    }

    async DataCleanUpRequestTab(targetPage) {
        const currentPage = targetPage || this.page;
        try {
            const field2 = currentPage.locator(this.datacleanuprequestTab);
            await field2.waitFor({ State: 'visible' });
            await field2.click();

        } catch (error) {
            console.error(`❌ Error in Data Clean Up TAB:`, error.message);
            throw error;
        }
    }

    async SearchAndClickOnApprvoveButtonAndOKButton(targetPage, fileName) {
        const currentPage = targetPage || this.page;
        try {
            const field1 = currentPage.locator(this.searchinputfieldDataCleanuUp);
            await field1.waitFor({ state: 'visible' });
            await field1.fill(getbackFillFileName() || fileName);

            const field2 = currentPage.locator(this.ApproveButtonDatClenUp);
            await field2.waitFor({ state: 'visible' });
            await field2.click();

            const okButton = currentPage.locator('//button[@type="button" and contains(text(),"Ok")]');
            await okButton.waitFor({ state: 'visible' });
            await okButton.click();

            //console.log(`✅ Successfully searched for [${fileName}], clicked Approve, and resolved OK modal window.`);

        } catch (error) {
            console.error(`❌ Error in Data Clean Up TAB:`, error.message);
            throw error;
        }
    }

    async Collectionrebuild_backFillRequestApproveButton(targetPage, renamedFilePath) {
        const currentPage = targetPage || this.page;

        await BrowserUtils.defaultReload(this.page);

        // console.log(`Started BackFill Approve process :- Test`);
        const field = currentPage.locator(this.searchinputfield);
        await field.waitFor({ state: 'visible' });
        await field.click();
        await field.fill(renamedFilePath);

        const field2 = currentPage.locator(this.backfillrequestapprovebutton);
        await field2.waitFor({ State: 'visible' });
        await field2.click();

        const okButton = currentPage.locator('//button[@type="button" and contains(text(),"Ok")]');
        await okButton.waitFor({ state: 'visible' });
        await okButton.click();
    }
}