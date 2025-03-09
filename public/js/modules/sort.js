export function initSort() {
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", function () {
      let overlay = this.closest(".menu-category").querySelector(".sort-overlay");
      if (overlay) {
        overlay.classList.remove("hidden");
      }
    });
  });
  document.querySelectorAll(".close-sort").forEach(button => {
    button.addEventListener("click", function () {
      let overlay = this.closest(".sort-overlay");
      if (overlay) {
        overlay.classList.add("hidden");
      }
    });
  });
  document.querySelectorAll(".sort-btn").forEach(button => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      const sortType = this.getAttribute("data-sort");
      const container = document.querySelector(`.${category}`);
      const items = Array.from(container.children);
      let currentOrder = this.getAttribute("data-order") || "asc";
      currentOrder = currentOrder === "asc" ? "desc" : "asc";
      this.setAttribute("data-order", currentOrder);
      items.sort((a, b) => {
        let valueA, valueB;
        if (sortType === "price") {
          valueA = parseFloat(a.getAttribute("data-price"));
          valueB = parseFloat(b.getAttribute("data-price"));
        } else {
          valueA = a.getAttribute("data-name").toLowerCase();
          valueB = b.getAttribute("data-name").toLowerCase();
        }
        if (valueA > valueB) return currentOrder === "asc" ? 1 : -1;
        if (valueA < valueB) return currentOrder === "asc" ? -1 : 1;
        return 0;
      });
      container.innerHTML = "";
      items.forEach(item => container.appendChild(item));
      let overlay = container.closest(".menu-category").querySelector(".sort-overlay");
      if (overlay) {
        overlay.classList.add("hidden");
      }
    });
  });
}
