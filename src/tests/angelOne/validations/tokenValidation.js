import { expect } from "chai"
import { validateProperAuthCreation } from "../../../utils/sqlQuery.js"
import { partnerCustomerId } from "../../../payloads/userData.js"


export async function validateTokenGeneration(response) {
    const data = await validateProperAuthCreation()

    expect(data.UserId).to.equal(partnerCustomerId)
    // expect(data.PartnerShortToken).to.equal(response.shortToken)
    // expect(data.GenerateHashSha256).to.equal(response.generateHashSha256)
    // expect(data.ShortTokenHashSha256).to.equal(response.shortTokenHashSha256)
    // expect(data.AudienceSecretCode).to.equal(response.AudienceSecretCode)
    // expect(data.MuthootSecreetKey).to.equal(response.MuthootSecreetKey)
    // expect(data.AuthToken).to.equal(response.AuthToken)
    // expect(data.AuthCode).to.equal(response.AuthCode)
    // expect(data.PartnerCustomerId).to.equal(response.partnerCustomerId)
    // expect(data.LeadId).to.equal(response.leadId)

}