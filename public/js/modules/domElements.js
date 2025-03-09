export function initDOMElements() {
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");
  const toggleButton = document.getElementById("darkModeToggle");
  const body = document.body;
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  const languageSwitcher = document.getElementById("languageSwitcher");
  const exploreBtn = document.querySelector(".explore-btn");
  const menuSection = document.getElementById("menu");

  if (!loginBtn || !logoutBtn || !toggleButton || !scrollToTopBtn || !languageSwitcher || !exploreBtn || !menuSection) {
    console.error("One or more DOM elements not found.");
    return;
  }
}
