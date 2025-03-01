document.addEventListener("DOMContentLoaded", () => {
    // Create share buttons container
    let shareButtons = document.createElement("div");
    shareButtons.classList.add("share-buttons");

    // Facebook Share Button
    let facebookButton = document.createElement("a");
    facebookButton.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href);
    facebookButton.innerText = "Share on Facebook";
    shareButtons.appendChild(facebookButton);

    // Twitter Share Button
    let twitterButton = document.createElement("a");
    twitterButton.href = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(window.location.href);
    twitterButton.innerText = "Share on Twitter";
    shareButtons.appendChild(twitterButton);

    // Instagram Feed (requires a valid access token)
    let instagramFeed = document.createElement("div");
    instagramFeed.id = "instagram-feed";
    shareButtons.appendChild(instagramFeed);

    document.body.appendChild(shareButtons);

    // Fetch and embed Instagram feed (replace 'YOUR_ACCESS_TOKEN' with a valid token)
    fetch("https://api.instagram.com/v1/users/self/media/recent/?access_token=YOUR_ACCESS_TOKEN")
        .then(response => response.json())
        .then(data => {
            let feed = document.getElementById("instagram-feed");
            data.data.forEach(post => {
                let img = document.createElement("img");
                img.src = post.images.thumbnail.url;
                img.alt = "Instagram post image";
                feed.appendChild(img);
            });
        })
        .catch(error => console.error("Error fetching Instagram feed:", error));

    // Optionally, add direct social media links
    let socialLinks = document.createElement("div");
    socialLinks.classList.add("social-links");
    socialLinks.innerHTML = `
        <a href="https://www.facebook.com/portantoniolb" target="_blank">Facebook</a>
        <a href="https://www.instagram.com/abouphilippe_portantonio" target="_blank">Instagram</a>
    `;
    document.body.appendChild(socialLinks);
});