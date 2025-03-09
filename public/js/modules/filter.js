export function initFilter() {
  const filterSelect = document.getElementById("filter");
  if (filterSelect) {
    filterSelect.addEventListener("change", function () {
      const filterValue = this.value;
      document.querySelectorAll(".menu-item").forEach(item => {
        if (filterValue === "all") {
          item.style.display = "flex";
        } else {
          if (item.dataset.ingredients.toLowerCase().includes(filterValue.toLowerCase())) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
        }
      });
    });
  } else {
    console.error("Filter select element not found.");
  }
}
