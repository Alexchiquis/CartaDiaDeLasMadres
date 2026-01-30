const envoltura = document.querySelector(".envoltura-sobre");
const carta = document.querySelector(".carta");
const corazon = document.querySelector(".corazon");
const contenido = document.querySelector(".contenido");

// Evitamos depender de transitionend (en algunos navegadores/GitHub Pages se pierde,
// y eso hace que “tengas que picar varias veces”).
const DURACION_SOLAPA_MS = 680;
const DURACION_CARTA_MS = 620;
const DELAY_CARTA_MS = 120; // pequeña espera para que la solapa empiece a abrir antes de levantar la carta

let estado = "cerrado"; // cerrado | abierto
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
  if (!envoltura || !carta || !corazon) return;
  if (estaBloqueado()) return;
  if (debeIgnorarInteraccion(e)) return;

  if (estado === "cerrado") {
    // 1 clic: abre solapa + levanta la carta (se siente “todo a la vez”)
    const total = DURACION_SOLAPA_MS + DURACION_CARTA_MS + DELAY_CARTA_MS;
    bloquear(total);

    envoltura.classList.add("abierto");

    window.setTimeout(() => {
      // usamos "abierta" para que quede arriba
      carta.classList.remove("cerrando-carta");
      carta.classList.add("abierta");
    }, DELAY_CARTA_MS);

    window.setTimeout(() => {
      lanzarConfetti();
      estado = "abierto";
    }, DELAY_CARTA_MS + Math.min(420, DURACION_CARTA_MS));

    return;
  }

  // estado === "abierto"
  const total = DURACION_CARTA_MS + DURACION_SOLAPA_MS;
  bloquear(total);

  // Baja carta primero
  carta.classList.add("cerrando-carta");
  window.setTimeout(() => {
    carta.classList.remove("abierta", "cerrando-carta");
    envoltura.classList.remove("abierto");
    estado = "cerrado";
  }, DURACION_CARTA_MS);
}

// Click/tap SOLO en el corazón (para que se entienda).
corazon?.addEventListener("pointerup", activar);

// Accesibilidad: Enter/Espacio en el corazón.
corazon?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    activar(e);
  }
});

// Si el usuario hace scroll dentro, no “toglees” por un tap accidental.
contenido?.addEventListener("pointerup", (e) => e.stopPropagation());
