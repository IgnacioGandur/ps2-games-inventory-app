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
} = require("../db/queries");

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
        // TODO: Set everything of the publishers filter.

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

    const gameData = await getGameById(gameId);
    const gameGenres = await getGameGenres(gameId);
    const gameCover = await getGameCover(gameId);
    const gamePublisher = await getGamePublisher(gameId);

    res.render("pages/gamePage", {
        title: gameData[0].title,
        gameData: gameData[0],
        gameGenres: gameGenres,
        gameCover: gameCover[0],
        gamePublisher: gamePublisher[0],
        gameReleaseDate: format(gameData[0].release_date, "LLLL ho, yyyy"),
    });
}

async function deleteGamePost(req, res) {
    const { gameId } = req.params;
    await deleteGame(gameId);
    res.redirect("/games");
}

module.exports = {
    gamesGet,
    gamePageGet,
    deleteGamePost,
};
