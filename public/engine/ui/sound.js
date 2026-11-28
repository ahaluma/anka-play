// Sounds made with Web Audio: no files to download. Friendly, never scary. And the confetti.

let ctx = null;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, start, duration, type = "sine", volume = 0.2) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

/** A short burst of noise through a band filter: a clap (high) or a pat (low). */
function noise(duration, volume, freq) {
  const a = audio();
  if (!a) return;
  const buffer = a.createBuffer(1, Math.ceil(a.sampleRate * duration), a.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2;
  const src = a.createBufferSource();
  src.buffer = buffer;
  const filter = a.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  const gain = a.createGain();
  gain.gain.value = volume;
  src.connect(filter).connect(gain).connect(a.destination);
  src.start();
}

export const sound = {
  tap: () => tone(660, 0, 0.08, "triangle", 0.15),
  right: () => [523, 659, 784].forEach((f, i) => tone(f, i * 0.09, 0.22, "triangle", 0.2)),
  wrong() {
    tone(220, 0, 0.25, "sine", 0.18);
    tone(196, 0.12, 0.3, "sine", 0.15);
  },
  /** The sound of a move of the Wald's clapping rhythm (ideas/muster): 👏 a clap, 🦶 a stamp, 🦵 a pat on the knees. */
  move(icon) {
    if (icon === "👏") return noise(0.09, 0.5, 1800);
    if (icon === "🦶") return tone(80, 0, 0.22, "sine", 0.45);
    if (icon === "🦵") return noise(0.07, 0.35, 500);
  },
  /** Applause: many claps, close together, for about a second. */
  applause() {
    for (let i = 0; i < 18; i++) setTimeout(() => noise(0.08, 0.35 + Math.random() * 0.2, 1400 + Math.random() * 900), i * 55 + Math.random() * 40);
  },
  win: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25, "triangle", 0.2)),
};

const COLORS = ["#ff5a36", "#ffc83a", "#12a564", "#2456b8", "#e8488a"];

/** Confetti; `colors` lets a scene keep its own few colours. */
export function celebrate(pieces = 60, colors = COLORS) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < pieces; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    el.style.left = Math.random() * 100 + "vw";
    el.style.background = colors[i % colors.length];
    el.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
    el.style.animationDelay = Math.random() * 0.4 + "s";
    document.body.append(el);
    el.addEventListener("animationend", () => el.remove());
  }
}
