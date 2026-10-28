import { runOnDatabase } from "../index.js"
import { partnerCustomerId } from "../payloads/userData.js"

export async function validateCreateLeadData(mobile) {
    let query = `SELECT * FROM Leads where LeadPhone='${mobile}' order by LastAction desc`
    let dbName = 'AngelOne_LOS_QA_DB'
    const data = await runOnDatabase(dbName, query)
    return data ? data[0] : null
}

export async function validateProperAuthCreation() {
    let query = `select * from ServerAuthSessionDetails where userId=${partnerCustomerId} order by 1 desc`
    let dbName = 'AngelOne_Auth_QA_DB'
    const data = await runOnDatabase(dbName, query)
    return data ? data[0] : null
}

export async function getNachDetails() {
    let query = `select top 10 * from DigioWebhookEvents order by 1 desc`
    let dbName = 'Angel_MW_API_QA_DB'
    const data = await runOnDatabase(dbName, query)
    return data
}

export async function updateNachDetails() {
    let query = `update DigioWebhookEvents set CurrentStatus='upi.mnd.autodebit.success' where EntityId='ENA260414183225195ADJKG9BUJLJSPUP'`
    let dbName = 'Angel_MW_API_QA_DB'
    const data = await runOnDatabase(dbName, query)
    return data
}

export async function getRazorpayOrderMasterDetails(){
    let query = `select top 10 * from RazorpayOrderMaster order by CreatedOn desc`
    let dbName = 'Angel_MW_API_QA_DB'
    const data = await runOnDatabase(dbName, query)
    return data
}

export async function getRazorpayPayoutWebhookEventsDetails(){
    let query = `select top 10 * from RazorpayPayoutWebhookEvents order by 1 desc`
    let dbName = 'Angel_MW_API_QA_DB'
    const data = await runOnDatabase(dbName, query)
    return data
}

export async function RazorpayWebhookEvents(){
    let query = `select top 10 * from RazorpayWebhookEvents order by 1 desc`
    let dbName = 'Angel_MW_API_QA_DB'
    const data = await runOnDatabase(dbName, query)
    return data
}

export async function getFrontEndLogs() {
    let query = `select * from FrontendLogs order by 1 desc`;
    let dbName = 'AngelOne_LOS_QA_DB'
    let data = await runOnDatabase(dbName, query)
    return data
}

export async function getLeadShareDetails(leadId) {
    let query = `select top 10 * from LeadShareDetails where Leadid=${leadId} order by CreatedOn desc;`;
    let dbName = 'AngelOne_LOS_QA_DB'
    let data = await runOnDatabase(dbName, query)
    return data
}

export async function getFullRazorpayDetails(){
    let query = `select top 10 * from RazorpayOrderMaster rm join RazorpayWebhookEvents rw on rm.PaymentId=rw.PaymentId where leadId='38101348' order by rm.CreatedOn desc`
    let dbName = 'Angel_MW_API_QA_DB'
    const data = await runOnDatabase(dbName, query)
    return data
}

export async function getAPIDetails(mobile) {
    let query = `SELECT top 10* FROM LOSApiTracker order by 1 desc`
    let dbName = 'AngelOne_LOS_QA_DB'
    const data = await runOnDatabase(dbName, query)
    return data ? data[0] : null
}