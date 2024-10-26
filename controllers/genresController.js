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
    function checkPassword(password) {
        if (password === process.env.DELETION_PASSWORD) {
            return true;
        } else {
            return false;
        }
    }
    // TODO: IMPLEMENT PASSWORD CHECKING TO AUTHORIZE THE DELETION OF THE GENRE.
    const { genreId } = req.params;
    const { deleteGenrePass } = req.body;

    const isValidPassword = checkPassword(deleteGenrePass);

    if (isValidPassword) {
        await deleteGenre(genreId);
        const genres = await getAllGenres();
        return res.render("pages/genres", {
            title: "PS2 Games Genres",
            genres: genres,
            successDeleteResponse: "Genre deleted successfully.",
        });
    } else {
        const genres = await getAllGenres();
        return res.render("pages/genres", {
            title: "PS2 Genres Page",
            genres: genres,
            failedDeleteResponse:
                "Invalid password. You can't delete a record unless you know the password.",
        });
    }
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
