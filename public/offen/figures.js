// The figures of the open Tal, drawn here as light vector shapes (no emoji, no picture files): the same few
// figures come back at every place. Plain and calm: few colours, no outlines, one shared definition per figure
// (<symbol>, drawn with <use>), so even a slow phone draws a pond full of frogs easily.
//
//   mountFigures()        once per screen: the shared definitions
//   figure("frog")        an <svg> that shows one figure; also "star", "ring" (a frog under water), "mask", "pad"

const NS = "http://www.w3.org/2000/svg";

const SYMBOLS = {
  // A sitting frog seen from the front: body, two eye bumps, a smile.
  frog: `<symbol id="fig-frog" viewBox="0 0 40 40">
      <ellipse cx="20" cy="26" rx="15" ry="11" class="f-body"/>
      <circle cx="12.5" cy="14.5" r="6" class="f-body"/><circle cx="27.5" cy="14.5" r="6" class="f-body"/>
      <ellipse cx="20" cy="30" rx="8.5" ry="5.5" class="f-belly"/>
      <circle cx="12.5" cy="14" r="3.4" class="f-eye"/><circle cx="27.5" cy="14" r="3.4" class="f-eye"/>
      <circle cx="13.2" cy="14.4" r="1.7" class="f-ink"/><circle cx="28.2" cy="14.4" r="1.7" class="f-ink"/>
      <path d="M14.5 24.5q5.5 4 11 0" class="f-line"/>
    </symbol>`,
  star: `<symbol id="fig-star" viewBox="0 0 40 40">
      <path d="M20 3.5l4.9 10.4 11.4 1.4-8.4 7.8 2.2 11.3L20 28.8 9.9 34.4l2.2-11.3-8.4-7.8 11.4-1.4z" class="f-star"/>
    </symbol>`,
  // Where a frog dove: two rings on the water.
  ring: `<symbol id="fig-ring" viewBox="0 0 40 40">
      <ellipse cx="20" cy="22" rx="13" ry="5" class="f-ring"/><ellipse cx="20" cy="22" rx="6.5" ry="2.4" class="f-ring"/>
    </symbol>`,
  // A funny eye mask, drawn in the frog's own box so it sits right over the eyes; the eyes look through the holes.
  mask: `<symbol id="fig-mask" viewBox="0 0 40 40">
      <path d="M3 12Q20 5 37 12Q39.5 20.5 31 21.8Q24 22.6 20 18.6Q16 22.6 9 21.8Q.5 20.5 3 12ZM9 14.5a3.5 2.8 0 1 0 7 0a3.5 2.8 0 1 0-7 0ZM24 14.5a3.5 2.8 0 1 0 7 0a3.5 2.8 0 1 0-7 0Z" fill-rule="evenodd" class="f-mask"/>
      <path d="M3 13.5l-2.5-2.5M37 13.5l2.5-2.5" class="f-line"/>
    </symbol>`,
  // Signs on buttons, so a child who cannot read knows them: done (a tick), no (a cross), on (an arrow).
  ok: `<symbol id="fig-ok" viewBox="0 0 40 40"><path d="M8 21l8 8 16-17" class="f-sign"/></symbol>`,
  no: `<symbol id="fig-no" viewBox="0 0 40 40"><path d="M11 11l18 18M29 11L11 29" class="f-sign"/></symbol>`,
  next: `<symbol id="fig-next" viewBox="0 0 40 40"><path d="M8 20h22M21 10l10 10-10 10" class="f-sign"/></symbol>`,
  // A lily pad with its notch, stretched to the size of its place.
  pad: `<symbol id="fig-pad" viewBox="0 0 200 120" preserveAspectRatio="none">
      <path d="M100 60L29.8 21.8A96 56 0 1 1 23.3 26.3Z"/>
    </symbol>`,
};

export function mountFigures() {
  if (document.getElementById("fig-defs")) return;
  const svg = document.createElementNS(NS, "svg");
  svg.id = "fig-defs";
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.innerHTML = Object.values(SYMBOLS).join("");
  document.body.prepend(svg);
}

/** One figure as an <svg> element that fills its box. */
export function figure(name, className = "") {
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", `fig fig-${name} ${className}`.trim());
  svg.setAttribute("aria-hidden", "true");
  if (name === "pad") svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("viewBox", name === "pad" ? "0 0 200 120" : "0 0 40 40");
  const use = document.createElementNS(NS, "use");
  use.setAttribute("href", `#fig-${name}`);
  svg.append(use);
  return svg;
}
