document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar-menu");

  if (menuButton && sidebar) {
    // Toggle the "open" class on click
    menuButton.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Optional: If you want the menu toggle always visible, you can remove the conditional hide.
  // Otherwise, use the code below to show/hide on small screens.
  window.addEventListener("resize", () => {
    // Example: always show the button:
    if (menuButton) menuButton.style.display = "block";
    
    // If you want to hide on larger screens, uncomment the following:
    /*
    if (window.innerWidth < 768) {
      menuButton.style.display = "block";
    } else {
      menuButton.style.display = "none";
      if (sidebar) sidebar.classList.remove("open");
    }
    */
  });
});
