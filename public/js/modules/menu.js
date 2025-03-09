export async function loadMenu() {
  try {
    const categories = ["sandwiches", "salads", "main-dishes", "drinks", "platters", "alcoholic"];
    for (const category of categories) {
      const response = await fetch(`/data/menu/${category}.json`);
      if (!response.ok) throw new Error(`Failed to fetch ${category}`);
      const items = await response.json();
      renderCategory(category, items);
    }
  } catch (error) {
    console.error("Error loading menu:", error);
  }
}

function renderCategory(category, items) {
  const container = document.querySelector(`.${category}`);
  if (!container) {
    console.error(`Container for category ${category} not found.`);
    return;
  }
  container.innerHTML = items
    .map(item => {
      let imagePath = item.image.replace("Images/", "images/");
      return `
        <div class="menu-item" 
             data-id="${item.id}"
             data-name="${item.translations.en.name}"
             data-price="${item.price}"
             data-image="${imagePath}"
             data-category="${category}"
             data-ingredients="${item.translations.en.ingredients}">
          <img src="${imagePath}" alt="${item.id}">
          <p><span data-i18n="${item.id}">${item.translations.en.name}</span> – <span>$${item.price}</span></p>
        </div>
      `;
    })
    .join("");
  attachItemListeners(container);
}

function attachItemListeners(container) {
  container.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("mousedown", handleMouseDown);
    item.addEventListener("mouseup", handleMouseUp);
    item.addEventListener("mouseleave", handleMouseLeave);
    item.addEventListener("touchend", handleTouchEnd);
  });
}
