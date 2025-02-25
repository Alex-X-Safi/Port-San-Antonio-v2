document.addEventListener("DOMContentLoaded", function () {
  // Auth0 Configuration
  const auth0 = new auth0.WebAuth({
   domain: 'dev-0132r5n5b6i1ud7p.us.auth0.com',
   clientID: 'B5av2t8rJs1Sor2vcVrOcXXxt5Be9zrI',
   redirectUri: window.location.origin,
   audience: 'https://dev-0132r5n5b6i1ud7p.us.auth0.com/api/v2/',
   responseType: 'token id_token',
   scope: 'openid profile email'
  });

  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");

  loginBtn.addEventListener("click", () => {
    auth0.authorize();
  });

  logoutBtn.addEventListener("click", () => {
    auth0.logout({
      returnTo: window.location.origin
    });
  });

  auth0.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime()));
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
    } else if (err) {
      console.error(err);
    }
  });

  const isAuthenticated = () => {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  };

  if (isAuthenticated()) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
  }

  // DOM Elements
  const toggleButton = document.getElementById("darkModeToggle");
  const body = document.body;
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  const languageSwitcher = document.getElementById("languageSwitcher");
  let currentPopupItem = null;
  let pressTimer;
  let lastTap = 0;
  let touchStartX = null;

  // Dark Mode
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
  }
  toggleButton.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
  });

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

  function handleMouseDown(e) {
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

  function handleTouchEnd(e) {
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

  // Scroll Management
  window.addEventListener("scroll", () => {
    scrollToTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
  });
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Language Management and i18next Initialization
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
        backend: {
          loadPath: "/data/translations/{{lng}}/translation.json"
        },
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

  // Smooth scroll for navigation links - only for in-page anchors (those starting with "#")
  document.querySelectorAll("nav ul li a").forEach(anchor => {
    anchor.addEventListener("click", function (event) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        event.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // Explore Button Scroll to Menu Section
  const exploreBtn = document.querySelector(".explore-btn");
  const menuSection = document.getElementById("menu");
  if (exploreBtn && menuSection) {
    exploreBtn.addEventListener("click", function (event) {
      event.preventDefault();
      menuSection.style.display = "block";
      menuSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Sorting Overlay Toggle (Filter Button)
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", function () {
      let overlay = this.closest(".menu-category").querySelector(".sort-overlay");
      console.log("Filter button clicked. Overlay:", overlay);
      if (overlay) {
        overlay.classList.remove("hidden");
      }
    });
  });

  // Close Sort Overlay
  document.querySelectorAll(".close-sort").forEach(button => {
    button.addEventListener("click", function () {
      let overlay = this.closest(".sort-overlay");
      if (overlay) {
        overlay.classList.add("hidden");
      }
    });
  });

  // Sorting Functionality for Sort Buttons
  let currentSort = { type: null, order: "asc" };
  document.querySelectorAll(".sort-btn").forEach(button => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      const sortType = this.getAttribute("data-sort");
      const container = document.querySelector(`.${category}`);
      const items = Array.from(container.children);
      if (currentSort.type === sortType) {
        currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
      } else {
        currentSort.type = sortType;
        currentSort.order = "asc";
      }
      items.sort((a, b) => {
        let valueA, valueB;
        if (sortType === "price") {
          valueA = parseFloat(a.getAttribute("data-price"));
          valueB = parseFloat(b.getAttribute("data-price"));
        } else {
          valueA = a.getAttribute("data-name").toLowerCase();
          valueB = b.getAttribute("data-name").toLowerCase();
        }
        if (valueA > valueB) return currentSort.order === "asc" ? 1 : -1;
        if (valueA < valueB) return currentSort.order === "asc" ? -1 : 1;
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

  // Filtering Functionality
  const filterSelect = document.getElementById("filter");
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

  // Popup and Long Press Handling on Menu Items
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("mousedown", function (e) {
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
    item.addEventListener("touchend", function (e) {
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

  // Initial Load
  loadMenu();
});