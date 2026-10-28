import crypto from "crypto";
import fs from "fs";
import path from "path";

export function writeToEnvSync(keyValuePairs) {
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';

    // Read existing content if file exists
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    const envLines = envContent.split(/\r?\n/);

    // Update or add new variables
    for (const [key, value] of Object.entries(keyValuePairs)) {
        let keyExists = false;
        for (let i = 0; i < envLines.length; i++) {
            if (envLines[i].startsWith(`${key}=`)) {
                envLines[i] = `${key}=${value}`;
                keyExists = true;
                break;
            }
        }
        if (!keyExists) {
            envLines.push(`${key}=${value}`);
        }
    }

    // Write back to file synchronously
    fs.writeFileSync(envPath, envLines.filter(line => line.trim() !== '').join('\n') + '\n', 'utf8');
    console.log(`Successfully synced variables to .env file`);
}

export async function generateHashes(shortToken, partnerCustomerId) {
    console.log("PartnerCustomerID:", partnerCustomerId);

    // Static backend values
    const partnerId = "63f91932-a5a4-418c-896e-fc5d3f3b8b50";
    const secureSaltKey = "dGhpc2lzYXNlY3VyZXNhbHRrZXlmb3JhZnBsYXBp";

    // ⚠️ EXACT backend string format (CRLF + spaces are critical)
    const generateHash =
        secureSaltKey + "{\r\n" +
        "  \"PartnerCustomerID\":\"" + partnerCustomerId + "\",\r\n" +
        "  \"ShortToken\":\"" + shortToken + "\"\r\n" +
        "}";

    // Pipe-separated hash (unchanged)
    const shortTokenHash = partnerId + "|" + shortToken;

    // SHA-256 function (Node.js compatible)
    function sha256(input) {
        return crypto.createHash('sha256').update(input).digest('hex');
    }

    // Generate SHA-256 hashes
    const generateHashSha256 = sha256(generateHash);
    const shortTokenHashSha256 = sha256(shortTokenHash);

    // Write to .env synchronously
    writeToEnvSync({
        'short_token': shortToken,
        'generateHashSha256': generateHashSha256,
        'shortTokenHashSha256': shortTokenHashSha256
    });

    return {
        shortToken,
        generateHashSha256,
        shortTokenHashSha256
    };
}
