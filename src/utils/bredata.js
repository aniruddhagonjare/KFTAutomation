import { getBreData } from "../services/apiService.js";
import xlsx from "xlsx";
import pLimit from "p-limit";
import fs from "fs";
import http from "http";
import https from "https";

http.globalAgent.maxSockets = 50;
https.globalAgent.maxSockets = 50;

async function main() {
    const AUTHTOKEN = '_fj9SIC5T8R888X6A6s_NH4PGBntRcngwSIh-H2ZkkRtNBupKYmc4Rs29lxwA_EZQQmk0YlJSgwrPDfoG74w5t8Z7-3Pgb-q0zahfF-BcrdKgZde_GHK-qaUzLpr4-hs';
    const baseUrl = 'https://mf-embed-aurix-api.knightfintech.com';

    console.log("Reading Excel file...");
    const workbook = xlsx.readFile('src/payloads/Untitled spreadsheet (4).xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    let allLeadIds = rows.map(r => r.leadId || r.leadid || r["Lead ID"]).filter(Boolean);

    const limit = pLimit(50);
    const results = []; // <-- store everything here

    const start = Date.now();

    await Promise.all(
        allLeadIds.map(leadId =>
            limit(async () => {
                try {
                    console.log(`[Lead ID: ${leadId}] Starting API call...`);
                    let response = await getBreData(baseUrl, AUTHTOKEN, leadId);
                    console.log(`[Lead ID: ${leadId}] Finished with Status: ${response.status}`);

                    let applicationStatus = "";

                    if (response.body?.Data?.ApplicationStatus) {
                        const appStatus = response.body.Data.ApplicationStatus;

                        // Remove logos + stringify clean data
                        for (const id in appStatus) {
                            for (const key of ['True', 'False']) {
                                if (Array.isArray(appStatus[id][key])) {
                                    appStatus[id][key].forEach(lender => delete lender.LenderLogo);
                                }
                            }
                        }

                        applicationStatus = JSON.stringify(appStatus);
                    }

                    results.push({
                        leadId,
                        status: response.status,
                        applicationStatus
                    });

                } catch (error) {
                    console.error(`[Lead ID: ${leadId}] Error: ${error.message}`);

                    results.push({
                        leadId,
                        status: error.response?.status || 500,
                        error: error.message
                    });
                }
            })
        )
    );

    console.log("Writing Excel file...");

    const newSheet = xlsx.utils.json_to_sheet(results);
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, newSheet, "BRE_RESULTS");

    xlsx.writeFile(newWorkbook, "bre_results.xlsx");

    console.log(`Finished in ${(Date.now() - start) / 1000} seconds.`);
}

main().catch(console.error);