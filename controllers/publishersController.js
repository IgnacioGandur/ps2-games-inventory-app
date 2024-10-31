const {
    getAllPublishers,
    deletePublisher,
    checkIfPublisherExists,
    addPublisher,
    updatePublisherName,
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

const validateNewPublisherName = [
    body("newPublisherValue")
        .trim()
        .notEmpty()
        .withMessage("The new publisher name can't be empty."),
];

const publisherEditPost = [
    validateNewPublisherName,
    async (req, res) => {
        const validationErrors = validationResult(req);
        const publishers = await getAllPublishers();
        const { newPublisherValue, editPublisherPass } = req.body;
        const { publisherId } = req.params;

        if (!validationErrors.isEmpty()) {
            return res.status(400).render("pages/publishers", {
                title: "PS2 Games Vault | Publishers",
                publishers: publishers,
                validationErrors: validationErrors.array(),
            });
        }

        if (editPublisherPass !== process.env.DELETION_PASSWORD) {
            return res.status(401).render("pages/publishers", {
                title: "PS2 Games Vault | Publishers",
                publishers: publishers,
                error: "The provided password is not correct. No records were updated.",
            });
        }

        if (editPublisherPass === process.env.DELETION_PASSWORD) {
            const alreadyExists =
                await checkIfPublisherExists(newPublisherValue);
            if (alreadyExists) {
                return res.render("pages/publishers", {
                    title: "PS2 Games Vault | Publishers",
                    publishers: publishers,
                    error: `The new record name: ${newPublisherValue} already exists in the database. Update cancelled.`,
                });
            } else {
                await updatePublisherName(newPublisherValue, publisherId);
                const publishers = await getAllPublishers();
                return res.render("pages/publishers", {
                    title: "PS2 Games Vault | Publishers",
                    publishers: publishers,
                    successMessage: `The publisher name was updated to "${newPublisherValue}".`,
                });
            }
        }
    },
];

module.exports = {
    publishersGet,
    publishersDeletePost,
    addPublisherPost,
    publisherEditPost,
};
