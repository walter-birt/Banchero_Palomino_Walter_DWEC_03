// Guardar la dificultad seleccionada en localStorage
document.getElementById("facil").addEventListener("click", function () {
    localStorage.setItem("dificultad", "facil");
    window.location.href = "./juego.html"; 
});

document.getElementById("intermedio").addEventListener("click", function () {
    localStorage.setItem("dificultad", "intermedio");
    window.location.href = "./juego.html"; 
});

document.getElementById("dificil").addEventListener("click", function () {
    localStorage.setItem("dificultad", "dificil");
    window.location.href = "./juego.html"; 
});

// Agregar eventos para mostrar instrucciones al pasar el mouse
const botones = document.querySelectorAll("button");

botones.forEach(function(boton) {
    boton.addEventListener("mouseover", function() {
        boton.classList.add("remarcar-boton");
    });

    boton.addEventListener("mouseout", function() {
        boton.classList.remove("remarcar-boton");
    });
});
