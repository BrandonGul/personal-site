const mode       = localStorage.getItem("mode");
const homeButton = document.getElementById("home-button");

if (mode) {
  document.body.classList.add("no-animate", mode)
}

if (homeButton) {
  homeButton.addEventListener("click", () => {
    history.back();
  });
}
