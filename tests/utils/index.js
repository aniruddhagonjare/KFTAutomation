import sql from 'mssql';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config();

// ✅ Connect to any database dynamically
async function connectToDatabase(dbName) {
    const connectionTimeout = Number(process.env.DB_CONNECTION_TIMEOUT || 60000);
    const requestTimeout = Number(process.env.DB_REQUEST_TIMEOUT || 600000);

    const config = {
        server: process.env.DB_SERVER,
        database: dbName,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: 1433,
        options: {
            encrypt: true,
            trustServerCertificate: false,
            enableArithAbort: true
        },
        connectionTimeout,
        requestTimeout,
        pool: {
            max: 5,
            min: 0,
            idleTimeoutMillis: 30000
        }
    };

    try {
        const pool = await new sql.ConnectionPool(config).connect();
        return pool;
    } catch (error) {
        console.error(`Failed to connect to database ${dbName}:`, error.message);
        throw error;
    }
}

// Usage
export async function runOnDatabase(dbName, query) {
    const pool = await connectToDatabase(dbName);

    try {
        const result = await pool.request().query(query);
        return result.recordset ? result.recordset : [];
    } finally {
        try {
            await pool.close();
        } catch (closeError) {
            console.warn(`Warning: failed to close database pool for ${dbName}:`, closeError.message);
        }
    }
}


async function getAllDatabaseNames() {
    // Step 1: get DB names by connecting to master

    const masterPool = await connectToDatabase('master');
    
    const dbResult = await masterPool.request().query(`
        SELECT name FROM sys.databases
        WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb')
        AND state_desc = 'ONLINE'
    `);
    
    await masterPool.close();

    const databases = dbResult.recordset.map(row => row.name);

    const dbWithTables = [];

    // Step 2: connect to EACH database directly with same credentials
    
    for (const dbName of databases) {
        try {
            const dbPool = await connectToDatabase(dbName);     // ← direct connection to that DB
            const tableResult = await dbPool.request().query(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_TYPE = 'BASE TABLE'
                AND TABLE_NAME NOT LIKE 'sysdac%'
                AND TABLE_NAME NOT LIKE '__Migration%'
                ORDER BY TABLE_NAME
            `);
            
            await dbPool.close();

            console.log(`${dbName} -> ${tableResult.recordset.length} tables found`);

            dbWithTables.push({
                database: dbName,
                tables: tableResult.recordset.map(row => row.TABLE_NAME)
            });

        } catch (err) {
            console.error(`Failed on ${dbName}:`, err.message);
            dbWithTables.push({ database: dbName, tables: [] });
        }
    }

    writeFileSync('databases.json', JSON.stringify(dbWithTables, null, 2));
    return dbWithTables;
}
