const toggleGenresButton = document.querySelector("[data-toggle-genres]");
const togglePublishersButton = document.querySelector(
    "[data-toggle-publishers]",
);
const genresButtonIcon = document.querySelector(".genres-icon-span");
const publishersButtonIcon = document.querySelector(".publishers-icon-span");

const genresForm = document.querySelector("[data-genres-form]");
const publishersForm = document.querySelector("[data-publishers-form]");
const allGenresBoxes = document.querySelectorAll("[data-genre-box]");
const allPublishersBoxes = document.querySelectorAll("[data-publisher-box]");

function validateBox(boxes) {
    // Transform the node list in to an array, then check if any box is checked.
    const anyChecked = [...boxes].some((box) => box.checked);

    // If no boxes are checked then alert the user.
    if (!anyChecked) {
        boxes[0].setCustomValidity("Select at least one option to filter.");
    } else {
        boxes[0].setCustomValidity("");
    }
}

validateBox(allGenresBoxes);

allGenresBoxes.forEach((box) => {
    box.addEventListener("input", () => {
        validateBox(allGenresBoxes);
    });
});

genresForm.addEventListener("submit", (e) => {
    validateBox(allGenresBoxes);

    if (!genresForm.checkValidity()) {
        e.preventDefault();
    }
});

validateBox(allPublishersBoxes);

allPublishersBoxes.forEach((box) => {
    box.addEventListener("input", () => {
        validateBox(allPublishersBoxes);
    });
});

publishersForm.addEventListener("submit", (e) => {
    validateBox(allPublishersBoxes);

    if (!publishersForm.checkValidity()) {
        e.preventDefault();
    }
});

let showGenres = false;
let showPublishers = false;

function toggleVisibility(filter) {
    if (filter === "genres") {
        showGenres = !showGenres;

        if (showGenres) {
            genresForm.style.display = "grid";
            genresButtonIcon.innerHTML = "keyboard_arrow_up";
        } else {
            genresForm.style.display = "none";
            genresButtonIcon.innerHTML = "keyboard_arrow_down";
        }
    }

    if (filter === "publishers") {
        showPublishers = !showPublishers;

        if (showPublishers) {
            publishersForm.style.display = "grid";
            publishersButtonIcon.innerHTML = "keyboard_arrow_up";
        } else {
            publishersForm.style.display = "none";
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

const allGameCovers = document.querySelectorAll("[data-game-cover]");
allGameCovers.forEach((cover) => {
    cover.addEventListener("error", (e) => {
        e.target.src = "/images/ps2_games.jpg";
    });
});
