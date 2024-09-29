const { argv } = require("node:process");
const pg = require("pg");
const { Client } = pg;

const SQL = `

    CREATE TABLE IF NOT EXISTS publishers (
    id INTEGER GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    PRIMARY KEY(id),
    CONSTRAINT unique_publisher_name UNIQUE (name));

    CREATE TABLE IF NOT EXISTS genres (
    id INTEGER GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT unique_genre_name UNIQUE(name));

    CREATE TABLE IF NOT EXISTS games (
    id INTEGER GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    release_date DATE NOT NULL,
    publisher_id INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT unique_game_title UNIQUE(title),
    CONSTRAINT fk_publisher_id FOREIGN KEY (publisher_id) REFERENCES publishers(id) ON DELETE SET NULL);

    CREATE TABLE IF NOT EXISTS covers (
    id INTEGER GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER,
    url TEXT NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT unique_cover_url UNIQUE (url),
    CONSTRAINT unique_game_id UNIQUE (game_id),
    CONSTRAINT fk_game_id FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE );


    CREATE TABLE IF NOT EXISTS games_genres (
    id INTEGER GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER,
    genre_id INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT fk_game_id FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT fk_genre_id FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL);

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
