const cuadriculas_vacias = document.getElementById("cuadriculas-vacias");
const numeros = document.getElementById("numeros");
const resultado = document.getElementById("resultado");
const pistas = document.getElementById("pistas");
let numeroSeleccionado = null;
let posicionInicial = null;
let aciertos = 0;
const botonVolver = document.getElementById("boton-volver-ajugar");
let fallos = 0; 
let maxFallos = 0;


// Mostrar contador de fallos en la página
const fallosElemento = document.getElementById("fallos");
fallosElemento.textContent = `Fallos: ${fallos}`;


/* -------------------USUARIO Y TEMPORIZADOR --------------------------*/

const temporizadorElemento = document.getElementById("temporizador");

// Verificar si hay un usuario activo
const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
if (!usuarioActivo) {
    alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
    window.location.href = "../login.html";
} else {
    // Mostrar el nombre del usuario en el juego
    const usuarioNombreElemento = document.getElementById("usuario-nombre");
    usuarioNombreElemento.textContent = `Usuario: ${usuarioActivo.usuario}`;
}
// Inicializo el tiempo en 100 segundos
let tiempoRestante = "100";
// Función para actualizar el temporizador
function actualizarTemporizador() {
    tiempoRestante--;
    temporizadorElemento.textContent = `Tiempo restante: ${tiempoRestante} segundos`;

    if (tiempoRestante <= 0) {
        clearInterval(temporizadorInterval);
        alert("Se acabó el tiempo. Serás redirigido al inicio de sesión.");
        localStorage.removeItem("usuarioActivo"); // Limpiar el usuario activo
        window.location.href = "../login.html"; // Redirigir al login
    }
}

// Iniciar el temporizador
const temporizadorInterval = setInterval(actualizarTemporizador, 1000);

/*----------------fin conf. usuario y temporizador--------------------*/


// --------- COMPROBAR DIFICULTAD SELECCIONADA ----------------------------
const dificultad = localStorage.getItem("dificultad");
let cuadriculasTotales;

if (dificultad === "facil") {
    cuadriculasTotales = 1;
    maxFallos = 4;
} else if (dificultad === "intermedio") {
    cuadriculasTotales = 2;
    maxFallos = 10;
} else if (dificultad === "dificil") {
    cuadriculasTotales = 3;
    maxFallos = 15;
} else {
    alert("Por favor selecciona una dificultad.");
    window.location.href = "dificultad.html";
}


// Generación del NÚMERO OBJETIVO según nivel
let numeroObjetivo2 = Math.floor(Math.random() * Math.pow(10, cuadriculasTotales))
    .toString()
    .padStart(cuadriculasTotales, "0");

// Función para generar un número objetivo
function generarNumeroObjetivo() {
    numeroObjetivo2 = Math.floor(Math.random() * Math.pow(10, cuadriculasTotales))
        .toString()
        .padStart(cuadriculasTotales, "0");
    console.log(`Nuevo número objetivo: ${numeroObjetivo2}`);
}

// Función principal para reiniciar el juego
document.getElementById("boton-volver-ajugar").addEventListener("click", function () {
    aciertos = 0;
    resultado.textContent = '';
    cuadriculas_vacias.innerHTML = '';
    numeros.innerHTML = '';
    pistas.innerHTML = '';
    fallos = 0;
    fallosElemento.textContent = `Fallos: ${fallos}`;
    generarNumeroObjetivo();

    // Reiniciar el juego
    iniciarJuego();

    // Deshabilitar el botón de "Volver a Jugar"
    botonVolver.disabled = true;
    botonVolver.style.opacity = 0.5;

    // Restaurar las cuadriculas a su estado inicial
    const vacias = document.querySelectorAll(".cuadricula-vacia");
    vacias.forEach(cuadricula => {
        cuadricula.classList.remove("perdida");
    });

});

