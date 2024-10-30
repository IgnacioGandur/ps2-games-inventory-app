const allDeleteGenresButtons = document.querySelectorAll(
    "[data-delete-genre-button]",
);
const deleteGenreForm = document.querySelector("[data-delete-genre-form]");
const deletionModal = document.querySelector("[data-delete-genre-modal]");
const cancelDeletionButton = document.querySelector(
    "[data-delete-genre-button-cancel]",
);
const allGenreTags = document.querySelectorAll("[data-genre-tag]");
const editTagModal = document.querySelector("[data-edit-genre-modal]");
const editTagForm = document.querySelector("[data-edit-genre-form ]");
const cancelTagEdit = document.querySelector("[data-edit-genre-button-cancel]");
const newGenreValueInput = document.querySelector("[data-new-genre-value]");

allGenreTags.forEach((tag) => {
    tag.addEventListener("click", showEditModal);
});

// Functions to show/hide the edit modal.

function showEditModal() {
    editTagModal.classList.add("visible");
}

function hideEditModal() {
    editTagModal.classList.remove("visible");
}

cancelTagEdit.addEventListener("click", (e) => {
    e.stopPropagation();
    hideEditModal();
});

// Manage the target id to edit the correct genre.

function setEditTargetGenre(id) {
    editTagForm.action = `/genres/update/${id}`;
}

// Set the current genre name to be displayed when editing it.

function setTargetGenreName(genreName) {
    newGenreValueInput.value = genreName;
}

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
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        showDeleteModal();
    });
});

cancelDeletionButton.addEventListener("click", hideDeletionModal);
