function searchGet(req, res) {
    res.render("pages/search", {
        title: "Search a ps2 game",
    });
}

module.exports = {
    searchGet,
};
