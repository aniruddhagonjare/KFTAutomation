import fs from 'fs';
import ExcelJS from 'exceljs';
import path from 'path';
import { getPartnerName, getApplicationIdGlobal, getCollectionAmountConsolidate, getCollectionAmountBank, getDemandDate, setbackFillFileName, getExcessAmount, getEMIAmount, getConsoleModifiedAmount, getBankModifiedAmount, getConsoleDueAmount, getbankDueAmount } from '../../../fixtures/baseTest.js';

export { page } from '../../../fixtures/baseTest.js';


export class collectionUpload {
    constructor(page) {
        this.attach(page);
    }
    attach(page) {
        this.page = page;
        this.maualuploadcheckbox = 'xpath=//div[@class="form-group col-sm-2"]//input[@id="chk_Manual" and @type="checkbox"]';
        this.partnerNameDropDown = 'xpath=//select[@id="PartnerID" and @name="PartnerId"]';
        this.productNameDropDown = 'xpath=//textarea[@type="search" and @placeholder="--Select--"]';

        this.noproductfoundmessageafterselectpartner = 'xpath=//p[text()="No Product(s) found for Selected Partner."]';

        this.uploadFileButton = 'xpath=//input[@type="file" and @id="fileUploadCollections" and @accept=".txt,.xls,.xlsx"]';

        this.collectionfileuploadclosebutton = '//*[@id="alert"]//div//div//div//button[@data-bs-dismiss="modal"]';

        this.processbutton = 'xpath=//button[@id="btn_process" or contains(text(),"Process")]';
    }

    async clickOnManualUploadCheckBox(targetPage) {
        const currentPage = targetPage || this.page;
        const field = currentPage.locator(this.maualuploadcheckbox);
        await field.waitFor({ state: 'visible' });
        await field.click();
    }

    async dropDownValuePartnerName(targetPage) {
        const currentPage = targetPage || this.page;
        const field = currentPage.locator(this.partnerNameDropDown);
        await field.waitFor({ state: 'visible' });
        await field.selectOption({ label: getPartnerName() });
    }

    get productnameselection() {
        const name = process.env.productName;
        return `xpath=//span[@class="select2-results"]//li[normalize-space()="${name}"]`;
    }

    async DropDownValueProductName(targetPage) {
        const currentPage = targetPage || this.page;
        const field = currentPage.locator(this.productNameDropDown);
        await field.waitFor({ state: 'visible' });
        await field.click();
        await new Promise(resolve => setTimeout(resolve, 500));

        const fieldd = currentPage.locator(this.productnameselection);
        await fieldd.waitFor({ state: 'visible' });
        await fieldd.click();
    }

