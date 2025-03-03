document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar-menu");

  if (menuButton && sidebar) {
    // Toggle sidebar on button click
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click from bubbling to document
      sidebar.classList.toggle("open");
    });

    // Close sidebar if click happens outside of it
    document.addEventListener("click", (e) => {
      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && e.target !== menuButton) {
        sidebar.classList.remove("open");
      }
    });
  }

  // Optional: If you want the #navToggle arrow to toggle the header visibility:
  const navToggle = document.getElementById("navToggle");
  const header = document.querySelector("header");
  if (navToggle && header) {
    navToggle.addEventListener("click", () => {
      header.classList.toggle("collapsed");
      // Add a CSS rule for header.collapsed if needed.
    });
  }
});
