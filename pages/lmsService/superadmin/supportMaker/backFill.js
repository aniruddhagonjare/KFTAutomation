import { setbackFillFileName, getApplicationIdGlobal, getDisbursementDate, getRPSAllEmiDates, getDemandDateFormatted } from "../../../../fixtures/baseTest.js";
import fs from 'fs';
import expect from '@playwright/test';
import ExcelJS from 'exceljs';
import path from 'path';


export class backFill {
    constructor(page) {
        this.page = page;
        this.supportmakersidebar = page.locator('xpath=//li[@title="Support" and @maker]');
        this.selecttypedropdown = page.locator('xpath=//select[@id="SupportType" and @name="SupportType"]');

        this.uploadfilecheckbox = page.locator('xpath=//input[@type="checkbox" and @id="UploadFile"]')
        this.backfilchoosefilebutton = page.locator('xpath=//a[@class="upload-btn"]//input[@type="file" and @id="BackFillUploadfile"]')

        this.formdatefield = page.locator('xpath=//input[@type="date" and @id="FromDate" and @name="FromDate"]');
        this.todatefield = page.locator('xpath=//input[@type="date" and @id="ToDate" and @name="ToDate"]');

        this.popupClosebutton = page.locator('xpath=//button[@id="messageModalClose" and @type="button" and contains(text(),"Close")]');

        this.test = page.locator('xpath=//select[@id="BackFillTemplateId" and @name="BackFillTemplateId"]');
        this.selectcollectionreadmethod = page.locator('xpath=//select[@id="CollectionRead" and @name="CollectionRead"]');
        this.selectcollectionfilesource = page.locator('xpath=//select[@id="CollectionFileSource" and @name="CollectionFileSourceType"]');

        this.savebutton = page.locator('xpath=//button[contains(text(),"Save") or @type="button" and @id="AddSubmitBtn"]');

        this.currentLoopIndex = 0;

    }

    async supportMakerSideBar() {
        await this.supportmakersidebar.waitFor({ State: 'visible' })
        await this.supportmakersidebar.click();
    }

