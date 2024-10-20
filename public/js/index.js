const genresLink = document.querySelector("[data-genres-link]");
const publishersLink = document.querySelector("[data-publishers-link]");

const genresTagsContainer = document.querySelector(
    "[data-genres-tags-container]",
);
const publishersTagsContainer = document.querySelector(
    "[data-publishers-tags-container]",
);

// MOUSE ENTER AND MOUSE LEAVE EVENTS ON GENRES LINK

genresLink.addEventListener("mouseenter", () => {
    genresTagsContainer.classList.add("visible");
});

genresLink.addEventListener("mouseleave", () => {
    genresTagsContainer.classList.remove("visible");
});

// FOCUS AND BLUR EVENTS
genresLink.addEventListener("focus", () => {
    genresTagsContainer.classList.add("visible");
});

genresLink.addEventListener("blur", () => {
    genresTagsContainer.classList.remove("visible");
});

// FOCUS AND BLUR
publishersLink.addEventListener("focus", () => {
    publishersTagsContainer.classList.add("visible");
});

publishersLink.addEventListener("blur", () => {
    publishersTagsContainer.classList.remove("visible");
});

// MOUSE ENTER AND MOUSE LEAVE EVENTS ON PUBLISHERS LINK
publishersLink.addEventListener("mouseenter", () => {
    publishersTagsContainer.classList.add("visible");
});

publishersLink.addEventListener("mouseleave", () => {
    publishersTagsContainer.classList.remove("visible");
});

genresTagsContainer.addEventListener("mouseenter", (e) => {
    if (e.target.classList.contains("visible")) {
        return;
    }
    e.target.classList.add("visible");
});

genresTagsContainer.addEventListener("mouseleave", (e) => {
    e.target.classList.remove("visible");
});

publishersTagsContainer.addEventListener("mouseenter", (e) => {
    if (e.target.classList.contains("visible")) {
        return;
    }
    e.target.classList.add("visible");
});

publishersTagsContainer.addEventListener("mouseleave", (e) => {
    e.target.classList.remove("visible");
});
