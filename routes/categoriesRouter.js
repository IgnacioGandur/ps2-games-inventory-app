const { Router } = require("express");
const categoriesRouter = Router();
const categoriesController = require("../controllers/categoriesController");

categoriesRouter.get("/", categoriesController);

module.exports = categoriesController;
