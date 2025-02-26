document.addEventListener('DOMContentLoaded', () => {
    const updateUI = () => {
        const user = netlifyIdentity.currentUser();
        if (user) {
            const roles = user.app_metadata && user.app_metadata.roles ? user.app_metadata.roles : [];
            if (roles.includes('admin')) {
                initCMS();
            } else {
                showError('Access Denied: Admins only.');
                window.location.href = '/';
            }
        } else {
            netlifyIdentity.open();
        }
    };

    const initCMS = () => {
        CMS.init({
            config: {
                backend: {
                    name: 'git-gateway',
                    branch: 'main',
                    commit_messages: {
                        create: 'Create {{collection}} “{{slug}}”',
                        update: 'Update {{collection}} “{{slug}}”',
                        delete: 'Delete {{collection}} “{{slug}}”',
                        uploadMedia: 'Upload “{{path}}”',
                        deleteMedia: 'Delete “{{path}}”'
                    }
                },
                load_config_file: false,
                media_folder: 'public/images',
                public_folder: '/images',
                collections: [
                    {
                        name: 'menu',
                        label: 'Menu Items',
                        folder: 'data/menu',
                        create: true,
                        delete: true,
                        slug: '{{slug}}',
                        identifier_field: 'id',
                        fields: [
                            {
                                label: 'ID',
                                name: 'id',
                                widget: 'string',
                                pattern: ['^[a-z0-9-]+$', 'Lowercase letters, numbers, and dashes only']
                            },
                            {
                                label: 'Price',
                                name: 'price',
                                widget: 'number',
                                value_type: 'float',
                                min: 0,
                                step: 0.01
                            },
                            {
                                label: 'Image',
                                name: 'image',
                                widget: 'image',
                                allow_multiple: false,
                                choose_url: false
                            },
                            {
                                label: 'Category',
                                name: 'category',
                                widget: 'select',
                                options: [
                                    { label: 'Sandwiches', value: 'sandwiches' },
                                    { label: 'Salads', value: 'salads' },
                                    { label: 'Main Dishes', value: 'main-dishes' },
                                    { label: 'Drinks', value: 'drinks' },
                                    { label: 'Platters', value: 'platters' },
                                    { label: 'Alcoholic', value: 'alcoholic' }
                                ]
                            },
                            {
                                label: 'Translations',
                                name: 'translations',
                                widget: 'object',
                                fields: [
                                    {
                                        label: 'English',
                                        name: 'en',
                                        widget: 'object',
                                        fields: [
                                            { label: 'Name', name: 'name', widget: 'string' },
                                            { label: 'Ingredients', name: 'ingredients', widget: 'text' },
                                            { label: 'Health Info', name: 'health', widget: 'text' }
                                        ]
                                    },
                                    {
                                        label: 'Spanish',
                                        name: 'es',
                                        widget: 'object',
                                        fields: [
                                            { label: 'Name', name: 'name', widget: 'string' },
                                            { label: 'Ingredients', name: 'ingredients', widget: 'text' },
                                            { label: 'Health Info', name: 'health', widget: 'text' }
                                        ]
                                    },
                                    {
                                        label: 'Arabic',
                                        name: 'ar',
                                        widget: 'object',
                                        fields: [
                                            { label: 'Name', name: 'name', widget: 'string' },
                                            { label: 'Ingredients', name: 'ingredients', widget: 'text' },
                                            { label: 'Health Info', name: 'health', widget: 'text' }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    };

    netlifyIdentity.on('login', updateUI);
    netlifyIdentity.on('logout', () => window.location.href = '/');
    netlifyIdentity.init();
    updateUI();
});

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}
