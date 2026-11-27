// The universe as a graph: which stations a child can see, open and reach, and what is near what.
// Pure functions, no DOM, no storage: everything about the child comes in as `facts`, so the same code runs
// in the browser, in tools/check-graph.mjs and in tests. See docs/DESIGN.md, section 4.
//
// facts = {
//   age: 7,
//   mastered: (station) => boolean,          // all the station's perspectives (1 to 5) starred (engine/learner.js)
//   starred: (station, perspective) => boolean,
//   flag: (station, group) => boolean,       // all the station's perspectives starred in that group of the ladder
//   rounds: (station) => number,
//   visited: (station) => boolean,
//   parent: (key) => boolean,                // a switch on the parents' page
// }

import { MAPS, STATIONS, EDGES, HOME, HOME_DOORS, BANDS } from "../content/universe.js";

export const station = (id) => STATIONS.find((s) => s.id === id) || null;
export const map = (id) => MAPS.find((m) => m.id === id) || null;
export const bandOf = (stationId) => map(station(stationId)?.map)?.band ?? null;

/** One checker per condition type. A new type is one new line here, nothing else changes. */
export const CONDITIONS = {
  age: (n, f) => (f.age ?? 0) >= n,
  mastered: (ids, f) => ids.every((s) => f.mastered(s)),
  perspective: ({ station: s, p }, f) => f.starred(s, p),
  flag: ({ station: s, group }, f) => f.flag(s, group),
  rounds: ({ station: s, n }, f) => f.rounds(s) >= n,
  visited: (s, f) => f.visited(s),
  reached: (mapId, f) => STATIONS.some((s) => s.map === mapId && f.visited(s.id)),
  parent: (key, f) => f.parent(key),
  all: (list, f) => list.every((c) => holds(c, f)),
  any: (list, f) => list.some((c) => holds(c, f)),
  not: (c, f) => !holds(c, f),
};

/** Does a condition hold? null and "always" always hold. */
export function holds(cond, facts) {
  if (cond == null || cond === "always") return true;
  const [type, arg] = Object.entries(cond)[0] ?? [];
  const check = CONDITIONS[type];
  if (!check) throw new Error(`Unknown condition type: ${type}`);
  return check(arg, facts);
}

const walkable = (e) => e.kind === "path" || e.kind === "portal";

/** The Home edges the engine adds by itself: Home -> every map's entry and back, always open. */
export function homeEdges() {
  return MAPS.flatMap((m) => [
    { from: HOME, to: m.entry, kind: "home", requires: HOME_DOORS.find((d) => d.map === m.id)?.requires ?? null },
    ...STATIONS.filter((s) => s.map === m.id).map((s) => ({ from: s.id, to: HOME, kind: "home", requires: null })),
  ]);
}

export const allEdges = () => [...EDGES, ...homeEdges()];

/** Is the way along this edge open? */
export const edgeOpen = (edge, facts) => walkable(edge) || edge.kind === "home" ? holds(edge.requires, facts) : false;

/** Is the station's own door open (whichever way the child came)? */
export const stationOpen = (id, facts) => holds(station(id)?.open ?? "always", facts);

/** The ways out of a node, as a station screen or the map draws them. */
export const outgoing = (id) => allEdges().filter((e) => e.from === id && (walkable(e) || e.kind === "home"));

/** Every station the child can get to: a walk from Home along open edges. Locked doors stop the walk. */
export function reachable(facts) {
  const seen = new Set([HOME]);
  const todo = [HOME];
  while (todo.length) {
    const here = todo.pop();
    if (here !== HOME && !stationOpen(here, facts)) continue; // can stand at the door, not walk through
    for (const e of outgoing(here)) {
      if (!seen.has(e.to) && edgeOpen(e, facts)) {
        seen.add(e.to);
        todo.push(e.to);
      }
    }
  }
  seen.delete(HOME);
  return seen;
}

/** Is a station drawn on its map? Listed in `shows`, visited, or an open path from a drawn station leads
 *  to it (the fog lifts when the way opens). */
export function visible(id, facts) {
  const s = station(id);
  if (!s) return false;
  if (map(s.map).shows.includes(id) || facts.visited(id)) return true;
  return EDGES.some((e) => e.to === id && e.kind === "path" && edgeOpen(e, facts) &&
    (map(s.map).shows.includes(e.from) || facts.visited(e.from)));
}

/** The first-visit questions of a station: the gate of a portal into it. Asked once, whichever way the
 *  child comes in first. Never blocks: the answers only choose the starting rung. */
export const gateOf = (id) => EDGES.find((e) => e.to === id && e.gate)?.gate ?? null;

/** Nearness between two stations (0 when nothing says so). Symmetric. */
export function nearness(a, b) {
  const e = EDGES.find((x) => (x.from === a && x.to === b) || (x.from === b && x.to === a));
  return e?.nearness ?? 0;
}

/** Stations near this one, nearest first, same band only (preschool and school are never mixed). */
export function near(id, min = 0.5) {
  const band = bandOf(id);
  return STATIONS.filter((s) => s.id !== id && bandOf(s.id) === band)
    .map((s) => ({ id: s.id, nearness: nearness(id, s.id) }))
    .filter((x) => x.nearness >= min)
    .sort((a, b) => b.nearness - a.nearness);
}

/** PROPOSED (docs/DESIGN.md, open question 3): the next station to suggest after `id`: the nearest
 *  station that is reachable and not mastered yet. A suggestion, never a lock. */
export function suggest(id, facts) {
  const can = reachable(facts);
  return near(id, 0).find((x) => can.has(x.id) && stationOpen(x.id, facts) && !facts.mastered(x.id))?.id ?? null;
}

export { BANDS };
