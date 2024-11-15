const { format } = require("date-fns");
const {
    getAllGames,
    getGameById,
    getGameGenres,
    getGameCover,
    getGamePublisher,
    deleteGame,
    getAllGenres,
    getAllPublishers,
    getGamesByGenres,
    getGenreNames,
    getGamesByPublishers,
    getPublishersNames,
    checkIfGameExistsById,
    searchGameByTitle,
    updateGame,
    removeGamesGenres,
    updateGameCover,
    insertIntoGames_genres,
    checkIfGameExists,
    checkIfDescriptionAlreadyExists,
    checkIfCoverAlreadyExists,
} = require("../db/queries");
const { query, body, validationResult } = require("express-validator");

async function gamesGet(req, res) {
    const { genreFilters, publisherFilters } = req.query;

    if (genreFilters) {
        const games = await getGamesByGenres(genreFilters);
        const genres = await getAllGenres();
        const publishers = await getAllPublishers();
        const genreNames = await getGenreNames(genreFilters);

        return res.render("pages/games", {
            title: "Games filtered by genres",
            games: games,
            genres: genres,
            publishers: publishers,
            filteringBy: "genres",
            filters: genreNames,
        });
    }

    if (publisherFilters) {
        const games = await getGamesByPublishers(publisherFilters);
        const genres = await getAllGenres();
        const publishers = await getAllPublishers();
        const publishersNames = await getPublishersNames(publisherFilters);

        return res.render("pages/games", {
            title: "Games filtered by publisher",
            games: games,
            genres: genres,
            publishers: publishers,
            filteringBy: "publishers",
            filters: publishersNames,
        });
    }

    const games = await getAllGames();
    const genres = await getAllGenres();
    const publishers = await getAllPublishers();

    res.render("pages/games", {
        title: "Games list",
        games: games,
        genres: genres,
        publishers: publishers,
    });
}

async function gamePageGet(req, res) {
    const { gameId } = req.params;

    if (isNaN(gameId)) {
        return res.status(404).render("pages/404", {
            title: "Invalid search parameter.",
            error: `The game id you passed in the url is not right. Expected: Integer. Received: "${gameId}".`,
        });
    }

    const gameExists = await checkIfGameExistsById(gameId);

    if (gameExists) {
        const gameData = await getGameById(gameId);
        const gameGenres = await getGameGenres(gameId);
        const gameCover = await getGameCover(gameId);
        const gamePublisher = await getGamePublisher(gameId);
        const genres = await getAllGenres();
        const publishers = await getAllPublishers();

        const passwordError =
            req.query.error === "wrongPassword"
                ? "Wrong password. You can't delete this game unless you know the password."
                : null;

        return res.render("pages/gamePage", {
            title: gameData[0].title,
            gameId: gameId,
            gameData: gameData[0],
            gameGenres: gameGenres,
            gameCover: gameCover[0],
            gamePublisher: gamePublisher[0],
            gameReleaseDate: format(gameData[0].release_date, "LLLL do, yyyy"),
            passwordError: passwordError,
            genres: genres,
            publishers: publishers,
        });
    } else {
        return res.status(404).render("pages/404", {
            title: "Game Not Found",
            error: "The game you are looking for doesn't exists.",
        });
    }
}

function checkPassword(password) {
    if (password === process.env.DELETION_PASSWORD) {
        return true;
    } else {
        return false;
    }
}

async function deleteGamePost(req, res) {
    const { confirmationPassword } = req.body;
    const { gameId } = req.params;
    const isValidPassword = checkPassword(confirmationPassword);

    if (isValidPassword) {
        await deleteGame(gameId);
        return res.redirect("/games");
    } else {
        return res.redirect(`/games/${gameId}?error=wrongPassword`);
    }
}

const validateSearch = [
    query("searchTerm")
        .trim()
        .notEmpty()
        .withMessage("The search term can't be empty.")
        .exists()
        .withMessage("The search term is required.")
        .isLength({ min: 1 })
        .withMessage("The search term requires at least 1 character."),
];

