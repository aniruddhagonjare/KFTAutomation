export class CommonFunctions {
    constructor(page) {
        this.page = page;

        this.remarkstextarefield = page.locator('//textarea[@placeholder="Enter Remarks" or @placeholder="Enter Remarks" or @id="txtRemarks"]');
        this.loader1 = 'xpath=//div[@id="status"]';
        this.loader2 = 'xpath=//div[@class="lds-ring"]';
    }

    async Loader1(targetPage) {
        const currentPage = targetPage || this.page;
        const currentLoader1 = currentPage.locator(this.loader1);
        const currentLoader2 = currentPage.locator(this.loader2);

        try {
            const detectedLoader = await Promise.race([
                currentLoader1.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'loader1'),
                currentLoader2.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'loader2'),
                new Promise(resolve => setTimeout(() => resolve(null), 5005))
            ]);

            if (detectedLoader === 'loader1') {
                await currentLoader1.waitFor({ state: 'hidden', timeout: 30000 });
            } else if (detectedLoader === 'loader2') {
                await currentLoader2.waitFor({ state: 'hidden', timeout: 30000 });
            } else {
            }

        } catch (e) {
            console.log(`Loader error: ${e.message}`);
        }
    }

    async RemarksTextAreaField() {
        await this.remarkstextarefield.waitFor({ state: 'visible' })
        await this.remarkstextarefield.fill('Automation Test Remarks');
    }

    async waitForUrlFragment(page, urlFragment) {
        await page.waitForURL(
            (url) => url.href.includes(urlFragment),
            {
                waitUntil: 'load',
                timeout: 60000
            }
        );
    }

    async getTabByName(tabTitle, timeout = 400000) {
        if (!this.page) {
            throw new Error("Base page instance is not defined.");
        }

        const browserContext = this.page.context();
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            const allTabs = browserContext.pages();

            for (const tab of allTabs) {
                try {
                    const title = await tab.title();
                    if (title.includes(tabTitle)) {
                        await tab.bringToFront();
                        await tab.waitForLoadState('domcontentloaded');

                        this.page = tab;
                        return tab;
                    }
                } catch (err) {
                    console.log(`TAB name is not match:- ` + err);
                }
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        throw new Error(`Timeout: Could not find an open tab with the title containing: "${tabTitle}" within ${timeout}ms`);
    }

    async getMultipleDatafromTable(rownumber) {
        const formattedData = [];
        const rows = await this.page.locator('tbody tr').all();

        for (const row of rows) {
            const cells = row.locator('td');
            const allCellsText = await cells.allInnerTexts();

            if (allCellsText.length > rownumber && allCellsText.length >= 2) {
                const laNumber = allCellsText[rownumber]?.trim();

                if (laNumber) {
                    formattedData.push(laNumber.replace(/\D/g, ''));
                }
            }
        }
        console.log("Extracted Numeric ID's:", formattedData);
        return formattedData;
    }
}