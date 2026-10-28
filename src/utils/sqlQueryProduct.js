import { runOnDatabase } from "../index"

export async function ProductsMaster() {
    let query = `SELECT TOP 5 * FROM ProductsMaster ORDER BY Productid DESC;`
    let dbName = 'SO-Demo-LMS-QA'
    const data = await runOnDatabase(dbName, query)
    return data ? data[0] : null
}

export async function TestingQuery() {
    let query = `SELECT TOP 1 * FROM ProductsMaster ORDER BY Productid DESC;`;
    let dbName = 'SO-Demo-LMS-QA'
    let data = await runOnDatabase(dbName, query)
    return data
}