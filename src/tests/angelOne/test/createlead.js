import { expect } from "chai"
import { kftBaseUrl } from "../../../config/urls.js"
import { createLeadAPI } from "../../../services/apiService.js"
import { generateToken } from "../generateToken.js"
import { describe, it } from "node:test"
import { validateTokenGeneration } from "../validations/tokenValidation.js"
import { createLeadRequestBody } from "../../../payloads/angelOne/payload.js"

describe("Validating the Create Lead API ", async () => {
    let { AuthToken: token } = await generateToken()
    it("Validating the API without Phone Number", async () => {
        let { ...requestBody } = createLeadRequestBody
        requestBody.LeadPhone = ''
        const apiResponse = await createLeadAPI(kftBaseUrl, requestBody, token)
        expect(apiResponse.body.Meta.StatusCode).to.equal('BadRequest')
        expect(apiResponse.body.Meta.Message).to.equal('Lead Phone is mandatory')
        expect(apiResponse.body.Meta.Success).to.equal(false)
    })
    it("Validating the API without Email", async () => {
        let { ...requestBody } = createLeadRequestBody
        requestBody.LeadEmail = ''

        const apiResponse = await createLeadAPI(kftBaseUrl, requestBody, token)
        console.log(apiResponse.body)
        await validateTokenGeneration(apiResponse.body)
    })
    it("Validating the API without PAN", async () => {
        let { ...requestBody } = createLeadRequestBody
        requestBody.LeadPAN = ''
   
        const apiResponse = await createLeadAPI(kftBaseUrl, requestBody, token)
        console.log(apiResponse.body)
        await validateTokenGeneration(apiResponse.body)
    })
    it("Validating the API without  DOB", async () => {
        let { ...requestBody } = createLeadRequestBody
        requestBody.LeadDOB = ''

        const apiResponse = await createLeadAPI(kftBaseUrl, requestBody, token)
        console.log(apiResponse.body)
        await validateTokenGeneration(apiResponse.body)
    })
    it("Validating the API without  Gender", async () => {
        let { ...requestBody } = createLeadRequestBody
        requestBody.LeadGender = ''
        const apiResponse = await createLeadAPI(kftBaseUrl, requestBody, token)
        console.log(apiResponse.body)
        await validateTokenGeneration(apiResponse.body)
    })
    it("Validating the API without Entity Type", async () => {
         let { ...requestBody } = createLeadRequestBody
        requestBody.LeadEntityType = ''
        const apiResponse = await createLeadAPI(kftBaseUrl, requestBody, token)
        console.log(apiResponse.body)
        await validateTokenGeneration(apiResponse.body)

    })
    it("Validating the API with Invalid Scheme", async () => {
         let { ...requestBody } = createLeadRequestBody
        requestBody.Scheme = '852949'
        const apiResponse = await createLeadAPI(kftBaseUrl, requestBody, token)
        console.log(apiResponse.body)
        await validateTokenGeneration(apiResponse.body)

    })
})