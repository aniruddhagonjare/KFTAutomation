import { getApplicationId } from "../../../fixtures/baseTest.js";


export class searchCustomer {

    constructor(page) {
        this.page = page;
    }

    onTab(targetPage) {
        this.page = targetPage || this.page;
        return this;
    }

    get customerSidebar() { return this.page.locator('xpath=//a[@href="/CustomerDetails/Search"][span[text()="Customers"]]'); }
    get searchField() { return this.page.locator('xpath=//*[@id="SearchedQuery" and @name="SearchedQuery"]'); }
    get createButton() { return this.page.locator('xpath=//*[contains(text(),"Search") and @id="custsearchbtn" and @type="button"]'); }
    get soa() { return this.page.locator('xpath=//i[@title="Statement Of Account" and @class="fa fa-book"]'); }
    get rps() { return this.page.locator('xpath=//i[@title="Repayment Schedule" and @class="fa fa-calendar"]'); }


    async customerSideBar() {
        await this.customerSidebar.waitFor({ state: 'visible' });
        await this.customerSidebar.click();
    }

    async customerSearchField(text) {
        await this.searchField.waitFor({ state: 'visible' });
        await this.searchField.fill(text);         // set applicationId here on completion LMS Journey
    }

    async clickSearchButton() {
        await this.createButton.waitFor({ state: 'visible' });
        await this.createButton.click();
    }

    async SOA() {
        await this.soa.waitFor({ state: 'visible' });

        const expectedTabTitle = "Statement Of Accounts";
        const context = this.page.context();
        const allPages = context.pages();

        let existingPage = null;

        for (const openPage of allPages) {
            const title = await openPage.title();
            if (title.includes(expectedTabTitle)) {
                existingPage = openPage;
                break;
            }
        }

        if (existingPage) {
            await existingPage.bringToFront();
            await existingPage.reload({ waitUntil: 'load' });

            return existingPage;
        } else {
            const [newPage] = await Promise.all([
                context.waitForEvent('page'),
                this.soa.click()
            ]);

            await newPage.waitForLoadState('load');
            return newPage;
        }
    }

    async RPS() {
        await this.rps.waitFor({ state: 'visible' });

        const expectedTabTitle = "Repayment Schedule";
        const context = this.page.context();
        const allPages = context.pages();

        let existingPage = null;

        for (const openPage of allPages) {
            const title = await openPage.title();
            if (title.includes(expectedTabTitle)) {
                existingPage = openPage;
                break;
            }
        }

        if (existingPage) {
            await existingPage.bringToFront();
            await existingPage.reload({ waitUntil: 'load' });

            return existingPage;
        } else {
            const [newPage] = await Promise.all([
                context.waitForEvent('page'),
                this.rps.click()
            ]);

            await newPage.waitForLoadState('load');
            return newPage;
        }
    }
}