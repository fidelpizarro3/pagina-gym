// ==================== INICIALIZACIÓN DE DATOS ====================
// Obtiene el usuario activo y los usuarios registrados
let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActual"));
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// Inicializa la disponibilidad de turnos si no existe en localStorage
document.addEventListener('DOMContentLoaded', () => {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabados'];
  const horarios = {
    'Lunes': ['08:00 - 09:00', '10:00 - 11:00', '12:00 - 13:00', '18:00 - 19:00', '20:00 - 21:00', '22:00 - 23:00'],
    'Martes': ['08:00 - 09:00', '10:00 - 11:00', '12:00 - 13:00', '18:00 - 19:00', '20:00 - 21:00', '22:00 - 23:00'],
    'Miércoles': ['08:00 - 09:00', '10:00 - 11:00', '12:00 - 13:00', '18:00 - 19:00', '20:00 - 21:00', '22:00 - 23:00'],
    'Jueves': ['08:00 - 09:00', '10:00 - 11:00', '12:00 - 13:00', '18:00 - 19:00', '20:00 - 21:00', '22:00 - 23:00'],
    'Viernes': ['08:00 - 09:00', '10:00 - 11:00', '12:00 - 13:00', '18:00 - 19:00', '20:00 - 21:00', '22:00 - 23:00'],
    'Sabados': ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00']
  };

  // Si no existe disponibilidad, la crea con 18 lugares por turno
  if (!localStorage.getItem('disponibilidad')) {
    const disponibilidad = {};
    dias.forEach(dia => {
      disponibilidad[dia] = {};
      horarios[dia].forEach(hora => {
        disponibilidad[dia][hora] = 18;
      });
    });
    localStorage.setItem('disponibilidad', JSON.stringify(disponibilidad));
  }

  mostrarDisponibilidad(); // Muestra los turnos disponibles en pantalla
});

// ==================== MOSTRAR DISPONIBILIDAD DE TURNOS ====================
//esta función recorre la disponibilidad de turnos y los muestra en la página
// al hacer click en un turno, intenta reservarlo 
function mostrarDisponibilidad() {
  const disponibilidad = JSON.parse(localStorage.getItem('disponibilidad'));
  document.querySelectorAll('.dia-turnos').forEach(section => {
    const dia = section.querySelector('h3').textContent;
    section.querySelectorAll('.turno').forEach(div => {
      const hora = div.textContent.trim();
      const disp = disponibilidad[dia]?.[hora] ?? 0;

      // Muestra la cantidad de lugares disponibles en cada turno
      const info = document.createElement('p');
      info.className = 'disponible';
      info.textContent = `Disponible: ${disp}`;
      div.appendChild(info);

      // Al hacer click en un turno, intenta reservarlo
      div.addEventListener('click', () => reservarTurno(dia, hora, div));
    });
  });
}

// ==================== RESERVAR UN TURNO ====================
function reservarTurno(dia, hora, div) {
  let usuario = JSON.parse(localStorage.getItem('usuarioActual')); //esto agarra el objeto de usuario actual del localStorag
  let disponibilidad = JSON.parse(localStorage.getItem('disponibilidad')); //esto agarra el objeto de disponibilidad del localStorage
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || []; //esto agarra el array de usuarios del localStorage

  // Validaciones antes de reservar
  if (!usuario) {
    alert('Debés iniciar sesión para reservar.');
    return;
  }
  if (usuario.creditos <= 0) {
    alert('No tenés más créditos disponibles.');
    return;
  }
  if (disponibilidad[dia][hora] <= 0) {
    alert('Este turno ya no tiene lugares disponibles.');
    return;
  }
  // Verifica si ya tiene ese turno reservado
  const yaReservado = usuario.turnos.find(t => t.dia === dia && t.hora === hora);
  if (yaReservado) {
    alert('Ya tenés reservado este turno.');
    return;
  }

  // Reserva el turno, descuenta crédito y actualiza disponibilidad
  usuario.turnos.push({ dia, hora });
  usuario.creditos--;
  disponibilidad[dia][hora]--;

  // Actualiza usuarioActual y el array de usuarios
  localStorage.setItem('usuarioActual', JSON.stringify(usuario));
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === usuario.email) {
      usuarios[i] = usuario;
      break;
    }
  }
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  localStorage.setItem('disponibilidad', JSON.stringify(disponibilidad));

  alert(`Turno reservado para ${dia} a las ${hora}. Créditos restantes: ${usuario.creditos}`);
  location.reload(); // Recarga la página para actualizar la vista
}

