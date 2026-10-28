// import { ,  } from "../../../../fixtures/baseTest.js";
import { page, expect, getApplicationId, setbackFillFileName } from "../../../../fixtures/baseTest.js";
import fs from 'fs';
import ExcelJS from 'exceljs';


export class dataCleanUp {
    constructor(page) {
        this.page = page;
        this.uploadFilecheckBox = page.locator('xpath=//*[@onchange="EnableDisableChkbx(this)" and @id="UploadFile" and @type="checkbox"]');
        this.UploadFile = page.locator('xpath=//input[@type="file" and @id="BackFillUploadfile" and @class="form-control"]');

        this.collectionfeedandsplitcheckbox = page.locator('xpath=//input[@type="checkbox" and @id="CollectionFeed" and @class="IsChkActive"]');
        this.collectionfeedandsplitdatefield = page.locator('xpath=//input[@type="date" and @id="Date_CollectionFeed" and @class="form-control "]');

        this.ledgerentriescheckbox = page.locator('xpath=//input[@type="checkbox" and @id="LedgerEntries" and @class="IsChkActive"]');
        this.ledgerentriesdatefield = page.locator('xpath=//input[@type="date" and @id="Date_LedgerEntries" and @class="form-control "]');

        this.demandschedulecheckbox = page.locator('xpath=//input[@type="checkbox" and @id="DemandSchedule" and @class="IsChkActive"]');
        this.demandscheduledatefield = page.locator('xpath=//input[@type="date" and @id="Date_DemandSchedule" and @class="form-control "]');

        this.loandatacheckbox = page.locator('xpath=//input[@type="checkbox" and @id="LoanData" and @class="IsChkActive"]');
        this.loandatadatefield = page.locator('xpath=//input[@type="date" and @id="Date_LoanData" and @class="form-control "]');

        this.dpdhistorycheckbox = page.locator('xpath=//input[@type="checkbox" and @id="DPDHistory" and @class="IsChkActive"]');
        this.dpdhistorydatefield = page.locator('xpath=//input[@type="date" and @id="Date_DPDHistory" and @class="form-control "]');

        this.rateresteentriescheckbox = page.locator('xpath=//input[@type="checkbox" and @id="RateResetEntries" and @class="IsChkActive"]');
        this.rateresteentriesdatefield = page.locator('xpath=//input[@type="date" and @id="Date_RateReset" and @class="form-control "]');

        this.revertrpscheckbox = page.locator('xpath=//input[@type="checkbox" and @id="RevertRPS" and @class="IsChkActive"]');
        this.revertrpdatefield = page.locator('xpath=//input[@type="date" and @id="Date_RevertRPS" and @class="form-control "]');

        this.deleteuploadedrpscheckbox = page.locator('xpath=//input[@type="checkbox" and @id="DeleteUploadedRPS" and @class="IsChkActive"]');
        this.deleteuploadedrpsdatefield = page.locator('xpath=//input[@type="date" and @id="Date_DeleteRPS" and @class="form-control "]');

        this.overdueentriescheckbox = page.locator('xpath=//input[@type="checkbox" and @id="OverdueEntries" and @class="IsChkActive"]');
        this.overdueentriesdatefield = page.locator('xpath=//input[@type="date" and @id="Date_OverduEntries" and @class="form-control "]');

        this.writeoffdetailscheckbox = page.locator('xpath=//input[@type="checkbox" and @id="WriteOff" and @class="IsChkActive"]');
        this.writeoffdetailsdatefield = page.locator('xpath=//input[@type="date" and @id="Date_WriteOff" and @class="form-control "]');

        this.npamarkingdatecheckbox = page.locator('xpath=//input[@type="checkbox" and @id="NPAMarkingDate" and @class="IsChkActive"]');
        this.npamarkingdatedatefield = page.locator('xpath=//input[@type="date" and @id="Date_NPAMarkingDate" and @class="form-control "]');

        this.allexceptdisbursalcheckbox = page.locator('xpath=//input[@type="checkbox" and @id="chkAllPolicyActivities"]');

        this.removedatabutton = page.locator('xpath=//button[@type="button" and @id="RemoveData" and contains(text(),"Remove Data")]');

        this.popupcloseButton = page.locator('xpath=//button[@type="button" and @id="messageModalClose" and contains(text(),"Close")]');
    }

