document.addEventListener("DOMContentLoaded", async function () {
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

  // DOM Elements
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  const languageSwitcher = document.getElementById("languageSwitcher");

  let currentPopupItem = null;
  let pressTimer;
  let lastTap = 0;
  let touchStartX = null;

  // Handle Authentication Redirect
  async function handleAuthCallback() {
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      await netlifyIdentity.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  await handleAuthCallback();

  // Check Authentication Status
  updateUI();

  // Login & Logout Event Listeners
  loginBtn.addEventListener("click", () => {
    netlifyIdentity.open();
  });

  logoutBtn.addEventListener("click", () => {
    netlifyIdentity.logout();
  });

  // Dark Mode
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
  }

  darkModeToggle.addEventListener("click", function () {
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
            <img src="${imagePath}" alt="${item.translations.en.name}">
            <div class="menu-item-details">
              <h3>${item.translations.en.name}</h3>
              <p>${item.translations.en.ingredients}</p>
              <span>${item.price}</span>
            </div>
          </div>
        `;
      })
      .join("");
  }

  await loadMenu();

  // Scroll to Top
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Language Switcher
  languageSwitcher.addEventListener("change", function () {
    const selectedLanguage = this.value;
    i18next.changeLanguage(selectedLanguage, () => {
      updateContent();
    });
  });

  function updateContent() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = i18next.t(element.getAttribute("data-i18n"));
    });
  }

  i18next.init({
    lng: "en",
    debug: true,
    resources: {
      en: {
        translation: {
          // Add your English translations here
        },
      },
      es: {
        translation: {
          // Add your Spanish translations here
        },
      },
      ar: {
        translation: {
          // Add your Arabic translations here
        },
      },
    },
  }, () => {
    updateContent();
  });

  // Popup Handling
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (currentPopupItem) {
        currentPopupItem.classList.remove("active");
      }
      currentPopupItem = item;
      item.classList.add("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (currentPopupItem && !currentPopupItem.contains(e.target)) {
      currentPopupItem.classList.remove("active");
      currentPopupItem = null;
    }
  });
});