import { getDemandDate, getDemandDateFormatted, getDisbursementDate, page } from "../../../fixtures/baseTest.js";
import { backFill } from "./supportMaker/backFill.js";


export class Ledgers {

    constructor(page) {
        this.page = page;
        this.test = 1;
    }

    onTab(targetPage) {
        this.page = targetPage || this.page;
        return this;
    }

    get accoutingtab() { return this.page.locator('xpath=//li[@title="Accounting"]//a[@data-bs-parent="#Accordion"]//i[@class="fa fa-calculator"]'); }
    get ledgersentries() { return this.page.locator('xpath=//li[@title="Ledger"]//span[contains(text(),"Ledger Entries")]'); }
    get formdatefield() { return this.page.locator('xpath=//input[@id="frm-date" and @name="FromDate" and @type="date"]'); }
    get todatefield() { return this.page.locator('xpath=//input[@id="to-date" and @name="ToDate" and @type="date"]'); }
    get searchfield() { return this.page.locator('xpath=//input[@id="search" and @name="SeachQuery" and @type="text"]'); }
    get standardviewcheckbox() { return this.page.locator('xpath=//input[@id="standardview" and @type="checkbox"]'); }
    get searchbutton() { return this.page.locator('xpath=//button[@id="btn_searchloan" and contains(text(),"Search")]'); }

    get cliconpagination() {
        return this.page.locator('xpath=//div//select[contains(@class, "form-select form-select-sm") and contains(@id, "dt-length")]');
    }

    getOutstandingPrincipalLoanDisbursal() {
        return this.page.locator(`xpath=//*[@class="table dataGridSearch dataTable"]/tbody/tr[td="${getDisbursementDate()}" and td="Loan Disbursal" and td[contains(., "Outstanding Principal")]]/td[10]`);
    }

    getoutstandingprinciplemeta2(demandDate) {  // outstandingPrinciple  ------ Meta2
        return this.page.locator(`xpath=//*[@class="table dataGridSearch dataTable"]/tbody/tr[td="${demandDate}" and td="Meta2" and td[contains(., "Outstanding Principal") and not(contains(., "Contra Account"))]]/td[10]`);
    }


    getintrestaccuralnotdueamount(dynamicDate) {
        // Escapes text safely within the template literal
        return this.page.locator(`xpath=//*[@class="table dataGridSearch dataTable"]/tbody/tr[td="${dynamicDate}" and td="Interest Accural Not Due"][1]/td[8]`);
    }
    //*[@class="table dataGridSearch dataTable"]/tbody/tr[td="20-11-2026" and td="Interest Accural Not Due" and td[contains(., "Interest Accural Not Due")]][1]/td[8]


    async AccoutingTABSideBar() {
        await this.accoutingtab.waitFor({ state: 'visible' })
        await this.accoutingtab.click();
    }

    async LedgersEntriesSideBar() {
        await this.AccoutingTABSideBar();
        await this.ledgersentries.waitFor({ state: 'visible' })
        await this.ledgersentries.click();
    }

    async FromDateLedgerField() {
        await this.formdatefield.waitFor({ state: 'visible' })
        await this.formdatefield.fill("2000-01-01");
    }

    async ToDateLedgerField() {
        await this.todatefield.waitFor({ state: 'visible' });
        await this.todatefield.fill("2050-01-01");
    }

    async SearchField(appId) {
        await this.searchfield.waitFor({ state: 'visible' });
        const safeAppId = appId ? String(appId) : '';
        await this.searchfield.fill(safeAppId);
    }

    async StandardViewCheckBox() {
        await this.standardviewcheckbox.waitFor({ state: 'visible' })
        await this.standardviewcheckbox.click();
    }

    async SearchButton() {
        await this.searchbutton.waitFor({ state: 'visible' })
        await this.searchbutton.click();
    }


    // Ledger page Calculations 

    async getLoanDisbursalOutstandingPrincipalValue() {


        const lengthDropdown = this.page.locator('select[id^="dt-length-"].form-select.form-select-sm');
        await lengthDropdown.selectOption('300');

        if (this.test === 1) {
            this.test = 2;

            const locator = this.getOutstandingPrincipalLoanDisbursal();
            await locator.waitFor({ state: 'visible' });
            const loanDisbursalOutstandingPrincipalValue = await locator.innerText();
            const cleanedValue = loanDisbursalOutstandingPrincipalValue.replace(/,|[DdCc][Rr]/g, '').trim();

            console.log(`[Run 1] ledger O/s Principal value after disbursal is : ------------------------------------------------------ ${cleanedValue}`);

            // --- 2. Fetch Interest Accrual Value ---
            const demandDate = getDisbursementDate();
            const locatorInterest = this.getintrestaccuralnotdueamount(demandDate);

            console.log(`Xpath for Interest acccural >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${locatorInterest}`);

            await locatorInterest.waitFor({ state: 'visible' });
            const interestAccrualRaw = await locatorInterest.innerText();

            const cleanedInterestValue = interestAccrualRaw.replace(/,|[DdCc][Rr]/g, '').trim();

            console.log(`[Run 1] Interest Value for ${demandDate} is: ------------------------------------------------------ ${cleanedInterestValue}`);

            return {
                outstandingPrincipal: cleanedValue,
                interestAccrual: cleanedInterestValue
            };

        } else {
            const demand_date = getDemandDateFormatted();

            const [year, month, day] = demand_date.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day);

            const targetDay = dateObj.getDate();
            dateObj.setMonth(dateObj.getMonth() - 1);

            if (dateObj.getDate() !== targetDay) {
                dateObj.setDate(0);
            }

            const pad = (num) => String(num).padStart(2, '0');

            // CHANGE: Changed hyphens (-) to forward slashes (/) to match your table data format
            const customPastDate = `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()}`;

            // --- 1. Fetch Outstanding Principal Meta 2 ---
            const locator2 = this.getoutstandingprinciplemeta2(customPastDate);
            await locator2.waitFor({ state: 'visible' });
            const meta2OutstandingPrincipalValue = await locator2.innerText();
            const cleanedPrincipalValue = meta2OutstandingPrincipalValue.replace(/,|[DdCc][Rr]/g, '').trim();
            console.log(`[Run 2] Principal Value for ${customPastDate} is: ${cleanedPrincipalValue}`);

            // --- 2. Fetch Interest Accrual Value ---
            // Pass the newly formatted customPastDate (05/09/2026) directly into the method
            const locatorInterest = this.getintrestaccuralnotdueamount(customPastDate);
            await locatorInterest.waitFor({ state: 'visible' });

            const interestAccrualRaw = await locatorInterest.innerText();
            const cleanedInterestValue = interestAccrualRaw.replace(/,|[DdCc][Rr]/g, '').trim();
            console.log(`[Run 2] Interest Value for ${customPastDate} is: ${cleanedInterestValue}`);

            return {
                outstandingPrincipal: cleanedPrincipalValue,
                interestAccrual: cleanedInterestValue
            };
        }



    }

}