import { generateHashes, writeToEnvSync } from "../../utils/crypto.js";
import { generateAuthToken, getToken } from "../../services/apiService.js";
import { angelOneBaseUrl, kftAuthBaseUrl, } from "../../config/urls.js";
import { generateTokenBody } from "../../payloads/authPayload.js";
import { validateTokenGeneration } from "./validations/tokenValidation.js";
import { partnerCustomerId } from "../../payloads/userData.js";

export async function generateToken() {

    const shortToken = await getToken(angelOneBaseUrl)

    const apiResponse = await generateHashes(shortToken.body.data.short_token, partnerCustomerId)

    let rawData = generateTokenBody(partnerCustomerId, apiResponse.shortToken)

    const response = await generateAuthToken(kftAuthBaseUrl, rawData, apiResponse.generateHashSha256, false)

    if (!response || !response.body || !response.body.Data || !response.body.Data.AuthToken) {
        console.error(`Failed to fetch AuthToken. Status: ${response?.status}`);
        console.error("API Response Body:", response?.body);
        console.error("API Response Text:", response?.text);
        throw new Error("AuthToken is missing from the API response.");
    }

    await validateTokenGeneration(response.body.Data)

    await writeToEnvSync({ AuthToken: response.body.Data.AuthToken, AuthCode: response.body.Data.AuthCode })

    return {
        AuthToken: response.body.Data.AuthToken,
        AuthCode: response.body.Data.AuthCode
    }
}