const envoltura = document.querySelector(".envoltura-sobre");
const carta = document.querySelector(".carta");
const contenido = document.querySelector(".contenido");

// Evitamos depender de transitionend (en algunos navegadores/GitHub Pages se pierde,
// y eso hace que “tengas que picar varias veces”).
const DURACION_SOLAPA_MS = 720;
const DURACION_CARTA_MS = 650;

let estado = "cerrado"; // cerrado | solapa-abierta | carta-abierta
let bloqueadoHasta = 0;

function ahora() {
  return Date.now();
}

function estaBloqueado() {
  return ahora() < bloqueadoHasta;
}

function bloquear(ms) {
  bloqueadoHasta = ahora() + ms;
  envoltura.classList.add("animando");
  window.setTimeout(() => {
    envoltura.classList.remove("animando");
  }, ms);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function lanzarConfetti() {
  const colores = ["#ff4d8d", "#ff86b0", "#bde0fe", "#cdb4db", "#c7f9cc", "#ffd166"];
  const esMovil = window.matchMedia?.("(max-width: 480px)")?.matches ?? false;
  const cantidad = esMovil ? 50 : 80;

  for (let i = 0; i < cantidad; i++) {
    const el = document.createElement("div");
    el.className = "confetti";

    const left = rand(0, 100);
    const dx = rand(-170, 170);
    const rot = rand(-420, 420);
    const dur = rand(1200, 2100);
    const w = rand(6, 10);
    const h = rand(10, 16);

    el.style.left = `${left}vw`;
    el.style.backgroundColor = colores[i % colores.length];
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.setProperty("--dx", `${dx}px`);
    el.style.setProperty("--rot", `${rot}deg`);
    el.style.animationDuration = `${dur}ms`;

    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), dur + 200);
  }
}

function debeIgnorarInteraccion(e) {
  // Si estás leyendo/scroll en el contenido, no cierres/abras por accidente
  if (e?.target && e.target.closest?.(".contenido")) return true;
  // Evita toggles raros si seleccionas texto
  const sel = window.getSelection?.();
  if (sel && String(sel).trim().length > 0) return true;
  return false;
}

function activar(e) {
  if (!envoltura || !carta) return;
  if (estaBloqueado()) return;
  if (debeIgnorarInteraccion(e)) return;

  switch (estado) {
    case "cerrado": {
      envoltura.classList.add("abierto");
      bloquear(DURACION_SOLAPA_MS);
      window.setTimeout(() => {
        estado = "solapa-abierta";
      }, DURACION_SOLAPA_MS);
      break;
    }

    case "solapa-abierta": {
      carta.classList.add("mostrar-carta");
      bloquear(DURACION_CARTA_MS);
      window.setTimeout(() => {
        carta.classList.remove("mostrar-carta");
        carta.classList.add("abierta");
        estado = "carta-abierta";
        lanzarConfetti();
      }, DURACION_CARTA_MS);
      break;
    }

    case "carta-abierta": {
      carta.classList.add("cerrando-carta");
      bloquear(DURACION_CARTA_MS);
      window.setTimeout(() => {
        carta.classList.remove("cerrando-carta", "abierta");
        envoltura.classList.remove("abierto");
        estado = "cerrado";
      }, DURACION_CARTA_MS);
      break;
    }
  }
}

// Pointer events suelen ir más suaves (y sin delay) en móvil.
envoltura?.addEventListener("pointerup", activar);

// Accesibilidad: Enter/Espacio.
envoltura?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    activar(e);
  }
});

// Si el usuario hace scroll dentro, no “toglees” por un tap accidental.
contenido?.addEventListener("pointerup", (e) => e.stopPropagation());
