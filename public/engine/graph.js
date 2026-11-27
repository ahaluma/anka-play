// The universe as a graph: which stations a child can see, open and reach, and what is near what.
// Pure functions, no DOM, no storage: everything about the child comes in as `facts`, so the same code runs
// in the browser, in tools/check-graph.mjs and in tests. See docs/DESIGN.md, section 4.
//
// facts = {
//   age: 7,
//   mastered: (station) => boolean,          // every idea of the station mastered (engine/learner.js)
//   ideaMastered: (idea) => boolean,         // all the idea's perspectives (1 to 5) starred in its mastery group
//   starred: (station, perspective) => boolean,
//   flag: (station, group) => boolean,       // all perspectives of the station's ideas starred in that group
//   rounds: (station) => number,
//   visited: (station) => boolean,
//   parent: (key) => boolean,                // a switch on the parents' page
//   ready?: (station) => boolean,            // optional: has the station something to play yet? Guidance skips it
// }

import { MAPS, STATIONS, EDGES, HOME, HOME_DOORS, BANDS } from "../content/universe.js";

export const STATIONS_BY_ID = Object.fromEntries(STATIONS.map((s) => [s.id, s]));
export const station = (id) => STATIONS_BY_ID[id] || null;
export const map = (id) => MAPS.find((m) => m.id === id) || null;
export const bandOf = (stationId) => map(station(stationId)?.map)?.band ?? null;

/** One checker per condition type. A new type is one new line here, nothing else changes. */
/** A pure game station is mastered from the start: it never blocks what depends on it. */
export const isMastered = (id, facts) => !!station(id)?.game || facts.mastered(id);

export const CONDITIONS = {
  age: (n, f) => (f.age ?? 0) >= n,
  mastered: (ids, f) => ids.every((s) => isMastered(s, f)),
  idea: (ids, f) => [ids].flat().every((i) => f.ideaMastered(i)), // ideas mastered, wherever they live
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
export const stationOpen = (id, facts) => !!station(id)?.game || holds(station(id)?.open ?? "always", facts); // a game is always open

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

/** The journey (decided): nearness guides the child from station to station, the way the Denk-Berg's camps
 *  lead upwards. next() is the nearest station that is reachable, open and not mastered yet, same band only.
 *  How a map shows it is its `guide`:
 *    tour     small children: after a round the guide walks the child along the path to next() (Tal)
 *    hint     the map marks next() and the station screen points at it; the child may go anywhere (Fluss, Feld)
 *    glimpse  next() plus glimpse(): near stations still in the fog or locked, with what opens them,
 *             to wake curiosity (Berg)
 *  A suggestion, never a lock: conditions alone decide what is open. */
export function next(id, facts) {
  const can = reachable(facts);
  const ready = (s) => facts.ready?.(s) ?? true;
  const candidates = near(id, 0).filter((x) => can.has(x.id) && ready(x.id) && stationOpen(x.id, facts) && !isMastered(x.id, facts));
  if (candidates.length) return candidates[0].id;
  // Nothing near is left: the nearest unmastered reachable station on the same map, then any in the band.
  const here = station(id);
  const rest = STATIONS.filter((s) => s.id !== id && bandOf(s.id) === bandOf(id) && can.has(s.id) && ready(s.id) &&
    stationOpen(s.id, facts) && !isMastered(s.id, facts));
  return (rest.find((s) => s.map === here.map) ?? rest[0])?.id ?? null;
}
export const suggest = next;

/** Near stations the child cannot play yet, with the condition that would open the way: what to be curious about. */
export function glimpse(id, facts, min = 0.4) {
  const can = reachable(facts);
  return near(id, min)
    .filter((x) => !can.has(x.id) || !stationOpen(x.id, facts))
    .map((x) => ({ ...x, opens: EDGES.find((e) => e.to === x.id && e.requires && !edgeOpen(e, facts))?.requires ?? station(x.id).open ?? null }));
}

/** PROPOSED and accepted: review tasks. Near stations of the same band the child has mastered: one of their
 *  ideas gives one task per round (policy `review`). */
export const reviewFrom = (id, facts, min = 0.5) => near(id, min).filter((x) => isMastered(x.id, facts)).map((x) => x.id);

export { BANDS };
