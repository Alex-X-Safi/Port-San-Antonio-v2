export function initScroll() {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  window.addEventListener("scroll", () => {
    if (scrollToTopBtn) {
      scrollToTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
    }
  });
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}
