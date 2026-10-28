export class loginPageScreenJourney {
    constructor(page) {
        this.attach(page);
    }
    
    attach(page) {
        this.page = page;
        
        this.username = page.locator('xpath=//input[@name="UserName" and @id="UserName"]');
        this.password = page.locator('xpath=//input[@name="Password" and @id="Password"]');
        this.signinbutton = page.locator('xpath=//button[@type="submit" and @value="Log in"]');

        // https://jrclproduct-los-client-qa.azurewebsites.net/QueueTracker
    }

    async gotoScreenJourneyURL(){
        await this.page.goto('https://jrclproduct-los-client-qa.knightfintech.com/QueueTracker');
    }

    async UserNameField() {
        await this.username.waitFor({ state: 'visible' });
        await this.username.fill('superadmin@bankofindia.co.in');
    }

    async UserNPassWordField() {
        await this.password.waitFor({ state: 'visible' });
        await this.password.fill('Cbank@1234');
    }

    async SignInButton() {
        await this.signinbutton.waitFor({ state: 'visible' });
        await this.signinbutton.click();
    }

    async SuperAdminLogin_ScreenJourny(){
        await this.gotoScreenJourneyURL();
        await this.UserNameField();
        await this.UserNPassWordField();
        await this.SignInButton();
    }
}