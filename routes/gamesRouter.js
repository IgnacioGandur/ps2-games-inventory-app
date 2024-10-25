const { Router } = require("express");
const {
    gamesGet,
    gamePageGet,
    deleteGamePost,
    gamesSearch,
} = require("./../controllers/gamesController");

const gamesRouter = Router();

gamesRouter.get("/", gamesGet);
gamesRouter.get("/search", gamesSearch);
gamesRouter.get("/:gameId", gamePageGet);
gamesRouter.post("/delete/:gameId", deleteGamePost);

module.exports = gamesRouter;
