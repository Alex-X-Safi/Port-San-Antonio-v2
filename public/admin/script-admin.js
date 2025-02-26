document.addEventListener("DOMContentLoaded", async () => {
    const updateUI = async () => {
        const user = netlifyIdentity.currentUser();
        if (user) {
            const roles = user.app_metadata && user.app_metadata.roles ? user.app_metadata.roles : [];
            if (roles.includes("admin")) {
                initCMS();
            } else {
                alert("Access Denied: Admins only.");
                window.location.href = "/";
            }
        } else {
            netlifyIdentity.open();
        }
    };

    const initCMS = () => {
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
                                    ]},
                                    { label: "Spanish", name: "es", widget: "object", fields: [
                                        { label: "Name", name: "name", widget: "string" },
                                        { label: "Ingredients", name: "ingredients", widget: "text" },
                                        { label: "Health Info", name: "health", widget: "text" }
                                    ]},
                                    { label: "Arabic", name: "ar", widget: "object", fields: [
                                        { label: "Name", name: "name", widget: "string" },
                                        { label: "Ingredients", name: "ingredients", widget: "text" },
                                        { label: "Health Info", name: "health", widget: "text" }
                                    ]}
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    };

    netlifyIdentity.on("login", updateUI);
    netlifyIdentity.on("logout", () => window.location.href = "/");
    netlifyIdentity.init();
    updateUI();
});
