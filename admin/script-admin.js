document.addEventListener("DOMContentLoaded", () => {
  // Initialize Netlify Identity (which works with Git Gateway)
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        // If no user is logged in, open the login dialog
        window.netlifyIdentity.open();
      } else {
        // You can perform additional checks here if needed (e.g., for admin status)
        initCMS();
      }
    });
    // Trigger the initialization
    window.netlifyIdentity.init();
  } else {
    // If Netlify Identity is not available, just start the CMS (not recommended)
    initCMS();
  }

  function initCMS() {
    CMS.init({
      config: {
        backend: {
          name: "git-gateway",
          branch: "main"
        },
        media_folder: "public/images",
        public_folder: "/images",
        collections: [
          {
            name: "menu",
            label: "Menu Items",
            folder: "data/menu",
            create: true,
            slug: "{{slug}}",
            identifier_field: "id",
            fields: [
              { label: "ID", name: "id", widget: "string" },
              { label: "Price", name: "price", widget: "number" },
              { label: "Image", name: "image", widget: "image" },
              { label: "Category", name: "category", widget: "select", options: ["sandwiches", "salads", "main-dishes", "drinks", "platters", "alcoholic"] },
              {
                label: "Translations",
                name: "translations",
                widget: "object",
                fields: [
                  { label: "English", name: "en", widget: "object", fields: [
                      { label: "Name", name: "name", widget: "string" },
                      { label: "Ingredients", name: "ingredients", widget: "text" },
                      { label: "Health Info", name: "health", widget: "text" }
                    ]
                  },
                  { label: "Spanish", name: "es", widget: "object", fields: [
                      { label: "Name", name: "name", widget: "string" },
                      { label: "Ingredients", name: "ingredients", widget: "text" },
                      { label: "Health Info", name: "health", widget: "text" }
                    ]
                  },
                  { label: "Arabic", name: "ar", widget: "object", fields: [
                      { label: "Name", name: "name", widget: "string" },
                      { label: "Ingredients", name: "ingredients", widget: "text" },
                      { label: "Health Info", name: "health", widget: "text" }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    });
  }
});
