export class sideBarMenu {
    constructor(page) {
        this.page = page;
        this.supportmakersidebar = page.locator('xpath=//li[@title="Support" and @maker]');
        this.supportcheckerSideBar = page.locator('xpath=//li[@title="Support" and @checker]')
        this.customersidebar = page.locator('xpath=//a[@href="/CustomerDetails/Search"][span[text()="Customers"]]');
        this.accoutingtab = page.locator('xpath=//li[@title="Accounting"]//a[@data-bs-parent="#Accordion" and @href="#Accounting"]');
        this.ledgersentries = page.locator('xpath=//li[@title="Ledger"]//span[contains(text(),"Ledger Entries")]');
        this.eodprocessess = page.locator('xpath=//li[@title="EOD"]//span[contains(text(),"EOD Processes")]')
        this.collectiontab = page.locator('xpath=//li[@title="Collections"]//a[@href="#Collections" and @id="chargeaccordion"]');
        this.collectionuploadtab = page.locator('xpath=//ul[@id="Collections"]//li[@title="Collections"]');
        this.dashboardtab = page.locator('xpath=//li[@title="Dashboard"]');

    }

    async dashbaordSideBarOpenInNewTab(){
        await this.dashboardtab.waitFor({ state: 'visible' });

        const targetAnchor = this.dashboardtab.locator('a');
        const targetUrl = await targetAnchor.getAttribute('href');

        const expectedTabTitle = "Dashboard"; 
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
            this.page = existingPage;
        } else {

            const newPagePromise = context.waitForEvent('page');
            await targetAnchor.click();

            const newPage = await newPagePromise;
            await newPage.waitForLoadState('load');
            this.page = newPage;
        }
    }

    async dashbaordSideBarOpen(){
        await this.dashboardtab.waitFor({ state: 'visible' });

        const pagePromise = this.page.context().waitForEvent('page');

        await this.dashboardtab.click({ modifiers: ['Control', 'Meta'] });

        const newPage = await pagePromise;
        await newPage.waitForLoadState();
    }

    async supportMakerSideBarInNewTab() {
        await this.supportmakersidebar.waitFor({ state: 'visible' });

        const targetAnchor = this.supportmakersidebar.locator('a');
        const targetUrl = await targetAnchor.getAttribute('href');

        const expectedTabTitle = "Support"; // Change this to match your exact tab name/title
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
            // console.log(`Tab '${expectedTabTitle}' found. Switching context and reloading...`);

            await existingPage.bringToFront();
            await existingPage.reload({ waitUntil: 'load' });
            this.page = existingPage;
        } else {
            // console.log(`Tab '${expectedTabTitle}' not found. Opening a new tab...`);

            const newPagePromise = context.waitForEvent('page');
            await targetAnchor.click();

            const newPage = await newPagePromise;
            await newPage.waitForLoadState('load');
            this.page = newPage;
        }
    }

    async supportCheckerSideBarInNewTab() {
        await this.supportcheckerSideBar.waitFor({ state: 'visible' });

        const targetAnchor = this.supportcheckerSideBar.locator('a');
        const targetUrl = await targetAnchor.getAttribute('href');

        const expectedTabTitle = "Support Checker";
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
            // console.log(`Tab '${expectedTabTitle}' found. Switching context and reloading...`);
            await existingPage.bringToFront();
            await existingPage.reload({ waitUntil: 'load' });
            this.page = existingPage;
        } else {
            // console.log(`Tab '${expectedTabTitle}' not found. Opening a new tab...`);
            const newPagePromise = context.waitForEvent('page');
            await targetAnchor.click();
            const newPage = await newPagePromise;
            await newPage.waitForLoadState('load');
            this.page = newPage;
        }

        // CRITICAL: Return the active page instance to the test
        return this.page;
    }

    async supportCheckerSideBarOpen() {
        await this.supportcheckerSideBar.waitFor({ state: 'visible' });

        await this.page.evaluate((el) => {
            const anchor = el.querySelector('a');
            const url = anchor ? anchor.getAttribute('href') : window.location.href;

            window.open(url, '_blank');
        }, await this.supportcheckerSideBar.elementHandle());
    }

    async SearchCustomerSideBarOpen(){
        await this.customersidebar.waitFor({ state: 'visible' });
        const pagePromise = this.page.context().waitForEvent('page');
        // const pagePromise = context.waitForEvent('page');
        await this.customersidebar.click({ modifiers: ['Control', 'Meta'] });
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
    }

    async searchCustomerSideBarInNewTab() {
        await this.customersidebar.waitFor({ state: 'visible' });

        const targetAnchor = this.customersidebar.locator('a');
        const targetUrl = await targetAnchor.getAttribute('href');

        const expectedTabTitle = "Search Customer";
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
            // console.log(`Tab '${expectedTabTitle}' found. Switching context and reloading...`);

            await existingPage.bringToFront();
            await existingPage.reload({ waitUntil: 'load' });
            this.page = existingPage;
        } else {
            // console.log(`Tab '${expectedTabTitle}' not found. Opening a new tab...`);
            const newPagePromise = context.waitForEvent('page');

            await targetAnchor.click();

            const newPage = await newPagePromise;
            await newPage.waitForLoadState('load');
            this.page = newPage;
        }
    }


    async AccoutingTABSideBar() {
        await this.accoutingtab.waitFor({ state: 'visible' })
        await this.accoutingtab.click();
    }

    async LedgersEntriesSideBarOpen() {
        await this.AccoutingTABSideBar();

        await this.ledgersentries.waitFor({ state: 'visible' });

        const pagePromise = this.page.context().waitForEvent('page');

        await this.ledgersentries.click({ modifiers: ['Control', 'Meta'] });

        const newPage = await pagePromise;
        await newPage.waitForLoadState();
    }

    async LedgersEntriesSideBarInNewTab() {

        await this.AccoutingTABSideBar();
        await this.ledgersentries.waitFor({ state: 'visible' });

        const expectedTabTitle = "Ledger Entries"; // Update this to match your actual tab title
        const context = this.page.context();
        const allPages = context.pages();

        let existingPage = null;

        // 2. Check if the Ledger Entries tab is already open
        for (const openPage of allPages) {
            const title = await openPage.title();
            if (title.includes(expectedTabTitle)) {
                existingPage = openPage;
                break;
            }
        }

        if (existingPage) {
            // console.log(`Tab '${expectedTabTitle}' found. Switching context and reloading...`);
            await existingPage.bringToFront();
            await existingPage.reload({ waitUntil: 'load' });
            this.page = existingPage;
        } else {
            // console.log(`Tab '${expectedTabTitle}' not found. Opening a new tab...`);
            const pagePromise = context.waitForEvent('page');

            await this.ledgersentries.click({ modifiers: ['Control', 'Meta'] });

            const newPage = await pagePromise;
            await newPage.waitForLoadState('load');
            this.page = newPage;
        }
        return this.page;
    }


    async CollectionTabSideBarInNewTab() {
        await this.collectiontab.waitFor({ state: 'visible' })
        await this.collectiontab.click();
    }

    async CollectionUploadSideBarOpen() {
        await this.CollectionTabSideBarInNewTab();

        await this.collectionuploadtab.waitFor({ state: 'visible' });
        await this.page.evaluate((el) => {
            const anchor = el.querySelector('a');
            const url = anchor ? anchor.getAttribute('href') : window.location.href;

            window.open(url, '_blank');
        },
            await this.collectionuploadtab.elementHandle());
    }


    async CollectionUploadSideBarInNewTab() {
        await this.CollectionTabSideBarInNewTab();
        await this.collectionuploadtab.waitFor({ state: 'visible' });

        const expectedTabTitle = "Upload Collections";
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
            // console.log(`Tab '${expectedTabTitle}' found. Switching context and reloading...`);
            await existingPage.bringToFront();
            await existingPage.reload({ waitUntil: 'load' });
            this.page = existingPage;
        } else {
            // console.log(`Tab '${expectedTabTitle}' not found. Opening a new tab...`);

            const newPagePromise = context.waitForEvent('page');
            await this.page.evaluate((el) => {
                const anchor = el.querySelector('a');
                const url = anchor ? anchor.getAttribute('href') : window.location.href;
                window.open(url, '_blank');
            }, await this.collectionuploadtab.elementHandle());

            const newPage = await newPagePromise;
            await newPage.waitForLoadState('load');
            this.page = newPage;
        }
        return this.page;
    }


    async EodProcessSideBarOpen() {
        this.AccoutingTABSideBar();
        await this.eodprocessess.waitFor({ state: 'visible' });
        const pagePromise = this.page.context().waitForEvent('page');
        // const pagePromise = context.waitForEvent('page');
        await this.eodprocessess.click({ modifiers: ['Control', 'Meta'] });
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
    }

    async EodProcessSideBarInNewTab() {

        await this.AccoutingTABSideBar();
        await this.eodprocessess.waitFor({ state: 'visible' });

        const expectedTabTitle = "Task Scheduler";
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
            // console.log(`Tab '${expectedTabTitle}' found. Switching context and reloading...`);
            await existingPage.bringToFront();
            await existingPage.reload({ waitUntil: 'load' });
            this.page = existingPage;
        } else {
            // console.log(`Tab '${expectedTabTitle}' not found. Opening a new tab...`);
            const pagePromise = context.waitForEvent('page');

            await this.eodprocessess.click({ modifiers: ['Control', 'Meta'] });
            const newPage = await pagePromise;
            await newPage.waitForLoadState('load');
            this.page = newPage;
        }
        return this.page;
    }

}