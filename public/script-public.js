document.addEventListener("DOMContentLoaded", function () {
  // ------------------------------
  // Netlify Identity Initialization
  const updateUI = () => {
    const user = netlifyIdentity.currentUser();
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
    } else {
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
    }
  };

  netlifyIdentity.on("login", updateUI);
  netlifyIdentity.on("logout", () => {
    localStorage.removeItem("user");
    updateUI();
  });
  netlifyIdentity.init();

  // ------------------------------
  // DOM Elements
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");
  const toggleButton = document.getElementById("darkModeToggle");
  const body = document.body;
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  const languageSwitcher = document.getElementById("languageSwitcher");
  const exploreBtn = document.querySelector(".explore-btn");
  const menuSection = document.getElementById("menu");

  let currentPopupItem = null;
  let pressTimer;
  let lastTap = 0;
  let touchStartX = null;

  if (!loginBtn || !logoutBtn || !toggleButton || !scrollToTopBtn || !languageSwitcher || !exploreBtn || !menuSection) {
    console.error("One or more DOM elements not found.");
    return;
  }

  // ------------------------------
  // Dark Mode
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
  }
  toggleButton.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
  });

  // ------------------------------
  // Menu Loading
  async function loadMenu() {
    try {
      const categories = ["sandwiches", "salads", "main-dishes", "drinks", "platters", "alcoholic"];
      for (const category of categories) {
        const response = await fetch(`/data/menu/${category}.json`);
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

  // ------------------------------
  // Popup Handling
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

  // Popup Navigation
  document.getElementById("popupPrev").addEventListener("click", () => navigatePopup(-1));
  document.getElementById("popupNext").addEventListener("click", () => navigatePopup(1));
  function navigatePopup(direction) {
    const items = Array.from(document.querySelectorAll(".menu-item"));
    if (!currentPopupItem) return;
    let currentIndex = items.indexOf(currentPopupItem);
    let newIndex = (currentIndex + direction + items.length) % items.length;
    openPopup(items[newIndex]);
  }

  // ------------------------------
  // Scroll Management
  window.addEventListener("scroll", () => {
    scrollToTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
  });
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ------------------------------
  // Language Management & i18next Initialization
  languageSwitcher.addEventListener("change", function () {
    const selectedLanguage = this.value;
    i18next.changeLanguage(selectedLanguage, function (err, t) {
      if (err) return console.error(err);
      updateContent();
    });
  });
  i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init(
      {
        lng: "en",
        fallbackLng: "en",
        debug: true,
        backend: { loadPath: "/data/translations/{{lng}}/translation.json" },
        detection: {
          order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag", "path", "subdomain"],
          caches: ["localStorage", "cookie"]
        }
      },
      function (err, t) {
        if (err) return console.error(err);
        updateContent();
      }
    );
  function updateContent() {
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      element.textContent = i18next.t(element.getAttribute("data-i18n"));
    });
  }

  // ------------------------------
  // Admin Access
  document.querySelector('a[href="#admin"]').addEventListener("click", function (e) {
    e.preventDefault();
    if (typeof netlifyIdentity === "undefined") {
      console.error("Netlify Identity is not defined. Please include the Netlify Identity widget script.");
      return;
    }
    const user = netlifyIdentity.currentUser();
    if (user && user.app_metadata.roles.includes("admin")) {
      window.location.href = "/admin";
    } else {
      netlifyIdentity.open("login");
      netlifyIdentity.on("login", user => {
        if (user.app_metadata.roles.includes("admin")) {
          window.location.href = "/admin";
        } else {
          alert(i18next.t("accessDenied"));
        }
      });
    }
  });

  // ------------------------------
  // Smooth scroll for navigation links
  document.querySelectorAll("nav ul li a").forEach(anchor => {
    anchor.addEventListener("click", function (event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Explore Button Scroll to Menu Section
  if (exploreBtn && menuSection) {
    exploreBtn.addEventListener("click", function (event) {
      event.preventDefault();
      menuSection.style.display = "block";
      menuSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ------------------------------
  // Individual Category Sorting Overlays (unchanged)
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
  document.addEventListener('DOMContentLoaded', function() {
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
});

  // ------------------------------
  // Universal Sorting Overlay (New Feature)
  // Create the overlay only if it doesn't already exist.
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
  // Global universal sort state
  let universalSortState = { type: null, order: "asc" };

  const universalSortBtn = document.querySelector(".universal-sort-btn");
  if (universalSortBtn) {
    universalSortBtn.addEventListener("click", function () {
      universalOverlay.classList.remove("hidden");
    });
  } else {
    console.error("Universal sort button not found.");
  }
  // Universal sort option click
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

  // ------------------------------
  // Filtering Functionality
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

  // ------------------------------
  // Popup and Long Press Handling for Dynamically Loaded Items
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("mousedown", function () {
      item.classList.add("long-pressing");
      pressTimer = setTimeout(() => {
        openPopup(item);
        item.classList.remove("long-pressing");
      }, 1500);
    });
    item.addEventListener("mouseup", function () {
      clearTimeout(pressTimer);
      item.classList.remove("long-pressing");
    });
    item.addEventListener("mouseleave", function () {
      clearTimeout(pressTimer);
      item.classList.remove("long-pressing");
    });
    item.addEventListener("touchend", function () {
      let currentTime = new Date().getTime();
      let tapLength = currentTime - lastTap;
      clearTimeout(pressTimer);
      item.classList.remove("long-pressing");
      if (tapLength < 500 && tapLength > 0) {
        openPopup(item);
      }
      lastTap = currentTime;
    });
  });

  // ------------------------------
  // Popup Close Functionality
  document.querySelector(".close-popup").addEventListener("click", function () {
    document.getElementById("foodPopup").classList.remove("show");
  });
  document.getElementById("foodPopup").addEventListener("click", function (e) {
    if (e.target === this) {
      this.classList.remove("show");
    }
  });

  // Popup Navigation via Swipe Gestures
  const foodPopupEl = document.getElementById("foodPopup");
  foodPopupEl.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].screenX;
  });
  foodPopupEl.addEventListener("touchend", function (e) {
    let touchEndX = e.changedTouches[0].screenX;
    if (touchStartX !== null) {
      let diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          navigatePopup(1);
        } else {
          navigatePopup(-1);
        }
      }
    }
    touchStartX = null;
  });

  // ------------------------------
  // Handle Form Submission in the Admin Dashboard
  const adminForm = document.getElementById("adminForm");
  if (adminForm) {
    adminForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const price = document.getElementById("price").value;
      const category = document.getElementById("category").value;
      const image = document.getElementById("image").value;
      const ingredients = document.getElementById("ingredients").value;
      const health = document.getElementById("health").value;
      const newItem = { name, price, category, image, ingredients, health };
      addItem(newItem);
      adminForm.reset();
    });
  }

  function addItem(item) {
    const container = document.querySelector(`.${item.category}`);
    const itemElement = document.createElement("div");
    itemElement.classList.add("menu-item");
    itemElement.setAttribute("data-name", item.name);
    itemElement.setAttribute("data-price", item.price);
    itemElement.setAttribute("data-image", item.image);
    itemElement.setAttribute("data-ingredients", item.ingredients);
    itemElement.setAttribute("data-health", item.health);
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <p><span data-i18n="${item.name.replace(/ /g, "")}">${item.name}</span> – <span>$${item.price}</span></p>
    `;
    container.appendChild(itemElement);
    // Re-apply long press events for the new item.
    itemElement.addEventListener("mousedown", function () {
      itemElement.classList.add("long-pressing");
      pressTimer = setTimeout(() => {
        openPopup(itemElement);
        itemElement.classList.remove("long-pressing");
      }, 1500);
    });
    itemElement.addEventListener("mouseup", function () {
      clearTimeout(pressTimer);
      itemElement.classList.remove("long-pressing");
    });
    itemElement.addEventListener("mouseleave", function () {
      clearTimeout(pressTimer);
      itemElement.classList.remove("long-pressing");
    });
    itemElement.addEventListener("touchend", function () {
      let currentTime = new Date().getTime();
      let tapLength = currentTime - lastTap;
      clearTimeout(pressTimer);
      itemElement.classList.remove("long-pressing");
      if (tapLength < 500 && tapLength > 0) {
        openPopup(itemElement);
      }
      lastTap = currentTime;
    });
  }

  // ------------------------------
  // Initial Load
  loadMenu();
});
document.getElementById('navToggle').addEventListener('click', function() {
  const header = document.querySelector('header');
  if (header.style.display === 'none' || getComputedStyle(header).display === 'none') {
    header.style.display = 'block';
    this.innerHTML = '&#x25B2;'; // Up arrow indicates you can hide nav
  } else {
    header.style.display = 'none';
    this.innerHTML = '&#x25BC;'; // Down arrow indicates nav is hidden, click to show
  }
});

