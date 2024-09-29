const { getAllPublishers, deletePublisher } = require("../db/queries");

async function publishersGet(req, res) {
    const publishers = await getAllPublishers();
    res.render("pages/publishers", {
        title: "Ps2 game publishers",
        publishers: publishers,
    });
}

async function publishersDeletePost(req, res) {
    const { publisherId } = req.params;
    await deletePublisher(publisherId);
    res.redirect("/publishers");
}

module.exports = {
    publishersGet,
    publishersDeletePost,
};
