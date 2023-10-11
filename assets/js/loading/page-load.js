const mode = localStorage.getItem("mode");

if (mode) {
  document.body.classList.add("no-animate", mode)
}
