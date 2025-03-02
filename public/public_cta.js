document.addEventListener("DOMContentLoaded", () => {
  // --- CTA Buttons ---
  // Find all elements with the "order-now" class, add "cta-button", and attach a click event.
  const orderButtons = document.querySelectorAll(".order-now");
  orderButtons.forEach(button => {
    button.classList.add("cta-button");
    button.addEventListener("click", () => {
      // Navigate to the CTA section in your HTML (make sure it has id="cta").
      window.location.href = "#cta";
    });
  });

  // --- Floating "Reserve a Table" Button ---
  // Create and add the floating button if it doesn't already exist.
  if (!document.querySelector(".floating-button")) {
    const floatingButton = document.createElement("div");
    floatingButton.classList.add("floating-button");
    floatingButton.innerText = "Reserve a Table";
    floatingButton.addEventListener("click", () => {
      // Update the URL below to your actual reservation page.
      window.location.href = "http://www.abouphilippe.com/reserve";
    });
    document.body.appendChild(floatingButton);
  }
});
