const { Router } = require("express");
const {
    addNewGameGet,
    addNewGamePost,
} = require("../controllers/addNewGameController");
const addNewGameRouter = Router();

addNewGameRouter.route("/").get(addNewGameGet).post(addNewGamePost);

module.exports = addNewGameRouter;
