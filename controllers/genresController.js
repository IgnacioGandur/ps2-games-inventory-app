const {
    getAllGenres,
    deleteGenre,
    addGenre,
    checkIfGenreExists,
    updateGenreName,
} = require("../db/queries");
const { body, param, validationResult } = require("express-validator");

async function genresGet(req, res) {
    const genres = await getAllGenres();

    res.render("pages/genres", {
        title: "Ps2 game genres",
        genres: genres,
    });
}

const validateGenreDeletion = [
    param("genreId")
        .exists()
        .withMessage("A genre id is required in the request's parameter.")
        .isInt()
        .withMessage(
            "The genre id in the request's parameter must be an integer.",
        ),
    body("deleteGenrePass")
        .trim()
        .notEmpty()
        .withMessage("The password field can't be empty.")
        .custom(async (password) => {
            if (password !== process.env.DELETION_PASSWORD) {
                throw new Error(`The password: "${password}" is not correct.`);
            }
        }),
];

const genreDeletePost = [
    validateGenreDeletion,
    async (req, res) => {
        const { genreId } = req.params;
        const validationErrors = validationResult(req);
        const genres = await getAllGenres();

        if (!validationErrors.isEmpty()) {
            return res.status(401).render("pages/genres", {
                title: "PS2 Games Genres",
                genres: genres,
                validationErrors: validationErrors.array(),
            });
        }

        await deleteGenre(genreId);

        return res.redirect("/genres");
    },
];

const validateGenre = [
    body("genreName")
        .trim()
        .notEmpty()
        .withMessage("The genre name can't be empty.")
        .isLength({ min: 3 })
        .withMessage("The genre name must be at least 3 characters long.")
        .custom(async (genreName) => {
            const alreadyExists = await checkIfGenreExists(genreName);

            if (alreadyExists) {
                throw new Error(
                    `The genre: "${genreName}" already exists in the database. `,
                );
            }
        }),
];

const addGenrePost = [
    validateGenre,
    async (req, res) => {
        const validationErrors = validationResult(req);
        const genres = await getAllGenres();
        const { genreName } = req.body;

        if (!validationErrors.isEmpty()) {
            return res.status(400).render("pages/genres", {
                title: "PS2 Game Vault | Genres",
                genres: genres,
                validationErrors: validationErrors.array(),
                userInput: genreName,
            });
        }

        await addGenre(genreName);
        return res.redirect("/genres");
    },
];

const validateGenreUpdate = [
    body("newGenreValue")
        .trim()
        .notEmpty()
        .withMessage("The new genre name can't be empty.")
        .isLength({ min: 3 })
        .withMessage("The new genre name must be at least 3 characters long."),
    body("editGenrePass")
        .trim()
        .notEmpty()
        .withMessage("The password field can't be empty.")
        .custom(async (password) => {
            if (password !== process.env.DELETION_PASSWORD) {
                throw new Error("The password is not correct.");
            }
        }),
    body("newGenreValue").custom(async (newGenre) => {
        const existsAlready = await checkIfGenreExists(newGenre);

        if (existsAlready) {
            throw new Error(
                `The genre: "${newGenre}" already exists in the database. `,
            );
        }
    }),
];

const updateGenrePost = [
    validateGenreUpdate,
    async (req, res) => {
        const validationErrors = validationResult(req);
        const genres = await getAllGenres();
        const { newGenreValue } = req.body;
        const { genreId } = req.params;

        if (!validationErrors.isEmpty()) {
            return res.status(400).render("pages/genres", {
                title: "PS2 Games Genres | Genres",
                genres: genres,
                validationErrors: validationErrors.array(),
            });
        }

        await updateGenreName(newGenreValue, genreId);

        return res.redirect("/genres");
    },
];

module.exports = {
    genresGet,
    genreDeletePost,
    addGenrePost,
    updateGenrePost,
};
