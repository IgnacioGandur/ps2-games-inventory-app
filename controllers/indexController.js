const { getAllGames } = require("../db/queries");

module.exports = indexController = {
    async indexGet(req, res) {
        const games = await getAllGames();
        res.render("pages/index", {
            title: "Ps2 Games Vault | Homepage",
            games,
        });
    },
};
