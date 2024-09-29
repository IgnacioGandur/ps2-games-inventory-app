const { Router } = require("express");
const {
    genresGet,
    genreDeletePost,
} = require("../controllers/genresController");

const genresRouter = Router();

genresRouter.get("/", genresGet);
genresRouter.post("/delete/:genreId", genreDeletePost);

module.exports = genresRouter;
