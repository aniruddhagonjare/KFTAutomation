import { kftLosUrl } from "../../config/urls.js";
import { createLeadAPI, getToken } from "../../services/losApiServices/losApiService.js";
import { createLeadpiBody, getTokenApiBody } from "../../payloads/losApi/losApiPayloads.js";
import { setToken, getToken as getStoredToken } from "../../payloads/tokenStoreLosService.js";
import { partnerCustomerId, token } from "../../payloads/userData.js";
import { createClient } from "../../utils/httpClient.js";
import { expect } from "chai";


describe("Generate Auth token", () => {
    it("Positive check for API run", async () => {
        let requestBody = { ...getTokenApiBody };

        const apiResponse = await getToken(kftLosUrl, requestBody);
        const AuthToken = apiResponse.body.Token;
        console.log("API Token:", AuthToken);

        setToken(AuthToken); // store globally for reuse
         expect(AuthToken).to.exist;

        // expect(apiResponse.body.Meta.StatusCode).to.equal('BadRequest');
        // expect(apiResponse.body.Meta.Message).to.equal('error');
        // expect(apiResponse.body.Meta.Success).to.equal(false);
    });
});

describe("Create lead", () => {
    it("Positive check for Create lead", async () => {
        let requestBody = { ...createLeadpiBody };

        const apiResponse = await createLeadAPI(kftLosUrl, requestBody, getStoredToken);
        const ceatedLead = console.log("Lead creation data : ", apiResponse.body);
    });
});



