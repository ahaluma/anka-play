// The figures of the open Tal, drawn here as light vector shapes (no emoji, no picture files): the same few
// figures come back at every place. Plain and calm: few colours, no outlines, one shared definition per figure
// (<symbol>, drawn with <use>), so even a slow phone draws a pond full of frogs easily.
//
//   mountFigures()        once per screen: the shared definitions
//   figure("frog")        an <svg> that shows one figure; also "apple", "hare", "star", "ring" (a frog under water),
//                         "mask", "pad"

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
  // A round apple with a stalk and a leaf.
  apple: `<symbol id="fig-apple" viewBox="0 0 40 40">
      <path d="M20 12C13 7 5 11 5 21c0 9 6 16 11 16c2 0 3-1 4-1s2 1 4 1c5 0 11-7 11-16c0-10-8-14-15-9Z" class="f-apple"/>
      <path d="M20 12q0-5 3-8" class="f-stalk"/><path d="M22 8q5-5 10-2q-4 5-10 2Z" class="f-leaf"/>
      <ellipse cx="13" cy="19" rx="2.5" ry="4" class="f-shine"/>
    </symbol>`,
  // A hare seen from the front: two long ears, a round head, eyes, a pink nose.
  hare: `<symbol id="fig-hare" viewBox="0 0 40 40">
      <ellipse cx="14" cy="11" rx="4" ry="10" class="f-fur"/><ellipse cx="26" cy="11" rx="4" ry="10" class="f-fur"/>
      <ellipse cx="14" cy="12" rx="1.8" ry="7" class="f-ear"/><ellipse cx="26" cy="12" rx="1.8" ry="7" class="f-ear"/>
      <ellipse cx="20" cy="28" rx="13" ry="11" class="f-fur"/>
      <ellipse cx="20" cy="32" rx="7" ry="5" class="f-muzzle"/>
      <circle cx="15" cy="25" r="2" class="f-ink"/><circle cx="25" cy="25" r="2" class="f-ink"/>
      <ellipse cx="20" cy="30" rx="2.2" ry="1.6" class="f-nose"/>
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
  // ---- The newer places (tal.js). Colours come from offen.css; a bird takes its colour from --bird.
  falter: `<symbol id="fig-falter" viewBox="0 0 40 40">
      <ellipse cx="12" cy="14" rx="9" ry="10" class="f-wing"/><ellipse cx="28" cy="14" rx="9" ry="10" class="f-wing"/>
      <ellipse cx="13" cy="28" rx="6.5" ry="7" class="f-wing2"/><ellipse cx="27" cy="28" rx="6.5" ry="7" class="f-wing2"/>
      <rect x="18.3" y="9" width="3.4" height="24" rx="1.7" class="f-ink"/>
      <path d="M19 9q-3-5-6-6M21 9q3-5 6-6" class="f-line"/>
    </symbol>`,
  pilz: `<symbol id="fig-pilz" viewBox="0 0 40 40">
      <rect x="15" y="18" width="10" height="17" rx="4" class="f-stem"/>
      <path d="M4 21C4 9 36 9 36 21Z" class="f-cap"/>
      <circle cx="14" cy="15" r="2.4" class="f-dot"/><circle cx="24" cy="13.5" r="2" class="f-dot"/><circle cx="29" cy="18" r="1.6" class="f-dot"/>
    </symbol>`,
  blatt: `<symbol id="fig-blatt" viewBox="0 0 40 40">
      <path d="M8 33C6 17 18 5 34 6C35 22 24 34 8 33Z" class="f-leafbig"/>
      <path d="M9 32L30 10" class="f-vein"/>
    </symbol>`,
  beere: `<symbol id="fig-beere" viewBox="0 0 40 40">
      <circle cx="14" cy="25" r="8" class="f-berry"/><circle cx="26" cy="25" r="8" class="f-berry"/><circle cx="20" cy="15" r="8" class="f-berry"/>
      <path d="M20 7q2-4 6-4" class="f-stalk"/>
    </symbol>`,
  zapfen: `<symbol id="fig-zapfen" viewBox="0 0 40 40">
      <path d="M20 3C30 10 31 26 20 37C9 26 10 10 20 3Z" class="f-cone"/>
      <path d="M13 14q7 4 14 0M11.5 21q8.5 5 17 0M13 28q7 4 14 0" class="f-scale"/>
    </symbol>`,
  vogel: `<symbol id="fig-vogel" viewBox="0 0 40 40">
      <ellipse cx="19" cy="24" rx="14" ry="11" class="f-bird"/>
      <circle cx="28" cy="14" r="8" class="f-bird"/>
      <path d="M35 13l5 2.5-5 2.5Z" class="f-beak"/>
      <circle cx="30" cy="12.5" r="1.8" class="f-ink"/>
      <path d="M8 22q8 10 18 2" class="f-wingline"/>
    </symbol>`,
  maus: `<symbol id="fig-maus" viewBox="0 0 40 40">
      <circle cx="11" cy="13" r="7" class="f-mouse"/><circle cx="29" cy="13" r="7" class="f-mouse"/>
      <circle cx="11" cy="13" r="4" class="f-ear"/><circle cx="29" cy="13" r="4" class="f-ear"/>
      <ellipse cx="20" cy="26" rx="12" ry="11" class="f-mouse"/>
      <circle cx="15.5" cy="24" r="1.8" class="f-ink"/><circle cx="24.5" cy="24" r="1.8" class="f-ink"/>
      <circle cx="20" cy="30" r="2" class="f-nose"/>
    </symbol>`,
  schnecke: `<symbol id="fig-schnecke" viewBox="0 0 40 40">
      <path d="M3 34h30q4 0 5-5" class="f-slug"/>
      <circle cx="18" cy="22" r="11" class="f-shell"/><path d="M18 22m-6 0a6 6 0 1 0 6-6a3 3 0 1 0 0 6" class="f-curl"/>
      <path d="M33 28l2-9M37 29l3-8" class="f-line"/>
    </symbol>`,
  blume: `<symbol id="fig-blume" viewBox="0 0 40 40">
      <path d="M20 22v16" class="f-stalk"/>
      <circle cx="20" cy="8" r="6" class="f-petal"/><circle cx="29" cy="15" r="6" class="f-petal"/><circle cx="11" cy="15" r="6" class="f-petal"/>
      <circle cx="25" cy="24" r="6" class="f-petal"/><circle cx="15" cy="24" r="6" class="f-petal"/>
      <circle cx="20" cy="17" r="5" class="f-heart"/>
    </symbol>`,
  stein: `<symbol id="fig-stein" viewBox="0 0 40 40"><path d="M4 32C3 20 12 12 22 13C32 14 38 22 36 32Z" class="f-stone"/></symbol>`,
  gras: `<symbol id="fig-gras" viewBox="0 0 40 40"><path d="M6 37Q8 18 4 8Q13 20 14 37ZM15 37Q18 14 20 3Q24 16 25 37ZM26 37Q30 20 37 10Q32 24 34 37Z" class="f-grass"/></symbol>`,
  kuerbis: `<symbol id="fig-kuerbis" viewBox="0 0 40 40">
      <ellipse cx="13" cy="24" rx="9" ry="12" class="f-pumpkin"/><ellipse cx="27" cy="24" rx="9" ry="12" class="f-pumpkin"/>
      <ellipse cx="20" cy="24" rx="8" ry="13" class="f-pumpkin2"/><path d="M20 11q0-5 4-7" class="f-stalk"/>
    </symbol>`,
  kiesel: `<symbol id="fig-kiesel" viewBox="0 0 40 40"><ellipse cx="20" cy="28" rx="9" ry="6" class="f-stone"/></symbol>`,
  wolke: `<symbol id="fig-wolke" viewBox="0 0 40 40"><path d="M9 28a7 7 0 0 1 1-14a9 9 0 0 1 17-2a7 7 0 0 1 4 16Z" class="f-cloud"/></symbol>`,
  regen: `<symbol id="fig-regen" viewBox="0 0 40 40"><path d="M9 22a7 7 0 0 1 1-14a9 9 0 0 1 17-2a7 7 0 0 1 4 16Z" class="f-cloud dark"/>
      <path d="M12 27l-2 6M20 27l-2 6M28 27l-2 6" class="f-rain"/></symbol>`,
  regenbogen: `<symbol id="fig-regenbogen" viewBox="0 0 40 40"><path d="M4 32a16 16 0 0 1 32 0" class="f-rb1"/><path d="M8.5 32a11.5 11.5 0 0 1 23 0" class="f-rb2"/><path d="M13 32a7 7 0 0 1 14 0" class="f-rb3"/></symbol>`,
  ei: `<symbol id="fig-ei" viewBox="0 0 40 40"><ellipse cx="20" cy="22" rx="11" ry="14" class="f-egg"/></symbol>`,
  riss: `<symbol id="fig-riss" viewBox="0 0 40 40"><ellipse cx="20" cy="22" rx="11" ry="14" class="f-egg"/><path d="M10 20l4 3 3-4 3 4 3-4 3 4 4-3" class="f-crack"/></symbol>`,
  kueken: `<symbol id="fig-kueken" viewBox="0 0 40 40"><path d="M9 30q11 9 22 0l-2 6H11Z" class="f-egg"/><circle cx="20" cy="20" r="10" class="f-chick"/>
      <circle cx="17" cy="18" r="1.6" class="f-ink"/><circle cx="23" cy="18" r="1.6" class="f-ink"/><path d="M18 22h4l-2 3Z" class="f-beak"/></symbol>`,
  samen: `<symbol id="fig-samen" viewBox="0 0 40 40"><path d="M2 28h36v10H2Z" class="f-soil"/><ellipse cx="20" cy="32" rx="3.5" ry="2.2" class="f-seed"/></symbol>`,
  keim: `<symbol id="fig-keim" viewBox="0 0 40 40"><path d="M2 28h36v10H2Z" class="f-soil"/><path d="M20 30V18" class="f-stalk"/>
      <path d="M20 20q-8-1-9-8q8 0 9 8ZM20 18q6-6 11-4q-4 6-11 4Z" class="f-leaf"/></symbol>`,
  bluete: `<symbol id="fig-bluete" viewBox="0 0 40 40"><path d="M2 32h36v8H2Z" class="f-soil"/><path d="M20 32V16" class="f-stalk"/>
      <circle cx="20" cy="7" r="4.5" class="f-petal"/><circle cx="26" cy="12" r="4.5" class="f-petal"/><circle cx="14" cy="12" r="4.5" class="f-petal"/>
      <circle cx="23" cy="18" r="4.5" class="f-petal"/><circle cx="17" cy="18" r="4.5" class="f-petal"/><circle cx="20" cy="13" r="3.6" class="f-heart"/></symbol>`,
  kreis: `<symbol id="fig-kreis" viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" class="f-shape"/></symbol>`,
  dreieck: `<symbol id="fig-dreieck" viewBox="0 0 40 40"><path d="M20 4L37 34H3Z" class="f-shape"/></symbol>`,
  quadrat: `<symbol id="fig-quadrat" viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" rx="2" class="f-shape"/></symbol>`,
  rechteck: `<symbol id="fig-rechteck" viewBox="0 0 40 40"><rect x="2" y="11" width="36" height="18" rx="2" class="f-shape"/></symbol>`,
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
