document.addEventListener("DOMContentLoaded", async function () {
  // Auth0 Configuration
  const auth0Client = await createAuth0Client({
    domain: "dev-0132r5n5b6i1ud7p.us.auth0.com",
    client_id: "B5av2t8rJs1Sor2vcVrOcXXxt5Be9zrI",
    redirect_uri: window.location.origin,
    audience: "https://dev-0132r5n5b6i1ud7p.us.auth0.com/api/v2/",
    scope: "openid profile email"
  });

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
      await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  await handleAuthCallback();

  // Check Authentication Status
  async function updateUI() {
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
      const user = await auth0Client.getUser();
      localStorage.setItem("user", JSON.stringify(user));
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
    } else {
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
    }
  }

  updateUI();

  // Login & Logout Event Listeners
  loginBtn.addEventListener("click", () => {
    auth0Client.loginWithRedirect();
  });

  logoutBtn.addEventListener("click", () => {
    auth0Client.logout({ returnTo: window.location.origin });
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

  // Scroll Management
  window.addEventListener("scroll", () => {
    scrollToTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Language Switcher
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
          loadPath: "/data/translations/{{lng}}/translation.json",
        },
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

  // Initial Load
  loadMenu();
});
