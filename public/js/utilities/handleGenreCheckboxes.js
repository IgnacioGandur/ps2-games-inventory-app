const checkboxes = document.querySelectorAll("[data-genre-checkbox]");
const addGameForm = document.querySelector("#add-game-form");

function validateCheckboxes() {
    const anyChecked = [...checkboxes].some((checkbox) => checkbox.checked);

    if (!anyChecked) {
        checkboxes[0].setCustomValidity(
            "Please select at least one genre for this game.",
        );
    } else {
        checkboxes[0].setCustomValidity("");
    }
}

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("input", validateCheckboxes);
});

addGameForm.addEventListener("submit", (e) => {
    validateCheckboxes();

    if (!addGameForm.checkValidity()) {
        e.preventDefault();
    }
});
