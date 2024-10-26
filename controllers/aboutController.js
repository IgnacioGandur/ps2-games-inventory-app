function aboutGet(req, res) {
    const tools = [
        {
            icon: "/images/aboutPageIcons/nodejs-icon.svg",
            name: "Node js",
            link: "https://www.nodejs.org",
        },
        {
            icon: "/images/aboutPageIcons/javascript-icon.svg",
            name: "Javascript",
            link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        },
        {
            icon: "/images/aboutPageIcons/css-icon.svg",
            name: "CSS",
            link: "https://developer.mozilla.org/es/docs/Web/CSS",
        },
        {
            icon: "/images/aboutPageIcons/html-icon.svg",
            name: "HTML",
            link: "https://developer.mozilla.org/es/docs/Web/HTML",
        },
        {
            icon: "/images/aboutPageIcons/datefns-icon.svg",
            name: "Date-fns",
            link: "https://date-fns.org/",
        },
        {
            icon: "/images/aboutPageIcons/dotenv-icon.svg",
            name: "Dotenv",
            link: "https://github.com/motdotla/dotenv",
        },
        {
            icon: "/images/aboutPageIcons/express-icon.svg",
            name: "Express",
            link: "https://expressjs.com/",
        },
        {
            icon: "/images/aboutPageIcons/express-validator-icon.svg",
            name: "Express-validator",
            link: "https://express-validator.github.io/docs/",
        },
        {
            icon: "/images/aboutPageIcons/pg-icon.svg",
            name: "PG",
            link: "https://node-postgres.com/",
        },
        {
            icon: "/images/aboutPageIcons/ejs-icon.svg",
            name: "Ejs",
            link: "https://ejs.co/",
        },
        {
            icon: "/images/aboutPageIcons/postgresql-icon.svg",
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
