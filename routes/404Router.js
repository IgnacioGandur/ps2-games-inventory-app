const { Router } = require("express");
const get404Page = require("../controllers/404Controller");
const errorPageRouter = Router();

errorPageRouter.get("/", get404Page);

module.exports = errorPageRouter;
