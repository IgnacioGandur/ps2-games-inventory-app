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

const { body, validationResult } = require("express-validator");

async function addNewGameGet(req, res) {
    const genres = await getAllGenres();
    const publishers = await getAllPublishers();

    res.render("pages/addNewGame", {
        title: "Add a new game",
        genres: genres,
        publishers: publishers,
        inputValues: {},
    });
}

const validateGame = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage('The "title" field should not be empty.')
        .exists()
        .withMessage('The "title" field is required.')
        .isLength({ min: 3 })
        .withMessage(
            'The "title" field length should be at least 3 characters long.',
        ),
    body("description")
        .trim()
        .notEmpty()
        .withMessage('The "description" field can\'t be empty.')
        .exists()
        .withMessage('The "description" field is required.')
        .isLength({ min: 5 })
        .withMessage(
            'The "description" field must be at least 5 characters long.',
        ),
    body("release_date")
        .trim()
        .notEmpty()
        .withMessage('The "release date" field should not be empty.')
        .isISO8601()
        .withMessage(
            'The "release date" field should be a valid date format with the pattern: "YYYY-MM-DD".',
        ),
    body("coverUrl")
        .trim()
        .notEmpty()
        .withMessage('The "coverUrl" field can\'t be empty. ')
        .isURL()
        .withMessage('The "cover URL" field must be a valid URL. '),
];

const addNewGamePost = [
    validateGame,
    async function (req, res) {
        const {
            title,
            description,
            release_date,
            publisherId,
            genres,
            coverUrl,
        } = req.body;

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const genres = await getAllGenres();
            const publishers = await getAllPublishers();
            return res.status(400).render("pages/addNewGame", {
                title: "Add New Game",
                validationErrors: validationErrors.array(),
                genres: genres,
                publishers: publishers,
                inputValues: {
                    title,
                    description,
                    coverUrl,
                    release_date,
                },
            });
        }

        const gameAlreadyExists = await checkIfGameExists(title);
        const coverAlreadyExists = await checkIfCoverAlreadyExists(coverUrl);
        const descriptionAlreadyExists =
            await checkIfDescriptionAlreadyExists(description);

        const dbErrors = [];

        if (gameAlreadyExists) {
            dbErrors.push(
                `The record "${title}" already exists in the database.`,
            );
        }

        if (coverAlreadyExists) {
            dbErrors.push(
                `The game cover url is already being used in another record.`,
            );
        }

        if (descriptionAlreadyExists) {
            dbErrors.push(`
            Another game already has this description.
        `);
        }

        if (
            gameAlreadyExists ||
            coverAlreadyExists ||
            descriptionAlreadyExists
        ) {
            const genres = await getAllGenres();
            const publishers = await getAllPublishers();
            res.render("pages/addNewGame", {
                title: "Add a new game",
                genres: genres,
                publishers: publishers,
                errors: dbErrors,
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
    },
];

module.exports = {
    addNewGameGet,
    addNewGamePost,
};
