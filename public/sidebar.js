document.addEventListener("DOMContentLoaded", () => {
  // --- Navigation Sidebar Setup ---
  // Use the static elements in your HTML for the menu toggle and sidebar.
  const menuButton = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar-menu");

  if (menuButton && sidebar) {
    // Toggle the "open" class on the sidebar when the menu button is clicked.
    menuButton.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // --- Responsive Behavior ---
  // Show the menu button only on smaller screens.
  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      if (menuButton) menuButton.style.display = "block";
    } else {
      if (menuButton) menuButton.style.display = "none";
      // Also hide the sidebar when resizing to larger screens.
      if (sidebar) sidebar.classList.remove("open");
    }
  });

  // Trigger the initial resize logic so the menu button is hidden if the window is already large.
  if (window.innerWidth < 768) {
    if (menuButton) menuButton.style.display = "block";
  } else {
    if (menuButton) menuButton.style.display = "none";
  }
});
