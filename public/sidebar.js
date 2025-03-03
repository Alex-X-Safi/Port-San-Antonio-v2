document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar-menu");

  if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
      // Toggle the open class to slide the sidebar in/out
      sidebar.classList.toggle("open");
    });
  }

  // If you ONLY want the button to appear on mobile, use:
  /*
  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      menuButton.style.display = "block";
    } else {
      menuButton.style.display = "none";
      sidebar.classList.remove("open");
    }
  });
  */
});
