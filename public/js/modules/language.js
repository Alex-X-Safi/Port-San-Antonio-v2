export function initLanguage() {
  const languageSwitcher = document.getElementById("languageSwitcher");

  if (languageSwitcher) {
    languageSwitcher.addEventListener("change", function () {
      const selectedLanguage = this.value;
      i18next.changeLanguage(selectedLanguage, function (err, t) {
        if (err) return console.error(err);
        updateContent();
      });
    });
  }
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
}
