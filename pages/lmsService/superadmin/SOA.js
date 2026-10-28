import { getDemandDate, getOSPrinicipleAmoluntConsole, getOverdueAmountConsole, getOSPrinicipleAmoluntBank, getOverdueAmountBank, getCollectionAmountBank, getCollectionAmountConsolidate, getConsoleModifiedAmount, getBankModifiedAmount, getExcessAmountBank, getConsoleDueAmount, getbankDueAmount } from "../../../fixtures/baseTest.js";


export class SOA {
    constructor(page) {
        this.attach(page);
    }
    attach(page) {
        this.page = page;
        this.viewfilterdropdown = 'xpath=//select[@class="form-control" and @id="ddl_view" and @name="SelectedView"]';
        this.collectionamount = `xpath=(//table[contains(@class, "ac_statement")]//tr[td[text()="${getDemandDate()}"]]/td)[4]`;

        this.getpartnername = 'xpath=//table[@class="table table-hover"]//tbody//tr[1]//td[1]';
        this.getproductname = 'xpath=//input[@id="LoanAccountDetail_productName" and @type="text"]';

        let previousExcessAmount = 0.00;
    }

    getConsoleExcessValueLocator(currentPage) {
        const demandDate = getDemandDate();
        return currentPage.locator(`xpath=//table[contains(@class,"ac_statement")]/tbody/tr[td[contains(text(), "${demandDate}")]]/following-sibling::tr[1]//th[text()="Excess"]/ancestor::table/tbody/tr/td[8]`);
    }

    getBankExcessValueLocator(currentPage) {
        const demandDate = getDemandDate();
        return currentPage.locator(`xpath=//table[contains(@class,"ac_statement")]/tbody/tr[td[contains(text(), "${demandDate}")]]/following-sibling::tr[1]//th[text()="Excess"]/ancestor::table/tbody/tr/td[8]`);
    }


    getCollectionAmountLocator() {
        const demandDate = getDemandDate();
        return `xpath=(//table[contains(@class, "ac_statement")]//tr[td[text()="${demandDate}"]]/td)[4]`;
    }

    getDueAmountLocatorBank() {
        const demandDate = getDemandDate();
        return `xpath=(//table[contains(@class, "ac_statement")]//tr[td[text()="${demandDate}"]]/td)[4]`;
    }

    getOutstandingPrincipalConsole() {
        const demandDate = getDemandDate();
        return `xpath=//table[contains(@class,"ac_statement")]/tbody/tr[td[text()="${demandDate}"]]/following-sibling::tr[1]/descendant::table[3]/tbody/tr[1]/td[1]`;
    }

    getOutstandingPrincipalBank() {
        const demandDate = getDemandDate();
        return `xpath=//table[contains(@class,"ac_statement")]/tbody/tr[td[text()="${demandDate}"]]/following-sibling::tr[1]/descendant::table[3]/tbody/tr[1]/td[1]`;
    }

    getConsoleOverdueValueLocator() {
        const demandDate = getDemandDate();
        return `xpath=//table[contains(@class,"ac_statement")]/tbody/tr[td[text()="${demandDate}"]]/following-sibling::tr[1]/descendant::table[3]/tbody/tr[1]/td[2]`;
    }

    getBankOverdueValueLocator() {
        const demandDate = getDemandDate();
        return `xpath=//table[contains(@class,"ac_statement")]/tbody/tr[td[text()="${demandDate}"]]/following-sibling::tr[1]/descendant::table[3]/tbody/tr[1]/td[2]`;
    }



    async ViewFilterDropDownConsolidate(targetPage) {
        const currentPage = targetPage || this.page;
        const field = await currentPage.locator(this.viewfilterdropdown);
        await field.waitFor({ state: 'visible' });
        await field.click();
        await field.selectOption({ label: 'Option 1' });
    }

    async ViewFilterDropDownUCO(targetPage) {

        const currentPage = targetPage || this.page;
        const field = currentPage.locator(this.viewfilterdropdown);
        await field.waitFor({ state: 'visible' });
        await field.selectOption({ label: 'UCO' });
    }

