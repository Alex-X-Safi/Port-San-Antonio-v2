document.addEventListener('DOMContentLoaded', () => {
  // Initialize Auth0 Lock with your credentials
  const lock = new Auth0Lock(
    "B5av2t8rJs1Sor2vcVrOcXXxt5Be9zrI",
    "dev-0132r5n5b6i1ud7p.us.auth0.com",
    {
      auth: {
        redirectUrl: window.location.origin + "/admin/",
        responseType: "token id_token",
        audience: "https://dev-0132r5n5b6i1ud7p.us.auth0.com/api/v2/",
        scope: "openid profile email",
      },
      languageDictionary: {
        title: "Content Manager",
      },
      theme: {
        logo: "images/logo.png",
        primaryColor: "#31324F",
      },
    }
  );

  // Function to initialize Netlify CMS
  function initializeCMS() {
    CMS.init({
      config: {
        backend: {
          name: "git-gateway",
          branch: "main",
          commit_messages: {
            create: "Create {{collection}} “{{slug}}”",
            update: "Update {{collection}} “{{slug}}”",
            delete: "Delete {{collection}} “{{slug}}”",
            uploadMedia: "Upload “{{path}}”",
            deleteMedia: "Delete “{{path}}”",
          },
        },
        load_config_file: false,
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
              { label: "Price", name: "price", widget: "number", value_type: "float", min: 0, step: 0.01 },
              { label: "Image", name: "image", widget: "image", allow_multiple: false, choose_url: false },
              {
                label: "Category",
                name: "category",
                widget: "select",
                options: [
                  { label: "Sandwiches", value: "sandwiches" },
                  { label: "Salads", value: "salads" },
                  { label: "Main Dishes", value: "main-dishes" },
                  { label: "Drinks", value: "drinks" },
                  { label: "Platters", value: "platters" },
                  { label: "Alcoholic", value: "alcoholic" },
                ],
              },
              {
                label: "Translations",
                name: "translations",
                widget: "object",
                fields: [
                  {
                    label: "English",
                    name: "en",
                    widget: "object",
                    fields: [
                      { label: "Name", name: "name", widget: "string" },
                      { label: "Ingredients", name: "ingredients", widget: "text" },
                      { label: "Health Info", name: "health", widget: "text" },
                    ],
                  },
                  {
                    label: "Spanish",
                    name: "es",
                    widget: "object",
                    fields: [
                      { label: "Name", name: "name", widget: "string" },
                      { label: "Ingredients", name: "ingredients", widget: "text" },
                      { label: "Health Info", name: "health", widget: "text" },
                    ],
                  },
                  {
                    label: "Arabic",
                    name: "ar",
                    widget: "object",
                    fields: [
                      { label: "Name", name: "name", widget: "string" },
                      { label: "Ingredients", name: "ingredients", widget: "text" },
                      { label: "Health Info", name: "health", widget: "text" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  }

  // Function to check if user is authenticated
  function isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return expiresAt && new Date().getTime() < expiresAt;
  }

  if (!isAuthenticated()) {
    lock.show();
  } else {
    initializeCMS();
  }

  lock.on("authenticated", function (authResult) {
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime()));

    lock.getUserInfo(authResult.accessToken, function (error, profile) {
      if (error) {
        console.error("Error fetching user info:", error);
        return;
      }
      localStorage.setItem("profile", JSON.stringify(profile));
      initializeCMS();
    });
  });
});