    async UploadFileCheckBox() {
        await this.uploadFilecheckBox.waitFor({ State: 'visible' })
        await this.uploadFilecheckBox.click();
    }

    async ChooseFileButton() {
        const folderPath = 'Files';

        const files = fs.readdirSync(folderPath);
        const existingFile = files.find(file => file.startsWith('BackFill') && file.endsWith('.xlsx'));
        const originalFile = existingFile ? `${folderPath}/${existingFile}` : `${folderPath}/BackFill.xlsx`;
        const fileNameOnly = originalFile.split('/').pop();
        setbackFillFileName(fileNameOnly);


        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(originalFile);
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
            worksheet.getRow(targetRowIndex + 1).getCell(targetColIndex).value = getApplicationId();
        } else {
            worksheet.getCell('B2').value = getApplicationId();
        }
        await workbook.xlsx.writeFile(originalFile);
        await this.UploadFile.setInputFiles(originalFile);
        return originalFile;
    }

    async ChooseFileButtonviaUserInput(filePath) {
        const nodePath = require('path');
        const fileName = nodePath.basename(filePath);
        const correctedPath = nodePath.join(process.cwd(), 'excelFiles', fileName);

        //console.log("📂 Uploading from exact path:", correctedPath);

        await this.UploadFile.waitFor({ state: 'attached' });
        await this.UploadFile.setInputFiles(correctedPath);
    }

    async CollectionFeedSplit_DataCleanUp(date) {
        try {
            await this.collectionfeedandsplitcheckbox.waitFor({ state: 'visible' });
            await this.collectionfeedandsplitcheckbox.click();

            let formattedDate = date;
            if (date && date.includes('/')) {
                const [day, month, year] = date.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }
            await this.collectionfeedandsplitdatefield.waitFor({ state: 'visible' });
            await this.collectionfeedandsplitdatefield.fill(formattedDate);

        } catch (error) {
            console.error(`❌ Error in Collection Feed Split for date [${date}]:`, error.message);
            throw error;
        }
    }


    async LedgerEntries_DataCleanUp(date) {
        try {
            await this.ledgerentriescheckbox.waitFor({ state: 'visible' });
            await this.ledgerentriescheckbox.click();

            let formattedDate = date;
            if (date && date.includes('/')) {
                const [day, month, year] = date.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }
            await this.ledgerentriesdatefield.waitFor({ state: 'visible' });
            await this.ledgerentriesdatefield.fill(formattedDate);

        } catch (error) {
            console.error(`❌ Error in Ledger Entries for date [${date}]:`, error.message);
            throw error;
        }

    }

    async DemandSchedule_DataCleanUp(date) {
        try {
            await this.demandschedulecheckbox.waitFor({ state: 'visible' });
            await this.demandschedulecheckbox.click();

            let formattedDate = date;
            if (date && date.includes('/')) {
                const [day, month, year] = date.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }
            await this.demandscheduledatefield.waitFor({ state: 'visible' });
            await this.demandscheduledatefield.fill(formattedDate);

        } catch (error) {
            console.error(`❌ Error in Demand Schedule for date [${date}]:`, error.message);
            throw error;
        }

    }

    async LoanData_DataCleanUp(date) {
        try {
            await this.loandatacheckbox.waitFor({ state: 'visible' });
            await this.loandatacheckbox.click();

            let formattedDate = date;
            if (date && date.includes('/')) {
                const [day, month, year] = date.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }
            await this.loandatadatefield.waitFor({ state: 'visible' });
            await this.loandatadatefield.fill(formattedDate);

        } catch (error) {
            console.error(`❌ Error in Loan Data for date [${date}]:`, error.message);
            throw error;
        }
    }

    async DPDHistory_DataCleanUp(date) {
        try {
            await this.dpdhistorycheckbox.waitFor({ state: 'visible' });
            await this.dpdhistorycheckbox.click();

            let formattedDate = date;
            if (date && date.includes('/')) {
                const [day, month, year] = date.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }
            await this.dpdhistorydatefield.waitFor({ state: 'visible' });
            await this.dpdhistorydatefield.fill(formattedDate);

        } catch (error) {
            console.error(`❌ Error in DPD History for date [${date}]:`, error.message);
            throw error;
        }
    }

    async RateResetEntries_DataCleanUp(date) {
        try {
            await this.rateresteentriescheckbox.waitFor({ state: 'visible' });
            await this.rateresteentriescheckbox.click();

            let formattedDate = date;
            if (date && date.includes('/')) {
                const [day, month, year] = date.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }
            await this.rateresteentriesdatefield.waitFor({ state: 'visible' });
            await this.rateresteentriesdatefield.fill(formattedDate);

        } catch (error) {
            console.error(`❌ Error in Rate Reset Entries for date [${date}]:`, error.message);
            throw error;
        }
    }

    async RevertRPS_DataCleanUp(date) {
        try {
            await this.revertrpscheckbox.waitFor({ state: 'visible' });
            await this.revertrpscheckbox.click();

            let formattedDate = date;
            if (date && date.includes('/')) {
                const [day, month, year] = date.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }
            await this.revertrpdatefield.waitFor({ state: 'visible' });
            await this.revertrpdatefield.fill(formattedDate);

        } catch (error) {
            console.error(`❌ Error in Revert RPS for date [${date}]:`, error.message);
            throw error;
        }
    }

    async DeleteUploadedRPS_DataCleanUp(date) {
        try {
            await this.deleteuploadedrpscheckbox.waitFor({ state: 'visible' });
            await this.deleteuploadedrpscheckbox.click();

            let formattedDate = date;
            if (date && date.includes('/')) {
                const [day, month, year] = date.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }
            await this.deleteuploadedrpsdatefield.waitFor({ state: 'visible' });
            await this.deleteuploadedrpsdatefield.fill(formattedDate);

        } catch (error) {
            console.error(`❌ Error in Delete Uploaded RPS for date [${date}]:`, error.message);
            throw error;
        }
    }

    async OverdueEntries_DataCleanUp(date) {
        try {
            await this.overdueentriescheckbox.waitFor({ state: 'visible' });
            await this.overdueentriescheckbox.click();

            let formattedDate = date;
            if (date && date.includes('/')) {
                const [day, month, year] = date.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }
            await this.overdueentriesdatefield.waitFor({ state: 'visible' });
            await this.overdueentriesdatefield.fill(formattedDate);

        } catch (error) {
            console.error(`❌ Error in Overdue Entries for date [${date}]:`, error.message);
            throw error;
        }
    }

    async WriteOffDetails_DataCleanUp(date) {
        try {
            await this.writeoffdetailscheckbox.waitFor({ state: 'visible' });
            await this.writeoffdetailscheckbox.click();

            let formattedDate = date;
            if (date && date.includes('/')) {
                const [day, month, year] = date.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }
            await this.writeoffdetailsdatefield.waitFor({ state: 'visible' });
            await this.writeoffdetailsdatefield.fill(formattedDate);

        } catch (error) {
            console.error(`❌ Error in Write Off Details for date [${date}]:`, error.message);
            throw error;
        }
    }

    async NPAMarkingDate_DataCleanUp(date) {
        try {
            await this.npamarkingdatecheckbox.waitFor({ state: 'visible' });
            await this.npamarkingdatecheckbox.click();

            let formattedDate = date;
            if (date && date.includes('/')) {
                const [day, month, year] = date.split('/');
                formattedDate = `${year}-${month}-${day}`;
            }
            await this.npamarkingdatedatefield.waitFor({ state: 'visible' });
            await this.npamarkingdatedatefield.fill(formattedDate);

        } catch (error) {
            console.error(`❌ Error in NPA Marking Date for date [${date}]:`, error.message);
            throw error;
        }
    }

    async AllExceptDisbursal() {

        try {
            await this.allexceptdisbursalcheckbox.waitFor({ state: 'visible' });
            await this.allexceptdisbursalcheckbox.click();
        } catch (error) {
            console.error(`❌ Error in All Except Disbursal checkox`, error.message);
            throw error;
        }
    }

    async RemoveDataButton() {

        try {
            await this.removedatabutton.waitFor({ state: 'visible' });
            await this.removedatabutton.click();

            await this.popupcloseButton.waitFor({ state: 'visible' });
            await this.popupcloseButton.click();
        } catch (error) {
            console.error(`❌ Error in Remove Data button and pop up close button`, error.message);
            throw error;
        }
    }

}