const deleteGameButton = document.querySelector("[data-delete-game-button]");
const deletionModal = document.querySelector("[data-deletion-modal]");
const hideDeletionModalButton = document.querySelector(
    "[data-hide-deletion-modal-button]",
);
const confirmDeletionButton = document.querySelector(
    "[confirm-deletion-button]",
);
const deleteForm = document.querySelector("[data-delete-form]");
const editGameModal = document.querySelector("[data-edit-game-details-modal]");
const showEditModalButton = document.querySelector("[data-show-edit-modal]");
const hideEditModalButton = document.querySelector("[data-hide-edit-modal]");
const originalReleaseDate = document.querySelector(
    "[data-original-release-date]",
);

function showEditModal() {
    editGameModal.classList.add("visible");
}

showEditModalButton.addEventListener("click", showEditModal);

function hideEditModal() {
    editGameModal.classList.remove("visible");
}

hideEditModalButton.addEventListener("click", hideEditModal);

function showDeletionModal() {
    deletionModal.classList.add("visible");
}

deleteGameButton.addEventListener("click", (e) => {
    showDeletionModal();
});

hideDeletionModalButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    deletionModal.classList.remove("visible");
});

flatpickr("#updatedGameReleaseDate", {
    allowInput: true,
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    defaultDate: new Date(`${originalReleaseDate.dataset.originalReleaseDate}`),
});
