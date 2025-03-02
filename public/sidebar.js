/* Fixing CTA and Testimonials buttons */
// Ensure buttons navigate correctly
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".cta-button").addEventListener("click", function () {
        window.location.href = "#cta-section";
    });
    document.querySelector(".testimonials-button").addEventListener("click", function () {
        window.location.href = "#testimonials-section";
    });
});

/* Adding Three-Striped Button */
const menuButton = document.createElement("button");
menuButton.classList.add("menu-toggle");
menuButton.innerHTML = "&#9776;"; // Three-striped icon

document.querySelector(".navbar").prepend(menuButton);

/* Sidebar Menu */
const sidebar = document.createElement("div");
sidebar.classList.add("sidebar-menu");
sidebar.innerHTML = `
    <ul>
        <li><a href="#">Reserve a Table</a></li>
        <li><a href="#">Share on Facebook</a></li>
        <li><a href="#">Share on Twitter</a></li>
        <li><a href="#">Facebook</a></li>
        <li><a href="#">Instagram</a></li>
    </ul>
`;
document.body.appendChild(sidebar);

menuButton.addEventListener("click", function () {
    sidebar.classList.toggle("open");
});

/* Ensuring Visibility */
window.addEventListener("resize", function () {
    if (window.innerWidth < 768) {
        menuButton.style.display = "block";
    } else {
        menuButton.style.display = "none";
    }
});
