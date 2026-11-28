// The two portals at the bottom of every place (places.js): a door with a small picture of where it leads, and
// the place's name below it. The pictures are tiny vector scenes in the colours of the open Tal, no files.

import { el, link } from "../engine/ui/parts.js";
import { shared as T } from "../engine/i18n.js";
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
  // A path of number stones in the grass, a butterfly above.
  wiese: `<rect x="0" y="22" width="60" height="18" rx="4" class="m-grass"/>
    <circle cx="10" cy="31" r="5" class="m-stone"/><circle cx="23" cy="31" r="5" class="m-stone"/><circle cx="36" cy="31" r="5" class="m-stone"/><circle cx="49" cy="31" r="5" class="m-stone"/>
    <ellipse cx="27" cy="11" rx="5" ry="6" class="m-wing"/><ellipse cx="35" cy="11" rx="5" ry="6" class="m-wing"/>`,
  // Two fir trees and a row: mushroom, leaf, mushroom, leaf.
  waldrand: `<path d="M8 30 16 4 24 30Z" class="m-fir"/><path d="M36 30 44 6 52 30Z" class="m-fir"/>
    <path d="M4 37a5 5 0 0 1 10 0Z" class="m-apple"/><ellipse cx="22" cy="35" rx="4" ry="2.5" class="m-pad"/>
    <path d="M30 37a5 5 0 0 1 10 0Z" class="m-apple"/><ellipse cx="48" cy="35" rx="4" ry="2.5" class="m-pad"/>`,
  // Sky with a sun and three birds flying in a row.
  himmel: `<rect x="0" y="0" width="60" height="40" rx="6" class="m-sky"/><circle cx="48" cy="11" r="6" class="m-sun"/>
    <path d="M8 26q4-4 8 0q4-4 8 0M22 18q4-4 8 0q4-4 8 0M36 28q4-4 8 0q4-4 8 0" class="m-flight"/>`,
  // Three nests on a branch, blue, yellow and red eggs.
  nester: `<path d="M2 18h56" class="m-branch"/>
    <path d="M4 26a8 6 0 0 0 16 0Z" class="m-nest"/><ellipse cx="12" cy="24" rx="3" ry="4" class="m-blue"/>
    <path d="M22 34a8 6 0 0 0 16 0Z" class="m-nest"/><ellipse cx="30" cy="32" rx="3" ry="4" class="m-yellow"/>
    <path d="M40 26a8 6 0 0 0 16 0Z" class="m-nest"/><ellipse cx="48" cy="24" rx="3" ry="4" class="m-apple"/>`,
  // A puddle with a leaf on it and a flower mirrored in it.
  pfuetze: `<ellipse cx="30" cy="27" rx="27" ry="11" class="m-water"/>
    <path d="M18 4v12" class="m-stalk"/><circle cx="18" cy="5" r="4" class="m-yellow"/>
    <path d="M18 22v8" class="m-stalk m-faint"/><circle cx="18" cy="32" r="3.5" class="m-yellow m-faint"/>
    <path d="M36 28c-1-6 4-10 11-9c0 6-5 10-11 9Z" class="m-pad"/>`,
  // A hill with a bench, a hare on it.
  huegel: `<path d="M0 38Q30 6 60 38Z" class="m-grass"/>
    <rect x="17" y="23" width="26" height="4" rx="1.5" class="m-trunk"/><rect x="19" y="27" width="3" height="7" class="m-trunk"/><rect x="38" y="27" width="3" height="7" class="m-trunk"/>
    <ellipse cx="28" cy="12" rx="1.6" ry="4.5" class="m-ear"/><ellipse cx="32" cy="12" rx="1.6" ry="4.5" class="m-ear"/><circle cx="30" cy="19" r="4.5" class="m-ear"/>`,
  // A stream with stones of different shapes on the bank.
  bach: `<path d="M0 6Q30 16 60 6V18Q30 28 0 18Z" class="m-water"/>
    <circle cx="12" cy="31" r="5" class="m-stone"/><path d="M24 36 30 25 36 36Z" class="m-stone"/><rect x="42" y="27" width="10" height="10" rx="1" class="m-stone"/>`,
  // Home: a little house.
  home: `<rect x="17" y="17" width="26" height="19" rx="1.5" class="m-wall"/><path d="M13 19 30 5 47 19Z" class="m-roof"/>
    <rect x="26" y="25" width="8" height="11" rx="1" class="m-trunk"/>`,
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

/** The portals of a place: the neighbour on one side, Home in the middle, the neighbour on the other side
 *  (asked for 28.11.: a way Home at every place, and the portals half as high). names: the places' names. */
export function portals(here, names, label) {
  const box = el("nav", "portals");
  box.setAttribute("aria-label", label);
  const [a, b] = placeById[here].links;
  for (const [id, href, name] of [[a, `#/${a}`, names[a]], ["home", "#/", names.home ?? T.labels.home], [b, `#/${b}`, names[b]]]) {
    const p = link(`portal portal-${id}`, href);
    p.setAttribute("aria-label", name);
    const door = el("span", "portal-door");
    door.append(el("span", "portal-light"));
    p.append(door, miniScene(id, "portal-mini"), el("span", "portal-name", name));
    box.append(p);
  }
  return box;
}
