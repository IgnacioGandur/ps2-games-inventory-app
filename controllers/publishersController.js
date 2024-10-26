const {
    getAllPublishers,
    deletePublisher,
    checkIfPublisherExists,
    addPublisher,
} = require("../db/queries");

async function publishersGet(req, res) {
    const publishers = await getAllPublishers();
    res.render("pages/publishers", {
        title: "Ps2 game publishers",
        publishers: publishers,
    });
}

async function publishersDeletePost(req, res) {
    function checkPassword(password) {
        if (password === process.env.DELETION_PASSWORD) {
            return true;
        } else {
            return false;
        }
    }
    const { publisherId } = req.params;
    const { deletePublisherPass } = req.body;

    const isValidPassword = checkPassword(deletePublisherPass);

    if (isValidPassword) {
        await deletePublisher(publisherId);
        const publishers = await getAllPublishers();
        return res.render("pages/publishers", {
            title: "PS2 Game Publishers",
            publishers: publishers,
            successDeleteResponse: "Publisher deleted successfully.",
        });
    } else {
        const publishers = await getAllPublishers();
        return res.render("pages/publishers", {
            title: "PS2 Game Publishers",
            publishers: publishers,
            failedDeleteResponse:
                "Invalid password. You can't delete a record unless you know the password.",
        });
    }
}

async function addPublisherPost(req, res) {
    const { publisherName } = req.body;
    const publishers = await getAllPublishers();
    const result = await checkIfPublisherExists(publisherName);
    if (result) {
        return res.render("pages/publishers", {
            title: "PS2 Game Publishers",
            publishers: publishers,
            error: `The record "${publisherName}" already exists in the publishers database.`,
        });
    } else {
        await addPublisher(publisherName);
        const publishers = await getAllPublishers();
        return res.render("pages/publishers", {
            title: "PS2 Games Publishers",
            publishers: publishers,
            successMessage: `The record "${publisherName}" was added to the database successfully.`,
        });
    }
}

module.exports = {
    publishersGet,
    publishersDeletePost,
    addPublisherPost,
};
