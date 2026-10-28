import {test, expect  } from '@playwright/test'
import { setBatchName, setApplicationBatchName } from '../../fixtures/baseTest';

export const uploadPoolFile =

    class uploadPoolFile {

        constructor(page) {

            this.page = page;
            //--------------------------------Debt Pool Upload--------------------------------//
            this.uploadFile = page.locator('xpath=//*[contains(text(),"Upload Application Files Here")]');   
            this.batchName = page.locator('xpath=//div[@class="batch-wrap"]//input[@placeholder="eg. 123456" and @placeholder="eg. 123456"]');
            this.processButton = page.locator('xpath=//button[contains(text(),"Process") or @id="btnProcessUpload"]');
            this.overWriteOnExistingBatchCheckbox = page.locator('//input[@id="chkbatchname" or @type="checkbox" or @name="chkbatchname"]');
            this.viewSummaryButton = page.locator('xpath=//a[contains(text(),"View Summary")]')
            this.sampleFilebutton= page.locator('xpath=//*[@class="fa fa-download"]');

            //--------------------------------Application Upload--------------------------------//

            this.applicationuploadFilefield = page.locator('xpath=//*[contains(text(),"Upload Application Files Here")]');  
            this.applicationbatchname= page.locator('xpath=//div[@class="batch-wrap"]//input[@id="batchname" and @placeholder="Enter Batch Number" and @name="batchname"]');
            this.applicationpoolprocessbutton = page.locator('//button[contains(text(),"Process") or @id="btnProcessUpload"]');


        }

        async uploadPool() {
            await expect(this.uploadFile, 'Upload file field did not appear on page').toBeVisible();
            await this.uploadFile.setInputFiles('Files/DebtPool.xlsx');
            
        }

        async enterPoolBatchName() {

            await expect(this.batchName, 'Batch name field did not appear on page').toBeVisible();
            const batchName = 'AniAutomation' + Math.floor(Math.random() * 10000);
            await this.batchName.fill(batchName);
            setBatchName(batchName); 
            return batchName;
        }

        async clickProcessButton() {
            await expect(this.processButton, 'Process button did not appear on page').toBeVisible();
            await this.processButton.click();
        }

        //--------------------------------Application Upload--------------------------------//

    
        async ApplicationUploadFileField(journeyName) {
            await expect(this.applicationuploadFilefield, 'Application upload file field did not appear on page').toBeVisible();
            await this.applicationuploadFilefield.setInputFiles(`Files/${journeyName}.xlsx`);
            console.log(`📂 POM uploaded file from path: Files/${journeyName}.xlsx`);
        }

        async EnterApplicationBatchName(){
            await expect(this.applicationbatchname, 'Application batch name field did not appear on page').toBeVisible();
            const applicationBatchName = 'ApplicationPoolBatch' + Math.floor(Math.random() * 10000 );
            await this.applicationbatchname.fill(applicationBatchName);
            setApplicationBatchName(applicationBatchName);
            process.env.GLOBAL_BATCH_NAME = applicationBatchName;
            return applicationBatchName;
        }
        
        async ClickOnApplicationPoolProcessButton(){
            await expect(this.applicationpoolprocessbutton, 'Application Pool Process button did not appear on page').toBeVisible();
            await this.applicationpoolprocessbutton.click();
        }
    }