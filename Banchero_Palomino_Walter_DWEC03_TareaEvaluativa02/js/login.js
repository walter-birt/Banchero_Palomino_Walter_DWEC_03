document.addEventListener('DOMContentLoaded', function() {
    // Cargar usuarios desde un archivo JSON
    const usuarios = [
        { "id": 1, "usuario": "iarana", "contraseña": "1234Abcd" },
        { "id": 2, "usuario": "agoikoetxea", "contraseña": "5678Efgh" },
        { "id": 3, "usuario": "jolano", "contraseña": "9012Ijkl" }
    ];

    // Guardar los usuarios en el localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Obtener los datos del formulario
    const loginBtn = document.getElementById('login-btn');
    const usuarioInput = document.getElementById('usuarioTecleado');
    const contraseniaInput = document.getElementById('contraseniaTecleada');
    const mensajeError = document.getElementById('mensaje');
    usuarioInput.focus();

    // Evento al hacer clic en el botón de login
    loginBtn.addEventListener('click', function() {
        // Limpiar el mensaje de error
        mensajeError.textContent = '';

        // Obtener los valores de los campos de usuario y contraseña
        const usuario = usuarioInput.value.trim();
        const contrasenia = contraseniaInput.value.trim();

        // Verificar que la contraseña cumpla con el formato (letras y números)
        const passwordRegExp = /^[a-zA-Z0-9]+$/; // Expresión para solo letras y números
        if (!passwordRegExp.test(contrasenia)) {
            mensajeError.textContent = 'La contraseña solo puede contener letras y números.';
            return; 
           
        }

        // Recuperar los usuarios desde el localStorage
        const usuarios = JSON.parse(localStorage.getItem('usuarios'));

        // Buscar si el usuario y la contraseña coinciden
        const usuarioValido = usuarios.find(function(usu) {
            return usu.usuario === usuario && usu.contraseña === contrasenia;
        });

        // Si los datos son correctos, redirigir al juego
        if (usuarioValido) {
            // Guardar la sesión de usuario en el localStorage
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));
           
            // Redirigir a la página del juego
            window.location.href = './html/dificultad.html'; 
        } else {
            // Si los datos son incorrectos, mostrar un mensaje de error
            mensajeError.textContent = 'Usuario o contraseña incorrectos.';
        }
    });
});
