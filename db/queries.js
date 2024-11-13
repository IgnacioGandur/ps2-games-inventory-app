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
        SELECT games_genres.id AS gg_id, genres.id, genres.name AS genre FROM genres 
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

async function checkIfGameExists(title) {
    const { rows } = await db.query(
        `
        SELECT * FROM games WHERE title = $1;
    `,
        [title],
    );

    // Check if the return value is empty.
    if (rows.length != 0) {
        return true;
    } else {
        return false;
    }
}

async function checkIfCoverAlreadyExists(coverUrl) {
    const { rows } = await db.query(
        `
        SELECT * FROM covers WHERE url = $1;
    `,
        [coverUrl],
    );

    if (rows.length != 0) {
        return true;
    } else {
        return false;
    }
}

async function checkIfDescriptionAlreadyExists(description) {
    const { rows } = await db.query(
        `
        SELECT * FROM games WHERE description = $1;
    `,
        [description],
    );

    if (rows.length != 0) {
        return true;
    } else {
        return false;
    }
}

async function getGamesByGenres(genres) {
    const { rows } = await db.query(
        `
        SELECT * FROM (
            SELECT DISTINCT games.id, games.title, covers.url AS cover 
            FROM games
            INNER JOIN covers ON games.id = covers.game_id
            INNER JOIN games_genres ON games.id = games_genres.game_id
            INNER JOIN genres ON games_genres.genre_id = genres.id
            WHERE genres.id = ANY($1::int[])
        ) AS distinct_games
        ORDER BY title;
    `,
        [genres],
    );

    return rows;
}

async function getGenreNames(genreIds) {
    const { rows } = await db.query(
        `
       SELECT genres.name FROM genres WHERE genres.id = ANY($1::int[]); 
    `,
        [genreIds],
    );

    return rows;
}

async function getGamesByPublishers(publishersIds) {
    const publishersInt = [];

    for (let i = 0; i < publishersIds.length; i++) {
        publishersInt.push(Number(publishersIds[i]));
    }

    const { rows } = await db.query(
        `
        SELECT games.id, games.title, covers.url AS cover FROM games
        INNER JOIN covers ON games.id = covers.game_id
        INNER JOIN publishers ON games.publisher_id = publishers.id
        WHERE publishers.id = ANY ($1::int[]) ORDER BY games.title;
    `,
        [publishersInt],
    );

    return rows;
}

async function getPublishersNames(publishersIds) {
    const { rows } = await db.query(
        `
        SELECT publishers.name FROM publishers WHERE publishers.id = ANY ($1::int[]);
    `,
        [publishersIds],
    );
    return rows;
}

async function checkIfGenreExists(genreName) {
    const { rows } = await db.query(
        `
        SELECT * FROM genres WHERE name = $1;
    `,
        [genreName],
    );

    if (rows.length != 0) {
        return true;
    } else {
        return false;
    }
}

async function addGenre(genreName) {
    await db.query(
        `
        INSERT INTO genres (name) VALUES ($1);
    `,
        [genreName],
    );
}

async function checkIfPublisherExists(publisherName) {
    const { rows } = await db.query(
        `
        SELECT * FROM publishers WHERE publishers.name = $1;
    `,
        [publisherName],
    );

    if (rows.length != 0) {
        return true;
    } else {
        return false;
    }
}

async function addPublisher(publisherName) {
    await db.query(
        `
        INSERT INTO publishers (name) VALUES ($1);
    `,
        [publisherName],
    );
}

async function checkIfGameExistsById(gameId) {
    const { rows } = await db.query(
        `
        SELECT * FROM games WHERE games.id = $1;
    `,
        [gameId],
    );

    if (rows.length === 0) {
        // The game doesn't exists.
        return false;
    } else {
        return true;
    }
}

async function searchGameByTitle(gameTitle) {
    const searchTerm = `%${gameTitle}%`;
    const { rows } = await db.query(
        `
        SELECT games.id, games.title, covers.url AS cover FROM games
        INNER JOIN covers ON games.id = covers.game_id 
        WHERE games.title LIKE $1;
    `,
        [searchTerm],
    );

    return rows;
}

async function updateGenreName(newGenreName, genreId) {
    await db.query(
        `
        UPDATE genres SET name = $1 WHERE id = $2;
    `,
        [newGenreName, genreId],
    );
}

async function updatePublisherName(newPublisherName, publisherId) {
    await db.query(
        `
        UPDATE publishers SET name = $1 WHERE id = $2;
    `,
        [newPublisherName, publisherId],
    );
}

async function updateGame(
    newTitle,
    newDescription,
    newReleaseDate,
    newPublisherId,
    gameId,
) {
    await db.query(
        `
        UPDATE games SET title = $1, description = $2, release_date = $3, publisher_id = $4 WHERE id = $5;
    `,
        [newTitle, newDescription, newReleaseDate, newPublisherId, gameId],
    );
}

async function removeGamesGenres(game_genreIdsArray) {
    await db.query(
        `
        DELETE FROM games_genres WHERE id = ANY ($1);
    `,
        [game_genreIdsArray],
    );
}

async function updateGameCover(gameId, newCoverUrl) {
    await db.query(
        `
        UPDATE covers SET url = $1 WHERE game_id = $2;
    `,
        [newCoverUrl, gameId],
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
    checkIfGameExists,
    checkIfCoverAlreadyExists,
    checkIfDescriptionAlreadyExists,
    getGamesByGenres,
    getGenreNames,
    getGamesByPublishers,
    getPublishersNames,
    checkIfGenreExists,
    addGenre,
    checkIfPublisherExists,
    addPublisher,
    checkIfGameExistsById,
    searchGameByTitle,
    updateGenreName,
    updatePublisherName,
    updateGame,
    removeGamesGenres,
    updateGameCover,
};
