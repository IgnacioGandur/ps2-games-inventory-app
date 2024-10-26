const allDeleteGenresButtons = document.querySelectorAll(
    "[data-delete-genre-button]",
);
const deleteGenreForm = document.querySelector("[data-delete-genre-form]");
const deletionModal = document.querySelector("[data-delete-genre-modal]");
const cancelDeletionButton = document.querySelector(
    "[data-delete-genre-button-cancel]",
);

// Create a variable to hold the target genre id.
let targetGenreId = undefined;

// Handle modal show/hide.
function showDeleteModal() {
    deletionModal.classList.add("visible");
}
function hideDeletionModal() {
    deletionModal.classList.remove("visible");
}

// Set the form's action url for the correct genre deletion.
function setTargetGenre(genreId) {
    targetGenreId = genreId;
    deleteGenreForm.action = `/genres/delete/${genreId}`;
}

// Add listeners to buttons and forms.
allDeleteGenresButtons.forEach((button) => {
    button.addEventListener("click", showDeleteModal);
});

cancelDeletionButton.addEventListener("click", hideDeletionModal);
