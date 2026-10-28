import { getAAudienceSecretCCode } from "../../../tests/utils/embeddedSqlqueries.js";
import { muthootBaseUrl } from "../../config/urls.js"
import { embeddedAuthTokenBody, EmbeddedgenerateUtmBody } from "../../payloads/embedded/payload.js"
import { generateAuthToken, generateUtmCode } from "./apiservice.js"


export async function generateEmbeddedUrl(baseUrl,mobile,partnerCustomerId,utm_code) {
    const audienceSecretCode = await getAAudienceSecretCCode('MF_Auth_UAT_DB');
    embeddedAuthTokenBody.MobileNumber=mobile
    embeddedAuthTokenBody.PartnerCustomerId=partnerCustomerId
    embeddedAuthTokenBody.AudienceSecretCode=audienceSecretCode
    let authTokenGeneration= await generateAuthToken(baseUrl,embeddedAuthTokenBody) 
    console.log("Auth Token Generation Response: ",authTokenGeneration.data)
    let authToken=authTokenGeneration.data.Data.Token

    EmbeddedgenerateUtmBody.MobileNumber=mobile
    EmbeddedgenerateUtmBody.PartnerCustomerId=partnerCustomerId
    EmbeddedgenerateUtmBody.UTMCode=utm_code
    let utmGeneration= await generateUtmCode(baseUrl,EmbeddedgenerateUtmBody)
    let utmCode=utmGeneration.data.Data.UTM

    let url=`${utmCode}&&authToken=${authToken}`

    return url
}