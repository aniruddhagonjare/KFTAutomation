import { test, expect } from '@playwright/test';


test('BuiltInLocators',async({page})=>{
await page.goto('https://so-lms-qa.knightfintech.com');
//inputbox - username 
await expect(await page.locator("//*[@id='UserName']")).toBeVisible();
await expect(await page.locator("//*[@id='UserName']")).toBeEmpty();
await expect(await page.locator("//*[@id='UserName']")).toBeEditable();
await expect(await page.locator("//*[@id='UserName']")).toBeEnabled();
await page.locator('//*[@id="UserName"]').fill('uco.superadmin@ucobank.com');
// password
await expect(await page.locator("//*[@id='Password']")).toBeVisible();
await expect(await page.locator("//*[@id='Password']")).toBeEmpty();
await expect(await page.locator("//*[@id='Password']")).toBeEditable();
await expect(await page.locator("//*[@id='Password']")).toBeEnabled();
await page.fill("//*[@id='Password']", 'Test@1243');
// Login 
await expect(await page.locator("//*[@id='loginSubmitBtn']")).toBeVisible();
await page.locator("//*[@id='loginSubmitBtn']").click();
console.log('Test Executed successfully');
});