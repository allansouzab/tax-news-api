const sql = require("mssql");
const config = require('./config');

let pool = null;

module.exports = {
    async closePool() {
        try {
            // try to close the connection pool
            await pool.close();

            // set the pool to null to ensure
            // a new one will be created by getConnection()
            pool = null;
        } catch (err) {
            // error closing the connection (could already be closed)
            // set the pool to null to ensure
            // a new one will be created by getConnection()
            pool = null;
        }
    },
    async getConnection() {
        try {
            if (pool) {
                // has the connection pool already been created?
                // if so, return the existing pool
                return pool;
            }
            // create a new connection pool
            pool = await sql.connect(config);

            // catch any connection errors and close the pool
            pool.on("error", async err => {
                await closePool();
            });
            return pool;
        } catch (err) {
            // error connecting to SQL Server
            pool = null;
        }
    }
}