    async GetCollectionAmountConsolidated(targetPage, modifier = 1.0) {
        if (this.globalPreviousExcess === undefined || isNaN(this.globalPreviousExcess)) {
            this.globalPreviousExcess = 0.00;
        }

        const currentPage = targetPage || this.page;

        const normalizedModifier = (modifier !== 'FC' && typeof modifier !== 'number') ? parseFloat(modifier) : modifier;

        const field = await currentPage.locator(this.getCollectionAmountLocator());
        await field.waitFor({ state: 'visible' });

        const rawText = await field.textContent();
        const cleanText = (rawText || "").trim();
        const baseDueAmount = parseFloat(cleanText.replace(/[^0-9.-]+/g, "")) || 0.00;

        process.env.DueconsoleAmount = baseDueAmount.toFixed(2);
        console.log(`----------------------- [CONSOLIDATED] Before Execution - UI Base Due Amount: ${baseDueAmount.toFixed(2)} -----------------------`);

        let finalAmount = 0.00;

        if (normalizedModifier === 1.0) {
            console.log(`📉 [CONSOLIDATED] LMS Logic Active (1.0). Deducting Stored Excess: ${this.globalPreviousExcess}`);

            const rawFinalAmount = parseFloat((baseDueAmount - this.globalPreviousExcess).toFixed(2));

            if (rawFinalAmount < 0) {
                finalAmount = 0.00;
                this.globalPreviousExcess = parseFloat(Math.abs(rawFinalAmount).toFixed(2));
                console.log(`✅ [CONSOLIDATED] Excess fully covers target. Pay: 0.00. Remaining Credit: ${this.globalPreviousExcess}`);
            } else {
                finalAmount = rawFinalAmount;
                this.globalPreviousExcess = 0.00;
                console.log(`✅ [CONSOLIDATED] Excess applied. Pay: ${finalAmount.toFixed(2)}. Credit fully consumed.`);
            }
        }
        else if (normalizedModifier > 1.0 && normalizedModifier <= 1.5) {
            console.log(`💼 [CONSOLIDATED] Advanced Payment Tier (${normalizedModifier}) Active. Skipping excess deduction.`);

            finalAmount = parseFloat((baseDueAmount * normalizedModifier).toFixed(2));

            if (finalAmount > baseDueAmount) {
                this.globalPreviousExcess = parseFloat((finalAmount - baseDueAmount).toFixed(2));
                console.log(`🔥 [ADVANCED Excess] New excess generated: ${this.globalPreviousExcess}`);
            }
        }
        else if (normalizedModifier > 1.5 && normalizedModifier <= 1.9) {
            console.log(`💰 [CONSOLIDATED] Part Payment Tier (${normalizedModifier}) Active. Skipping excess deduction.`);

            finalAmount = parseFloat((baseDueAmount * normalizedModifier).toFixed(2));

            if (finalAmount > baseDueAmount) {
                this.globalPreviousExcess = parseFloat((finalAmount - baseDueAmount).toFixed(2));
                console.log(`🔥 [PART Excess] New excess generated: ${this.globalPreviousExcess}`);
            }
        }
        else {
            console.log(`🔀 [CONSOLIDATED] Out-of-bounds Modifier (${normalizedModifier}) active. Skipping excess deduction.`);

            finalAmount = parseFloat((baseDueAmount * normalizedModifier).toFixed(2));

            if (finalAmount > baseDueAmount) {
                this.globalPreviousExcess = parseFloat((finalAmount - baseDueAmount).toFixed(2));
                console.log(`🔥 [FALLBACK Excess] New excess generated: ${this.globalPreviousExcess}`);
            } else {
                console.log(`ℹ️ [CONSOLIDATED] Fractional modifier applied. Balance retained: ${this.globalPreviousExcess}`);
            }
        }

        const finalAmountStr = finalAmount.toFixed(2);
        process.env.GLOBAL_collectionConsolidate_amount = finalAmountStr;
        console.log(`----------------------- [CONSOLIDATED] After Execution - Final Amount Saved: ${finalAmountStr} -----------------------`);

        return cleanText;
    }


