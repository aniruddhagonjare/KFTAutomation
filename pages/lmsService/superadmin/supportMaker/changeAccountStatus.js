import { getApplicationId, page } from "../../../../fixtures/baseTest.js"
import { path } from "path";


export class changeAccountStatus {
    constructor(page) {
        this.page = page;
        this.appwisebutton = page.locator('xpath=//button[@id="appWise" and @type="button" and @data-bs-target="#multiCollapse1"]');

        this.applicationidfield = page.locator('xpath=//input[@id="appId" and @name="ApplicationId" and @type="Number"]');
        this.uploadfilebutton = page.locator('xpath=//button[@type="button" and @id="fileWise" and contains(text(),"Upload File")]');
        this.choosefilebutton = page.locator('xpath=//input[@id="uploadFile" and @name="uploadFile" and @type="file"]');
        this.processbutton = page.locator('xpath=//button[@type="button" and contains(text(),"Process")]')

        this.selectloanstatus = page.locator('xpath=//select[@class="form-control" and @id="LoanStatusType" and @name="LoanStatusType"]');
        this.selectbankstatus = page.locator('xpath=//select[@class="form-control" and @id="BankStatusType" and @name="StatusType"]');

        this.savebutton = page.locator('xpath=//button[@type="button" and contains(.,"Save Status")]');

        this.statusmessage = page.locator('xpath=//div[@id="failedListdiv1" and text()="Application status updated successfully"]');

    }

    async AppWiseButton() {
        await this.appwisebutton.waitFor({ State: 'visible' })
        await this.appwisebutton.click()
    }

    async ApplicationIdField() {
        await this.applicationidfield.waitFor({ State: 'visible' })
        await this.applicationidfield.fill(getApplicationId());
    }

    async SelectLoanStatus(TemplateName) {
        await this.selectloanstatus.selectOption({ label: TemplateName });
    }

    async SelectBankStatus(TemplateName) {
        await this.selectbankstatus.selectOption({ label: TemplateName });
    }

    async SaveStatusbutton() {
        await this.savebutton.waitFor({ State: 'visible' })
        await this.savebutton.click();

        await this.statusmessage.waitFor({ state: 'visible' });
        const messageText = await this.statusmessage.textContent();
        console.log(`Account Status message:-  ${messageText}`);
    }

    // Upload section
    // async UploadFileButton() {
    //     await this.uploadfilebutton.waitFor({ State: 'visible' })
    //     await this.uploadfilebutton.click()
    // }

    get uploadFileLocator() {
        return this.uploadfilebutton;
    }

    async clickUploadFileButton() {
        await this.uploadfilebutton.waitFor({ state: 'visible' });
        await this.uploadfilebutton.click();
    }

    async ChooseFileButton(filePath) {
        const nodePath = require('path');
        const fileName = nodePath.basename(filePath);
        const correctedPath = nodePath.join(process.cwd(), 'excelFiles', fileName);

        //console.log("📂 Uploading from exact path:", correctedPath);
        
        await this.choosefilebutton.waitFor({ state: 'attached' });
        await this.choosefilebutton.setInputFiles(correctedPath);
    }

    async ProcessButton() {
        await this.processbutton.waitFor({ State: 'visible' })
        await this.processbutton.click()
    }

}



