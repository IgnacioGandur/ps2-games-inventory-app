const { Router } = require("express");
const { searchGet } = require("../controllers/searchController");

const searchRouter = Router();
searchRouter.get("/", searchGet);

module.exports = searchRouter;
