const { Router } = require("express");
const {
    publishersGet,
    publishersDeletePost,
} = require("../controllers/publishersController");

const publishersRouter = Router();

publishersRouter.get("/", publishersGet);
publishersRouter.post("/delete/:publisherId", publishersDeletePost);

module.exports = publishersRouter;
