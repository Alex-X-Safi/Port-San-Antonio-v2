document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar-menu");

  if (menuButton && sidebar) {
    // Toggle the "open" class on click
    menuButton.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Always show the menu toggle button:
  window.addEventListener("resize", () => {
    if (menuButton) menuButton.style.display = "block";
  });
});
