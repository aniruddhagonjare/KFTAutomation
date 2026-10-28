import { test, expect } from '@playwright/test';
import { ENV_DATA } from '../../src/config/credential.config.js';
import { URLS } from '../../src/config/urls.config.js';

export const loginPage =

    class loginPage {

        constructor(page) {
            this.page = page;

            let rawKey = process.env.CLUSTER || 'S0';
            this.clusterKey = Object.keys(ENV_DATA).find(
                key => key.toLowerCase() === rawKey.toLowerCase()
            ) || rawKey;
            this.usernameField = page.locator('xpath=//*[@name="UserName" or @id="UserName" or @placeholder="Your User Name"]');
            this.passwordField = page.locator('xpath=//*[@name="Password" or @id="Password" or @placeholder="Your Password"]');
            this.signInButton = page.locator('xpath=//*[@type="submit" or @id="loginSubmitBtn"]');

            this.logout = page.locator('xpath=//a[contains(normalize-space(), "Logout")]/i[contains(@class, "fa-sign-out")]');
        }


        getValidatedUrl(urlType) {
            expect(URLS[this.clusterKey], `Cluster "${this.clusterKey}" configuration missing in URLS`).toBeDefined();
            const targetUrl = URLS[this.clusterKey][urlType];
            expect(targetUrl, `"${urlType}" is missing for cluster "${this.clusterKey}"`).toBeTruthy();
            return targetUrl;
        }

        async gotolosURL() {
            const targetUrl = this.getValidatedUrl('losBaseUrl');
            await this.page.goto(targetUrl);
            await expect(this.page, 'Failed to navigate to the LOS URL domain').toHaveURL(
                new RegExp(`${this.clusterKey}|so-auth`, 'i')
            );
        }

        async gotolmsURL() {
            const targetUrl = this.getValidatedUrl('lmsBaseUrl');
            await this.page.goto(targetUrl);

            await expect(this.page, 'Failed to route to LMS target or Auth Gateway').toHaveURL(
                new RegExp(`${this.clusterKey}|so-auth`, 'i')
            );
        }

        async loginL0UserApplicationQueue() {
            const userCreds = ENV_DATA?.loginCred?.l0UserApplicationQueue;

            expect(userCreds?.username, 'Username credential data missing').toBeTruthy();
            expect(userCreds?.password, 'Password credential data missing').toBeTruthy();

            await this.gotolosURL();

            await expect(this.usernameField, 'Username input field did not appear on page').toBeVisible();
            await this.usernameField.fill(userCreds.username);

            await expect(this.passwordField, 'Password input field did not appear on page').toBeVisible();
            await this.passwordField.fill(userCreds.password);

            await expect(this.signInButton, 'Sign In submit button is missing or disabled').toBeVisible();
            await this.signInButton.click();
        }

        async loginL0UserPoolQueue() {
            const userCreds = ENV_DATA.loginCred.l0UserPoolQueue;

            expect(userCreds?.username, 'Username credential data missing').toBeTruthy();
            expect(userCreds?.password, 'Password credential data missing').toBeTruthy();

            await this.gotolosURL();

            await this.usernameField.waitFor({ state: 'visible' });
            await expect(this.usernameField, 'Username input field did not appear on page').toBeVisible();
            await this.usernameField.fill(userCreds.username);

            await expect(this.passwordField, 'Password input field did not appear on page').toBeVisible();
            await this.passwordField.fill(userCreds.password);

            await expect(this.signInButton, 'Sign In submit button is missing or disabled').toBeVisible();
            await this.signInButton.click();
        }


        async loginL1User() {
            const userCreds = ENV_DATA.loginCred.l1User;

            expect(userCreds?.username, 'Username credential data missing').toBeTruthy();
            expect(userCreds?.password, 'Password credential data missing').toBeTruthy();

            await this.gotolmsURL();

            await expect(this.usernameField, 'Username input field did not appear on page').toBeVisible();
            await this.usernameField.fill(userCreds.username);
            await expect(this.passwordField, 'Password input field did not appear on page').toBeVisible();
            await this.passwordField.fill(userCreds.password);
            await expect(this.signInButton, 'Sign In submit button is missing or disabled').toBeVisible();
            await this.signInButton.click();
        }

        async loginL2User() {
            const userCreds = ENV_DATA.loginCred.l2User;

            expect(userCreds?.username, 'Username credential data missing').toBeTruthy();
            expect(userCreds?.password, 'Password credential data missing').toBeTruthy();

            await this.gotolmsURL();
            await expect(this.usernameField, 'Username input field did not appear on page').toBeVisible();
            await this.usernameField.fill(userCreds.username);
            await expect(this.passwordField, 'Password input field did not appear on page').toBeVisible();
            await this.passwordField.fill(userCreds.password);
            await expect(this.signInButton, 'Sign In submit button is missing or disabled').toBeVisible();
            await this.signInButton.click();
        }

        async loginL3User() {
            const userCreds = ENV_DATA.loginCred.l3User;

            expect(userCreds?.username, 'Username credential data missing').toBeTruthy();
            expect(userCreds?.password, 'Password credential data missing').toBeTruthy();

            await this.gotolmsURL();
            await expect(this.usernameField, 'Username input field did not appear on page').toBeVisible();
            await this.usernameField.fill(userCreds.username);
            await expect(this.passwordField, 'Password input field did not appear on page').toBeVisible();
            await this.passwordField.fill(userCreds.password);
            await expect(this.signInButton, 'Sign In submit button is missing or disabled').toBeVisible();
            await this.signInButton.click();
        }

        async superAdminLogin() {
            const userCreds = ENV_DATA?.loginCred?.superAdmin;

            expect(userCreds?.username, 'SuperAdmin username credential data missing').toBeTruthy();
            expect(userCreds?.password, 'SuperAdmin password credential data missing').toBeTruthy();

            await this.gotolmsURL();

            await expect(this.usernameField, 'Username input field did not appear on page').toBeVisible();
            await this.usernameField.fill(userCreds.username);

            await expect(this.passwordField, 'Password input field did not appear on page').toBeVisible();
            await this.passwordField.fill(userCreds.password);

            await expect(this.signInButton, 'Sign In submit button is missing or disabled').toBeVisible();
            await this.signInButton.click();
        }

        async LogoutUserLMS() {
            await this.logout.waitFor({ state: 'visible' });
            await this.logout.click();
            
            const userCreds = ENV_DATA?.loginCred?.l0UserApplicationQueue;

            expect(userCreds?.username, 'Username credential data missing').toBeTruthy();
            expect(userCreds?.password, 'Password credential data missing').toBeTruthy();

            await this.gotolmsURL();

            await expect(this.usernameField, 'Username input field did not appear on page').toBeVisible();
            await this.usernameField.fill(userCreds.username);

            await expect(this.passwordField, 'Password input field did not appear on page').toBeVisible();
            await this.passwordField.fill(userCreds.password);

            await expect(this.signInButton, 'Sign In submit button is missing or disabled').toBeVisible();
            await this.signInButton.click();
            
        }

        async logoutUser(){
            await this.logout.waitFor({ state: 'visible' });
            await this.logout.click();
        }
    }