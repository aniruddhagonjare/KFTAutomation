import { kftBaseUrl } from "../../config/urls.js";
import { customerOfferBody } from "../../payloads/apiPayload.js";
import { leadId, token } from "../../payloads/userData.js";
import { customerOffer } from "../../services/apiService.js";

export async function callCustomerOfferAPI(loanAmount) {
    console.log("Customer Offer API Triggered")
    const body = customerOfferBody
    body.LeadId = leadId
    body.SelectedCreditLimit = loanAmount
    const response = await customerOffer(kftBaseUrl, token, body)
    console.log(response.body)
}