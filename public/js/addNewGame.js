const gameReleaseDateCalendar = document.querySelector("#release_date");
flatpickr(gameReleaseDateCalendar, {
    allowInput: true,
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
});
