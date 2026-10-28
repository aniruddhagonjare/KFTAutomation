import { test,expect } from "@playwright/test";

export class SaveLoanAskPage {
    constructor(page) {
        this.page = page;
        this.rootContainer = page.locator('#root');
        this.loanAmountSelectBtn = page.getByText('Select Loan Amount*');
        this.selectDropdownBtn = page.getByText('Select▼');
        this.businessExpenseOption = page.locator('div').filter({ hasText: /^Business Expense$/ }).first();
        this.panInput = page.getByRole('textbox', { name: 'Enter PAN Number' });
        this.dobInput = page.getByRole('textbox', { name: 'DD-MM-YYYY' });
        this.consentCheckbox1 = page.locator('.css-175oi2r.r-1awozwy.r-1777fci.r-w7s2jr');
        this.consentCheckbox2 = page.locator('.css-175oi2r.r-1awozwy.r-1wztat5 > div:nth-child(2)');
    }

    async saveLoandetails(panNumber, dob) {
        await this.loanAmountSelectBtn.click();
        await this.selectDropdownBtn.click();
        await this.businessExpenseOption.click();
        await this.panInput.fill(panNumber);
        await this.dobInput.fill(dob);
        await this.consentCheckbox1.check();
        await this.consentCheckbox2.check();
    }
}
