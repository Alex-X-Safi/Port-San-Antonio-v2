export function initDarkMode() {
  const body = document.body;
  const toggleButton = document.getElementById("darkModeToggle");

  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
  }
  toggleButton.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
  });
}
