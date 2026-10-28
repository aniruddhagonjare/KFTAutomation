import { expect } from "chai";
import { digiMoneyBaseUrl } from "../../config/urls.js";
import { digitmoneyUTMBody } from "../../payloads/digitmoney/digitmoneyapiPayload.js";
import { utmGeneration } from "../../services/apiService.js";
import { describe, it } from "node:test"


describe("Valdiating the UTM Generation UPI with Multiple Combinations", async () => {
    it("Validating the API without Partner Name", async () => {
        let { ...apiBody } = digitmoneyUTMBody
        apiBody.UTMSource = ""
        const apiResponse = await utmGeneration(digiMoneyBaseUrl, apiBody)

        expect(apiResponse.body.Meta.Success).to.be.false;
        expect(apiResponse.body.Meta.Message).to.be.eql("Missing UTM parameters.");
        expect(apiResponse.body.Meta.StatusCode).to.be.eql("400");
        expect(apiResponse.body.Data).to.be.null;
    })

    it("Validating the API without UTM medium", async () => {
        let { ...apiBody } = digitmoneyUTMBody
        apiBody.UTMMedium = ""
        const apiResponse = await utmGeneration(digiMoneyBaseUrl, apiBody)

        expect(apiResponse.body.Meta.Success).to.be.false;
        expect(apiResponse.body.Meta.Message).to.be.eql("Missing UTM parameters.");
        expect(apiResponse.body.Meta.StatusCode).to.be.eql("400");
        expect(apiResponse.body.Data).to.be.null;
    })

    it("Validating the API without UTM campaign", async () => {
        let { ...apiBody } = digitmoneyUTMBody
        apiBody.UTMCampaign = ""
        const apiResponse = await utmGeneration(digiMoneyBaseUrl, apiBody)

        expect(apiResponse.body.Meta.Success).to.be.true;
        expect(apiResponse.body.Meta.Message).to.be.eql("UTM link generated successfully.");
        expect(apiResponse.body.Meta.StatusCode).to.be.eql("200");
        expect(apiResponse.body.Data).to.not.be.null;
    })
})