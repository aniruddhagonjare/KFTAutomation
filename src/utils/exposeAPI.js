
import axios from "axios";
import fs from "fs/promises";
import http from "http";
import https from "https";
import pLimit from "p-limit";

const axiosInstance = axios.create({
    httpAgent: new http.Agent({ keepAlive: true, maxSockets: 100 }),
    httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 100 }),
    timeout: 10000,
    headers: {
        'Connection': 'keep-alive'
    }
});

const isinCache = new Map();
const CACHE_TTL = 300000; // 5 minutes

async function callData(EligibleISINCount, InEligibleISINCount, partyCode) {
    const response = await axiosInstance.post(`http://10.3.197.220:9090/nbfc/partycode/${partyCode}`, {
        ineligibleIsins: InEligibleISINCount,
        eligibleIsins: EligibleISINCount
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(response.data);
    return response.data;
}

async function updateIsin(isin, partycode, status = "pending", quantity = 0, price = 20.888) {
    try {
        const response = await axiosInstance.post(`http://10.3.197.220:9090/nbfc/isin/${isin}`, {
            partyCode: partycode,
            quantity: quantity,
            price: price,
            isActive: true,
            pldege: status
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`✓ Updating ISIN ${isin} with status: ${status} (Qty: ${quantity}, Price: ${price})`);
        return { isin, success: true, status, price, quantity, data: response.data };
    } catch (error) {
        const errorData = error.response ? JSON.stringify(error.response.data) : '';
        const errorMessage = error.message || 'Unknown error';
        console.error(`✗ Failed to update ISIN ${isin}:`, errorMessage, errorData);
        return { isin, success: false, error: errorMessage, data: error.response?.data };
    }
}

async function updateIsinWithRetry(isin, partycode, status, quantity, price, retries = 3) {
    let lastResult;
    for (let i = 0; i < retries; i++) {
        lastResult = await updateIsin(isin, partycode, status, quantity, price);
        if (lastResult.success) return lastResult;

        const isParseError = lastResult.error && lastResult.error.includes("Parse Error");
        const isTimeout = lastResult.error && lastResult.error.includes("timeout");

        if (i < retries - 1 && (isParseError || isTimeout)) {
            const delay = Math.pow(2, i) * 1000;
            const msg = `Retry ${i + 1}/${retries} for ISIN ${isin} in ${delay}ms due to: ${lastResult.error}`;
            console.log(msg);
            await logToFile(msg);
            await new Promise(resolve => setTimeout(resolve, delay));
        } else {
            break;
        }
    }
    return lastResult;
}

const logToFile = async (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    try {
        await fs.appendFile('process.log', logMessage);
    } catch (err) {
        console.error('Failed to write to log file:', err);
    }
    console.log(message);
};

export async function resetAngelOne(clientId, softReset, apiKey, aoOverride) {
    try {
        // Trigger the request without awaiting it (Fire-and-forget) to ensure response is in milliseconds
        axiosInstance.post(`http://10.3.197.220:9090/angel-one/reset`, null, {
            params: {
                client_id: clientId,
                soft_reset: softReset
            },
            headers: {
                'X-api-key': apiKey,
                ...(aoOverride ? { 'aooverride': aoOverride } : {})
            }
        }).then(response => {
            console.log(`✓ Reset Angel One for client ${clientId}`);
            logToFile(`✓ Reset Angel One for client ${clientId}`);
        }).catch(error => {
            const errorData = error.response ? JSON.stringify(error.response.data) : '';
            console.error(`✗ Failed to reset Angel One for client ${clientId}:`, error.message, errorData);
            logToFile(`✗ Failed to reset Angel One for client ${clientId}: ${error.message} ${errorData}`);
        });

        // Return immediately
        return { success: true, message: "Reset request accepted and processing in background" };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function processIsins(partyCode, model = "success", EligibleISINCount, InEligibleISINCount = 0, statusCode = "success", quantity = 0, price = 20.888, isinsArr = null) {
    const code = partyCode;
    const updateMode = model;
    const totalStart = Date.now();

    // 1. Fetch ISIN Data (if not provided)
    let eligibleIsins = [];
    let callDataDuration = 0;

    if (Array.isArray(isinsArr) && isinsArr.length > 0) {
        eligibleIsins = isinsArr;
        logToFile(`Using provided list of ${eligibleIsins.length} ISINs for ${code}`);
    } else {
        const cached = isinCache.get(code);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            eligibleIsins = cached.isins;
            logToFile(`Reusing cached ISINs for ${code} (Cache age: ${Date.now() - cached.timestamp}ms)`);
        } else {
            const callDataStart = Date.now();
            const data = await callData(EligibleISINCount, InEligibleISINCount, code);
            callDataDuration = Date.now() - callDataStart;

            eligibleIsins = (data.data && data.data[code] && data.data[code].eligibleIsins)
                ? (Array.isArray(data.data[code].eligibleIsins) ? data.data[code].eligibleIsins : Object.keys(data.data[code].eligibleIsins))
                : (data.isins || []);

            isinCache.set(code, { isins: eligibleIsins, timestamp: Date.now() });
            logToFile(`Data fetched in ${callDataDuration}ms and cached`);
        }
    }

    if (eligibleIsins && eligibleIsins.length > 0) {
        logToFile(`Updating ${eligibleIsins.length} ISINs in parallel with concurrency limit 5...`);

        // 2. Limited Concurrency Updates
        const limit = pLimit(5);
        const updateStart = Date.now();
        const updatePromises = eligibleIsins.map((isin, index) => {
            const status = (updateMode === statusCode)
                ? (index % 2 === 0 ? "success" : "failed")
                : updateMode;

            // Generate random values if defaults are used
            const finalQuantity = (quantity === 0) ? Math.floor(Math.random() * 1000) + 1 : quantity;
            const finalPrice = (price === 20.888) ? parseFloat((Math.random() * 5000 + 100).toFixed(3)) : price;

            return limit(() => updateIsinWithRetry(isin, code, status, finalQuantity, finalPrice));
        });

        const results = await Promise.all(updatePromises);
        const updateDuration = Date.now() - updateStart;

        let totalSucceeded = 0;
        let totalFailed = 0;
        results.forEach(res => {
            if (res && res.success !== false) totalSucceeded++;
            else totalFailed++;
        });

        const totalDuration = Date.now() - totalStart;

        logToFile(`\n--- Summary ---
ISINs: ${eligibleIsins.length} | Success: ${totalSucceeded} | Fail: ${totalFailed}
Internal Latency: ${totalDuration}ms (Fetch: ${callDataDuration}ms, Update: ${updateDuration}ms)`);

        // RETURN ONLY THE UPDATED ISINS DATA
        const lastResult = results.length > 0 ? results[results.length - 1] : null;
        if (lastResult && lastResult.data && lastResult.data.data && lastResult.data.data[code]) {
            return lastResult.data.data[code].eligibleIsins || lastResult.data.data[code];
        }

        return {
            status: totalFailed === 0 ? "success" : "partial_success",
            processedCount: eligibleIsins.length,
            message: `Processed ${totalSucceeded} ISINs.`
        };
    }

    return { error: "No ISINs found", partyCode: code };
}