    async GetCollectionAmountBank(targetPage, modifier = 1.0) {
        const currentPage = targetPage || this.page;

        const normalizedModifier = (modifier !== 'FC' && typeof modifier !== 'number') ? parseFloat(modifier) : modifier;

        const field = await currentPage.locator(this.getCollectionAmountLocator());
        await field.waitFor({ state: 'visible', timeout: 5000 });

        const rawText = await field.textContent();
        const cleanText = (rawText || "").trim();
        const baseAmount = parseFloat(cleanText.replace(/[^0-9.-]+/g, "")) || 0.00;

        process.env.DuebankAmount = baseAmount.toFixed(2);
        console.log(`----------------------- [BANK] Before Execution - UI Bank Base Amount: ${baseAmount.toFixed(2)} -----------------------`);

        const currentExcessValue = parseFloat(process.env.excessAmountbank) || 0.00;
        let finalAmount = 0.00;

        if (normalizedModifier === 1.0) {
            console.log(`📉 [BANK] LMS Logic Active (1.0). Deducting Stored Excess: ${currentExcessValue}`);

            const rawFinalAmount = parseFloat((baseAmount - currentExcessValue).toFixed(2));

            if (rawFinalAmount < 0) {
                finalAmount = 0.00;
                const remainingExcess = parseFloat(Math.abs(rawFinalAmount).toFixed(2));
                process.env.excessAmountbank = remainingExcess.toFixed(2);
                console.log(`✅ [BANK] Excess fully covers target. Pay: 0.00. Remaining Credit: ${remainingExcess}`);
            } else {
                finalAmount = rawFinalAmount;
                process.env.excessAmountbank = "0.00";
                console.log(`✅ [BANK] Excess applied. Pay: ${finalAmount.toFixed(2)}. Credit fully consumed.`);
            }
        }
        else if (normalizedModifier > 1.0 && normalizedModifier <= 1.5) {
            console.log(`💼 [BANK] Advanced Payment Tier (${normalizedModifier}) Active. Skipping excess deduction.`);

            finalAmount = parseFloat((baseAmount * normalizedModifier).toFixed(2));

            if (finalAmount > baseAmount) {
                const newExcess = parseFloat((finalAmount - baseAmount).toFixed(2));
                process.env.excessAmountbank = newExcess.toFixed(2);
                console.log(`🔥 [BANK ADVANCED Excess] New excess generated: ${newExcess}`);
            } else {
                process.env.excessAmountbank = currentExcessValue.toFixed(2);
            }
        }
        else if (normalizedModifier > 1.5 && normalizedModifier <= 1.9) {
            console.log(`💰 [BANK] Part Payment Tier (${normalizedModifier}) Active. Skipping excess deduction.`);

            finalAmount = parseFloat((baseAmount * normalizedModifier).toFixed(2));

            if (finalAmount > baseAmount) {
                const newExcess = parseFloat((finalAmount - baseAmount).toFixed(2));
                process.env.excessAmountbank = newExcess.toFixed(2);
                console.log(`🔥 [BANK PART Excess] New excess generated: ${newExcess}`);
            } else {
                process.env.excessAmountbank = currentExcessValue.toFixed(2);
            }
        }
        else {
            console.log(`🔀 [BANK] Out-of-bounds Modifier (${normalizedModifier}) active. Skipping excess deduction.`);

            finalAmount = parseFloat((baseAmount * normalizedModifier).toFixed(2));

            if (finalAmount > baseAmount) {
                const newExcess = parseFloat((finalAmount - baseAmount).toFixed(2));
                process.env.excessAmountbank = newExcess.toFixed(2);
                console.log(`🔥 [BANK FALLBACK Excess] New excess generated: ${newExcess}`);
            } else {
                console.log(`ℹ️ [BANK] Fractional modifier applied. Balance retained: ${currentExcessValue}`);
                process.env.excessAmountbank = currentExcessValue.toFixed(2);
            }
        }

        const finalAmountStr = finalAmount.toFixed(2);
        process.env.GLOBAL_collectionBank_amount = finalAmountStr;
        console.log(`----------------------- [BANK] After Execution - Final Bank Amount Saved: ${finalAmountStr} -----------------------`);

        return cleanText;
    }


    async GetPartnerName(targetPage) {

        const currentPage = targetPage || this.page;
        const field = await currentPage.locator(this.getpartnername);
        await field.waitFor({ state: 'visible' });
        const partnername = await field.textContent();
        process.env.partnername = partnername;
    }

