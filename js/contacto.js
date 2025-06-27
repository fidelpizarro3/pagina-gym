// Validación avanzada para el formulario de contacto
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formContacto');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valido = true;

    // Limpiar errores y estilos previos
    ['nombre', 'email', 'telefono', 'mensaje'].forEach(campo => {
      const errorSpan = document.getElementById('error' + capitalize(campo));
      const input = document.getElementById(campo === 'mensaje' ? 'mensajeContacto' : campo);
      if (errorSpan) errorSpan.textContent = '';
      if (input) {
        input.style.borderColor = '';
        input.style.background = '';
      }
      const label = document.getElementById('label' + capitalize(campo));
      if (label) label.style.color = '';
    });

    // Validar nombre (obligatorio)
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
      valido = false;
      mostrarError('nombre', 'El nombre es obligatorio.');
    }

    // Validar email (obligatorio y formato)
    const email = document.getElementById('email').value.trim();
    if (!email) {
      valido = false;
      mostrarError('email', 'El email es obligatorio.');
    } else if (!/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email)) {
      valido = false;
      mostrarError('email', 'El formato de email no es válido.');
    }

    // Teléfono (opcional, si se completa debe ser numérico y al menos 8 dígitos)
    const telefono = document.getElementById('telefono').value.trim();
    if (telefono && !/^\d{8,}$/.test(telefono)) {
      valido = false;
      mostrarError('telefono', 'El teléfono debe tener al menos 8 dígitos y solo números.');
    }

    // Mensaje es optativo, pero si se ingresa, debe tener al menos 3 caracteres
    const mensaje = document.getElementById('mensajeContacto').value.trim();
    if (mensaje && mensaje.length < 3) {
      valido = false;
      mostrarError('mensajeContacto', 'El mensaje debe tener al menos 3 caracteres si se completa.');
    }

    if (valido) {
      form.submit();
    }
  });

  function mostrarError(campo, mensaje) {
    document.getElementById('error' + capitalize(campo)).textContent = mensaje;
    document.getElementById(campo).style.borderColor = '#e63946';
    document.getElementById(campo).style.background = '#ffeaea';
    const label = document.getElementById('label' + capitalize(campo));
    if (label) label.style.color = '#e63946';
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});