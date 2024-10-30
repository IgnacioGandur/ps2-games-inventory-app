const { Router } = require("express");
const {
    genresGet,
    genreDeletePost,
    addGenrePost,
    updateGenrePost,
} = require("../controllers/genresController");

const genresRouter = Router();

genresRouter.get("/", genresGet);
genresRouter.post("/delete/:genreId", genreDeletePost);
genresRouter.post("/addGenre", addGenrePost);
genresRouter.post("/update/:genreId", updateGenrePost);

module.exports = genresRouter;