// FUNCIÓN PARA INICIAR EL JUEGO
function iniciarJuego() {
    // Generar cuadriculas vacías
    for (let i = 0; i < cuadriculasTotales; i++) {
        let cuadricula = document.createElement("div");
        cuadricula.className = "cuadricula-vacia";
        cuadricula.setAttribute("id", `cuadricula-vacia-${i}`);
        cuadriculas_vacias.appendChild(cuadricula);
    }

    // Crear los números del 0 al 9
    for (let i = 0; i < 10; i++) {
        let numero = document.createElement("div");
        numero.className = "cuadricula-numero";
        numero.textContent = i;

        // Evento para seleccionar el número
        numero.addEventListener("mousedown", function (e) {
            if (numeroSeleccionado && numeroSeleccionado !== numero) {
                numeroSeleccionado.classList.remove("seleccionado", "arrastrando");
            }
            numeroSeleccionado = numero;
            numeroSeleccionado.classList.add("seleccionado");
            posicionInicial = { x: e.clientX, y: e.clientY };
        });

        // Evento onmouseover para cambiar el color al pasar el mouse por encima
        numero.addEventListener("mouseover", function () {
            numero.classList.add("mouse-sobre-cuadricula");
        });


        // Evento onmouseout para restaurar el color cuando el mouse salga
        numero.addEventListener("mouseout", function () {
            numero.classList.remove("mouse-sobre-cuadricula");
        });

        // Agregar a la lista de números
        numeros.appendChild(numero);
    }

    // Hacer que las cuadriculas vacías reciban el número
    let vacias = document.querySelectorAll(".cuadricula-vacia");
    vacias.forEach(cuadricula => {
        cuadricula.addEventListener("mouseup", function (e) {
            if (numeroSeleccionado) {
                let rect = cuadricula.getBoundingClientRect();
                if (
                    e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom
                ) {
                    cuadricula.textContent = numeroSeleccionado.textContent;
                    numeroSeleccionado.classList.remove("seleccionado", "arrastrando");
                    numeroSeleccionado = null;

                    // Verificar si el dígito es correcto
                    let index = Array.from(cuadriculas_vacias.children).indexOf(cuadricula);
                    if (cuadricula.textContent === numeroObjetivo2[index]) {
                        cuadricula.classList.add("bloqueada");
                        aciertos++;
                    }

                    else {
                        fallos++; // Incrementar fallos
                        fallosElemento.textContent = `Fallos: ${fallos}`; // Mostrar fallos


                        if (fallos >= maxFallos) {
                            resultado.textContent = "Has perdido. Intenta de nuevo.";
                            resultado.style.color = 'red';


                            // Deshabilitar el juego
                            const vacias = document.querySelectorAll(".cuadricula-vacia");
                            vacias.forEach(cuadricula => {
                                cuadricula.classList.add("bloqueada");
                                cuadricula.classList.add("perdida"); 
                            });

                            // Habilitar el botón "Volver a Jugar"

                            botonVolver.disabled = false;
                            botonVolver.style.opacity = 1;
                        }

                    }

                    // Actualizo las pistas
                    mostrarPistas();
                }
            }
        });
    });
}

// Función para mostrar pistas
function mostrarPistas() {
    let pistasTexto = [];
    let vacias = document.querySelectorAll(".cuadricula-vacia");

    vacias.forEach(function (cuadricula, index) {
        if (cuadricula.textContent !== "") {
            let digito = cuadricula.textContent;
            let pista = obtenerPista(digito, index);
            pistasTexto.push(pista);
        }
    });

    pistas.innerHTML = "";
    for (let i = 0; i < pistasTexto.length; i += 2) {
        let pistaDiv = document.createElement("div");
        pistaDiv.textContent = `${pistasTexto[i]} ${pistasTexto[i + 1] || ''}`;
        pistas.appendChild(pistaDiv);
    }

    if (aciertos === cuadriculasTotales) {
        resultado.textContent = `¡Acertaste el número! El número objetivo es: ${numeroObjetivo2}`;
        resultado.style.color = 'green';

        // Habilitar el botón "Volver a Jugar"
        botonVolver.disabled = false;
        botonVolver.style.opacity = 1;
    }
}

// Función para obtener pistas
function obtenerPista(digito, index) {
    if (digito === numeroObjetivo2[index]) {
        return `${digito} es correcto (OK)`;
    } else if (Math.abs(digito - numeroObjetivo2[index]) === 1) {
        return `${digito} está caliente`;
    } else {
        return `${digito} está frío`;
    }
}

// Iniciar el juego al cargar la página
window.onload = function () {
    generarNumeroObjetivo();
    iniciarJuego();
};
