const gameCover = document.querySelector("[data-game-cover]");

gameCover.addEventListener("error", (e) => {
    e.target.src = "/images/ps2_games.jpg";
});