// ==================== MOSTRAR Y CANCELAR TURNOS EN "MIS TURNOS" ====================
document.addEventListener('DOMContentLoaded', () => {
  // Solo ejecuta si estamos en la página de Mis Turnos
  if (document.getElementById('infoCreditosMisTurnos')) {
    let usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    let disponibilidad = JSON.parse(localStorage.getItem('disponibilidad')) || {};

    // Muestra los créditos disponibles
    document.getElementById('infoCreditosMisTurnos').textContent = `Créditos disponibles: ${usuario.creditos}`;
    // Muestra la lista de turnos reservados
    const lista = document.getElementById('listaTurnos');
    lista.innerHTML = '';
    if (!usuario.turnos || usuario.turnos.length === 0) {
      lista.innerHTML = '<li>No tenés turnos reservados.</li>';
    } else {
      usuario.turnos.forEach((t, idx) => {
        const li = document.createElement('li');
        li.textContent = `${t.dia} - ${t.hora} `;

        // Botón para cancelar el turno
        const btnCancelar = document.createElement('button');
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.style.marginLeft = '10px';
        btnCancelar.addEventListener('click', () => {
          // Elimina el turno y reintegra el crédito
          usuario.turnos.splice(idx, 1);
          usuario.creditos++;

          // Actualiza la disponibilidad del turno cancelado
          if (
            disponibilidad[t.dia] &&
            typeof disponibilidad[t.dia][t.hora] === 'number'
          ) {
            disponibilidad[t.dia][t.hora]++;
          }

          // Actualiza el usuario en el array de usuarios
          for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].email === usuario.email) {
              usuarios[i] = usuario;
              break;
            }
          }

          // Guarda los cambios en localStorage
          localStorage.setItem('usuarioActual', JSON.stringify(usuario));
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
          localStorage.setItem('disponibilidad', JSON.stringify(disponibilidad));

          // Muestra mensaje y recarga la lista
          alert(`Turno cancelado. Crédito reintegrado. Créditos actuales: ${usuario.creditos}`);
          location.reload();
        });

        li.appendChild(btnCancelar);
        lista.appendChild(li);
      });
    }
  }
});

// ==================== BOTÓN VOLVER EN "MIS TURNOS" ====================
document.addEventListener('DOMContentLoaded', () => {
  const btnVolver = document.querySelector('.volver');
  if (btnVolver) {
    btnVolver.addEventListener('click', () => {
      window.location.href = 'menu.html'; // Redirige al menú principal
    });
  }
});

// ==================== BOTÓN "VER MIS TURNOS" EN TURNOS ====================
document.addEventListener('DOMContentLoaded', () => {
  const btnMisTurnos = document.getElementById('verMisTurnos');
  if (btnMisTurnos) {
    btnMisTurnos.addEventListener('click', () => {
      window.location.href = 'misturnos.html';
    });
  }
});

