const { Pool } = require("pg");

const pool = new Pool({
    connectionString:
        process.env.NODE_ENV === "development"
            ? process.env.DB_DEVELOPMENT_CONNECTION_STRING
            : process.env.DATABASE_PUBLIC_URL,
});

module.exports = pool;
