function aboutGet(req, res) {
    const tools = [
        {
            icon: "/images/aboutPageIcons/nodejs-icon.svg",
            name: "Node js",
            link: "https://www.nodejs.org",
            description: "To write the server app in JS.",
        },
        {
            icon: "/images/aboutPageIcons/javascript-icon.svg",
            name: "Javascript",
            link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            description: "The web's programming language.",
        },
        {
            icon: "/images/aboutPageIcons/css-icon.svg",
            name: "CSS",
            link: "https://developer.mozilla.org/es/docs/Web/CSS",
            description: "To style the website.",
        },
        {
            icon: "/images/aboutPageIcons/html-icon.svg",
            name: "HTML",
            link: "https://developer.mozilla.org/es/docs/Web/HTML",
            description: "To structure the website's pages.",
        },
        {
            icon: "/images/aboutPageIcons/datefns-icon.png",
            name: "Date-fns",
            link: "https://date-fns.org/",
            description:
                "One of my favorite libraries to handle dates formatting.",
        },
        {
            icon: "/images/aboutPageIcons/dotenv-icon.svg",
            name: "Dotenv",
            link: "https://github.com/motdotla/dotenv",
            description: "To use environment variables in the project.",
        },
        {
            icon: "/images/aboutPageIcons/express-icon.svg",
            name: "Express",
            link: "https://expressjs.com/",
            description: "Web framework to handle requests in the server.",
        },
        {
            icon: "/images/aboutPageIcons/express-validator-icon.svg",
            name: "Express-validator",
            link: "https://express-validator.github.io/docs/",
            description: "A library to validate user input.",
        },
        {
            icon: "/images/aboutPageIcons/pg-icon.svg",
            name: "PG",
            link: "https://node-postgres.com/",
            description: "A Postgresql client for Node Js.",
        },
        {
            icon: "/images/aboutPageIcons/ejs-icon.png",
            name: "Ejs",
            link: "https://ejs.co/",
            description: "To render content dynamically into our views.",
        },
        {
            icon: "/images/aboutPageIcons/postgresql-icon.svg",
            name: "Postgresql",
            link: "https://www.postgresql.org/",
            description:
                "The RDBMS used to create/manage the databases for this website.",
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