// ==================== FILTRO Y BÚSQUEDA DE TURNOS ====================
// Permite filtrar los turnos por día y buscar por horario
document.addEventListener('DOMContentLoaded', () => {
  const filtroDia = document.getElementById('filtroDia');
  const busquedaTurno = document.getElementById('busquedaTurno');

  if (filtroDia && busquedaTurno) {
    filtroDia.addEventListener('change', filtrarTurnos);
    busquedaTurno.addEventListener('input', filtrarTurnos);
  }

  function filtrarTurnos() {
    const diaSeleccionado = filtroDia.value;
    const textoBusqueda = busquedaTurno.value.toLowerCase();

    document.querySelectorAll('.dia-turnos').forEach(section => {
      const dia = section.querySelector('h3').textContent;
      // Muestra u oculta el día según el filtro
      if (diaSeleccionado !== 'todos' && dia !== diaSeleccionado) {
        section.style.display = 'none';
      } else {
        section.style.display = '';
// Registro
document.getElementById("formRegistro").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("registroEmail").value;
  const pass = document.getElementById("registroPassword").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existe = usuarios.find(u => u.email === email);

  if (existe) {
    alert("El usuario ya existe.");
    return;
  }

  // Crear usuario y guardar en usuarios
  const nuevoUsuario = { email: email, password: pass, turnos: [], creditos: 16 };
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Login automático con el mismo objeto que está en el array (el último del array)
  const usuarioGuardado = usuarios[usuarios.length - 1];
  localStorage.setItem("usuarioActual", JSON.stringify(usuarioGuardado));
  window.location.href = "turnos.html";
});

// Login
document.getElementById("formLogin").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  // Buscar el usuario en el array para mantener referencia y sincronía
  const user = usuarios.find(u => u.email === email && u.password === pass);

  const mensajeLogin = document.getElementById("mensajeLogin");
  if (user) {
    localStorage.setItem("usuarioActual", JSON.stringify(user));
    window.location.href = "menu.html";
  } else {
    if (mensajeLogin) {
      mensajeLogin.textContent = "Email o contraseña incorrectos.";
    } else {
      alert("Email o contraseña incorrectos.");
    }
  }
});// Registro
document.getElementById("formRegistro").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("registroEmail").value;
  const pass = document.getElementById("registroPassword").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existe = usuarios.find(u => u.email === email);

  if (existe) {
    alert("El usuario ya existe.");
    return;
  }

  // Crear usuario y guardar en usuarios
  const nuevoUsuario = { email: email, password: pass, turnos: [], creditos: 16 };
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Login automático con el mismo objeto que está en el array (el último del array)
  const usuarioGuardado = usuarios[usuarios.length - 1];
  localStorage.setItem("usuarioActual", JSON.stringify(usuarioGuardado));
  window.location.href = "turnos.html";
});

// Login
document.getElementById("formLogin").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  // Buscar el usuario en el array para mantener referencia y sincronía
  const user = usuarios.find(u => u.email === email && u.password === pass);

  const mensajeLogin = document.getElementById("mensajeLogin");
  if (user) {
    localStorage.setItem("usuarioActual", JSON.stringify(user));
    window.location.href = "menu.html";
  } else {
    if (mensajeLogin) {
      mensajeLogin.textContent = "Email o contraseña incorrectos.";
    } else {
      alert("Email o contraseña incorrectos.");
    }
  }
});// Registro
document.getElementById("formRegistro").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("registroEmail").value;
  const pass = document.getElementById("registroPassword").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existe = usuarios.find(u => u.email === email);

  if (existe) {
    alert("El usuario ya existe.");
    return;
  }

  // Crear usuario y guardar en usuarios
  const nuevoUsuario = { email: email, password: pass, turnos: [], creditos: 16 };
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Login automático con el mismo objeto que está en el array (el último del array)
  const usuarioGuardado = usuarios[usuarios.length - 1];
  localStorage.setItem("usuarioActual", JSON.stringify(usuarioGuardado));
  window.location.href = "turnos.html";
});

// Login
document.getElementById("formLogin").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  // Buscar el usuario en el array para mantener referencia y sincronía
  const user = usuarios.find(u => u.email === email && u.password === pass);

  const mensajeLogin = document.getElementById("mensajeLogin");
  if (user) {
    localStorage.setItem("usuarioActual", JSON.stringify(user));
    window.location.href = "menu.html";
  } else {
    if (mensajeLogin) {
      mensajeLogin.textContent = "Email o contraseña incorrectos.";
    } else {
      alert("Email o contraseña incorrectos.");
    }
  }
});        // Filtra los horarios dentro del día
        section.querySelectorAll('.turno').forEach(div => {
          const hora = div.textContent.toLowerCase();
          if (textoBusqueda && !hora.includes(textoBusqueda)) {
            div.style.display = 'none';
          } else {
            div.style.display = '';
          }
        });
      }
    });
  }
});
