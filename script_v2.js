const envoltura = document.querySelector(".envoltura-sobre");
const carta     = document.querySelector(".carta");
let abierto     = false;

envoltura.addEventListener("click", () => {
  if (envoltura.classList.contains("animando")) return;
  envoltura.classList.add("animando");

  if (!abierto) {
    // 1) Abrir solapa
    envoltura.classList.add("abierto", "desactivar-sobre");
    // 2) Mostrar carta simultáneo
    carta.classList.add("mostrar-carta");
    // 3) Tras la transición, dejarla desplegada
    setTimeout(() => {
      carta.classList.remove("mostrar-carta");
      carta.classList.add("abierta");
      envoltura.classList.remove("animando");
    }, 500); // coincide con tu transition .5s
  } else {
    // 1) Cerrar carta
    carta.classList.add("cerrando-carta");
    setTimeout(() => {
      carta.classList.remove("cerrando-carta","abierta");
      // 2) Cerrar solapa
      envoltura.classList.remove("abierto","desactivar-sobre","animando");
    }, 500);
  }

  abierto = !abierto;
});


