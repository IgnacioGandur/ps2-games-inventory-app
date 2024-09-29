const { Router } = require("express");
const {
    gamesGet,
    gamePageGet,
    deleteGamePost,
} = require("./../controllers/gamesController");

const gamesRouter = Router();

gamesRouter.get("/", gamesGet);
gamesRouter.get("/:gameId", gamePageGet);
gamesRouter.post("/delete/:gameId", deleteGamePost);

module.exports = gamesRouter;
