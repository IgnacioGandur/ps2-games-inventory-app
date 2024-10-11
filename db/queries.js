const db = require("./pool");

async function getAllGames() {
    const { rows } = await db.query(`
        SELECT games.title, games.id, covers.url AS cover FROM games 
        INNER JOIN covers ON games.id = covers.game_id ORDER BY games.title;
    `);
    return rows;
}

async function getAllGenres() {
    const { rows } = await db.query("SELECT * FROM genres ORDER BY name;");
    return rows;
}

async function getAllPublishers() {
    const { rows } = await db.query("SELECT * FROM publishers ORDER BY name;");
    return rows;
}

async function insertGame(title, description, release_date, publisherId) {
    try {
        const result = await db.query(
            `
        INSERT INTO games (title, description, release_date, publisher_id) 
        VALUES ($1, $2, $3, $4) returning id ;
    `,
            [title, description, release_date, publisherId],
        );

        // Get id of last inserted record.
        const idOfInsertedGame = result.rows[0].id;

        return idOfInsertedGame;
    } catch (errors) {
        console.error(errors);
    }
}

async function insertIntoGames_genres(gameId, genres) {
    await db.query(
        `
        INSERT INTO games_genres (game_id, genre_id) 
        SELECT $1, UNNEST($2::int[]);
    `,
        [gameId, genres],
    );
}

async function insertIntoCovers(gameId, coverUrl) {
    await db.query(
        `
        INSERT INTO covers (game_id, url) 
        VALUES ($1, $2);
    `,
        [gameId, coverUrl],
    );
}

async function getGameGenres(gameId) {
    const { rows } = await db.query(
        `
        SELECT genres.name AS genre FROM genres 
        INNER JOIN games_genres ON genres.id = games_genres.genre_id
        INNER JOIN games ON games_genres.game_id = games.id 
        WHERE games.id = $1;
    `,
        [gameId],
    );

    return rows;
}

async function getGameById(gameId) {
    const { rows } = await db.query(
        `
        SELECT * FROM games WHERE id = $1;
    `,
        [gameId],
    );

    return rows;
}

async function getGameCover(gameId) {
    const { rows } = await db.query(
        `
        SELECT covers.url AS cover FROM covers 
        INNER JOIN games on covers.game_id = games.id 
        WHERE games.id = $1;
    `,
        [gameId],
    );

    console.log("getGAmeCovers function result: ", rows);

    return rows;
}

async function getGamePublisher(gameId) {
    const { rows } = await db.query(
        `
        SELECT publishers.name AS publisher FROM publishers
        INNER JOIN games on publishers.id = games.publisher_id
        WHERE games.id = $1;
    `,
        [gameId],
    );

    return rows;
}

async function deleteGenre(genreId) {
    await db.query(
        `
        DELETE FROM genres WHERE genres.id = $1;
    `,
        [genreId],
    );
}

async function deleteGame(gameId) {
    await db.query(
        `
        DELETE FROM games WHERE games.id = $1;
    `,
        [gameId],
    );
}

async function deletePublisher(publisherId) {
    await db.query(
        `
        DELETE FROM publishers WHERE publishers.id = $1;
    `,
        [publisherId],
    );
}

module.exports = {
    getAllGames,
    getAllGenres,
    getAllPublishers,
    insertGame,
    insertIntoGames_genres,
    insertIntoCovers,
    getGameById,
    getGameGenres,
    getGameCover,
    getGamePublisher,
    deleteGenre,
    deleteGame,
    deletePublisher,
};
