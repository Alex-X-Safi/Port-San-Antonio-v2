export function initNavigation() {
  document.querySelectorAll("nav ul li a").forEach(anchor => {
    anchor.addEventListener("click", function (event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const exploreBtn = document.querySelector(".explore-btn");
  const menuSection = document.getElementById("menu");

  if (exploreBtn && menuSection) {
    exploreBtn.addEventListener("click", function (event) {
      event.preventDefault();
      menuSection.style.display = "block";
      menuSection.scrollIntoView({ behavior: "smooth" });
    });
  }
}
