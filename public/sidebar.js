document.addEventListener("DOMContentLoaded", () => {
  // Query the static menu toggle button and sidebar from your HTML.
  const menuButton = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar-menu");

  if (menuButton && sidebar) {
    // Toggle the "open" class on the sidebar when the menu button is clicked.
    menuButton.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Responsive behavior: show the menu button on small screens, hide it on larger screens.
  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      if (menuButton) menuButton.style.display = "block";
    } else {
      if (menuButton) menuButton.style.display = "none";
      // Optionally, close the sidebar when resizing to larger screens.
      if (sidebar) sidebar.classList.remove("open");
    }
  });
});
