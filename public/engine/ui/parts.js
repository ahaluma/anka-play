// Small building blocks every board and screen uses: elements, a group of pictures in rows of five,
// a number sign with its dots, number buttons. No game logic here.

export const el = (tag, className = "", text) => {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
};

export const button = (className, label, text) => {
  const b = el("button", className, text);
  b.type = "button";
  if (label) b.setAttribute("aria-label", label);
  return b;
};

export const link = (className, href, text) => {
  const a = el("a", className, text);
  a.href = href;
  return a;
};

/** n pictures, five in a row, so 5 and 10 are seen at once. More than ten: smaller. */
export function group(n, icon, className = "") {
  const g = el("span", "pics " + className + (n > 10 ? " many" : ""));
  for (let i = 0; i < n; i++) g.append(el("span", "pic pop", icon));
  return g;
}

/** That many dots in rows of five. */
export function dots(n, className = "num-dots") {
  const d = el("span", className);
  for (let i = 0; i < n; i++) d.append(el("i"));
  return d;
}

/** A sign with a number and (up to 10) its dots. */
export function sign(n, num, withDots = n <= 10) {
  const s = el("div", "sign");
  s.append(el("b", "", num(n)));
  if (withDots) s.append(dots(n, "sign-dots"));
  return s;
}

export function shake(node) {
  node.classList.remove("shake");
  void node.offsetWidth; // restart the animation
  node.classList.add("shake");
}

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Inline SVG icons, so there are no image files to load. */
export const icons = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5 9.5 18 20 6"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
};
