import { kftBaseUrl } from "../../config/urls.js"
import { pledgeStocksBody } from "../../payloads/apiPayload.js"
import { leadId, token } from "../../payloads/userData.js"
import { generateOtpForPledge, getPledgedStocks, postingPledgeStocks, validatePledgeOtp } from "../../services/apiService.js"

export async function pledgeStocksFlow() {
    console.log("Get Pledged Stocks Details API Triggered")
    const getResponse = await getPledgedStocks(kftBaseUrl, token, leadId)
    console.log(getResponse.body)
    const eligibleStocks = getResponse.body.Data.EligibleStocks

    if (!eligibleStocks || eligibleStocks.length === 0) {
        console.log("No eligible stocks found.")
        return
    }

    console.log(`Found ${eligibleStocks.length} eligible stocks. Mapping to payload...`)

    // Use the payload template
    let body = { ...pledgeStocksBody }
    body.LeadId = leadId

    // Map all stocks from the response to the payload
    // For demonstration, we'll mark the first stock as selected for pledge
    body.EligibleStocks = eligibleStocks.map((stock, index) => {
        let mappedStock = {
            "StockName": stock.StockName,
            "Isin": stock.Isin,
            "NumberOfStocks": stock.NumberOfStocks,
            "EligibleUnits": stock.EligibleUnits,
            "StockPrice": stock.StockPrice,
            "LtvPercentage": stock.LtvPercentage,
            "StockValue": stock.StockValue,
            "EligibleValue": stock.EligibleValue,
            "IsPledge": true, // Select the first one for pledge
            "IsShareInUse": stock.IsShareInUse,
            "SelectedStockValue": stock.StockValue,
            "SelectedLoanAmount": stock.EligibleValue,
            "SelectedStockQuantity": stock.EligibleUnits
        }
        console.log(mappedStock)

        // Add HaircutPercent if it exists in the response
        if (stock.HaircutPercent !== undefined) {
            mappedStock.HaircutPercent = stock.HaircutPercent
        }

        return mappedStock
    })

    // Update higher level values based on the selection
    if (body.EligibleStocks.length > 0) {
        body.SelectedCreditLimit = body.EligibleStocks[0].SelectedLoanAmount
        body.PledgeAmount = body.EligibleStocks[0].SelectedLoanAmount
    }

    console.log("Posting dynamic pledge stock body...")
    const postResponse = await postingPledgeStocks(kftBaseUrl, token, leadId, body)
    console.log("POST Response Body:", postResponse.body)

    const apiResponse = await generateOtpForPledge(kftBaseUrl, token, leadId)
    console.log("Generate OTP Response Body:", apiResponse.body)

    const otpAPIresponse = await validatePledgeOtp(kftBaseUrl, token, leadId, apiResponse.body.Data.RequestId, "123456")
    console.log("Validate OTP Response Body:", otpAPIresponse.body)
}
