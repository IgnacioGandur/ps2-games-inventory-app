const { Pool } = require("pg");

const pool = new Pool({
    connectionString:
        process.env.NODE_ENV === "development"
            ? process.env.DB_DEVELOPMENT_CONNECTION_STRING
            : process.env.DB_PRODUCTION_CONNECTION_STRING,
});

module.exports = pool;
