//ts-check
import { test, expect } from '@playwright/test';
import { time } from 'console';
import fs from 'fs';


const testDataPath= 'testdata/data.json';
const testData=JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

if (!Array.isArray(testData) || testData.length === 0) {
  console.error('testData is empty or not an array:', testData);
}

testData.forEach((user, index) => {
  const titleUser = user && user.username ? user.username : `user-${index}`;

   test(`Login with user ${(titleUser)}`, async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    await page.fill('#user-name', user.username);
    await page.fill('#password', user.password);
    await page.click('#login-button');
    await page.waitForTimeout(5000);
    await page.close();

    });
});