document.addEventListener("DOMContentLoaded", () => {
    // Add meta tags
    let metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    metaDescription.content = "Port San Antonio is a premier beach resort offering exquisite dining, breathtaking views, and top-notch services.";
    document.head.appendChild(metaDescription);

    let metaKeywords = document.createElement("meta");
    metaKeywords.name = "keywords";
    metaKeywords.content = "Port San Antonio, beach resort, dining, seafood, Mediterranean cuisine, fine dining";
    document.head.appendChild(metaKeywords);

    // Add structured data (JSON-LD)
    let script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Restaurant",
        "name": "Port San Antonio",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Sea Road",
            "addressLocality": "Mastita, Jbeil",
            "addressRegion": "Mount Lebanon",
            "postalCode": "00961",
            "addressCountry": "LB"
        },
        "telephone": "+96109796226",
        "url": "http://www.portsanantonio.com",
        "servesCuisine": "Seafood, Mediterranean"
    });
    document.head.appendChild(script);
});
