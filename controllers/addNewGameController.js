const {
    getAllGenres,
    getAllPublishers,
    insertGame,
    insertIntoGames_genres,
    insertIntoCovers,
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

    res.redirect("/");
}

module.exports = {
    addNewGameGet,
    addNewGamePost,
};
