import { getbackFillFileName } from "../../../../fixtures/baseTest.js";


export class activeProcessDetails {
    constructor(page) {
        this.page = page;
        this.supportmakersidebar = page.locator('xpath=//li[@title="Support" and @maker]');
        this.selecttypedropdown = page.locator('xpath=//select[@id="SupportType" and @name="SupportType"]');

        this.backfillbutton = page.locator('xpath=//button[@id="getBackFillId" and contains(text(),"Back fill") and @type="button"]');
    }

    async supportMakerSideBar() {
        await this.supportmakersidebar.waitFor({ State: 'visible' })
        await this.supportmakersidebar.click();
    }

    async SelectTypeDropDown() {
        await this.selecttypedropdown.waitFor({ State: 'visible' })
        await this.selecttypedropdown.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    async DropDownValueActiveProcessDetails(TemplateName) {
        await this.selecttypedropdown.selectOption({ label: TemplateName });
    }

    async BackFillButton() {
        await this.backfillbutton.waitFor({ State: 'visible' })
        await this.backfillbutton.click();
    }

    // async ActiveProcessPath() {
    //     try {
    //         const fileName = await getbackFillFileName();
    //         const rowLocator = this.page.locator(`//*[@id="DataDivTarget4"]//tbody//tr[td[contains(., "${fileName}")]]`);

    //         // console.log(`Checking for file row: ${fileName}`);

    //         await rowLocator.waitFor({ state: 'visible', timeout: 3000 });
    //         // console.log(`Back Fill Processing detected. Waiting for completion...`);

    //         await rowLocator.waitFor({ state: 'hidden', timeout: 3600000 }); // Added a higher timeout for processing
    //         // console.log(`Back Fill Processing completed successfully.`);

    //     } catch (e) {
    //         // console.log(`No active BackFill File processing detected. Exiting function.`);
    //         return;
    //     }
    // }

    async ActiveProcessPath(fileName) {
        // If no fileName is passed, it falls back to the default generator
        const targetFile = fileName || await getbackFillFileName();

        try {
            const rowLocator = this.page.locator(`//*[@id="DataDivTarget4"]//tbody//tr[td[contains(., "${targetFile}")]]`);
            await rowLocator.waitFor({ state: 'visible', timeout: 10000 });

            await rowLocator.waitFor({ state: 'hidden', timeout: /*3600000, */ 14400000 });

        } catch (e) {
            return;
        }
    }

}