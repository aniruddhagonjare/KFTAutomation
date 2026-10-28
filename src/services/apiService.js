import { partnerCustomerId } from "../payloads/userData.js";
import { createClient } from "../utils/httpClient.js";
import dotenv from "dotenv";
dotenv.config();

export async function getToken(baseUrl) {
    return await createClient(baseUrl)
        .get("/auth/v2/generate-s2s-token")
        .set('Content-Type', 'application/json')
        .set('X-Deviceid', 'test-device-123')
        .set('X-Requestid', 'req-123-456')
        .set('X-Clientpublicip', '0.0.0.0')
        .set('X-Operatingsystem', 'Linux')
        .set('Appversion', '1.0.0')
        .set('Applicationname', 'KFT_TEST')
        .set('User-Agent', 'KFT-Test/1.0')
        .set('Authorization', 'Bearer ' + process.env.token)
        .query({ apiKey: process.env.ANGEL_ONE_SECREET });
}

export async function generateAuthToken(baseUrl, body, signatureHash, muthoot) {
    console.log(baseUrl)
    if (!muthoot) {
        return await createClient(baseUrl)
            .post("/api/auth/generate_token")
            .set('X-AOL-Signature', signatureHash || process.env.generateHashSha256)
            .set('AudienceSecretCode', process.env.AudienceSecretCode)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(body);
    }
    else if (muthoot) {
        return await createClient(baseUrl)
            .post("/api/generate_token")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('AudienceSecretCode', process.env.AudienceSecretCode)
            .send(body);
    }
}
export async function createLeadAPI(baseUrl, body, token) {
    return await createClient(baseUrl)
        .post("/api/create_lead")
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
        .send(body);
}

export async function generateUTM(baseUrl, body) {
    return await createClient(baseUrl)
        .post("/api/generate_utm")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(body);
}

export async function leadStage(baseUrl, token, leadId) {
    return await createClient(baseUrl)
        .get("/api/lead_stage")
        .query({ leadId: leadId })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function portfolioBreAPI(baseUrl, token, leadId) {
    return await createClient(baseUrl)
        .post("/api/portfolio_bre_offer")
        .query({ leadId: leadId })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}
export async function customerOffer(baseUrl, token, body) {
    return await createClient(baseUrl)
        .post("/api/customer_offer")
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
        .send(body);
}

export async function getKYCLeadData(baseUrl, token, leadId) {
    return await createClient(baseUrl)
        .get("/api/kyc")
        .query({ leadId: leadId })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function redirectionToKYC(baseUrl, token, leadId) {
    return await createClient(baseUrl)
        .get("/api/kyc")
        .query({ leadId: leadId, platform: "android", build: "", theme: "light", slot: "qa1" })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function getKYCStatusAPI(baseUrl, token, leadId, KID) {
    return await createClient(baseUrl)
        .get("/api/kyc_current_status")
        .query({ leadId: leadId, KId: KID })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function saveDocument(baseUrl, token, body) {
    return await createClient(baseUrl)
        .post("/api/save_kyc_docuement")
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
        .send(body);
}

export async function amlRequest(baseUrl, token, leadId) {
    return await createClient(baseUrl)
        .get("/api/aml_request")
        .query({ leadId: leadId })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function getPledgedStocks(baseUrl, token, leadId) {
    return await createClient(baseUrl)
        .get("/api/pledge")
        .query({ leadId: leadId })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function postingPledgeStocks(baseUrl, token, leadId, body) {
    return await createClient(baseUrl)
        .post("/api/pledge")
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
        .send(body);
}

export async function generateOtpForPledge(baseUrl, token, leadId) {
    return await createClient(baseUrl)
        .post("/api/generate_pledge_otp")
        .query({ leadId: leadId })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function getBreData(baseUrl, token, leadId) {
    return await createClient(baseUrl)
        .post("/api/multi_BRE")
        .query({ leadId: leadId })
        .query({ lead_stage: 4 })
        .set('AUTHTOKEN', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
}

export async function validatePledgeOtp(baseUrl, token, leadId, requestId, otp) {
    return await createClient(baseUrl)
        .post("/api/validate_pledge_otp")
        .query({ leadId: leadId, requestId: requestId, otp: otp })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function getPledgeStatus(baseUrl, token, leadId, requestId) {
    return await createClient(baseUrl)
        .get("/api/pledge_status")
        .query({ leadId: leadId, requestId: requestId })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function addBankDetails(baseUrl, token, leadId) {
    return await createClient(baseUrl)
        .get("/api/bank_details")
        .query({ leadId: leadId })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function postBankingDetails(baseUrl, token, leadId, body) {
    return await createClient(baseUrl)
        .post("/api/bank_details")
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
        .send(body);
}

export async function bankDetailsFrontEnd(baseUrl, token, leadId, body) {
    return await createClient(baseUrl)
        .post("/api/bank_details_frontend")
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
        .send(body);
}

export async function getMandateData(baseUrl, token, applicationId) {
    return await createClient(baseUrl)
        .get("/api/mandate_data")
        .query({ applicationId: `${applicationId} + 1` })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function initiateMandateDetails(baseUrl, token, applicationId) {
    return await createClient(baseUrl)
        .post("/api/initiate_mandate")
        .query({ leadId: `${applicationId} + 1`, platform: "", build: "", theme: "light", slot: "qa1" })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function getMandateStatusAPI(baseUrl, token, applicationId) {
    return await createClient(baseUrl)
        .get("/api/mandate_status")
        .query({ applicationId: `${applicationId} + 1` })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function sanctionAPIDetails(baseUrl, token, applicationId) {
    return await createClient(baseUrl)
        .get("/lpsapi/SanctionApplication")
        .query({ applicationId: `${applicationId} + 1` })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function getLoanSummary(baseUrl, token, applicationId) {
    return await createClient(baseUrl)
        .get("/api/loan_summary")
        .query({ applicationId: `${applicationId} + 1` })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function getKFSDetails(baseUrl, token, applicationId) {
    return await createClient(baseUrl)
        .get("/api/kfs_sanction")
        .query({ applicationId: `${applicationId} + 1` })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function getLoanAgreementDetails(baseUrl, token, applicationId) {
    return await createClient(baseUrl)
        .get("/api/loan_agreement")
        .query({ applicationId: `${applicationId} + 1` })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function agreementConsentApplication(baseUrl, token, applicationId) {
    return await createClient(baseUrl)
        .get("/api/agreement_consent")
        .query({ applicationId: `${applicationId} + 1`, isConsentProvided: true })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function withdraApplication(baseUrl, token, leadId) {
    return await createClient(baseUrl)
        .post("/api/withdrawal_otpgen")
        .query({ leadId: leadId, isResend: false })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function validateWithdrawlOtp(baseUrl, token, leadId, body) {
    return await createClient(baseUrl)
        .post("/api/withdrawal_otpva")
        .query({ leadId: leadId, otp: 312700 })
        .set('X-Aurix-Token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Aurix-PartnerCustomerId', partnerCustomerId)
}

export async function utmGeneration(baseUrl, body) {
    return await createClient(baseUrl)
        .post("/api/utm_generation")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('K-Aurix-Version', 'v1')
        .send(body)
}