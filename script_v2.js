const envoltura = document.querySelector(".envoltura-sobre");
const carta     = document.querySelector(".carta");

let estado = 0; // 0 = cerrado; 1 = flap abierto; 2 = carta afuera

envoltura.addEventListener("click", () => {
  if (envoltura.classList.contains("animando")) return;

  envoltura.classList.add("animando");
  
  if (estado === 0) {
    // paso 1: abrir solapa
    envoltura.classList.add("abierto");
    envoltura.addEventListener("transitionend", function handler(ev) {
      if (ev.propertyName === "transform") {
        estado = 1;
        envoltura.classList.remove("animando");
        envoltura.removeEventListener("transitionend", handler);
      }
    });
  } 
  else if (estado === 1) {
    // paso 2: mostrar la carta
    carta.classList.add("mostrar-carta");
    carta.addEventListener("transitionend", function handler(ev) {
      if (ev.propertyName === "transform") {
        carta.classList.remove("mostrar-carta");
        carta.classList.add("abierta");
        estado = 2;
        envoltura.classList.remove("animando");
        carta.removeEventListener("transitionend", handler);
      }
    });
  } 
  else {
    // paso 3: cerrar todo
    carta.classList.add("cerrando-carta");
    carta.addEventListener("transitionend", function handler(ev) {
      if (ev.propertyName === "transform") {
        carta.classList.remove("cerrando-carta","abierta");
        envoltura.classList.remove("abierto","animando");
        estado = 0;
        carta.removeEventListener("transitionend", handler);
      }
    });
  }
});

