import { kftBaseUrl } from "../../config/urls.js";
import { leadId, token } from "../../payloads/userData.js";
import { amlRequest, getKYCLeadData, getKYCStatusAPI, getPledgedStocks, redirectionToKYC, saveDocument } from "../../services/apiService.js";


export async function createKYCRecord() {
    console.log("Create KYC Record API Triggered")
    const response = await getKYCLeadData(kftBaseUrl, token, leadId)
    console.log(response.body)
}

export async function redirectionGetKYCUrl() {
    console.log("Redirection Get KYC URL API Triggered")
    const response = await redirectionToKYC(kftBaseUrl, token, leadId)
    console.log(response.body)
}

export async function getCurrentKYCStatus() {
    console.log("Get Current KYC Status API Triggered")
    const response = await getKYCStatusAPI(kftBaseUrl, token, leadId)
    console.log(response.body)
}
export async function saveKycDocument() {
    console.log("Save KYC Document API Triggered")
    const response = await saveDocument(kftBaseUrl, token, leadId, "KID260302154038537DW438UBPJNLCS8")
    console.log(response.body)

}

export async function getAMLRequest() {
    console.log("Get AML Request API Triggered")
    const response = await amlRequest(kftBaseUrl, token, leadId)
    console.log(response.body)
}
