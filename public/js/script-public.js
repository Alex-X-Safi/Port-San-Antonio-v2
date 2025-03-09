document.addEventListener("DOMContentLoaded", function () {
  import("./modules/netlifyIdentity.js").then(module => module.initNetlifyIdentity());
  import("./modules/domElements.js").then(module => module.initDOMElements());
  import("./modules/darkMode.js").then(module => module.initDarkMode());
  import("./modules/menu.js").then(module => module.loadMenu());
  import("./modules/popup.js").then(module => module.initPopup());
  import("./modules/scroll.js").then(module => module.initScroll());
  import("./modules/language.js").then(module => module.initLanguage());
  import("./modules/admin.js").then(module => module.initAdmin());
  import("./modules/navigation.js").then(module => module.initNavigation());
});
