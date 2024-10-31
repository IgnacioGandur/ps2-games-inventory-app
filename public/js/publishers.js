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
const allPublisherTags = document.querySelectorAll("[data-publisher-tag]");
const editPublisherModal = document.querySelector(
    "[data-edit-publisher-modal]",
);
const editPublisherForm = document.querySelector("[data-edit-publisher-form]");
const cancelPublisherEdit = document.querySelector(
    "[data-edit-publisher-button-cancel]",
);
const newPublisherValueInput = document.querySelector(
    "[data-new-publisher-value]",
);

function showEditModal() {
    editPublisherModal.classList.add("visible");
}

function hideEditModal() {
    editPublisherModal.classList.remove("visible");
}

function setEditTargetPublisher(id) {
    editPublisherForm.action = `/publishers/update/${id}`;
}

function setTargetPublisherName(publisherName) {
    newPublisherValueInput.value = publisherName;
}

allPublisherTags.forEach((tag) => {
    tag.addEventListener("click", showEditModal);
});

cancelPublisherEdit.addEventListener("click", (e) => {
    e.stopPropagation();
    hideEditModal();
});

function showDeleteModal() {
    deletionModal.classList.add("visible");
}

function hideDeletionModal() {
    deletionModal.classList.remove("visible");
}

function setTargetPublisher(publisherId) {
    deletePublisherForm.action = `/publishers/delete/${publisherId}`;
}

allDeletePublisherButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        showDeleteModal();
    });
});

cancelDeletionButton.addEventListener("click", hideDeletionModal);
