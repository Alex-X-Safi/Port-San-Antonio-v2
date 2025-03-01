document.addEventListener("DOMContentLoaded", () => {
    // Improve "Order Now" buttons by adding the CTA class
    let orderButtons = document.querySelectorAll(".order-now");
    orderButtons.forEach(button => {
        button.classList.add("cta-button");
    });

    // Add a floating "Reserve a Table" button
    let floatingButton = document.createElement("div");
    floatingButton.classList.add("floating-button");
    floatingButton.innerText = "Reserve a Table";
    floatingButton.addEventListener("click", () => {
        // Update the link below to your actual reservation page URL
        window.location.href = "http://www.abouphilippe.com/reserve";
    });
    document.body.appendChild(floatingButton);
});