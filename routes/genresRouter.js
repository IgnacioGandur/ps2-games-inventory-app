const { Router } = require("express");
const {
    genresGet,
    genreDeletePost,
    addGenrePost,
} = require("../controllers/genresController");

const genresRouter = Router();

genresRouter.get("/", genresGet);
genresRouter.post("/delete/:genreId", genreDeletePost);
genresRouter.post("/addGenre", addGenrePost);

module.exports = genresRouter;
