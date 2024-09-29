const { getAllGenres, deleteGenre } = require("../db/queries");

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

module.exports = {
    genresGet,
    genreDeletePost,
};
