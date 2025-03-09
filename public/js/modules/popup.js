export function initPopup() {
  document.getElementById("popupPrev").addEventListener("click", () => navigatePopup(-1));
  document.getElementById("popupNext").addEventListener("click", () => navigatePopup(1));
}

function openPopup(item) {
  const itemId = item.dataset.id;
  const category = item.dataset.category;
  const currentLang = i18next.language;
  fetch(`/data/menu/${category}.json`)
    .then(res => res.json())
    .then(items => {
      const itemData = items.find(i => i.id === itemId);
      const translations = itemData.translations[currentLang] || itemData.translations.en;
      document.getElementById("popupName").textContent = translations.name;
      document.getElementById("popupPrice").textContent = `$${itemData.price}`;
      document.getElementById("popupIngredients").textContent = translations.ingredients;
      document.getElementById("popupHealth").textContent = translations.health;
      document.getElementById("popupImage").src = itemData.image.replace("Images/", "images/");
      document.getElementById("foodPopup").classList.add("show");
      currentPopupItem = item;
    });
}

function handleMouseDown() {
  this.classList.add("long-pressing");
  pressTimer = setTimeout(() => {
    openPopup(this);
    this.classList.remove("long-pressing");
  }, 1500);
}

function handleMouseUp() {
  clearTimeout(pressTimer);
  this.classList.remove("long-pressing");
}

function handleMouseLeave() {
  clearTimeout(pressTimer);
  this.classList.remove("long-pressing");
}

function handleTouchEnd() {
  let currentTime = new Date().getTime();
  let tapLength = currentTime - lastTap;
  clearTimeout(pressTimer);
  this.classList.remove("long-pressing");
  if (tapLength < 500 && tapLength > 0) {
    openPopup(this);
  }
  lastTap = currentTime;
}

function navigatePopup(direction) {
  const items = Array.from(document.querySelectorAll(".menu-item"));
  if (!currentPopupItem) return;
  let currentIndex = items.indexOf(currentPopupItem);
  let newIndex = (currentIndex + direction + items.length) % items.length;
  if (items[newIndex]) {
    openPopup(items[newIndex]);
  }
}
