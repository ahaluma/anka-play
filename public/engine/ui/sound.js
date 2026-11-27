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

export const sound = {
  tap: () => tone(660, 0, 0.08, "triangle", 0.15),
  right: () => [523, 659, 784].forEach((f, i) => tone(f, i * 0.09, 0.22, "triangle", 0.2)),
  wrong() {
    tone(220, 0, 0.25, "sine", 0.18);
    tone(196, 0.12, 0.3, "sine", 0.15);
  },
  win: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25, "triangle", 0.2)),
};

const COLORS = ["#ff5a36", "#ffc83a", "#12a564", "#2456b8", "#e8488a"];

export function celebrate(pieces = 60) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < pieces; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    el.style.left = Math.random() * 100 + "vw";
    el.style.background = COLORS[i % COLORS.length];
    el.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
    el.style.animationDelay = Math.random() * 0.4 + "s";
    document.body.append(el);
    el.addEventListener("animationend", () => el.remove());
  }
}
