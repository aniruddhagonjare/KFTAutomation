import { runOnDatabase } from "../utils/index.js";



 export async function getAAudienceSecretCCode(dbName) {
    let query = `SELECT AudienceSecretCode FROM JwtAudienceMaster WHERE AudienceName ='Aurix-LSP'`;
    const data = await runOnDatabase(dbName, query)
    return data[0].AudienceSecretCode;

 }


