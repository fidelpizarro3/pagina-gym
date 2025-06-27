// ==================== NAVBAR DINÁMICO SEGÚN SESIÓN ====================
window.addEventListener("DOMContentLoaded", () => {
  const usuarioLogueado = localStorage.getItem("usuarioActual"); // Verifica si hay usuario logueado
  const nav = document.querySelector(".nav"); // Selecciona el navbar

  if (nav && usuarioLogueado) {
    // Elimina el enlace "Iniciar sesión" si el usuario está logueado
    const loginLi = Array.from(nav.children).find(
      li => li.querySelector('a') && li.querySelector('a').getAttribute('href') === 'login.html'
    );
    if (loginLi) nav.removeChild(loginLi);

    // Agrega el enlace "Menú" si no existe y el usuario está logueado
    if (!Array.from(nav.children).some(li => li.textContent.includes("Menú"))) {
      const menuItem = document.createElement("li");
      const menuLink = document.createElement("a");
      menuLink.href = "menu.html";
      menuLink.textContent = "Menú";
      menuItem.appendChild(menuLink);
      nav.appendChild(menuItem);
    }

    // Agrega el botón "Cerrar sesión" si no existe y si detecta que el usuario está logueado
    if (!Array.from(nav.children).some(li => li.classList.contains("cerrar-sesion"))) {
      const logoutItem = document.createElement("li");
      logoutItem.classList.add("cerrar-sesion");
      const logoutBtn = document.createElement("button");
      logoutBtn.textContent = "Cerrar sesión";
      logoutBtn.className = "btn-cerrar-sesion";
      // Al hacer click, elimina la sesión y redirige al inicio
      logoutBtn.onclick = () => {
        localStorage.removeItem("usuarioActual");
        window.location.href = "index.html";
      };
      logoutItem.appendChild(logoutBtn);
      nav.appendChild(logoutItem);
    }
  }
});

