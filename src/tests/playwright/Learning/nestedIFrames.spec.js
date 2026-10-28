import { test, expect } from '@playwright/test';


test('Nested iframes test', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/nested_frames');
    expect(await page.title()).toBe('https://the-internet.herokuapp.com/nested_frames');

const MainFrame = await page.frameLocator({ hasXPath: '//frame[@src="/frame_top"]' });   //frame[@name="frame-top"]

const LeftFrame = await MainFrame.frameLocator({ hasXPath: '//frame[@src="/frame_left"]' }).locator('body').textContent();  //frame[@name="frame-left"]
console.log(`Left Frame Text: ${LeftFrame}`);
const MiddleFrame = await MainFrame.frameLocator({ hasXPath: '//frame[@src="/frame_middle"]' }).locator('body').textContent();  //frame[@name="frame-middle"]
console.log(`Middle Frame Text: ${MiddleFrame}`);
const RightFrame = await MainFrame.frameLocator({ hasXPath: '//frame[@src="/frame_right"]' }).locator('body').textContent();  //frame[@name="frame-right"]
console.log(`Right Frame Text: ${RightFrame}`);

await page.waitForTimeout(10000);

});