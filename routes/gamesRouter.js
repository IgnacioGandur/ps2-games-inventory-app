const { Router } = require("express");
const {
    gamesGet,
    gamePageGet,
    deleteGamePost,
    gamesSearch,
    updateGamePost,
} = require("./../controllers/gamesController");

const gamesRouter = Router();

gamesRouter.get("/", gamesGet);
gamesRouter.get("/search", gamesSearch);
gamesRouter.post("/delete/:gameId", deleteGamePost);
gamesRouter.post("/update/:gameId", updateGamePost);
gamesRouter.get("/:gameId", gamePageGet);

module.exports = gamesRouter;
