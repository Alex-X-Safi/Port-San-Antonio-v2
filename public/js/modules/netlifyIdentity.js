export function initNetlifyIdentity() {
  const updateUI = () => {
    const user = netlifyIdentity.currentUser();
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
    } else {
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
    }
  };

  netlifyIdentity.on("login", updateUI);
  netlifyIdentity.on("logout", () => {
    localStorage.removeItem("user");
    updateUI();
  });
  netlifyIdentity.init();
}
