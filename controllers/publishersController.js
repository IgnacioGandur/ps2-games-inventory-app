const {
    getAllPublishers,
    deletePublisher,
    checkIfPublisherExists,
    addPublisher,
} = require("../db/queries");
const { body, validationResult } = require("express-validator");

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

const validatePublisher = [
    body("publisherName")
        .trim()
        .notEmpty()
        .withMessage("The publisher name can't be empty.")
        .isLength({ min: 3 })
        .withMessage(
            "The publisher field name must be at least 3 characters long.",
        ),
];

const addPublisherPost = [
    validatePublisher,
    async (req, res) => {
        const { publisherName } = req.body;
        const publishers = await getAllPublishers();
        const result = await checkIfPublisherExists(publisherName);
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(400).render("pages/publishers", {
                title: "PS2 Games Vault | Publishers",
                publishers: publishers,
                validationErrors: validationErrors.array(),
                userInput: publisherName,
            });
        }

        if (result) {
            return res.render("pages/publishers", {
                title: "PS2 Game Publishers",
                publishers: publishers,
                error: `The record "${publisherName}" already exists in the publishers database.`,
                userInput: publisherName,
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
    },
];

module.exports = {
    publishersGet,
    publishersDeletePost,
    addPublisherPost,
};
