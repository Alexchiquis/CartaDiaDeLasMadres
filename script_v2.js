const envoltura = document.querySelector(".envoltura-sobre");
const carta     = document.querySelector(".carta");
let estado = "cerrado"; // cerrada, solapa-abierta, carta-abierta

envoltura.addEventListener("click", (e) => {
  if (envoltura.classList.contains("animando")) return;

  switch (estado) {
    case "cerrado":
      // abrir solapa
      envoltura.classList.add("animando", "abierto");
      // esperamos a que termine la rotación
      envoltura.addEventListener("transitionend", function handler(ev) {
        if (ev.propertyName === "transform") {
          estado = "solapa-abierta";
          envoltura.classList.remove("animando");
          envoltura.removeEventListener("transitionend", handler);
        }
      });
      break;

    case "solapa-abierta":
      // mostrar carta
      envoltura.classList.add("animando");
      carta.classList.add("mostrar-carta");
      carta.addEventListener("transitionend", function handler(ev) {
        if (ev.propertyName === "transform") {
          carta.classList.remove("mostrar-carta");
          carta.classList.add("abierta");
          estado = "carta-abierta";
          envoltura.classList.remove("animando");
          carta.removeEventListener("transitionend", handler);
        }
      });
      break;

    case "carta-abierta":
      // cerrar carta y sobre
      envoltura.classList.add("animando");
      carta.classList.add("cerrando-carta");
      carta.addEventListener("transitionend", function handler(ev) {
        if (ev.propertyName === "transform") {
          carta.classList.remove("cerrando-carta", "abierta");
          envoltura.classList.remove("abierto", "animando");
          estado = "cerrado";
          carta.removeEventListener("transitionend", handler);
        }
      });
      break;
  }
});