const gamesSearch = [
    validateSearch,
    async (req, res) => {
        const { searchTerm } = req.query;
        const queryResults = await searchGameByTitle(searchTerm);
        const genres = await getAllGenres();
        const publishers = await getAllPublishers();
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const games = await getAllGames();
            return res.status(400).render("pages/games", {
                title: "PS2 Games Vault | Games",
                genres: genres,
                publishers: publishers,
                games: games,
                validationErrors: validationErrors.array(),
            });
        }

        res.render("pages/games", {
            title: "Search results",
            games: queryResults,
            genres: genres,
            publishers: publishers,
            searchResult: `Showing search results for the titles that contain the term: "${searchTerm}".`,
        });
    },
];

const validateGameUpdate = [
    body("updatedGameTitle")
        .trim()
        .notEmpty()
        .toLowerCase()
        .withMessage("The updated game title can't be empty.")
        .isLength({ min: 3 })
        .withMessage(
            "The updated game title should be at least 3 characters long.",
        )
        .custom(async (updatedTitle, { req }) => {
            const { gameId } = req.params;
            const originalGameEntry = await getGameById(gameId);
            const updatedTitleAlreadyExists =
                await checkIfGameExists(updatedTitle);

            if (updatedTitle === originalGameEntry[0].title) {
                return;
            }

            if (updatedTitleAlreadyExists) {
                throw new Error(
                    `The title: "${updatedTitle}" already exists in the database. No updates were applied.`,
                );
            }
        }),
    body("updatedGameCoverUrl")
        .trim()
        .notEmpty()
        .withMessage("The updated game cover URL can't be empty.")
        .isURL()
        .withMessage("The updated game cover URL must be a valid URL")
        .custom(async (updatedGameCoverUrl, { req }) => {
            const { gameId } = req.params;
            const updatedGameCoverUrlAlreadyExists =
                await checkIfCoverAlreadyExists(updatedGameCoverUrl);
            const originalGameCover = await getGameCover(gameId);

            if (updatedGameCoverUrl === originalGameCover[0].cover) {
                return;
            }

            if (updatedGameCoverUrlAlreadyExists) {
                throw new Error(`
                Another record already is using the updated game cover url.
            `);
            }
        }),
    body("updatedGameDescription")
        .trim()
        .notEmpty()
        .withMessage("The updated game description can't be empty.")
        .toLowerCase()
        .isLength({ min: 3 })
        .withMessage(
            "The updated game description should be at least 3 characters long.",
        )
        .custom(async (updatedDescription, { req }) => {
            const { gameId } = req.params;
            const descriptionAlreadyExists =
                await checkIfDescriptionAlreadyExists(updatedDescription);
            const originalGameEntry = await getGameById(gameId);

            if (updatedDescription === originalGameEntry[0].description) {
                return;
            }

            if (descriptionAlreadyExists) {
                throw new Error(
                    `Another record already has the updated description you are trying to use.`,
                );
            }
        }),
    body("updatedGameReleaseDate")
        .trim()
        .notEmpty()
        .withMessage("The updated release date can't be empty.")
        .isISO8601()
        .withMessage(
            'The updated release date should be a valid date with the following format:"yyyy-mm-dd".',
        ),
    body("targetGamesGenres")
        .custom(async (targetGenres) => {
            // If no genres are going to be deleted just return.
            if (targetGenres === undefined) {
                return;
            }
            const arrayOfGenreObjects = [];

            for (let i = 0; i < targetGenres.length; i++) {
                arrayOfGenreObjects.push(JSON.parse(targetGenres[i]));
            }

            let isInvalid = false;
            const invalidIds = [];

            for (let i = 0; i < arrayOfGenreObjects.length; i++) {
                if (isNaN(arrayOfGenreObjects[i].id)) {
                    invalidIds.push(arrayOfGenreObjects[i].id);
                    isInvalid = true;
                }
            }

            const invalidIdsToString = invalidIds.join(", ");

            if (isInvalid) {
                throw new Error(
                    `One of the genres to delete id is not an integer. Expected: Integers. Received the following invalid values: "${invalidIdsToString}".`,
                );
            }
        })
        .custom(async (targetGenres, { req }) => {
            let { updatedGameGenres } = req.body;
            const { gameId } = req.params;
            // Get the current genres of the game to be updated/edited.
            const currentGenres = await getGameGenres(gameId);
            // If no new genres are selected, use an empty array.
            updatedGameGenres === undefined
                ? (updatedGameGenres = [])
                : (updatedGameGenres = updatedGameGenres);

            // If there are no genres selected to delete just return.
            if (targetGenres === undefined) {
                return;
            }

            // If the genres to delete is the same length of the current genres in the target game and no new genres are going  to be added, throw error.
            if (
                targetGenres.length === currentGenres.length &&
                updatedGameGenres.length === 0
            ) {
                throw new Error(
                    "The game must have at least 1 genre. If you are going to delete all the current genres, add at least 1 new one. ",
                );
            }
        }),
    body("updatedGameGenres")
        .custom(async (updatedGenresList, { req }) => {
            // Return if there are no new genres.
            if (updatedGenresList === undefined) {
                return;
            }

            const arrayOfInvalidIds = [];

            let isInvalid = false;

            // If there's an invalid id value populate the array with them and set the error variable to true.
            for (let i = 0; i < updatedGenresList.length; i++) {
                if (isNaN(updatedGenresList[i])) {
                    arrayOfInvalidIds.push(updatedGenresList[i]);
                    isInvalid = true;
                }
            }

            // Join the array of errors into a string.
            let invalidIdsToString = arrayOfInvalidIds.join(", ");

            if (isInvalid) {
                throw new Error(
                    `One of the new genres id is not an integer. Expected: Integer. Received the following invalid values: ${invalidIdsToString}.`,
                );
            }
        })
        .custom(async (updatedGenresArray, { req }) => {
            const { gameId } = req.params;
            // Array of genres ids that are going to be deleted.
            const { targetGamesGenres } = req.body;
            // Array of current genres in the current game.
            const currentGenres = await getGameGenres(gameId);

            const genresArray = [];
            const genresToDelete = [];

            if (req.body.targetGamesGenres) {
                req.body.targetGamesGenres.forEach((genre) => {
                    genresArray.push(JSON.parse(genre));
                });

                genresArray.forEach((genre) => {
                    genresToDelete.push(genre.id);
                });
            }

            // If the user doesn't select any new genres when editing the game, set to empty array.
            let updatedGenres;
            updatedGenresArray === undefined
                ? (updatedGenres = [])
                : (updatedGenres = updatedGenresArray);

            // If the user doesn't select any genres to delete when editing the game, set to empty array.
            let targetGenres;
            targetGamesGenres === undefined
                ? (targetGenres = [])
                : (targetGenres = req.body.targetGamesGenres);

            const repeatedGenres = [];

            // Check if the new genres are already present in the game.
            updatedGenres.forEach((newGenre) => {
                currentGenres.forEach((currentGenre) => {
                    // genresToDelete.forEach((genreToDelete) => {});
                    if (Number(newGenre) === currentGenre.id) {
                        repeatedGenres.push(newGenre);
                    }
                });
            });

            const repeatedGenresThatWillNotBeDeleted = [];

            // Check which of the genres are repeated and are NOT going to be deleted from the current genres.
            repeatedGenres.forEach((repeatedGenre) => {
                genresToDelete.includes(repeatedGenre)
                    ? ""
                    : repeatedGenresThatWillNotBeDeleted.push(repeatedGenre);
            });

            const repeatedGenresNames = await getGenreNames(
                repeatedGenresThatWillNotBeDeleted,
            );

            const gn = repeatedGenresNames.map((obj) => obj.name).join(", ");

            if (repeatedGenresThatWillNotBeDeleted.length !== 0) {
                throw new Error(`
                You can't add repeated genres. List of repeated genres: ${gn}.
            `);
            }
        }),
    body("updatedPublisherId")
        .trim()
        .notEmpty()
        .withMessage("The publisher id field can't be empty.")
        .isInt()
        .withMessage("The publisher id value should be an integer."),
    body("adminPass")
        .trim()
        .notEmpty()
        .withMessage("The password field can't be empty.")
        .custom(async (password, { req }) => {
            if (password !== process.env.DELETION_PASSWORD) {
                throw new Error(
                    `The provided password: "${password}" is not correct.`,
                );
            }
        }),
];