    async CollectionChooseAndUploadFileButton(targetPage, currentModifier = null) {
        const currentPage = targetPage || this.page;

        const amountModifiersList = ['PP', 'FC', 0.2, 1.3, 1.6, 1.0, 1.0, 1.3, 'FC', 1.0, 0.0, 0.0, 0.0, 1.0];
        const loopIndex = global.backFillLoopCounter !== undefined ? global.backFillLoopCounter : 0;

        let activeModifier = currentModifier;
        if (activeModifier === null || activeModifier === undefined) {
            activeModifier = amountModifiersList[loopIndex] !== undefined ? amountModifiersList[loopIndex] : 1.0;
        }

        console.log(`📊 [EXCEL CONTEXT] Resolved Running Modifier for execution: "${activeModifier}" (Type: ${typeof activeModifier})`);

        const uploadbtn = currentPage.locator(this.uploadFileButton);
        await uploadbtn.waitFor({ state: 'visible' });

        const applicationIdFile = getApplicationIdGlobal() + '_' + Math.floor(Math.random() * 1000);
        const folderPath = 'Files';

        const files = fs.readdirSync(folderPath);
        const existingFile = files.find(file => file.startsWith('CollectionFile') && file.endsWith('.xlsx'));
        const originalFile = existingFile ? `${folderPath}/${existingFile}` : `${folderPath}/CollectionFile.xlsx`;

        const renamedFileName = `CollectionFile_${applicationIdFile}.xlsx`;
        const renamedFilePath = `${folderPath}/${renamedFileName}`;

        if (originalFile !== renamedFilePath) {
            if (fs.existsSync(originalFile)) {
                fs.renameSync(originalFile, renamedFilePath);
                const CollectionFilename = renamedFilePath.split('/').pop();
                setbackFillFileName(CollectionFilename);
            } else {
                throw new Error(`Source file not found at ${originalFile}`);
            }
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(renamedFilePath);
        const worksheet = workbook.worksheets[0];

        let splEventValue = '';
        let impactValue = '';

        const cleanModifierString = typeof activeModifier === 'string' ? activeModifier.trim().toUpperCase() : '';
        const normalizedModifier = (activeModifier !== 'FC' && cleanModifierString !== 'PP' && typeof activeModifier !== 'number') ? parseFloat(activeModifier) : activeModifier;

        if (cleanModifierString === 'PP') {
            console.log(` ------------ Excel Builder: Configured For Part Payment String Indicator (PP) ------------`);
            splEventValue = 'PP';
            impactValue = Math.random() < 0.5 ? 'EMI' : 'Tenure';
        } else if (typeof normalizedModifier === 'number' && !isNaN(normalizedModifier)) {
            if (normalizedModifier >= 1.0 && normalizedModifier <= 1.5) {
                console.log(` ------------ Excel Builder: Configured For Advanced Payment Tier (${normalizedModifier}) ------------`);
                splEventValue = '';
                impactValue = '';
            } else {
                console.log(` ------------ Excel Builder: Configured For Standard / Out-of-bounds Tier (${normalizedModifier}) ------------`);
                splEventValue = '';
                impactValue = '';
            }
        } else {
            console.log(` ------------ Excel Builder: Configured For Special String Action (${normalizedModifier}) ------------`);
            splEventValue = '';
            impactValue = '';
        }

        const dataToInsert = {
            'Application ID': getApplicationIdGlobal(),
            'Transaction ID': 'TXN' + Math.floor(Math.random() * 1000000),
            'Customer_DepositDate_DMY': getDemandDate(),
            'Customer_SettlementDate_DMY': getDemandDate(),
            'Bank_DepositDate_DMY': getDemandDate(),
            'Bank_SettlementDate_DMY': getDemandDate(),
            'Gross Collection': getCollectionAmountConsolidate(),
            'BankPrincipal': getCollectionAmountBank(),
            'SplEventFlag': splEventValue,
            'Impact': impactValue
        };

        let headerRowIndex = -1;
        const columnIndices = {};

        for (let r = 1; r <= worksheet.rowCount; r++) {
            const row = worksheet.getRow(r);
            let matchCount = 0;
            const tempIndices = {};

            row.eachCell({ includeEmpty: false }, (cell, colIndex) => {
                const cellValue = cell.value ? cell.value.toString().trim() : '';
                if (!cellValue) return;

                Object.keys(dataToInsert).forEach(headerName => {
                    const normalizedCell = cellValue.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const normalizedHeader = headerName.toLowerCase().replace(/[^a-z0-9]/g, '');

                    if (cellValue === headerName || normalizedCell === normalizedHeader || normalizedCell.includes(normalizedHeader)) {
                        tempIndices[headerName] = colIndex;
                        matchCount++;
                    }
                });
            });

            if (matchCount >= 2) {
                headerRowIndex = r;
                Object.assign(columnIndices, tempIndices);
                break;
            }
        }

        if (headerRowIndex !== -1) {
            const dataRow = worksheet.getRow(headerRowIndex + 1);

            Object.keys(dataToInsert).forEach(headerName => {
                let colIdx = columnIndices[headerName];

                if (!colIdx) {
                    const cleanHeader = headerName.toLowerCase().replace(/[^a-z0-9]/g, '');
                    Object.keys(columnIndices).forEach(mappedName => {
                        if (mappedName.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanHeader)) {
                            colIdx = columnIndices[mappedName];
                        }
                    });
                }

                if (colIdx) {
                    dataRow.getCell(colIdx).value = dataToInsert[headerName];
                }
            });

            let fallbackSplEventCol = columnIndices['SplEventFlag'];
            let fallbackImpactCol = columnIndices['Impact'];

            const headerRow = worksheet.getRow(headerRowIndex);
            headerRow.eachCell((cell, colIndex) => {
                const text = cell.value ? cell.value.toString().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
                if (text.includes('splevent') || text.includes('eventflag')) fallbackSplEventCol = colIndex;
                if (text.includes('impact')) fallbackImpactCol = colIndex;
            });

            if (cleanModifierString === 'PP') {
                const lastColIndex = headerRow.actualCellCount || 23;
                if (!fallbackSplEventCol) {
                    fallbackSplEventCol = lastColIndex + 1;
                    headerRow.getCell(fallbackSplEventCol).value = 'SplEventFlag';
                    console.log(`➕ [COMPULSORY] Force created 'SplEventFlag' at column index: ${fallbackSplEventCol}`);
                }
                if (!fallbackImpactCol) {
                    fallbackImpactCol = fallbackSplEventCol + 1;
                    headerRow.getCell(fallbackImpactCol).value = 'Impact';
                    console.log(`➕ [COMPULSORY] Force created 'Impact' at column index: ${fallbackImpactCol}`);
                }
                headerRow.commit();
            }

            if (fallbackSplEventCol) dataRow.getCell(fallbackSplEventCol).value = dataToInsert['SplEventFlag'];
            if (fallbackImpactCol) dataRow.getCell(fallbackImpactCol).value = dataToInsert['Impact'];

            dataRow.commit();
        } else {
            worksheet.getCell('C2').value = dataToInsert['Application ID'];
            worksheet.getCell('D2').value = dataToInsert['Transaction ID'];
            worksheet.getCell('E2').value = dataToInsert['Customer_DepositDate_DMY'];
            worksheet.getCell('F2').value = dataToInsert['Customer_SettlementDate_DMY'];
            worksheet.getCell('G2').value = dataToInsert['Bank_DepositDate_DMY'];
            worksheet.getCell('H2').value = dataToInsert['Bank_SettlementDate_DMY'];
            worksheet.getCell('J2').value = dataToInsert['Gross Collection'];
            worksheet.getCell('P2').value = dataToInsert['BankPrincipal'];

            let fallbackSplEventCol = null;
            let fallbackImpactCol = null;
            const firstRow = worksheet.getRow(1);

            firstRow.eachCell((cell, colIndex) => {
                const txt = cell.value ? cell.value.toString().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
                if (txt.includes('splevent') || txt.includes('eventflag')) fallbackSplEventCol = colIndex;
                if (txt.includes('impact')) fallbackImpactCol = colIndex;
            });

            if (cleanModifierString === 'PP') {
                const lastColIndex = firstRow.actualCellCount || 16;

                if (!fallbackSplEventCol) {
                    fallbackSplEventCol = lastColIndex + 1;
                    firstRow.getCell(fallbackSplEventCol).value = 'SplEventFlag';
                }
                if (!fallbackImpactCol) {
                    fallbackImpactCol = fallbackSplEventCol + 1;
                    firstRow.getCell(fallbackImpactCol).value = 'Impact';
                }
                firstRow.commit();
            }

            if (fallbackSplEventCol) worksheet.getRow(2).getCell(fallbackSplEventCol).value = dataToInsert['SplEventFlag'];
            if (fallbackImpactCol) worksheet.getRow(2).getCell(fallbackImpactCol).value = dataToInsert['Impact'];
        }

        await workbook.xlsx.writeFile(renamedFilePath);
        await uploadbtn.setInputFiles(renamedFilePath);

        const processBtnLocator = currentPage.locator(this.processbutton);
        if (await processBtnLocator.isVisible()) {
            await processBtnLocator.click();
        } else {
            // console.log("Process Button not visible. Moving to the next step.");
        }

        const closeButton = currentPage.locator(this.collectionfileuploadclosebutton);
        await closeButton.waitFor({ state: 'visible' });
        await closeButton.click();

        return renamedFilePath;
    }

