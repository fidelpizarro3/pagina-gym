// ==================== REGISTRO DE USUARIO ====================
// Escucha el evento submit del formulario de registro
document.getElementById("formRegistro").addEventListener("submit", function(e) {
  e.preventDefault(); // Evita que el formulario recargue la página 
  const email = document.getElementById("registroEmail").value;
  const pass = document.getElementById("registroPassword").value;

  // Obtiene los usuarios registrados del localStorage o un array vacío si no hay ninguno
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  // Verifica si el email ya está registrado
  const existe = usuarios.find(u => u.email === email);

  if (existe) {
    alert("El usuario ya existe.");
    return;
  }

  // Crea el nuevo usuario con créditos y sin turnos
  const nuevoUsuario = { email: email, password: pass, turnos: [], creditos: 16 };
  usuarios.push(nuevoUsuario); // Lo agrega al array de usuarios
  localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Guarda el array actualizado

  // Login automático: guarda el usuario recién creado como usuarioActual
  const usuarioGuardado = usuarios[usuarios.length - 1]; //esto agarra el último usuario agregado
  localStorage.setItem("usuarioActual", JSON.stringify(usuarioGuardado)); // Guarda el usuario actual en localStorag
  window.location.href = "turnos.html"; // Redirige a la página de turnos
});

// ==================== LOGIN DE USUARIO ====================
// Escucha el evento submit del formulario de login
document.getElementById("formLogin").addEventListener("submit", function(e) {
  e.preventDefault(); // Evita que el formulario recargue la página
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  // Obtiene los usuarios registrados del localStorage
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  // Busca el usuario con el email y contraseña ingresados
  const user = usuarios.find(u => u.email === email && u.password === pass);

  const mensajeLogin = document.getElementById("mensajeLogin");
  if (user) {
    // Si existe, lo guarda como usuarioActual y redirige al menú principal
    localStorage.setItem("usuarioActual", JSON.stringify(user));
    window.location.href = "menu.html";
  } else {
    // Si no existe, muestra mensaje de error
    if (mensajeLogin) {
      mensajeLogin.textContent = "Email o contraseña incorrectos.";
    } else {
      alert("Email o contraseña incorrectos.");
    }
  }
});