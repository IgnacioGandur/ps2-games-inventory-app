const {
    getAllGenres,
    deleteGenre,
    addGenre,
    checkIfGenreExists,
} = require("../db/queries");

async function genresGet(req, res) {
    const genres = await getAllGenres();

    res.render("pages/genres", {
        title: "Ps2 game genres",
        genres: genres,
    });
}

async function genreDeletePost(req, res) {
    const { genreId } = req.params;
    await deleteGenre(genreId);
    res.redirect("/genres");
}

async function addGenrePost(req, res) {
    const genres = await getAllGenres();
    const { genreName } = req.body;
    const alreadyExists = await checkIfGenreExists(genreName);
    if (alreadyExists) {
        return res.render("pages/genres", {
            title: "Genre already exists",
            genres: genres,
            error: `The genre "${genreName}" already exists in the database.`,
        });
    } else {
        await addGenre(genreName);
        const genres = await getAllGenres();
        return res.render("pages/genres", {
            title: "PS2 Games Genres",
            genres: genres,
            successMessage: `The record "${genreName}" was successfully inserted into the database.`,
        });
    }
}

module.exports = {
    genresGet,
    genreDeletePost,
    addGenrePost,
};
