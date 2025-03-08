document.addEventListener("DOMContentLoaded", () => {
    // Add meta tags
    let metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    metaDescription.content = "Abou Philippe Restaurant is a premier beach resort located at Port Antonio Building, Sea Road, Mastita, Jbeil, Lebanon – offering exquisite dining, breathtaking views, and top-notch services.";
    document.head.appendChild(metaDescription);

    let metaKeywords = document.createElement("meta");
    metaKeywords.name = "keywords";
    metaKeywords.content = "Abou Philippe, Port Antonio, beach resort, Jbeil, Mastita, Lebanon, restaurant, seafood, dining";
    document.head.appendChild(metaKeywords);

    // Add structured data (JSON-LD)
    let script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Restaurant",
        "name": "Abou Philippe Restaurant",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Port Antonio Building, Sea Road",
            "addressLocality": "Mastita, Jbeil",
            "addressRegion": "Mount Lebanon",
            "postalCode": "00961",
            "addressCountry": "LB"
        },
        "telephone": "+96109796226",
        "url": "http://www.abouphilippe.com",
        "servesCuisine": "Seafood, Mediterranean"
    });
    document.head.appendChild(script);
});