// TODO: update the validation chain in the add new game   controller.

const updateGamePost = [
    validateGameUpdate,
    async (req, res) => {
        const {
            updatedGameTitle,
            updatedGameCoverUrl,
            updatedGameDescription,
            updatedGameReleaseDate,
            targetGamesGenres,
            updatedGameGenres,
            updatedPublisherId,
            adminPass,
        } = req.body;

        const { gameId } = req.params;

        const gameExists = await checkIfGameExistsById(gameId);
        const gameData = await getGameById(gameId);
        const gameGenres = await getGameGenres(gameId);
        const gameCover = await getGameCover(gameId);
        const gamePublisher = await getGamePublisher(gameId);
        const genres = await getAllGenres();
        const publishers = await getAllPublishers();

        // if (adminPass !== process.env.DELETION_PASSWORD) {
        //     return res.status(401).render("pages/gamePage", {
        //         title: gameData[0].title,
        //         gameId: gameId,
        //         gameData: gameData[0],
        //         gameGenres: gameGenres,
        //         gameCover: gameCover[0],
        //         gamePublisher: gamePublisher[0],
        //         gameReleaseDate: format(
        //             gameData[0].release_date,
        //             "LLLL do, yyyy",
        //         ),
        //         passwordError: `The password given: "${adminPass}" is not correct. No updates were applied to this game.`,
        //         genres: genres,
        //         publishers: publishers,
        //     });
        // }

        // if (adminPass === process.env.DELETION_PASSWORD) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(401).render("pages/gamePage", {
                title: gameData[0].title,
                gameId: gameId,
                gameData: gameData[0],
                gameGenres: gameGenres,
                gameCover: gameCover[0],
                gamePublisher: gamePublisher[0],
                gameReleaseDate: format(
                    gameData[0].release_date,
                    "LLLL do, yyyy",
                ),
                genres: genres,
                publishers: publishers,
                validationErrors: validationErrors.array(),
            });
        }

        if (gameExists) {
            const genresToDelete = [];
            const genresArray = [];

            if (targetGamesGenres) {
                targetGamesGenres.forEach((genre) => {
                    genresArray.push(JSON.parse(genre));
                });

                genresArray.forEach((genre) => {
                    genresToDelete.push(genre.gg_id);
                });
            }

            await updateGame(
                updatedGameTitle,
                updatedGameDescription,
                updatedGameReleaseDate,
                updatedPublisherId,
                gameId,
            );
            await removeGamesGenres(genresToDelete);
            await updateGameCover(gameId, updatedGameCoverUrl);
            await insertIntoGames_genres(gameId, updatedGameGenres);

            // TODO: Decide later if to keep the successful update message or just re-direct the user after the editing...

            // Fetch the database after the update.
            // const gameData = await getGameById(gameId);
            // const gameGenres = await getGameGenres(gameId);
            // const gameCover = await getGameCover(gameId);
            // const gamePublisher = await getGamePublisher(gameId);
            // const genres = await getAllGenres();
            // const publishers = await getAllPublishers();

            // return res.render("pages/gamePage", {
            //     title: gameData[0].title,
            //     gameId: gameId,
            //     gameData: gameData[0],
            //     gameGenres: gameGenres,
            //     gameCover: gameCover[0],
            //     gamePublisher: gamePublisher[0],
            //     gameReleaseDate: format(
            //         gameData[0].release_date,
            //         "LLLL do, yyyy",
            //     ),
            //     successUpdate: "This record was updated correctly.",
            //     genres: genres,
            //     publishers: publishers,
            // });
            return res.redirect(`/games/${gameId}`);
        } else {
            return res.status(404).render("pages/404", {
                title: "Game Not Found",
                error: "The game you are looking for doesn't exists.",
            });
        }
        // }
    },
];

module.exports = {
    gamesGet,
    gamePageGet,
    deleteGamePost,
    gamesSearch,
    updateGamePost,
};
