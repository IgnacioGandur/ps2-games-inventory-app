const {
    getAllPublishers,
    deletePublisher,
    checkIfPublisherExists,
    addPublisher,
    updatePublisherName,
} = require("../db/queries");
const { body, param, validationResult } = require("express-validator");

async function publishersGet(req, res) {
    const publishers = await getAllPublishers();
    res.render("pages/publishers", {
        title: "Ps2 game publishers",
        publishers: publishers,
    });
}

const validatePublisherDeletion = [
    body("deletePublisherPass")
        .trim()
        .notEmpty()
        .withMessage("The password field is empty.")
        .custom(async (password) => {
            if (password !== process.env.DELETION_PASSWORD) {
                throw new Error(`The password: "${password}" is not correct. `);
            }
        }),
];

const publishersDeletePost = [
    validatePublisherDeletion,
    async (req, res) => {
        const { publisherId } = req.params;
        const publishers = await getAllPublishers();

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(401).render("pages/publishers", {
                title: "PS2 Games Publishers",
                publishers: publishers,
                validationErrors: validationErrors.array(),
            });
        }

        await deletePublisher(publisherId);

        return res.redirect("/publishers");
    },
];

const validateNewPublisher = [
    body("publisherName")
        .trim()
        .notEmpty()
        .withMessage("The publisher name can't be empty.")
        .isLength({ min: 3 })
        .withMessage(
            "The publisher field name must be at least 3 characters long.",
        )
        .custom(async (publisherName) => {
            const alreadyExists = await checkIfPublisherExists(publisherName);
            if (alreadyExists) {
                throw new Error(
                    `The publisher: "${publisherName}" already exists in the database.`,
                );
            }
        }),
];

const addPublisherPost = [
    validateNewPublisher,
    async (req, res) => {
        const { publisherName } = req.body;
        const publishers = await getAllPublishers();
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(400).render("pages/publishers", {
                title: "PS2 Games Vault | Publishers",
                publishers: publishers,
                validationErrors: validationErrors.array(),
                userInput: publisherName,
            });
        }

        await addPublisher(publisherName);

        return res.redirect("/publishers");
    },
];

const validatePublisherNameUpdate = [
    param("publisherId")
        .isInt()
        .withMessage(
            "The publisher id in the URL parameter must be an integer.",
        ),
    body("newPublisherValue")
        .trim()
        .notEmpty()
        .withMessage("The new publisher name can't be empty.")
        .custom(async (updatedPublisherName) => {
            const alreadyExists =
                await checkIfPublisherExists(updatedPublisherName);
            if (alreadyExists) {
                throw new Error(
                    `The publisher name: "${updatedPublisherName}" already exists in the database.`,
                );
            }
        }),
    body("editPublisherPass")
        .trim()
        .notEmpty()
        .withMessage("The password field is empty.")
        .custom(async (password) => {
            if (password !== process.env.DELETION_PASSWORD) {
                throw new Error(
                    `The provided password: "${password}" is not correct. `,
                );
            }
        }),
];

const publisherEditPost = [
    validatePublisherNameUpdate,
    async (req, res) => {
        const validationErrors = validationResult(req);
        const publishers = await getAllPublishers();
        const { newPublisherValue } = req.body;
        const { publisherId } = req.params;

        if (!validationErrors.isEmpty()) {
            return res.status(400).render("pages/publishers", {
                title: "PS2 Games Vault | Publishers",
                publishers: publishers,
                validationErrors: validationErrors.array(),
            });
        }

        await updatePublisherName(newPublisherValue, publisherId);

        return res.redirect("/publishers");
    },
];

module.exports = {
    publishersGet,
    publishersDeletePost,
    addPublisherPost,
    publisherEditPost,
};
