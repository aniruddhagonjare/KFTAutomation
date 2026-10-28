export class EodProcess {

    constructor(page) {
        this.attach(page);
    }
    attach(page) {
        this.page = page;
        this.eodprocessreadcollectionfilegobutton = 'xpath=(//tr[td[contains(normalize-space(), "Trigger to read the collection data and save")]]//button[contains(@id, "CollectionDatadata")])[1]';
        this.eodschedulertab = 'xpath=//*[@id="eod-tab" and @role="tab" and contains(normalize-space(),"EOD Scheduler")]';
        
        this.closebutton = 'xpath=//div[@id="confirmationCloseDiv"]//button[@type="button" and contains(text(),"Close")]';
    }
 

    async EODProcessReadCollectionGoButton(targetPage) {
        const currentPage = targetPage || this.page;
        const eodprocessgobutton = await currentPage.locator(this.eodprocessreadcollectionfilegobutton);
        await eodprocessgobutton.waitFor({ state: 'visible' });
        await eodprocessgobutton.click();

        const close = await currentPage.locator(this.closebutton);
        await close.waitFor({ state: 'visible' });
        await close.click();
    }

    async ClickOnEODSchedulerTAB(targetPage) {
        const currentPage = targetPage || this.page;
        const eodschedulertab = await currentPage.locator(this.eodschedulertab);
        await eodschedulertab.waitFor({ state: 'visible' });
        await eodschedulertab.click();
    }


}
