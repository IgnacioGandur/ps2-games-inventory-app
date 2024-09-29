const { argv } = require("node:process");
const pg = require("pg");
const { Client } = pg;

const SQL = `

    CREATE TABLE IF NOT EXISTS publishers (
        id INTEGER GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) UNIQUE,
        PRIMARY KEY (id)
    );
    
    CREATE TABLE IF NOT EXISTS genres (
        id INTEGER GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) UNIQUE,
        PRIMARY KEY (id)
    );

    CREATE TABLE IF NOT EXISTS games_covers (
        id GENERATED ALWAYS AS IDENTITY,
        game_id INTEGER,
        genre_id INTEGER,
        game_id INTEGER,
        genre_id INTEGER,

    CREATE TABLE IF NOT EXISTS games (
        id INTEGER GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(255) UNIQUE NOT NULL,
        description TEXT UNIQUE NOT NULL,
        release_date DATE NOT NULL,
        publisher_id INTEGER,
        PRIMARY KEY (id),
        CONSTRAINT fk_publisher_id FOREIGN KEY (publisher_id) REFERENCES publishers(id) ON DELETE SET NULL,
        );
`;

async function main() {
    console.log("Seeding...");
    const client = new Client({
        connectionString: argv[2],
    });

    await client.connect();
    await client.query(SQL);
    await client.end();

    console.log("Done!");
}

main();