    async SelectTypeDropDown() {
        await this.selecttypedropdown.waitFor({ State: 'visible' })
        await this.selecttypedropdown.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    async DropDownValueBackFill(TemplateName) {
        await this.selecttypedropdown.selectOption({ label: TemplateName });
    }


    async ClickOnUploadFileCheckBox() {
        await this.uploadfilecheckbox.waitFor({ State: 'visible' });
        await this.uploadfilecheckbox.click();
    }

    /**
     * POM Layer Method to handle flexible backfill scenarios based on input type.
     * @param {boolean|string} inputModeOrPath - Takes a boolean (isAppIdSelected) or a string (capturedFilePath)
     */
    async BackFillChooseAndUploadFileButton(inputModeOrPath) {

        await this.backfilchoosefilebutton.waitFor({ state: 'visible' });

        let renamedFilePath = '';

        if (typeof inputModeOrPath === 'boolean') {
        
            const applicationIdFile = getApplicationIdGlobal() + '_' + Math.floor(Math.random() * 1000);
            const folderPath = 'Files';

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            const files = fs.readdirSync(folderPath);
            const existingFile = files.find(file => file.startsWith('BackFill') && file.endsWith('.xlsx'));
            
            const originalFile = existingFile ? path.join(folderPath, existingFile) : path.join(folderPath, 'BackFill.xlsx');

            const renamedFileName = `BackFill_${applicationIdFile}.xlsx`;
            renamedFilePath = path.join(folderPath, renamedFileName);

            if (originalFile !== renamedFilePath) {
                if (fs.existsSync(originalFile)) {
                    fs.renameSync(originalFile, renamedFilePath);
                    
                    const BackFilFilename = path.basename(renamedFilePath);
                    setbackFillFileName(BackFilFilename);
                } else {
                    throw new Error(`Source template excel file not found at ${originalFile}`);
                }
            }

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(renamedFilePath);
            const worksheet = workbook.worksheets[0];

            let targetRowIndex = -1;
            let targetColIndex = -1;

            worksheet.eachRow((row, rowIndex) => {
                row.eachCell((cell, colIndex) => {
                    if (cell.value && cell.value.toString().trim() === 'ApplicationId') {
                        targetRowIndex = rowIndex;
                        targetColIndex = colIndex;
                    }
                });
            });

            if (targetRowIndex !== -1 && targetColIndex !== -1) {
                worksheet.getRow(targetRowIndex + 1).getCell(targetColIndex).value = getApplicationIdGlobal();
            } else {
                worksheet.getCell('B2').value = getApplicationIdGlobal();
            }

            await workbook.xlsx.writeFile(renamedFilePath);

        } else if (typeof inputModeOrPath === 'string') {
            
            if (!inputModeOrPath) {
                throw new Error(`File upload mode active, but provided capturedFilePath string is empty.`);
            }
            renamedFilePath = inputModeOrPath;
        } else {
            throw new Error(`Invalid argument type passed to BackFillChooseAndUploadFileButton.`);
        }
        
        await this.backfilchoosefilebutton.setInputFiles(renamedFilePath);
        return renamedFilePath;
    }




    parseStringToDate(dateInput) {
        if (!dateInput) return new Date();

        const numbers = String(dateInput).match(/\d+/g);
        if (!numbers || numbers.length < 3) {
            console.error(`Invalid date pattern received: ${dateInput}`);
            return new Date();
        }

        let year, month, day;

        if (numbers[0].length === 4) {
            year = parseInt(numbers[0], 10);
            month = parseInt(numbers[1], 10) - 1;
            day = parseInt(numbers[2], 10);
        }

        else {
            day = parseInt(numbers[0], 10);
            month = parseInt(numbers[1], 10) - 1;
            year = parseInt(numbers[2], 10);
        }

        return new Date(year, month, day);
    }

    async FormDateFieldEodBod(activeIndex) {
        await this.formdatefield.waitFor({ state: 'visible' });
        let formattedDate = '';

        let rawResult = getRPSAllEmiDates();
        if (rawResult && typeof rawResult === 'string') {
            rawResult = JSON.parse(rawResult);
        }
        const rawEmiDataArray = rawResult || [];

        const emiDataArray = rawEmiDataArray.filter((item, index, arr) => {
            if (index === 0) return true;
            const currentArrDate = item.date ? item.date : item;
            const prevArrDate = arr[index - 1].date ? arr[index - 1].date : arr[index - 1];
            return currentArrDate !== prevArrDate;
        });

        if (activeIndex === 0) {
            const initialDate = getDisbursementDate();
            const dateObj = this.parseStringToDate(initialDate);

            const resDay = String(dateObj.getDate()).padStart(2, '0');
            const resMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
            formattedDate = `${dateObj.getFullYear()}-${resMonth}-${resDay}`;
        }
        else {

            const targetRecord = emiDataArray[activeIndex - 1];
            if (!targetRecord) {
                throw new Error(`FormDate Fail: No installment data available at index ${activeIndex - 1}`);
            }
            const rawDateStr = targetRecord.date ? targetRecord.date : targetRecord;

            const dateObj = this.parseStringToDate(rawDateStr);
            dateObj.setDate(dateObj.getDate() + 1);

            const resDay = String(dateObj.getDate()).padStart(2, '0');
            const resMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
            formattedDate = `${dateObj.getFullYear()}-${resMonth}-${resDay}`;
        }

        await this.formdatefield.fill(formattedDate);
        console.log(`Loop ${activeIndex + 1} - Back Fill FormDate: ${formattedDate}`);
    }

    async ToDateFieldEodBod(activeIndex) {
        await this.todatefield.waitFor({ state: 'visible' });

        let rawResult = getRPSAllEmiDates();
        if (rawResult && typeof rawResult === 'string') {
            rawResult = JSON.parse(rawResult);
        }
        const rawEmiDataArray = rawResult || [];

        const emiDataArray = rawEmiDataArray.filter((item, index, arr) => {
            if (index === 0) return true;
            const currentArrDate = item.date ? item.date : item;
            const prevArrDate = arr[index - 1].date ? arr[index - 1].date : arr[index - 1];
            return currentArrDate !== prevArrDate;
        });

        if (!emiDataArray || emiDataArray.length <= activeIndex) {
            throw new Error(`ToDate Fail: Data unavailable at index ${activeIndex}`);
        }

        const targetRecord = emiDataArray[activeIndex];
        const rawDateStr = targetRecord.date ? targetRecord.date : targetRecord;

        const dateObj = this.parseStringToDate(rawDateStr);
        dateObj.setDate(dateObj.getDate() - 1);

        const resDay = String(dateObj.getDate()).padStart(2, '0');
        const resMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
        const formattedDate = `${dateObj.getFullYear()}-${resMonth}-${resDay}`;

        await this.todatefield.fill(formattedDate);
        console.log(`Loop ${activeIndex + 1} - Back Fill ToDate: ${formattedDate}`);
    }


    async FormDateFieldDemand() {
        await this.formdatefield.waitFor({ state: 'visible' });
        await this.formdatefield.fill(getDemandDateFormatted());
        console.log(`Demand from date --------------------- ${getDemandDateFormatted()}`);
    }

    async ToDateFieldDemand() {
        await this.todatefield.waitFor({ state: 'visible' });
        await this.todatefield.fill(getDemandDateFormatted());
        console.log(`Demand To date --------------------- ${getDemandDateFormatted()}`);
    }


    async SelectBackFillTemplate(TemplateName) {
        await this.test.selectOption({ label: TemplateName });
    }

    async SelectCollectionReadMethod(TemplateName) {
        await this.selectcollectionreadmethod.selectOption({ label: TemplateName });
    }

    async SelectCollectionFileSource(TemplateName) {
        await this.selectcollectionfilesource.selectOption({ label: TemplateName });
    }

    async RebuildFromDate(dateVal) {
        const fromLocator = this.page.locator('//input[@type="date" and @id="FromDate" and @name="FromDate"]');
        await fromLocator.click();
        let finalDate = dateVal;
        if (dateVal.includes('/')) {
            const [day, month, year] = dateVal.split('/');
            finalDate = `${year}-${month}-${day}`;
        }
        await fromLocator.fill(finalDate);
        await fromLocator.press('Tab');
    }

    async RebuildToDate(dateVal) {
        const toLocator = this.page.locator('//input[@type="date" and @id="ToDate" and @name="ToDate"]');
        await toLocator.click();

        let finalDate = dateVal;
        if (dateVal.includes('/')) {
            const [day, month, year] = dateVal.split('/');
            finalDate = `${year}-${month}-${day}`;
        }

        await toLocator.fill(finalDate);
        await toLocator.press('Tab');
    }



    async CLickOnSaveButton() {

        await this.savebutton.waitFor({ state: 'visible' });
        await this.savebutton.click();

        await this.popupClosebutton.waitFor({ state: 'visible' });
        await this.popupClosebutton.click();
    }

    async collectiopnRebuild_CollectionChooseAndUploadFileButton(UserFile, fileChooser) {
        const folderPath = path.resolve(UserFile);
        const inputElement = fileChooser.element();

        console.log("⏳ Waiting for user to select a Collection file in the explorer popup window...");

        await inputElement.evaluate(async (input) => {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (input.files && input.files.length > 0) {
                        clearInterval(interval);
                        resolve(true);
                    }
                }, 300);
            });
        });

        const uploadedFileName = await inputElement.evaluate(input => {
            return input.files && input.files.length > 0 ? input.files.name : null;
        });

        if (!uploadedFileName) {
            throw new Error("No file was selected from the native explorer window for Collection.");
        }

        console.log(`✅ Collection file detected from explorer: "${uploadedFileName}"`);

        const cleanFolderName = path.basename(folderPath);
        const applicationIdFile = cleanFolderName + '_' + Math.floor(Math.random() * 1000);

        const files = fs.readdirSync(folderPath);
        const existingFile = files.find(file => file.startsWith('Collection') && file.endsWith('.xlsx'));

        const originalFile = existingFile
            ? path.join(folderPath, existingFile)
            : path.join(folderPath, 'Collection.xlsx');

        const renamedFileName = `Collection_${applicationIdFile}.xlsx`;
        const renamedFilePath = path.join(folderPath, renamedFileName);

        if (originalFile !== renamedFilePath) {
            if (fs.existsSync(originalFile)) {
                fs.copyFileSync(originalFile, renamedFilePath);
            } else {
                throw new Error(`Source Collection template file not found at path: ${originalFile}`);
            }
        }
        await fileChooser.setFiles(renamedFilePath);

        const collectionTextDisplay = this.page.locator('#collection_text');
        await expect(collectionTextDisplay).toHaveText(uploadedFileName);
        return renamedFilePath;
    }

    async CollectiopnRebuild_FormDateFieldEodBod(formattedDate) {

        await this.formdatefield.waitFor({ state: 'visible' });
        await this.formdatefield.fill(formattedDate);
        //console.log(`Collection Rebuild Back Fill FormDate: ${formattedDate}`);

    }

    async CollectiopnRebuild_ToDateFieldEodBod(formattedDate) {

        await this.todatefield.waitFor({ state: 'visible' });
        await this.todatefield.fill(formattedDate);
        //console.log(`Collection Rebuild Back Fill ToDate: ${formattedDate}`);
    }

    async CollectiopnRebuild_BackFillFileUpload(renamedFilePath) {
        await this.backfilchoosefilebutton.waitFor({ state: 'visible' });

        let absolutePath;

        if (!renamedFilePath.includes(path.sep)) {
            absolutePath = path.resolve(process.cwd(), 'excelFiles', renamedFilePath);
        } else {
            absolutePath = path.resolve(renamedFilePath);
        }

        await this.backfilchoosefilebutton.setInputFiles(absolutePath);
    }


}