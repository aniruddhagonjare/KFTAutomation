import { kftBaseUrl } from "../../config/urls.js";
import { createLeadAPI, getPledgedStocks } from "../../services/apiService.js";
import { generateToken } from "./generateToken.js";
import { callGetLeadAPI } from "./getLeadStage.js";
import dotenv from "dotenv";
import { callPortfolioBreAPI } from "./PortfolioBreAPI.js";
import { writeToEnvSync } from "../../utils/crypto.js";
import { callCustomerOfferAPI } from "./customerOffer.js";
import { createKYCRecord } from "./createKYCRecord.js";
import { pledgeStocksFlow } from "./pledgeScenarios.js";
import { leadId } from "../../payloads/userData.js";
import { createLeadRequestBody } from "../../payloads/angelOne/payload.js";
dotenv.config();

createLeadRequestBody

export async function createLead() {

    const { AuthToken: token } = await generateToken()

    const apiResponse = await createLeadAPI(kftBaseUrl, createLeadRequestBody, token)

    writeToEnvSync({ leadId: apiResponse.body.Data.LeadId })

    await new Promise((resolve) => setTimeout(resolve, 10000))

    await callGetLeadAPI(token, leadId)
    
    await new Promise((resolve) => setTimeout(resolve, 10000))

    const breResponse = await callPortfolioBreAPI(leadId)
    console.log(breResponse)
    new Promise((resolve) => setTimeout(resolve, 10000))
    if (breResponse.Data.MaxEligibleCreditLimit >= 25000) {
        
        const loanAmount = Number(breResponse.Data.MaxEligibleCreditLimit)
        
        await callCustomerOfferAPI(loanAmount)
        
        await new Promise((resolve) => setTimeout(resolve, 10000))
       
        await createKYCRecord()
       
        await new Promise((resolve) => setTimeout(resolve, 10000))
        
        await pledgeStocksFlow()
       
        await new Promise((resolve) => setTimeout(resolve, 10000))

    }
}