    async GetProductName(targetPage) {
        const currentPage = targetPage || this.page;
        const field = await currentPage.locator(this.getproductname);
        await field.waitFor({ state: 'visible' });
        const productname = await field.inputValue();
        process.env.productName = productname;
    }


    async getExcessValueConsole(targetPage) {
        const currentPage = targetPage || this.page;
        const session = await currentPage.context().newCDPSession(currentPage);

        try {
            await session.send('Network.clearBrowserCache');
            await currentPage.reload({ waitUntil: 'domcontentloaded' });

            const demandDate = getDemandDate();
            const dropIconSelector = `xpath=//table[contains(@class,"ac_statement")]/tbody/tr[td[contains(text(), "${demandDate}")]]//td[@id]`;
            const expandedRowSelector = `xpath=//table[contains(@class,"ac_statement")]/tbody/tr[td[contains(text(), "${demandDate}")]]/following-sibling::tr[1]`;

            const tabledropicon = currentPage.locator(dropIconSelector);
            await tabledropicon.waitFor({ state: 'visible', timeout: 5000 });
            await tabledropicon.click();

            const expandedRow = currentPage.locator(expandedRowSelector);
            await expandedRow.waitFor({ state: 'visible', timeout: 5000 });

            try {
                const field = this.getConsoleExcessValueLocator(currentPage);
                await field.waitFor({ state: 'visible', timeout: 5000 });

                const excessValue = await field.textContent();
                process.env.excessAmountConsole = excessValue ? excessValue.trim() : '';

                console.log(`--------------- Excess Amount Console: ${process.env.excessAmountConsole}`);
            } catch (e) {
                console.log(`❌  Excess Amount displying blank on console❌`);
            }

        } catch (error) {
            console.error(`❌ Error finding Console Excess Value: ${error.message}`);
            console.error(`Failed to extract or empty excess value from console: ${error.message}`);
            throw error;
        } finally {

            if (session) {
                await session.detach().catch(() => { });
            }
        }
    }


    async getExcessValueBank(targetPage) {
        try {
            const currentPage = targetPage || this.page;
            const demandDate = getDemandDate();

            const dropIconSelector = `xpath=//table[contains(@class,"ac_statement")]/tbody/tr[td[contains(text(), "${demandDate}")]]//td[@id]`;
            const dropdownIcon = currentPage.locator(dropIconSelector);

            const session = await currentPage.context().newCDPSession(currentPage);
            await session.send('Network.clearBrowserCache');

            await dropdownIcon.waitFor({ state: 'visible', timeout: 5000 });
            await dropdownIcon.click();

            try {
                const field = this.getBankExcessValueLocator(currentPage);
                await field.waitFor({ state: 'visible', timeout: 5000 });

                const excessValue = await field.textContent();
                if (!excessValue) {
                    throw new Error(`Failed to extract text from Excess Value locator for date: ${demandDate}`);
                }

                process.env.excessAmountbank = excessValue.trim();
                console.log(`--------------- Excess Amount Bank : ${getExcessAmountBank()}`);
            } catch (e) {
                console.log(`❌Excess Amount displying blank on bank ❌`);
            }
        } catch (e) {

        }
    }

    async getOverdueValueConsole(targetPage) {
        const currentPage = targetPage || this.page;
        const field = await currentPage.locator(this.getConsoleOverdueValueLocator());
        await field.waitFor({ state: 'visible' });
        const overdueValue = await field.textContent();
        process.env.overdueAmountConsole = overdueValue.trim();
        console.log(`Overdue Amount console: ${getOverdueAmountConsole()}`);
    }

    async getOverdueValueBank(targetPage) {
        const currentPage = targetPage || this.page;
        const field = await currentPage.locator(this.getBankOverdueValueLocator());
        await field.waitFor({ state: 'visible' });
        const overdueValue = await field.textContent();
        process.env.overdueAmountBank = overdueValue.trim();
        console.log(`Overdue Amount bank: ${getOverdueAmountBank()}`);
    }


