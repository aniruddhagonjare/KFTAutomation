import { remote } from 'webdriverio';
import { appiumOptions } from '../config/mobileCaps.js';

export async function createMobileDriver(caps) {
    const driver = await remote(appiumOptions(caps));
    return driver;
}
