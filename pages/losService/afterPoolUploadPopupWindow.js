import { expect } from '@playwright/test';

export const afterPoolUploadPopupWindow =

    class afterPoolUploadPopupWindow {
        constructor(page) {

            this.page = page;
            this.afterPoolUploadPopupWindowTotalPassed = page.locator('xpath=//*[@id="TotUpload"]') //click on Total upload leads on popup
            this.afterPoolUploadPopupWindowValidPassed = page.locator('xpath=//*[@id="totvalidatepass"]') //click on Valid upload leads on popup
            this.previewPool = page.locator('xpath=//*[contains(text(),"Preview Pool") or @id="runBre"]') //click on preview pool
        }

        async totalLeaduploaded() {
            await expect(this.afterPoolUploadPopupWindowTotalPassed, 'Total Uploaded Leads element did not appear on page').toBeVisible();
            await this.afterPoolUploadPopupWindowTotalPassed.click();
        }

        async ValidLeaduploaded() {

            await this.afterPoolUploadPopupWindowValidPassed.waitFor({ state: 'visible' });
            //await expect(this.afterPoolUploadPopupWindowValidPassed, 'Validation Passed leads element did not appear on page').toBeVisible();
            await this.afterPoolUploadPopupWindowValidPassed.click().catch(() => {
                console.log('Failed to click Validation Passed leads inside popup');
            });
        }
    }


