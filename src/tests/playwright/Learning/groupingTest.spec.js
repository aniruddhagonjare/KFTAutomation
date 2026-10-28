//@ts-check
import { test, expect } from '@playwright/test';

 test.describe('Verify describe functionality', () => {

  const wait = (ms) => new Promise(res => setTimeout(res, ms));

  test('Login using L0 user', async ({ page, context }) => {
    await page.goto('https://s1-auth-qa.azurewebsites.net/Account/Login?id=Utopia-LOS&returnUrl=https%3a%2f%2fs1-los-qa.azurewebsites.net%2fUserJourney%2fLoad%2f%3fjourneyName%3dSelect%26screenName%3dSelectJourney');
    await expect(page).toHaveTitle('Login');
    await page.fill('xpath=//*[@id="UserName" and @placeholder="Your User Name"]', 'ucoL0@ucobank.com');
    await page.fill('xpath=//*[@id="Password" and @placeholder="Your Password"]', 'Uco@1243');
    await page.click('xpath=//*[@type="submit" or @value="Log in"]');
    await expect(page).toHaveURL('https://s1-los-qa.azurewebsites.net/UserJourney/Load/?journeyName=Select&screenName=SelectJourney');
    await wait(10000); // Wait for 10 seconds to observe the result

  });

  test('Login using L1 user', async ({ page, context }) => {
    await page.goto('https://s1-auth-qa.azurewebsites.net/Account/Login?id=Utopia-LMS&returnUrl=https%3a%2f%2fs1-lms-qa.azurewebsites.net%2f');
    await expect(page).toHaveTitle('Login');
    await page.fill('xpath=//*[@id="UserName" and @placeholder="Your User Name"]', 'UcoL1@ucobank.com');
    await page.fill('xpath=//*[@id="Password" and @placeholder="Your Password"]', 'Uco@1243');
    await page.click('xpath=//*[@type="submit" or @value="Log in"]');
    //await page.waitForTimeout(10000); // Wait for 10 seconds to observe the result
    await wait(10000);

  });

  test('Login using L3 user', async ({ page }) => {
    await page.goto('https://s1-auth-qa.azurewebsites.net/Account/Login?id=Utopia-LMS&returnUrl=https%3a%2f%2fs1-lms-qa.azurewebsites.net%2f');
    await expect(page).toHaveTitle('Login');
    await page.fill('xpath=//*[@id="UserName" and @placeholder="Your User Name"]', 'UcoL3@ucobank.com');
    await page.fill('xpath=//*[@id="Password" and @placeholder="Your Password"]', 'Uco@1243');
    await page.click('xpath=//*[@type="submit" or @value="Log in"]');
    await wait(10000);
  });

});



//   async function waitForCondition(conditionFn, timeout = 10000) {
//     const start = Date.now();
//     while (Date.now() - start < timeout) {
//       if (conditionFn()) return true; // Condition met!
//       await new Promise(res => setTimeout(res, 100)); // Poll every 100ms
//     }
//   throw new Error("Wait timed out");
// }
// // @ts-ignore
// await waitForCondition(() => window.setTimeout(() => window.isLoaded = true, 5000));

//  });