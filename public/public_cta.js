document.addEventListener("DOMContentLoaded", () => {
  // --- CTA Buttons ---
  // Find all elements with the "order-now" class, add the "cta-button" class and attach a click event.
  const orderButtons = document.querySelectorAll(".order-now");
  orderButtons.forEach(button => {
    button.classList.add("cta-button");
    button.addEventListener("click", () => {
      // Navigate to the CTA section (ensure the section's id is "cta")
      window.location.href = "#cta";
    });
  });

  // --- Testimonials Button ---
  // If you have a dedicated testimonials button (with the class "testimonials-button"), attach an event.
  const testimonialsButton = document.querySelector(".testimonials-button");
  if (testimonialsButton) {
    testimonialsButton.addEventListener("click", () => {
      // Navigate to the Testimonials section (ensure the section's id is "testimonials")
      window.location.href = "#testimonials";
    });
  }

  // --- Floating "Reserve a Table" Button ---
  // Create and add a floating button if it doesn't already exist.
  if (!document.querySelector(".floating-button")) {
    const floatingButton = document.createElement("div");
    floatingButton.classList.add("floating-button");
    floatingButton.innerText = "Reserve a Table";
    floatingButton.addEventListener("click", () => {
      // Update this URL to your actual reservation page.
      window.location.href = "http://www.abouphilippe.com/reserve";
    });
    document.body.appendChild(floatingButton);
  }
});
