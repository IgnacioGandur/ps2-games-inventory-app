const allDeletePublisherButtons = document.querySelectorAll(
    "[data-delete-publisher-button]",
);
const deletePublisherForm = document.querySelector(
    "[data-delete-publisher-form]",
);

const deletionModal = document.querySelector("[data-delete-publisher-modal]");
const cancelDeletionButton = document.querySelector(
    "[data-delete-publisher-button-cancel]",
);

let targetPublisherId = undefined;

function showDeleteModal() {
    deletionModal.classList.add("visible");
}

function hideDeletionModal() {
    deletionModal.classList.remove("visible");
}

function setTargetPublisher(publisherId) {
    targetPublisherId = publisherId;
    deletePublisherForm.action = `/publishers/delete/${publisherId}`;
}

allDeletePublisherButtons.forEach((button) => {
    button.addEventListener("click", showDeleteModal);
});

cancelDeletionButton.addEventListener("click", hideDeletionModal);
