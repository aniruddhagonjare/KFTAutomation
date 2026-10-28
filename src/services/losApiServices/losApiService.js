import { kftLosUrl } from "../../config/urls.js";
import { getTokenApiBody } from "../../payloads/losApi/losApiPayloads.js";
import { createClient } from "../../utils/httpClient.js";


import dotenv from "dotenv";
dotenv.config();

export async function getToken(baseUrl,body) {
    return await createClient(baseUrl)
        .post("/GetToken")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(body)
}

// const data = await getToken (kftLosUrl, getTokenApiBody)
// console.log(data);

export async function createLeadAPI(baseUrl, body,token) {

        return await createClient(baseUrl)
            .post("/CreateLead")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('AUTHTOKEN',token)
            .send(body);
    }
   
export async function setLeadProduct(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SetLeadProduct")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function addLeadAddress(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/AddLeadAddress")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function addBusinessInformation(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/AddBusinessInformation")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function addGSTDetails(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/AddGSTDetails")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function saveUdyamDetails(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveUdyamDetails")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}


export async function addLeadAdditionalDetails(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/AddLeadAdditionalDetails")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}


export async function application_SaveLoanAskDetails(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveLoanAskDetails")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}


export async function application_SaveCustomerOffer(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveCustomerOffer")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function application_SaveCoBorrowerDetails(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveCoBorrowerDetails")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function application_SaveAdditionalLoanDetailsCLM2(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveAdditionalLoanDetailsCLM2")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function application_SubmitLoanApplication(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SubmitLoanApplication")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bank_SaveBankDetails(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveBankDetails")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bank_SaveInsuranceDetails(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/api/SaveInsuranceDetails")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bank_SavePostSanctions(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/api/SavePostSanctions")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function upload_files(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/UploadFiles")
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function upload_bankStatements(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/UploadBankStatements")
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bre_SaveBreBureauDataSplit(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveBreBureauDataSplit")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bre_SaveBreBureauData(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveBreBureauData")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bre_SaveBreProductData(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveBreProductData")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bre_SaveBreBankingData(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveBreBankingData")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bre_SaveBreFinancialsData(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveBreFinancialsData")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bre_SaveBreDemographyGeneralData(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveBreDemographyGeneralData")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bre_SaveBreGSTData(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveBreGSTData")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bre_SaveBreGuarantorData(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveBreGuarantorData")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bre_SaveBreTriangulationData(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveBreTriangulationData")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}

export async function bre_SaveBreAssessmentData(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/SaveBreAssessmentData")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('AUTHTOKEN',token)
        .send(body);
}











