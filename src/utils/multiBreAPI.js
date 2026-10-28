import axios from "axios";
import fs from "fs";
import http from "http";
import https from "https";
import xlsx from "xlsx";
import pLimit from "p-limit";

const AUTHTOKEN = "C7yweD3sJgnOs6v3eGYLjCLudAGN1UofvaofdtA8Tx6rwYwoSPm3F2f6VqTzRvPwBhbWk26JtL33H2ysVJR7NLFaS3srEJCVdSFanVSyU0cryUaDBnBfRZ0ZtJOrzDD9";
const CONCURRENCY = 20;
const OUTPUT_FILE = "bre_results.jsonl";

const limit = pLimit(CONCURRENCY);

const axiosInstance = axios.create({
    httpAgent: new http.Agent({ keepAlive: true, maxSockets: CONCURRENCY }),
    httpsAgent: new https.Agent({ keepAlive: true, maxSockets: CONCURRENCY }),
    timeout: 120000
});

const writer = fs.createWriteStream(OUTPUT_FILE, { flags: "a" });

async function apiCall(leadId) {
    const url = `https://mf-embed-aurix-api.knightfintech.com/api/multi_BRE?leadId=${leadId}&lead_stage=4`;

    try {
        const response = await axiosInstance.post(
            url,
            { leadId, leadStage: 4 },
            {
                headers: {
                    AUTHTOKEN,
                    "Content-Type": "application/json",
                    "X-Correlation-ID": `${Date.now()}-${leadId}`
                }
            }
        );

        if (response.data?.Data?.ApplicationStatus) {
            const appStatus = response.data.Data.ApplicationStatus;
            for (const id in appStatus) {
                for (const key of ['True', 'False']) {
                    if (Array.isArray(appStatus[id][key])) {
                        appStatus[id][key].forEach(lender => delete lender.LenderLogo);
                    }
                }
            }
        }

        const result = {
            leadId,
            status: response.status,
            response: response.data
        };

        writer.write(JSON.stringify(result) + "\n");

    } catch (error) {

        const result = {
            leadId,
            status: error.response?.status || 500,
            error: error.message
        };

        writer.write(JSON.stringify(result) + "\n");
    }
}

async function main() {

    console.log("Reading Excel...");

    const workbook = xlsx.readFile("src/payloads/BRE_FAIL.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    let completedLeads = new Set();
    if (fs.existsSync(OUTPUT_FILE)) {
        const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf-8');
        const lines = fileContent.split('\n').filter(Boolean);
        lines.forEach(line => {
            try {
                const parsed = JSON.parse(line);
                if (parsed.leadId) completedLeads.add(parsed.leadId.toString());
            } catch (e) {}
        });
    }

    const leadIds = rows
        .map(r => r.leadid?.toString())
        .filter(id => id && !completedLeads.has(id));

    console.log(`Found ${completedLeads.size} previously completed leads in ${OUTPUT_FILE}.`);
    console.log(`Loaded ${leadIds.length} remaining leads to process.`);

    const start = Date.now();

    await Promise.all(
        leadIds.map(id =>
            limit(() => apiCall(id))
        )
    );

    const end = Date.now();

    console.log(`Completed in ${(end - start) / 1000}s`);
}

main();