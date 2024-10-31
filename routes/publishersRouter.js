const { Router } = require("express");
const {
    publishersGet,
    publishersDeletePost,
    addPublisherPost,
    publisherEditPost,
} = require("../controllers/publishersController");

const publishersRouter = Router();

publishersRouter.get("/", publishersGet);
publishersRouter.post("/delete/:publisherId", publishersDeletePost);
publishersRouter.post("/update/:publisherId", publisherEditPost);
publishersRouter.post("/addPublisher", addPublisherPost);

module.exports = publishersRouter;
