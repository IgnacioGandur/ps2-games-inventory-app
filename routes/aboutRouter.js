const { Router } = require("express");

const aboutRouter = Router();
const { aboutGet } = require("../controllers/aboutController");

aboutRouter.get("/", aboutGet);

module.exports = aboutRouter;
