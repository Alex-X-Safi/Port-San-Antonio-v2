document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar-menu");

  if (menuButton && sidebar) {
    // Open sidebar on button click if not already open.
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click from bubbling to document
      if (!sidebar.classList.contains("open")) {
        sidebar.classList.add("open");
      }
    });

    // Close sidebar if click happens outside of it.
    document.addEventListener("click", (e) => {
      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && e.target !== menuButton) {
        sidebar.classList.remove("open");
      }
    });
  }
});