    async ConsoleOSPrincipleAmount(targetPage) {
        const currentPage = targetPage || this.page;

        const demandDate = getDemandDate();
        const dropIconSelector = `xpath=//table[contains(@class,"ac_statement")]/tbody/tr[td[contains(text(), "${demandDate}")]]//td[@id]`;

        const tabledropicon = currentPage.locator(dropIconSelector);
        await tabledropicon.waitFor({ state: 'visible', timeout: 5000 });
        await tabledropicon.click();

        const field = await currentPage.locator(this.getOutstandingPrincipalConsole());
        await field.waitFor({ state: 'visible' });
        const ConsoleOSprincipleamount = await field.textContent();
        process.env.consoleoutstandingPrincipalAmount = ConsoleOSprincipleamount.trim();

        await this.getOverdueValueConsole(currentPage);

        const osPrincipal = parseFloat(getOSPrinicipleAmoluntConsole().replace(/,/g, '')) || 0;
        const overdue = parseFloat(getOverdueAmountConsole().replace(/,/g, '')) || 0;

        const consolePrinciple_and_OD = osPrincipal + overdue;

        process.env.GLOBAL_collectionConsolidate_amount = consolePrinciple_and_OD.toFixed(2);

    }


    async BankOSPrincipleAmount(targetPage) {
        const currentPage = targetPage || this.page;

        const demandDate = getDemandDate();
        const dropIconSelector = `xpath=//table[contains(@class,"ac_statement")]/tbody/tr[td[contains(text(), "${demandDate}")]]//td[@id]`;

        const tabledropicon = currentPage.locator(dropIconSelector);
        await tabledropicon.waitFor({ state: 'visible', timeout: 5000 });
        await tabledropicon.click();

        const field = await currentPage.locator(this.getOutstandingPrincipalBank());
        await field.waitFor({ state: 'visible' });
        const BankOSprincipleamount = await field.textContent();
        process.env.bankoutstandingPrincipalAmount = BankOSprincipleamount.trim();

        await this.getOverdueValueBank(currentPage);

        const osPrincipal = parseFloat(getOSPrinicipleAmoluntBank().replace(/,/g, '')) || 0;
        const overdue = parseFloat(getOverdueAmountBank().replace(/,/g, '')) || 0;


        const bankPrinciple_and_OD = osPrincipal + overdue;

        process.env.GLOBAL_collectionBank_amount = bankPrinciple_and_OD.toFixed(2);


    }

    async GetCollectionAmountConsolidatedForPP(targetPage, modifier = 'PP') {
        if (this.globalPreviousExcess === undefined || isNaN(this.globalPreviousExcess)) {
            this.globalPreviousExcess = 0.00;
        }

        const currentPage = targetPage || this.page;

        const field = await currentPage.locator(this.getCollectionAmountLocator());
        await field.waitFor({ state: 'visible', timeout: 7000 });

        const rawText = await field.textContent();
        const cleanText = (rawText || "").trim();
        const baseDueAmount = parseFloat(cleanText.replace(/[^0-9.-]+/g, "")) || 0.00;

        process.env.DueconsoleAmount = baseDueAmount.toFixed(2);
        console.log(`----------------------- [CONSOLIDATED - PP] Before Execution - UI Base Due Amount: ${baseDueAmount.toFixed(2)} -----------------------`);

        const percentage = 50;
        let finalAmount = parseFloat((baseDueAmount * (1 + percentage / 100)).toFixed(2))

        // console.log(`💰 [CONSOLIDATED] Part Payment (PP) String Indicator Active. Skipping excess deduction.`);
        // console.log(`📈 [CONSOLIDATED - PP] Forcing payment over baseline due: ${baseDueAmount.toFixed(2)} -> Target: ${finalAmount.toFixed(2)}`);

        this.globalPreviousExcess = parseFloat((finalAmount - baseDueAmount).toFixed(2));
        console.log(`🔥 [PART Excess - PP] New excess generated and tracked: ${this.globalPreviousExcess.toFixed(2)}`);

        const finalAmountStr = finalAmount.toFixed(2);
        process.env.GLOBAL_collectionConsolidate_amount = finalAmountStr;
        console.log(`----------------------- [CONSOLIDATED - PP] After Execution - Final Amount Saved: ${finalAmountStr} -----------------------`);

        return cleanText;
    }

