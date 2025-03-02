document.addEventListener("DOMContentLoaded", () => {
  // --- Testimonials Button ---
  // Only attach an event if an element with class "testimonials-button" exists.
  const testimonialsButton = document.querySelector(".testimonials-button");
  if (testimonialsButton) {
    testimonialsButton.addEventListener("click", () => {
      // Navigate to the testimonials section (make sure it has id="testimonials").
      window.location.href = "#testimonials";
    });
  }
});
