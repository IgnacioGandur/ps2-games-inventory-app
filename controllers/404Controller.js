function get404Page(req, res) {
    return res.status(404).render("pages/404", {
        title: "Page Not Found",
        error: `The page you are looking for doesn't exist. Please check if you wrote the URL path correctly. Current URL path: "${req.originalUrl}"`,
    });
}

module.exports = get404Page;
