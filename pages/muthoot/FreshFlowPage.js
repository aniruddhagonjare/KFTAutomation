import { expect } from "@playwright/test";

export class FreshFlowPage {
    constructor(page) {
        this.page = page;
        
        // General Selectors
        this.rootContainer = page.locator('#root');
        this.continueBtn = page.locator('div').filter({ hasText: /^Continue$/ });
        this.selectDropdownBtn = page.getByText('Select▼');

        // Step 2: Loan Details Selectors
        this.loanAmountSelectBtn = page.getByText('Select Loan Amount*');
        this.businessExpenseOption = page.locator('div').filter({ hasText: /^Business Expense$/ }).first();
        this.panInput = page.getByRole('textbox', { name: 'Enter PAN Number' });
        this.dobInput = page.getByRole('textbox', { name: 'DD-MM-YYYY' });
        this.consentCheckbox1 = page.locator('.css-175oi2r.r-1awozwy.r-1777fci.r-w7s2jr');
        this.consentCheckbox2 = page.locator('.css-175oi2r.r-1awozwy.r-1wztat5 > div:nth-child(2)');

        // Step 3: Personal Information Selectors
        this.personalInfoSectionBtn = page.getByText('Personal Information');
        this.panInfoDetailsBtn = page.getByText(/PAN Number:.*Full/);
        this.emailInput = page.getByRole('textbox', { name: 'Enter Email' });
        this.education12thPassOption = page.locator('div').filter({ hasText: /^12th Pass \/ Higher Secondary$/ }).first();
        this.employmentSalariedOption = page.locator('div').filter({ hasText: /^Salaried$/ }).first();
        this.companyNameInput = page.getByRole('textbox', { name: 'Enter Company Name' });
        this.companyEmailInput = page.getByRole('textbox', { name: 'Enter Company Email' });
        this.salaryModeBankTransferOption = page.locator('div').filter({ hasText: /^Bank Transfer$/ }).first();
        this.monthlyIncomeInput = page.getByRole('textbox', { name: 'Enter Net Monthly Income' });

        // Step 4: Address Details Selectors
        this.pincodeInput = page.getByRole('textbox', { name: 'Enter 6-digit pincode' }).first();
        this.addressConsentCheckbox = page.locator('.css-175oi2r.r-1awozwy.r-1w15a45.r-z2wwpe');
    }

    async navigate(url) {
        await this.page.goto(url);
        await expect(this.rootContainer).toContainText("You're just 3 steps away from a Personal Loan");
    }

    async fillLoanDetails(panNumber, dob) {
        await this.loanAmountSelectBtn.click();
        await this.selectDropdownBtn.click();
        await this.businessExpenseOption.click();

        await expect(this.panInput).toBeVisible();
        await this.panInput.click();
        if(panNumber) {
            await this.panInput.fill(panNumber);
        }

        await expect(this.dobInput).toBeVisible();
        await this.dobInput.click();
        if(dob) {
            await this.dobInput.fill(dob);
        }

        await this.consentCheckbox1.click();
        await this.consentCheckbox2.click();
        await expect(this.rootContainer).toContainText('Almost there, just 2 steps to go.');
    }

    async fillPersonalInfo(email, companyName, companyEmail, monthlyIncome) {
        await this.personalInfoSectionBtn.click();
        await expect(this.rootContainer).toContainText('Personal Information');
        // Click to expand or proceed
        await this.panInfoDetailsBtn.click();

        await expect(this.emailInput).toBeVisible();
        await this.emailInput.click();
        if(email) {
            await this.emailInput.fill(email);
        }

        await this.selectDropdownBtn.first().click();
        await this.education12thPassOption.click();

        await this.employmentSalariedOption.click();

        await expect(this.companyNameInput).toBeVisible();
        await this.companyNameInput.click();
        if(companyName) {
            await this.companyNameInput.fill(companyName);
        }

        await expect(this.companyEmailInput).toBeVisible();
        await this.companyEmailInput.click();
        if(companyEmail) {
            await this.companyEmailInput.fill(companyEmail);
        }

        await this.selectDropdownBtn.first().click(); // Assuming second dropdown visually
        await this.salaryModeBankTransferOption.click();

        await expect(this.monthlyIncomeInput).toBeVisible();
        await this.monthlyIncomeInput.click();
        if(monthlyIncome) {
            await this.monthlyIncomeInput.fill(monthlyIncome);
        }

        await this.continueBtn.nth(1).click();
        await expect(this.rootContainer).toContainText('Final step to get your Personal Loan');
    }

    async fillAddressDetails(pincode) {
        await expect(this.rootContainer).toContainText('Address Details');

        await expect(this.pincodeInput).toBeVisible();
        await this.pincodeInput.click();
        if(pincode) {
            await this.pincodeInput.fill(pincode);
        }

        await this.addressConsentCheckbox.click();
        await this.continueBtn.nth(4).click();
    }
}
