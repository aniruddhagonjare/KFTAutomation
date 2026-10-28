import { createMobileDriver } from "./mobileDriver.js";
import { androidCaps } from "../config/mobileCaps.js";

async function checkContexts() {
    let driver;
    try {
        driver = await createMobileDriver(androidCaps);
        const contexts = await driver.getContexts();
        console.log("Available contexts:", JSON.stringify(contexts, null, 2));
    } catch (e) {
        console.error("Context check failed:", e);
    } finally {
        if (driver) await driver.deleteSession();
    }
}

checkContexts();
