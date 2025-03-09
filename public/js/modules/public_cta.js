document.addEventListener("DOMContentLoaded", () => {
  // --- CTA Buttons ---
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