    async GetCollectionAmountBankForPP(targetPage, modifier = 'PP') {
        const currentPage = targetPage || this.page;

        const field = await currentPage.locator(this.getDueAmountLocatorBank());
        await field.waitFor({ state: 'visible', timeout: 5000 });

        const rawText = await field.textContent();
        const cleanText = (rawText || "").trim();
        const baseAmount = parseFloat(cleanText.replace(/[^0-9.-]+/g, "")) || 0.00;

        process.env.DuebankAmount = baseAmount.toFixed(2);
        console.log(`----------------------- [BANK - PP] Before Execution - UI Bank Base Amount: ${baseAmount.toFixed(2)} -----------------------`);

        const currentExcessValue = parseFloat(process.env.excessAmountbank) || 0.00;
        const percentage = 50;
        let finalAmount = parseFloat((baseAmount * (1 + percentage / 100)).toFixed(2));


        console.log(`💰 [BANK] Part Payment (PP) String Indicator Active. Skipping excess deduction.`);
        console.log(`📈 [BANK - PP] Forcing payment over baseline due: ${baseAmount.toFixed(2)} -> Target: ${finalAmount.toFixed(2)}`);

        const newExcess = parseFloat((finalAmount - baseAmount).toFixed(2));
        process.env.excessAmountbank = newExcess.toFixed(2);
        console.log(`🔥 [BANK PP Excess] New excess generated and tracked: ${newExcess.toFixed(2)}`);

        const finalAmountStr = finalAmount.toFixed(2);
        process.env.GLOBAL_collectionBank_amount = finalAmountStr;
        console.log(`----------------------- [BANK - PP] After Execution - Final Bank Amount Saved: ${finalAmountStr} -----------------------`);

        return cleanText;
    }

    async GetCollectionAmountConsolidatedForFP(targetPage, modifier = 'FP') {
        const currentPage = targetPage || this.page;

        const field = currentPage.locator(this.getCollectionAmountLocator());
        await field.waitFor({ state: 'visible', timeout: 7000 });

        const rawText = await field.textContent();
        const cleanText = (rawText || "").trim();
        const baseDueAmount = parseFloat(cleanText.replace(/[^0-9.-]+/g, "")) || 0.00;

        const finalAmount = baseDueAmount;
        const finalAmountStr = finalAmount.toFixed(2);

        process.env.DueconsoleAmount = finalAmountStr;
        process.env.GLOBAL_collectionConsolidate_amount = finalAmountStr;

        this.globalPreviousExcess = 0.00;

        console.log(`----------------------- [CONSOLIDATED - ${modifier}] Execution -----------------------`);
        console.log(`UI Base Due Amount: ${finalAmountStr}`);
        console.log(`[CONSOLIDATED - ${modifier}] Full Payment selected. Uploading exact base due: ${finalAmountStr}`);
        console.log(`----------------------- [CONSOLIDATED - ${modifier}] Final Amount Saved: ${finalAmountStr} -----------------------`);

        return cleanText;
    }

    async GetCollectionAmountBankForFP(targetPage, modifier = 'FP') {
        
        const currentPage = targetPage || this.page;

        const field = currentPage.locator(this.getDueAmountLocatorBank());
        await field.waitFor({ state: 'visible', timeout: 5000 });

        const rawText = await field.textContent();
        const cleanText = (rawText || "").trim();
        const baseDueAmount = parseFloat(cleanText.replace(/[^0-9.-]+/g, "")) || 0.00;

        const finalAmount = baseDueAmount;
        const finalAmountStr = finalAmount.toFixed(2);

        process.env.DueBankAmount = finalAmountStr;
        process.env.GLOBAL_collectionBank_amount = finalAmountStr;

        this.globalPreviousExcess = 0.00;

        console.log(`----------------------- [BANK - ${modifier}] Execution -----------------------`);
        console.log(`UI Base Bank Due Amount: ${finalAmountStr}`);
        console.log(`[BANK - ${modifier}] Full Payment selected. Uploading exact base due: ${finalAmountStr}`);
        console.log(`----------------------- [BANK - ${modifier}] Final Amount Saved: ${finalAmountStr} -----------------------`);

        return cleanText;
    }

}