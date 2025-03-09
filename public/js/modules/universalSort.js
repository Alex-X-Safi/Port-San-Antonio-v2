export function initUniversalSort() {
  let universalOverlay = document.querySelector(".universal-sort-overlay");
  if (!universalOverlay) {
    universalOverlay = document.createElement("div");
    universalOverlay.className = "universal-sort-overlay hidden"; // hidden by default
    universalOverlay.innerHTML = `
      <div class="sort-menu">
        <h4>Sort All Categories</h4>
        <button class="universal-sort-option" data-sort="price">Sort by Price</button>
        <button class="universal-sort-option" data-sort="name">Sort Alphabetically</button>
        <button class="universal-sort-close">Close</button>
      </div>
    `;
    document.body.appendChild(universalOverlay);
  }

  let universalSortState = { type: null, order: "asc" };

  const universalSortBtn = document.querySelector(".universal-sort-btn");
  if (universalSortBtn) {
    universalSortBtn.addEventListener("click", function () {
      universalOverlay.classList.remove("hidden");
    });
  } else {
    console.error("Universal sort button not found.");
  }

  universalOverlay.querySelectorAll(".universal-sort-option").forEach(option => {
    option.addEventListener("click", function () {
      const sortType = this.getAttribute("data-sort");
      if (universalSortState.type === sortType) {
        universalSortState.order = universalSortState.order === "asc" ? "desc" : "asc";
      } else {
        universalSortState.type = sortType;
        universalSortState.order = "asc";
      }
      document.querySelectorAll(".menu-items").forEach(container => {
        const items = Array.from(container.children);
        items.sort((a, b) => {
          let valueA, valueB;
          if (sortType === "price") {
            valueA = parseFloat(a.getAttribute("data-price"));
            valueB = parseFloat(b.getAttribute("data-price"));
          } else {
            valueA = a.getAttribute("data-name").toLowerCase();
            valueB = b.getAttribute("data-name").toLowerCase();
          }
          if (valueA > valueB) return universalSortState.order === "asc" ? 1 : -1;
          if (valueA < valueB) return universalSortState.order === "asc" ? -1 : 1;
          return 0;
        });
        container.innerHTML = "";
        items.forEach(item => container.appendChild(item));
      });
      universalOverlay.classList.add("hidden");
    });
  });

  universalOverlay.querySelector(".universal-sort-close").addEventListener("click", function () {
    universalOverlay.classList.add("hidden");
  });
}
