const envoltura = document.querySelector(".envoltura-sobre");
const carta = document.querySelector(".carta");
const corazon = document.querySelector(".corazon");
const contenido = document.querySelector(".contenido");

// Evitamos depender de transitionend (en algunos navegadores/GitHub Pages se pierde,
// y eso hace que “tengas que picar varias veces”).
const CLASE_ABIERTO = "abierto";
const CLASE_EXTRAIDA = "extraida";
const CLASE_GUARDANDO = "guardando";

const DURACION_SOLAPA_MS = 680;
const DURACION_CARTA_MS = 650;
const DURACION_CARTA_SNAPPY_MS = 520;
const DELAY_CARTA_MS = 160; // debe coincidir con CSS (transition-delay de .abierto .carta)
const MOMENTO_EXTRAER_MS = DELAY_CARTA_MS + 420; // cambia a "extraida" cuando ya asomó

let bloqueadoHasta = 0;
let timerExtraer = 0;
let timerCerrar = 0;

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

function limpiarTimers() {
  if (timerExtraer) window.clearTimeout(timerExtraer);
  if (timerCerrar) window.clearTimeout(timerCerrar);
  timerExtraer = 0;
  timerCerrar = 0;
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

  const estaAbierto = envoltura.classList.contains(CLASE_ABIERTO);
  const estaExtraida = envoltura.classList.contains(CLASE_EXTRAIDA);

  if (!estaAbierto) {
    limpiarTimers();
    envoltura.classList.remove(CLASE_GUARDANDO);
    envoltura.classList.remove(CLASE_EXTRAIDA);

    // Abrir: solapa abre y luego la carta “asoma” (todo se controla por CSS)
    const total = DELAY_CARTA_MS + DURACION_CARTA_MS + DURACION_CARTA_SNAPPY_MS + 420;
    bloquear(total);
    envoltura.classList.add(CLASE_ABIERTO);

    timerExtraer = window.setTimeout(() => {
      envoltura.classList.add(CLASE_EXTRAIDA);
    }, MOMENTO_EXTRAER_MS);

    window.setTimeout(() => {
      lanzarConfetti();
    }, MOMENTO_EXTRAER_MS + 180);

    // Centrar para leer
    window.setTimeout(() => {
      try {
        envoltura.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch {}
    }, 240);

    return;
  }

  // Cerrar: baja la hoja (todavía arriba), luego entra al sobre y finalmente cierra.
  limpiarTimers();

  if (estaExtraida) {
    const total = DURACION_CARTA_SNAPPY_MS + DURACION_CARTA_MS + DURACION_SOLAPA_MS + 520;
    bloquear(total);

    envoltura.classList.add(CLASE_GUARDANDO);
    envoltura.classList.remove(CLASE_EXTRAIDA);

    timerCerrar = window.setTimeout(() => {
      envoltura.classList.remove(CLASE_GUARDANDO);
      envoltura.classList.remove(CLASE_ABIERTO);
    }, DURACION_CARTA_SNAPPY_MS + 60);

    return;
  }

  // Si estaba "abierto" pero todavía no llegó a extraerse (o se interrumpió), cierra normal.
  const total = DURACION_CARTA_MS + DURACION_SOLAPA_MS + 420;
  bloquear(total);
  envoltura.classList.remove(CLASE_GUARDANDO);
  envoltura.classList.remove(CLASE_EXTRAIDA);
  envoltura.classList.remove(CLASE_ABIERTO);
}

// Click/tap en el sobre o en el corazón (intuitivo).
envoltura?.addEventListener("pointerup", activar);
corazon?.addEventListener("pointerup", (e) => {
  e.stopPropagation();
  activar(e);
});

// Accesibilidad: Enter/Espacio en el corazón.
corazon?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    activar(e);
  }
});

// Si el usuario hace scroll dentro, no “toglees” por un tap accidental.
contenido?.addEventListener("pointerup", (e) => e.stopPropagation());
