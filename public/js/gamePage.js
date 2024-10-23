const deleteGameButton = document.querySelector("[data-delete-game-button]");
const deletionModal = document.querySelector("[data-deletion-modal]");
const hideDeletionModalButton = document.querySelector(
    "[data-hide-deletion-modal-button]",
);
const confirmDeletionButton = document.querySelector(
    "[confirm-deletion-button]",
);

const deleteForm = document.querySelector("[data-delete-form]");

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
