require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const path = require("node:path");
// Routers
const indexRouter = require("./routes/indexRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const addNewGameRouter = require("./routes/addNewGameRouter");
const gamesRouter = require("./routes/gamesRouter");
const genresRouter = require("./routes/genresRouter");
const publishersRouter = require("./routes/publishersRouter");

// Add flexibility on user input.
app.use(express.urlencoded({ extended: true }));

// Set the public directory
app.use(express.static("public"));

// Set the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", indexRouter);
app.use("/games", gamesRouter);
app.use("/categories", categoriesRouter);
app.use("/addNewGame", addNewGameRouter);
app.use("/genres", genresRouter);
app.use("/publishers", publishersRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});

// TODO: implement handling of genres and publishers deletion. How their deletion is going to affect records from the games table.
