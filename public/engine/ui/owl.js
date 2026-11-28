// The owl: the child's companion everywhere in AnkaPlay. Each child chooses their own owl when they are added: the
// same owl, with a hat in one of seven colours (profiles.HATS). A guest plays with the owl without a hat, its ear
// tufts showing. One drawing, kept as plain shapes, so it is drawn as an <svg> on screens and, with the same
// paths, on a <canvas> (the Berg's keepsake picture).
//
//   owl(hat, className)   a <span> with the owl as <svg>, 1em wide: its size comes from the font-size
//   myOwl(className)      the same, with the hat of the child playing now
//   drawOwl(g, x, y, size, hat)   the owl on a canvas, its box's top left at x, y

import * as profiles from "../profiles.js";

const BODY = "#9a7656";
const WING = "#7c5b3f";
const BELLY = "#ecdcc3";
const EYE = "#fff";
const INK = "#1b2140";
const BEAK = "#e8902f";
const SHADE = "rgba(27, 33, 64, 0.2)";

const circle = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

// In a 40 × 40 box: [path, colour]. The ear tufts only without a hat; the hat is drawn last, over the head.
const TUFTS = [["M10 14L8.2 4.8L16 10.5Z", BODY], ["M30 14L31.8 4.8L24 10.5Z", BODY]];
const OWL = [
  ["M20 8.5C29 8.5 33 15.5 33 24.5C33 32.5 27.5 38 20 38C12.5 38 7 32.5 7 24.5C7 15.5 11 8.5 20 8.5Z", BODY],
  ["M20 23C25.8 23 28.4 27.6 28.4 31.4C28.4 35.2 24.8 37.6 20 37.6C15.2 37.6 11.6 35.2 11.6 31.4C11.6 27.6 14.2 23 20 23Z", BELLY],
  ["M7.4 22.5C4.9 26.5 5.6 32.2 9.6 35.2C10.1 30.2 9.6 25.5 7.4 22.5Z", WING],
  ["M32.6 22.5C35.1 26.5 34.4 32.2 30.4 35.2C29.9 30.2 30.4 25.5 32.6 22.5Z", WING],
  [circle(14.3, 20, 5.8), EYE],
  [circle(25.7, 20, 5.8), EYE],
  [circle(14.9, 20.4, 2.7), INK],
  [circle(25.1, 20.4, 2.7), INK],
  [circle(15.8, 19.4, 0.9), EYE],
  [circle(26, 19.4, 0.9), EYE],
  ["M17.9 24.4H22.1L20 27.8Z", BEAK],
  ["M14.6 37.1h3.8v1.7h-3.8Z", BEAK],
  ["M21.6 37.1h3.8v1.7h-3.8Z", BEAK],
];
// A woolly hat with a bobble: the dome, the turned-up brim (the hat's colour, a little darker), the bobble.
const HAT = (c) => [
  ["M8.8 13C8.8 6.6 13.6 3.4 20 3.4C26.4 3.4 31.2 6.6 31.2 13Z", c],
  ["M8 11.6H32V15Q20 16.6 8 15Z", c],
  ["M8 11.6H32V15Q20 16.6 8 15Z", SHADE],
  [circle(20, 3.2, 2.7), "#fff"],
];

function parts(hat) {
  const c = profiles.HATS.find((h) => h.id === hat)?.color;
  return c ? [...OWL, ...HAT(c)] : [...TUFTS, ...OWL];
}

export function owlSvg(hat) {
  const paths = parts(hat).map(([d, fill]) => `<path d="${d}" fill="${fill}"/>`).join("");
  return `<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">${paths}</svg>`;
}

export function owl(hat = null, className = "owl") {
  const s = document.createElement("span");
  s.className = `mascot ${className}`.trim();
  s.innerHTML = owlSvg(hat);
  return s;
}

export const myOwl = (className) => owl(profiles.current()?.hat ?? null, className);

export function drawOwl(g, x, y, size, hat) {
  g.save();
  g.translate(x, y);
  g.scale(size / 40, size / 40);
  for (const [d, fill] of parts(hat)) {
    g.fillStyle = fill;
    g.fill(new Path2D(d));
  }
  g.restore();
}
