document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar-menu");

  if (menuButton && sidebar) {
    // Toggle on button click
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent the "outside" click from immediately closing
      sidebar.classList.toggle("open");
    });

    // Close sidebar if user clicks outside of it
    document.addEventListener("click", (e) => {
      // If the sidebar is open AND the click is outside both the sidebar & button, close it
      if (
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        e.target !== menuButton
      ) {
        sidebar.classList.remove("open");
      }
    });
  }

  // If you want the #navToggle arrow to do something, e.g., hide the entire <header>
  const navToggle = document.getElementById("navToggle");
  const header = document.querySelector("header");
  if (navToggle && header) {
    navToggle.addEventListener("click", () => {
      header.classList.toggle("collapsed");
      // Example: hide the nav entirely
      // If you do this, add a CSS rule:
      // header.collapsed nav { display: none; }
    });
  }
});
