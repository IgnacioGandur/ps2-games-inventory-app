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
} = require("../db/queries");
const { query, validationResult } = require("express-validator");

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
            error: `The game id you passed in the url is not right. Expected: Integer. Received: ${gameId}.`,
        });
    }

    const gameExists = await checkIfGameExistsById(gameId);

    if (gameExists) {
        const gameData = await getGameById(gameId);
        const gameGenres = await getGameGenres(gameId);
        const gameCover = await getGameCover(gameId);
        const gamePublisher = await getGamePublisher(gameId);

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
            gameReleaseDate: format(gameData[0].release_date, "LLLL ho, yyyy"),
            passwordError: passwordError,
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

module.exports = {
    gamesGet,
    gamePageGet,
    deleteGamePost,
    gamesSearch,
};
