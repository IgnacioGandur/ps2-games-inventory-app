const toggleGenresButton = document.querySelector("[data-toggle-genres]");
const togglePublishersButton = document.querySelector(
    "[data-toggle-publishers]",
);
const genresButtonIcon = document.querySelector(".genres-icon-span");
const publishersButtonIcon = document.querySelector(".publishers-icon-span");

const genresContainer = document.querySelector("[data-genres-container]");
const publishersContainer = document.querySelector(
    "[data-publishers-container]",
);

let showGenres = false;
let showPublishers = false;

function toggleVisibility(filter) {
    if (filter === "genres") {
        showGenres = !showGenres;

        if (showGenres) {
            genresContainer.style.display = "grid";
            genresButtonIcon.innerHTML = "keyboard_arrow_up";
        } else {
            genresContainer.style.display = "none";
            genresButtonIcon.innerHTML = "keyboard_arrow_down";
        }
    }

    if (filter === "publishers") {
        showPublishers = !showPublishers;

        if (showPublishers) {
            publishersContainer.style.display = "grid";
            publishersButtonIcon.innerHTML = "keyboard_arrow_up";
        } else {
            publishersContainer.style.display = "none";
            publishersButtonIcon.innerHTML = "keyboard_arrow_down";
        }
    }
}

toggleGenresButton.addEventListener("click", () => {
    toggleVisibility("genres");
});

togglePublishersButton.addEventListener("click", () => {
    toggleVisibility("publishers");
});
