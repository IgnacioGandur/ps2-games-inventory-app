const {
    getAllGenres,
    deleteGenre,
    addGenre,
    checkIfGenreExists,
    updateGenreName,
} = require("../db/queries");
const { body, validationResult } = require("express-validator");

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

const validateGenre = [
    body("genreName")
        .trim()
        .notEmpty()
        .withMessage("The genre name can't be empty.")
        .isLength({ min: 3 })
        .withMessage("The genre name must be at least 3 characters long."),
];

const addGenrePost = [
    validateGenre,
    async (req, res) => {
        const validationErrors = validationResult(req);
        const genres = await getAllGenres();
        const { genreName } = req.body;
        const alreadyExists = await checkIfGenreExists(genreName);

        if (!validationErrors.isEmpty()) {
            return res.status(400).render("pages/genres", {
                title: "PS2 Game Vault | Genres",
                genres: genres,
                validationErrors: validationErrors.array(),
                userInput: genreName,
            });
        }

        if (alreadyExists) {
            return res.render("pages/genres", {
                title: "Genre already exists",
                genres: genres,
                error: `The genre "${genreName}" already exists in the database.`,
                userInput: genreName,
            });
        } else {
            await addGenre(genreName);
            const genres = await getAllGenres();
            return res.render("pages/genres", {
                title: "PS2 Games Genres",
                genres: genres,
                successMessage: `The genre tag "${genreName}" was successfully inserted into the database.`,
            });
        }
    },
];

const validateNewGenreName = [
    body("newGenreValue")
        .trim()
        .notEmpty()
        .withMessage("The new genre name can't be empty."),
];

const updateGenrePost = [
    validateNewGenreName,
    async (req, res) => {
        const validationErrors = validationResult(req);
        const genres = await getAllGenres();
        const { newGenreValue, editGenrePass } = req.body;
        const { genreId } = req.params;

        if (!validationErrors.isEmpty()) {
            return res.status(400).render("pages/genres", {
                title: "PS2 Games Genres | Genres",
                genres: genres,
                validationErrors: validationErrors.array(),
            });
        }

        if (editGenrePass !== process.env.DELETION_PASSWORD) {
            return res.status(401).render("pages/genres", {
                title: "PS2 Games Vault | Genres",
                genres: genres,
                error: "The provided password is not correct. No genres were updated.",
            });
        }

        if (editGenrePass === process.env.DELETION_PASSWORD) {
            // Check if the updated value already exists in the database.
            const alreadyExists = await checkIfGenreExists(newGenreValue);
            if (alreadyExists) {
                return res.render("pages/genres", {
                    title: "PS2 Games Vault | Genres",
                    genres: genres,
                    error: `The new record name: "${newGenreValue}". Already exists in the database. Update cancelled.`,
                });
            } else {
                await updateGenreName(newGenreValue, genreId);
                const genres = await getAllGenres();
                return res.render("pages/genres", {
                    title: "PS2 Games Vault | Genres",
                    genres: genres,
                    successMessage: `The genre name was updated to "${newGenreValue}".`,
                });
            }
        }

        res.redirect("/genres");
    },
];

module.exports = {
    genresGet,
    genreDeletePost,
    addGenrePost,
    updateGenrePost,
};
