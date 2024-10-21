function aboutGet(req, res) {
    const tools = [
        {
            name: "Node js",
            link: "https://www.nodejs.org",
        },
        {
            name: "Javascript",
            link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        },
        {
            name: "CSS",
            link: "https://developer.mozilla.org/es/docs/Web/CSS",
        },
        {
            name: "HTML",
            link: "https://developer.mozilla.org/es/docs/Web/HTML",
        },
        {
            name: "Date-fns",
            link: "https://date-fns.org/",
        },
        {
            name: "Dotenv",
            link: "https://github.com/motdotla/dotenv",
        },
        {
            name: "Express",
            link: "https://github.com/motdotla/dotenv",
        },
        {
            name: "Express-validator",
            link: "https://express-validator.github.io/docs/",
        },
        {
            name: "PG",
            link: "https://node-postgres.com/",
        },
        {
            name: "Ejs",
            link: "https://ejs.co/",
        },
        {
            name: "Postgresql",
            link: "https://www.postgresql.org/",
        },
    ];
    res.render("pages/about", {
        title: "About page",
        tools: tools,
    });
}

module.exports = {
    aboutGet,
};
