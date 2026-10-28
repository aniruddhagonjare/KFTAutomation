import { test, getApplicationId } from '../../fixtures/baseTest.js';

export const applicationQueueL0 =

    class applicationQueueL0 {

        constructor(page) {

            this.attach(page);
        }
        attach(page) {
            this.page = page;
            this.sanctionanddisbursalHeading = page.locator('xpath=//a[contains(@class, "nav-link") and @href="#SanctionandDisbursal"]');
            this.sanctionanddisbursalTitle = page.locator('xpath=//a[@href="/Lending/LoanAccountDetails"]');

            this.postsanctionTAB = page.locator('xpath=//a[@role="tab" and contains(.,"Post Sanction")]');
            this.postsanctionSearchfield = page.locator('xpath=//input[@type="search" and @id="dt-search-1"]');

            this.savebutton = page.locator('xpath=//button[@type="button" and contains(.,"Save")]');

            this.benificerytypedropdown = page.locator('xpath=//select[@id="BeneficiaryTypeId" and @name="BeneficiaryType"]');
            this.benificeryNamedropdown = page.locator('xpath=//select[@id="BenficiaryId" and @name="BenficiaryId"]');

            this.benificeryamount = page.locator('xpath=//input[@id="BeneficiaryAmount" and @name="BeneficiaryAmount"]');
            this.benificeryamountfield = page.locator('xpath=//input[@id="Amount" and @name="Amount" and @type="text"]');
            this.plusbutton = page.locator(`xpath=//button[i[contains(@class, 'fa-plus')] and @type="button" or @onclick="SaveData(event)"]`);
            this.benificeryselectcheckbox = page.locator('xpath=//input[@type="checkbox" or @name="getselect" or @class="check_delete"]');
        }


        async CLickOnApplicationQueueSideBar() {
            await this.sanctionanddisbursalHeading.waitFor({ state: 'visible' });
            await this.sanctionanddisbursalHeading.click();
            await this.sanctionanddisbursalTitle.waitFor({ state: 'visible' });
            await this.sanctionanddisbursalTitle.click();
        }

        async ClickOnFirstLeadFromApplicationQueue() {

            await this.postsanctionTAB.waitFor({ state: 'visible' });
            await this.postsanctionTAB.click();

            await this.postsanctionSearchfield.waitFor({ state: 'visible' });
            await this.postsanctionSearchfield.fill(getApplicationId());


            const targetRow = this.page.locator('tbody tr', { hasText: getApplicationId() }).first();
            const postSanctionButton = targetRow.locator('button.btn-primary');
            await postSanctionButton.waitFor({ state: 'visible' });
            await postSanctionButton.click();


            //console.log(`Clicked on the first lead in Application Queue with Application ID: ${getApplicationId()}`);
        }

        async ClickOnSaveButton() {
            await this.savebutton.waitFor({ state: 'visible' });
            await this.savebutton.click();
        }

        async SelectBeneficiaryType(TemplateName) {
            await this.benificerytypedropdown.selectOption({ label: TemplateName });
        }

        async SelectBeneficiaryName(TemplateName) {
            await this.benificeryNamedropdown.selectOption({ label: TemplateName });
        }

        async benificeryAmount() {
            await this.benificeryamount.waitFor({ state: 'visible' });
            const benificeryamount = await this.benificeryamount.inputValue();
            console.log(`Benificery Text AMount >>>>>>>>>>>>>> ${benificeryamount}`);

            await this.benificeryamountfield.waitFor({ state: 'visible' });
            await this.benificeryamountfield.fill(benificeryamount);


            await this.plusbutton.waitFor({ state: 'visible' });
            await this.plusbutton.click();

            await this.benificeryselectcheckbox.waitFor({ state: 'visible' });
            await this.benificeryselectcheckbox.click();
            
        }


    }