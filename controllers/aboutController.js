function aboutGet(req, res) {
    res.render("pages/about", {
        title: "About page",
    });
}

module.exports = {
    aboutGet,
};