    async CollectionRebuild_CollectionChooseAndUploadFileButton(targetPage, renamedFilePath) {
        const currentPage = targetPage || this.page;

        const fileInputElement = currentPage.locator(this.uploadFileButton);

        await fileInputElement.waitFor({ state: 'visible' });

        let absolutePath;
        if (!renamedFilePath.includes(path.sep)) {
            absolutePath = path.resolve(process.cwd(), 'excelFiles', renamedFilePath);
        } else {
            absolutePath = path.resolve(renamedFilePath);
        }

        //console.log(`🚀 Programmatically uploading to system input: "${absolutePath}"`);
        await fileInputElement.setInputFiles(absolutePath);
    }

    async ColelctionRebuild_dropDownValuePartnerName(targetPage, partnerName) {
        const currentPage = targetPage || this.page;
        const field = currentPage.locator(this.partnerNameDropDown);
        await field.selectOption({ label: partnerName });
    }

    async CollectionRebuild_DropDownValueProductName(targetPage, productName) {
        const currentPage = targetPage || this.page;

        const noProductFoundMessage = currentPage.locator(this.noproductfoundmessageafterselectpartner);
        const closePopupButton = currentPage.locator('button[data-bs-dismiss="modal"]').first();

        const isPopupVisible = await noProductFoundMessage.waitFor({ state: 'visible', timeout: 7000 })
            .then(() => true)
            .catch(() => false);

        if (isPopupVisible) {
            console.log("The 'No product found' popup is displayed.");
            await new Promise(resolve => setTimeout(resolve, 3000));

            if (await closePopupButton.isVisible()) {
                await closePopupButton.click();
                console.log("Closed the popup safely.");
            }

            await new Promise(resolve => setTimeout(resolve, 5000));

        } else {
            console.log("Popup did not appear within 7s. Proceeding with product selection...");

            const field = currentPage.locator(this.productNameDropDown);
            await field.waitFor({ state: 'visible' });
            await field.click();

            await currentPage.waitForTimeout(500);

            const productnameselection = currentPage.locator(
                `xpath=//span[@class="select2-results"]//li[contains(normalize-space(), "${productName}")]`
            );
            await productnameselection.waitFor({ state: 'visible' });
            await productnameselection.click();
        }
    }


}
