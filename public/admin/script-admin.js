// script-admin.js

document.addEventListener("DOMContentLoaded", async () => {
    const auth0Client = await createAuth0Client({
        domain: "dev-0132r5n5b6i1ud7p.us.auth0.com",
        client_id: "B5av2t8rJs1Sor2vcVrOcXXxt5Be9zrI",
        audience: "https://dev-0132r5n5b6i1ud7p.us.auth0.com/api/v2/",
        scope: "openid profile email"
    });

    const updateUI = async () => {
        const isAuthenticated = await auth0Client.isAuthenticated();
        if (isAuthenticated) {
            const user = await auth0Client.getUser();
            if (user["https://yourapp.com/roles"].includes("admin")) {
                initCMS();
            } else {
                alert("Access Denied: Admins only.");
                window.location.href = "/";
            }
        } else {
            auth0Client.loginWithRedirect();
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

    updateUI();
});
