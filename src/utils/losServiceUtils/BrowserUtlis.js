// utils/BrowserUtils.js
class BrowserUtils {
    /**
     * Waits for a new tab/popup to open and validates its URL.
     * @param {Promise<Page>} pagePromise - The Playwright page promise (e.g., context.waitForEvent('page'))
     * @param {string} urlKeyword - Partial text/substring to match against the tab's URL
     * @param {number} timeoutMs - Maximum time to wait in milliseconds
     * @returns {Promise<Page>} The resolved new tab page instance
     */
    static async waitForNewTabAndVerifyUrl(pagePromise, urlKeyword = '', timeoutMs = 90000) {

        const newTab = await pagePromise;

        const urlPattern = new RegExp(urlKeyword);

        await newTab.waitForURL(urlPattern, {
            waitUntil: 'domcontentloaded', // 'load' you can add load alsoinstead of 'domcontentloaded'
            timeout: timeoutMs             // 'domcontentloaded' -> // Fires faster than 'load'
        });
        console.log(`Successfully intercepted new tab with URL containing: "${urlKeyword}"`);
        return newTab;
    }

    // static async defaultReload(page) {
    //     await page.reload({ waitUntil: 'domcontentloaded' });  // 'load'
    // }

    static async defaultReload(page) {
        if (!page) {
            throw new Error("BrowserUtils.defaultReload: 'page' argument is missing or undefined.");
        }
        await page.reload({ waitUntil: 'domcontentloaded' });
    }
}

module.exports = { BrowserUtils };
