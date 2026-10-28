import { kftBaseUrl } from "../../../config/urls.js"
import { createLeadRequestBody } from "../../../payloads/angelOne/payload.js"
import { createLeadAPI, portfolioBreAPI } from "../../../services/apiService.js"
import { generateToken } from "../generateToken.js"
import { describe,it } from "node:test"

describe("portfolio test",async()=>{
    let { AuthToken: token } = await generateToken()
    it("Invalid Scheme code",async()=>{
        let {...requestbody} = createLeadRequestBody
        requestbody.LeadEntityType = ''
        let apiResponse = await createLeadAPI(kftBaseUrl,requestbody,token)
        console.log(apiResponse.body)
        let  leadId = apiResponse.body.Data.LeadId
        let portfolioresponse = await portfolioBreAPI(kftBaseUrl,token,leadId)
        console.log(portfolioresponse.body)
    })
})