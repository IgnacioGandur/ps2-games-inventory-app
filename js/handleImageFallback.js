const allImages = document.querySelectorAll("img");

console.log("handle fallback image");

allImages.forEach((img) => {
    img.addEventListener("error", (e) => {
        e.target.src = "/images/ps2_games.jpg";
        e.onerror = null;
    });
});
