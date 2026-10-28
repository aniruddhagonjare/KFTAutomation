import { createMobileDriver } from "./mobileDriver.js";
import { androidCaps } from "../config/mobileCaps.js";
import { LoginPage } from "../pages/loginPage.js";
import { mail } from "../payloads/userData.js";
import fs from 'fs';

async function capture() {
    let driver;
    try {
        driver = await createMobileDriver(androidCaps);
        const loginPage = new LoginPage(driver);
        await loginPage.login(mail, "Welcome@1234");

        console.log("Login submitted. Waiting 10s for dashboard...");
        await new Promise(r => setTimeout(r, 10000));

        console.log("Capturing source...");
        const source = await driver.getPageSource();
        fs.writeFileSync('/tmp/page_source.xml', source);
        console.log("Source saved to /tmp/page_source.xml");
    } catch (e) {
        console.error("Capture failed:", e);
    } finally {
        if (driver) await driver.deleteSession();
    }
}

capture();
