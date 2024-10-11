const {
    getAllGames,
    getAllGenres,
    getAllPublishers,
} = require("../db/queries");

module.exports = indexController = {
    async indexGet(req, res) {
        const games = await getAllGames();
        const genres = await getAllGenres();
        const publishers = await getAllPublishers();
        res.render("pages/index", {
            title: "Ps2 Games Vault | Homepage",
            games,
            genres,
            publishers,
        });
    },
};
