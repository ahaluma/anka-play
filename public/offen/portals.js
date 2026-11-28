// The two portals at the bottom of every place (places.js): a door with a small picture of where it leads, and
// the place's name below it. The pictures are tiny vector scenes in the colours of the open Tal, no files.

import { el, link } from "../engine/ui/parts.js";
import { placeById } from "./places.js";

/** The small picture of each place, in a 60 × 40 box. */
const MINI = {
  // Water with the green and the reddish lily pad.
  teich: `<ellipse cx="30" cy="24" rx="28" ry="14" class="m-water"/>
    <path d="M19 24 11.5 20.3A10 6 0 1 1 10.8 21Z" class="m-pad"/>
    <path d="M42 22 35.6 19A8.5 5 0 1 1 35 19.7Z" class="m-pad-rose"/>`,
  // A tree with a round crown and red apples.
  apfelbaum: `<rect x="27" y="22" width="6" height="15" rx="2" class="m-trunk"/>
    <ellipse cx="30" cy="17" rx="17" ry="13" class="m-crown"/>
    <circle cx="22" cy="15" r="2.6" class="m-apple"/><circle cx="34" cy="11" r="2.6" class="m-apple"/>
    <circle cx="37" cy="20" r="2.6" class="m-apple"/><circle cx="27" cy="22" r="2.6" class="m-apple"/>
    <ellipse cx="30" cy="37" rx="22" ry="3" class="m-grass"/>`,
  // A hill with the dark hole of the burrow and two ears looking out.
  bau: `<path d="M2 38Q30 2 58 38Z" class="m-hill"/>
    <ellipse cx="30" cy="31" rx="9" ry="7" class="m-hole"/>
    <ellipse cx="27" cy="24" rx="1.8" ry="5" class="m-ear"/><ellipse cx="33" cy="24" rx="1.8" ry="5" class="m-ear"/>`,
  // The memory tables: two cards each, showing what is paired there.
  "memory-zahlen": `<rect x="6" y="5" width="21" height="30" rx="4" class="m-card"/><text x="16.5" y="27" class="m-num">3</text>
    <rect x="33" y="5" width="21" height="30" rx="4" class="m-card"/>
    <circle cx="39" cy="14" r="2.4" class="m-dot"/><circle cx="48" cy="20" r="2.4" class="m-dot"/><circle cx="39" cy="26" r="2.4" class="m-dot"/>`,
  "memory-formen": `<rect x="6" y="5" width="21" height="30" rx="4" class="m-card"/><circle cx="16.5" cy="20" r="6.5" class="m-apple"/>
    <rect x="33" y="5" width="21" height="30" rx="4" class="m-card"/><path d="M43.5 12.5L51 26.5H36Z" class="m-blue"/>`,
  "memory-rechnen": `<rect x="2" y="5" width="30" height="30" rx="4" class="m-card"/><text x="17" y="25" class="m-sum">2+3</text>
    <rect x="37" y="5" width="21" height="30" rx="4" class="m-card"/><text x="47.5" y="27" class="m-num">5</text>`,
};

export function miniScene(id, className = "mini") {
  const s = el("span", className);
  s.innerHTML = `<svg viewBox="0 0 60 40" aria-hidden="true" focusable="false">${MINI[id] ?? ""}</svg>`;
  return s;
}

/** The portals of a place. names: the places' names in the current language. */
export function portals(here, names, label) {
  const box = el("nav", "portals");
  box.setAttribute("aria-label", label);
  for (const id of placeById[here].links) {
    const a = link(`portal portal-${id}`, `#/${id}`);
    a.setAttribute("aria-label", names[id]);
    const door = el("span", "portal-door");
    door.append(el("span", "portal-light"));
    a.append(door, miniScene(id, "portal-mini"), el("span", "portal-name", names[id]));
    box.append(a);
  }
  return box;
}
