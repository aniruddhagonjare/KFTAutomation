import { setDisbursementDate, getRPSAllEmiDates } from "../../../fixtures/baseTest.js";

export class RPS {

    constructor(page) {
        this.page = page;
    }

    onTab(targetPage) {
        this.page = targetPage || this.page;
        return this;
    }

    get dsibursementdatetextfield() { return this.page.locator('xpath=//label[contains(text(),"Disbursement date")]/following-sibling::input'); }
    get firstDateCell() { return this.page.locator('tbody tr').first().locator('td').nth(1); }
    get lastDateCell() { return this.page.locator('tbody tr').nth(1).locator('td').nth(1); }
    get tableRows() { return this.page.locator('tbody tr'); }

    async getDisbursementDateTextField() {
        const field = this.dsibursementdatetextfield;

        await field.waitFor({ state: 'visible' });
        const disbursementDate = await field.inputValue();

        if (typeof setDisbursementDate === 'function') {
            setDisbursementDate(disbursementDate);
        }
        return disbursementDate;
    }

    async getEMIAmountFromTable() {
        if (!this.page) {
            throw new Error("this.page is undefined. Ensure the page context is passed to the constructor of this Page Object Class.");
        }

        const tableContainer = this.page.locator('.table-responsive, table.table').first();
        await tableContainer.waitFor({ state: 'visible' });

        const headers = await this.page.locator('table.table thead th').allTextContents();
        const amountColumnIndex = headers.findIndex(header => header.trim() === 'Amount');

        if (amountColumnIndex === -1) {
            throw new Error("Could not find the 'Amount' column header in the table structure.");
        }

        const targetCell = this.page.locator('table.table tbody tr')
            .filter({ has: this.page.locator('td:first-child').filter({ hasText: /^1$/ }) })
            .locator('td')
            .nth(amountColumnIndex);

        await targetCell.waitFor({ state: 'visible' });

        const rawAmountText = await targetCell.textContent();
        const emiDate = rawAmountText ? rawAmountText.trim() : "0";
        process.env.EMIDate = emiDate;
        // console.log(`[Table Lookup] Extracted EMI Amount: ${getEMIAmount()}`);
        return emiDate;
    }


    async getDemandDateFromRPSPage() {
        if (typeof global.backFillLoopCounter === 'undefined') {
            global.backFillLoopCounter = 0;
        }

        let rawResult = getRPSAllEmiDates();
        if (typeof rawResult === 'string') {
            rawResult = JSON.parse(rawResult);
        }
        const rawEmiDataArray = rawResult || [];

        const emiDataArray = rawEmiDataArray.filter((item, index, arr) => {
            if (index === 0) return true;
            const currentArrDate = item.date ? item.date : item;
            const prevArrDate = arr[index - 1].date ? arr[index - 1].date : arr[index - 1];
            return currentArrDate !== prevArrDate;
        });

        const activeIndex = global.backFillLoopCounter;

        if (!emiDataArray || emiDataArray.length <= activeIndex) {
            throw new Error(`getDemandDateFromRPSPage Fail: Index ${activeIndex} does not exist in deduplicated emiDataArray.`);
        }

        const targetRecord = emiDataArray[activeIndex];
        const rawDateStr = targetRecord.date ? targetRecord.date : targetRecord;

        process.env.formattedDemandDate = rawDateStr;

        const [year, month, day] = rawDateStr.split('-');
        const demanddate = `${day}/${month}/${year}`;
        process.env.demanddate = demanddate;

        global.backFillLoopCounter++;
        return demanddate;
    }


    formatTableDate(dateStr) {
        if (!dateStr || !dateStr.includes('/')) return dateStr;
        const [month, day, year] = dateStr.trim().split('/');
        return `${year}-${day}-${month}`;
    }

    async GetDataForFutureRPSDate() {
        const RpsAllEmiDates = [];
        const seenRecords = new Set();

        const rowCount = await this.tableRows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = this.tableRows.nth(i);
            const cells = row.locator('td');
            const cellCount = await cells.count();

            if (cellCount > 1) {
                const installmentNo = (await cells.nth(0).innerText()).trim();
                const rawBillingDate = (await cells.nth(1).innerText()).trim();

                if (installmentNo && !isNaN(installmentNo)) {
                    const recordKey = `${installmentNo}_${rawBillingDate}`;

                    if (!seenRecords.has(recordKey)) {
                        seenRecords.add(recordKey);
                        const formattedDate = this.formatTableDate(rawBillingDate);
                        RpsAllEmiDates.push({
                            installment: Number(installmentNo),
                            date: formattedDate
                        });
                    }
                }
            }
        }

        process.env.rpsallemiDates = JSON.stringify(RpsAllEmiDates);
        // console.log(`RPS all EMi Dates :- \n${JSON.stringify(RpsAllEmiDates, null, 2)}`);

        return RpsAllEmiDates;
    }


}
