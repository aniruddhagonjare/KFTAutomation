import { test,expect } from '@playwright/test';

export const selectPool =

    class selectPool{
        constructor(page) {

            this.page=page;
            this.debtPool=page.locator('xpath=//*[contains(text(),"Debt Pool")]');
            this.applicationUpload=page.locator('xpath=//*[contains(text(),"Application Upload")]');
        }

        async selectDebtPool(){
            await expect(this.debtPool, 'Debt Pool option did not appear on page').toBeVisible(); 
            await this.debtPool.click();
        }

        async selectApplicationUpload(){
            await expect(this.applicationUpload, 'Application Upload option did not appear on page').toBeVisible(); 
            await this.applicationUpload.click();
        }
}
