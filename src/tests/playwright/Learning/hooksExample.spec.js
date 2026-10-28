//ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://s1-auth-qa.azurewebsites.net/Account/Login/Utopia-LOS?returnUrl=https%3A%2F%2Fs1-los-qa.azurewebsites.net%2FUserJourney%2FLoad');
    console.log(`BeforeEach`);
});

test.afterEach(async ({ page }) => {
    await page.close();
    console.log(`AfterEach`);
});

test('Title', async ({ page }) => {
    const title = await page.title();
    console.log(`The title of the page is: ${title}`);
    expect(title).toBe('Login');
});

test('URL', async ({ page }) => {

    const url = page.url();
    console.log(`The URL of the page is: ${url}`);
    expect(url).toBe('https://s1-auth-qa.azurewebsites.net/Account/Login/Utopia-LOS?returnUrl=https%3A%2F%2Fs1-los-qa.azurewebsites.net%2FUserJourney%2FLoad');
});