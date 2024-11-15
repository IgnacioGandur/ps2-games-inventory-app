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
        .withMessage("The title field can't be empty.")
        .isLength({ min: 3 })
        .withMessage("The title field should be at least 3 characters long.")
        .toLowerCase()
        .custom(async (title) => {
            const alreadyExists = await checkIfGameExists(title);

            if (alreadyExists) {
                throw new Error(
                    `The game: "${title}" already exists in the database.`,
                );
            }
        }),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("The description field can't be empty.")
        .isLength({ min: 5 })
        .withMessage(
            "The description field must be at least 5 characters long.",
        )
        .toLowerCase()
        .custom(async (description) => {
            const alreadyExists =
                await checkIfDescriptionAlreadyExists(description);
            if (alreadyExists) {
                throw new Error(
                    "Another game already has the same descrpition. Use a different one.",
                );
            }
        }),
    body("release_date")
        .trim()
        .notEmpty()
        .withMessage('The "release date" field should not be empty.')
        .isISO8601()
        .withMessage(
            "The release date field should be a valid date format with the pattern: 'YYYY-MM-DD'.",
        ),
    body("coverUrl")
        .trim()
        .notEmpty()
        .withMessage("The cover URL field can't be empty. ")
        .isURL()
        .withMessage("The cover URL field must be a valid URL. ")
        .custom(async (coverUrl) => {
            const alreadyExists = await checkIfCoverAlreadyExists(coverUrl);

            if (alreadyExists) {
                throw new Error(
                    "Another game already has the same cover URL. Use another one.",
                );
            }
        }),
    body("genres")
        .custom(async (genres) => {
            if (genres === undefined) {
                throw new Error("You must select at least one genre.");
            }
        })
        .custom(async (genres) => {
            const arrayOfInvalidIds = [];

            for (let i = 0; i < genres.length; i++) {
                if (isNaN(Number(genres[i]))) {
                    arrayOfInvalidIds.push(genres[i]);
                }
            }

            if (arrayOfInvalidIds.length > 0) {
                throw new Error(
                    `At least one of the genre ids is invalid. Expect: Integer. Invalid value/s: "${arrayOfInvalidIds.join(", ")}".`,
                );
            }
        })
        .custom(async (genres) => {
            if (typeof genres === "string") {
                throw new Error(
                    `Invalid genre id. Expected: Integer. Received: "${genres}".`,
                );
            }
        }),
    body("publisherId")
        .trim()
        .notEmpty()
        .withMessage("The publisher id field can't be empty.")
        .isInt()
        .withMessage(
            "Invalid publisher id. The publisher id must be an integer.",
        ),
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

        const dbGenres = await getAllGenres();
        const publishers = await getAllPublishers();

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(400).render("pages/addNewGame", {
                title: "Add New Game",
                validationErrors: validationErrors.array(),
                genres: dbGenres,
                publishers: publishers,
                inputValues: {
                    title,
                    description,
                    coverUrl,
                    release_date,
                },
            });
        }

        const gameId = await insertGame(
            title,
            description,
            release_date,
            publisherId,
        );

        await insertIntoCovers(gameId, coverUrl);

        // If only one genres is selected create an array, add the genres and pass it to the db function.
        if (typeof genres === "string") {
            const gameGenres = [];
            gameGenres.push(genres);
            await insertIntoGames_genres(gameId, gameGenres);
        } else {
            await insertIntoGames_genres(gameId, genres);
        }
        return res.redirect("/games");
    },
];

module.exports = {
    addNewGameGet,
    addNewGamePost,
};
