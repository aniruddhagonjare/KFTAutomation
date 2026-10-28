import { test, expect, getCustomerId, getApplicationId } from '../../fixtures/baseTest.js';
import { CommonFunctions } from '../commonFunctions.js';

export const applicationQueueL3 =

    class applicationQueueL3 {

        constructor(page) {
            this.attach(page);
        }
        attach(page) {
            this.page = page;
            this.clickonapplicationqueuel3 = page.locator('xpath=//*[@class="fa fa-sitemap"]');
            this.clickonapplicationactivel3heading = page.locator('xpath=//*[@class="title-n-popup" and contains(normalize-space(), "Application Queue")]');
            this.clickonpedningforapprovall3heading = page.locator('xpath=//*[@class="title-n-popup" and contains(normalize-space(), "Pending for Approval")]');

            this.clickonL3approvebutton = page.locator('xpath=//button[@type="button"  and contains(text(),"Approve")]');

            this.sanctionbutton = page.locator('xpath=//*[@type="button" and contains(text(),"Sanction") ]');
            this.sanctionanddisbursalHeading = page.locator('xpath=//a[contains(@class, "nav-link") and @href="#SanctionandDisbursal"]');
            this.sanctionanddisbursalTitle = page.locator('xpath=//a[@href="/Lending/LoanAccountDetails"]');

            this.disbursementpendingtab = page.locator('xpath=//*[@role="tab" and contains(text(),"Disbursement Pending")]');

            this.openloanaccountButton = page.locator('xpath=//button[@type="button" and @id="openVA" and contains(text(),"Open Loan Account (Internal)")]');
            this.openvirtualaccountButton = page.locator('xpath=//button[@type="button" and contains(text(),"Open Virtual Account")]');
            this.repaymentschedulebutton = page.locator('xpath=//button[@type="button" and contains(text(),"Repayment Schedule")]');
            this.afterrepaymentscheduleSaveButton = page.locator('xpath=//button[@type="button" and contains(text(),"Save")]');
            this.disubrseloanButton = page.locator('xpath=//button[@type="button" and contains(text(),"Disburse Loan")]')

            this.disbursementstatustext = page.locator('xpath=//*[@for="shortCode" and contains(text(),"Disbursement Status")]');

            this.applicationqueuedatatablefirstrowactionbutton = page.locator(`//a[contains(normalize-space(@onclick), 'ApplnDetails(${getApplicationId()})')]`)
            this.disbursemnetpendingdatatablefirstrowactionbutton = page.locator(`//*[@type="button" and @onclick="PreDisbursementAction(${getApplicationId()})"]`);
            
            this.disbursemnetpendingdatatablefirstrowactionbuttonnew = page.locator(`xpath=//a[contains(@href, '/Lending/GetApplicationRepayment?applicationId=${getApplicationId()}')]`);

            this.searchfield = page.locator('xpath=//input[@type="search"]');

            this.common = new CommonFunctions(page);
        }

        async ClickOnOpenLoanAccountButton() {
            await this.openloanaccountButton.waitFor({ state: 'visible' });
            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.openloanaccountButton.click();
        }

        async ClickOnOpenVirtualAccountButton() {
            await this.openvirtualaccountButton.waitFor({ state: 'visible' });
            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.openvirtualaccountButton.click();
        }

        async ClickOnRepaymentScheduleButton() {
            await this.repaymentschedulebutton.waitFor({ state: 'visible' });
            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.repaymentschedulebutton.click();
        }

        async ClickOnAfterRepaymentScheduleSaveButton() {
            await this.afterrepaymentscheduleSaveButton.waitFor({ state: 'visible' });
            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.afterrepaymentscheduleSaveButton.click();
        }

        async ClickOnDisburseLoanButton() {
            await this.disubrseloanButton.waitFor({ state: 'visible' });
            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.disubrseloanButton.click();
            await this.common.Loader1();

        }

        async ClickOnDisbursementStatusText() {
            await this.disbursementstatustext.waitFor({ state: 'visible' });
            await expect(this.disbursementstatustext).toHaveText(/Disbursed to Escrow/, { timeout: 150000 });
            const statusText = await this.disbursementstatustext.innerText();
            console.log(`${statusText}`);
        }

        async clickOnApplicationQueueSideBarL3() {
            await this.clickonapplicationqueuel3.waitFor({ state: 'visible' });
            await this.clickonapplicationqueuel3.click();
        }

        async clickOnApplicationQueueHeadingL3() {
            await this.clickonapplicationactivel3heading.waitFor({ state: 'visible' });
            await this.clickonapplicationactivel3heading.click();
        }

        async ClickOnPendingForApprovaHeadingL3() {
            await this.clickonpedningforapprovall3heading.waitFor({ state: 'visible' });
            await this.clickonpedningforapprovall3heading.click();
        }

        async DisbursementPendingTAB() {
            await this.disbursementpendingtab.waitFor({ state: 'visible' });
            await this.disbursementpendingtab.click();
            await this.common.Loader1();
        }

        async ClickOnSanctionAndDisbursalHeadingL3SideBar() {
            await this.sanctionanddisbursalHeading.waitFor({ state: 'visible' });
            await this.sanctionanddisbursalHeading.click();
            await this.sanctionanddisbursalTitle.waitFor({ state: 'visible' });
            await this.sanctionanddisbursalTitle.click();
        }

        async ClickOnApplicationQueueFirstLeadFromApplicationQueueL3() {

            await this.SearchFieldInApplicationQueueL3();
            await this.applicationqueuedatatablefirstrowactionbutton.waitFor({ state: 'visible' });
            await this.applicationqueuedatatablefirstrowactionbutton.click();

        }

        async ClickOnDisbursementPendingFirstLeadFromApplicationQueueL3() {
            await this.SearchFieldInApplicationQueueL3();
            await this.page.waitForTimeout(1000);

            if (await this.disbursemnetpendingdatatablefirstrowactionbutton.isVisible()) {
                await this.disbursemnetpendingdatatablefirstrowactionbutton.waitFor({ state: 'visible' });
                await this.disbursemnetpendingdatatablefirstrowactionbutton.click();
            } else if (await this.disbursemnetpendingdatatablefirstrowactionbuttonnew.isVisible()) {
                await this.disbursemnetpendingdatatablefirstrowactionbuttonnew.waitFor({ state: 'visible' });
                await this.disbursemnetpendingdatatablefirstrowactionbuttonnew.click();
            } else {
                throw new Error("Neither disbursement pending action button was found visible on the page.");
            }
        }


        async ClickOnL3ApproveButton() {
            await this.common.RemarksTextAreaField();
            await this.clickonL3approvebutton.waitFor({ state: 'visible' });
            await this.clickonL3approvebutton.click();
        }

        async ClickOnSanctionButton() {
            await this.sanctionbutton.waitFor({ state: 'visible' });
            await this.sanctionbutton.click();
        }

        async SearchFieldInApplicationQueueL3() {
            await this.searchfield.waitFor({ state: 'visible' });
            await this.searchfield.fill(getApplicationId());
            await this.searchfield.press('Enter');
            await this.page.waitForTimeout(2000);
            await this.common.Loader1();
        }
    }