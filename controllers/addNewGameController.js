const {
    getAllGenres,
    getAllPublishers,
    insertGame,
    insertIntoGames_genres,
    insertIntoCovers,
    checkIfGameExists,
    checkIfCoverAlreadyExists,
    checkIfDescriptionAlreadyExists,
} = require("../db/queries");

async function addNewGameGet(req, res) {
    const genres = await getAllGenres();
    const publishers = await getAllPublishers();

    res.render("pages/addNewGame", {
        title: "Add a new game",
        genres: genres,
        publishers: publishers,
    });
}

async function addNewGamePost(req, res) {
    const { title, description, release_date, publisherId, genres, coverUrl } =
        req.body;

    const gameAlreadyExists = await checkIfGameExists(title);
    const coverAlreadyExists = await checkIfCoverAlreadyExists(coverUrl);
    const descriptionAlreadyExists =
        await checkIfDescriptionAlreadyExists(description);

    const errors = [];

    if (gameAlreadyExists) {
        errors.push(`The record "${title}" already exists in the database.`);
    }

    if (coverAlreadyExists) {
        errors.push(
            `The game cover url is already being used in another record.`,
        );
    }

    if (descriptionAlreadyExists) {
        errors.push(`
            Another game already has this description.
        `);
    }

    if (gameAlreadyExists || coverAlreadyExists || descriptionAlreadyExists) {
        const genres = await getAllGenres();
        const publishers = await getAllPublishers();
        res.render("pages/addNewGame", {
            title: "Add a new game",
            genres: genres,
            publishers: publishers,
            errors: errors,
            inputValues: {
                title: title,
                description: description,
                coverUrl: coverUrl,
                release_date: release_date,
            },
        });
    } else {
        const gameId = await insertGame(
            title,
            description,
            release_date,
            publisherId,
        );

        await insertIntoCovers(gameId, coverUrl);

        if (typeof genres === "string") {
            const gameGenres = [];
            gameGenres.push(genres);
            await insertIntoGames_genres(gameId, gameGenres);
        } else {
            await insertIntoGames_genres(gameId, genres);
        }
        res.redirect("/games");
    }
}

module.exports = {
    addNewGameGet,
    addNewGamePost,
};
