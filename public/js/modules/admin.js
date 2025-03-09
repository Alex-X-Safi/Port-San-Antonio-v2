export function initAdmin() {
  document.querySelector('a[href="#admin"]').addEventListener("click", function (e) {
    e.preventDefault();
    if (typeof netlifyIdentity === "undefined") {
      console.error("Netlify Identity is not defined. Please include the Netlify Identity widget script.");
      return;
    }
    const user = netlifyIdentity.currentUser();
    if (user && user.app_metadata.roles.includes("admin")) {
      window.location.href = "/admin";
    } else {
      netlifyIdentity.open("login");
      netlifyIdentity.on("login", user => {
        if (user.app_metadata.roles.includes("admin")) {
          window.location.href = "/admin";
        } else {
          alert(i18next.t("accessDenied"));
        }
      });
    }
  });

  const adminForm = document.getElementById("adminForm");
  if (adminForm) {
    adminForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const price = document.getElementById("price").value;
      const category = document.getElementById("category").value;
      const image = document.getElementById("image").value;
      const ingredients = document.getElementById("ingredients").value;
      const health = document.getElementById("health").value;
      const newItem = { name, price, category, image, ingredients, health };
      addItem(newItem);
      adminForm.reset();
    });
  }

  function addItem(item) {
    const container = document.querySelector(`.${item.category}`);
    const itemElement = document.createElement("div");
    itemElement.classList.add("menu-item");
    itemElement.setAttribute("data-name", item.name);
    itemElement.setAttribute("data-price", item.price);
    itemElement.setAttribute("data-image", item.image);
    itemElement.setAttribute("data-ingredients", item.ingredients);
    itemElement.setAttribute("data-health", item.health);
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <p><span data-i18n="${item.name.replace(/ /g, "")}">${item.name}</span> – <span>$${item.price}</span></p>
    `;
    container.appendChild(itemElement);
    // Re-apply long press events for the new item.
    itemElement.addEventListener("mousedown", function () {
      itemElement.classList.add("long-pressing");
      pressTimer = setTimeout(() => {
        openPopup(itemElement);
        itemElement.classList.remove("long-pressing");
      }, 1500);
    });
    itemElement.addEventListener("mouseup", function () {
      clearTimeout(pressTimer);
      itemElement.classList.remove("long-pressing");
    });
    itemElement.addEventListener("mouseleave", function () {
      clearTimeout(pressTimer);
      itemElement.classList.remove("long-pressing");
    });
    itemElement.addEventListener("touchend", function () {
      let currentTime = new Date().getTime();
      let tapLength = currentTime - lastTap;
      clearTimeout(pressTimer);
      itemElement.classList.remove("long-pressing");
      if (tapLength < 500 && tapLength > 0) {
        openPopup(itemElement);
      }
      lastTap = currentTime;
    });
  }
}
