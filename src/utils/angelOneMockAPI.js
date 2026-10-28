
import axios from "axios";
import fs from "fs";

async function callData(isin, partyCode) {
    const response = await axios.post(`http://10.3.197.220:9090/nbfc/partycode/${partyCode}`, {
        ineligibleIsins: 50,
        eligibleIsins: isin
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(response.data);
    return response.data;
}

async function updateIsin(isin, partycode, status = "pending") {
    try {
        const randomQty = Math.floor(Math.random() * 1000) + 1;
        const randomPrice = parseFloat((Math.random() * 5000 + 100).toFixed(3));
        
        const response = await axios.post(`http://10.3.197.220:9090/nbfc/isin/${isin}`, {
            partyCode: partycode,
            quantity: randomQty,
            price: randomPrice,
            isActive: true,
            pldege: status
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`✓ Updating ISIN ${isin} with status: ${status} (Qty: ${randomQty}, Price: ${randomPrice})`);
        return response.data;
    } catch (error) {
        const errorData = error.response ? JSON.stringify(error.response.data) : '';
        console.error(`✗ Failed to update ISIN ${isin}:`, error.message, errorData);
        logToFile(`✗ Failed to update ISIN ${isin}: ${error.message} ${errorData}`);
        return { isin, success: false, error: error.message, data: error.response?.data };
    }

}

// https://ext.digio.in/#/gateway/exit?exitMessage=UPI%20Mandate%20cancelled&type=cancel&showFailedExit=true

const logToFile = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync('process.log', logMessage);
    console.log(message);
};

async function processIsins() {
    let code = "BONTHU1";
    // updateMode options: 'success', 'fail', 'alternating'
    let updateMode = 'alternating';

    const data = await callData(5, code);
    logToFile(`Data: ${JSON.stringify(data)}`);

    // Select eligible ISINs for the specific party code
    const eligibleIsins = (data.data && data.data[code] && data.data[code].eligibleIsins)
        ? data.data[code].eligibleIsins
        : data.isins;

    logToFile(`ISINs to process: ${JSON.stringify(eligibleIsins)}`);

    if (eligibleIsins && eligibleIsins.length > 0) {
        const batchSize = 10;
        logToFile(`\nUpdating ${eligibleIsins.length} ISINs in batches of ${batchSize}...`);

        let totalSucceeded = 0;
        let totalFailed = 0;

        for (let i = 0; i < eligibleIsins.length; i += batchSize) {
            const batch = eligibleIsins.slice(i, i + batchSize);
            const batchNumber = Math.floor(i / batchSize) + 1;
            const totalBatches = Math.ceil(eligibleIsins.length / batchSize);

            logToFile(`\n[Batch ${batchNumber}/${totalBatches}] Processing ${batch.length} ISINs...`);

            const updatePromises = batch.map((isin, indexInBatch) => {
                const globalIndex = i + indexInBatch;
                let status = "success";

                if (updateMode === 'alternating') {
                    status = globalIndex % 2 === 0 ? "success" : "failed";
                    console.log(`ISIN ${isin} will be updated with status: ${status}`);
                } else {
                    status = updateMode;
                    console.log(`ISIN ${isin} will be updated with status: ${status}`);
                }

                return updateIsin(isin, code, status);
            });

            const results = await Promise.all(updatePromises);

            results.forEach(res => {
                if (res && res.success !== false) {
                    totalSucceeded++;
                } else {
                    totalFailed++;
                }
            });
        }

        logToFile(`\nProcessing completed summary:`);
        logToFile(`Total ISINs: ${eligibleIsins.length}`);
        logToFile(`✓ Succeeded: ${totalSucceeded}`);
        logToFile(`✗ Failed: ${totalFailed}`);

        if (totalFailed === 0) {
            logToFile('\nAll ISINs updated successfully!');
        } else {
            logToFile(`\nUpdates finished with ${totalFailed} failures.`);
        }
    }
}

processIsins();



