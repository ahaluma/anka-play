// Checks the universe in public/content/universe.js. Run: node tools/check-graph.mjs
// Prints every problem and exits with 1 if there is one. Warnings (layout) do not fail.

import { MAPS, STATIONS, EDGES, HOME } from "../public/content/universe.js";
import { reachable, visible, stationOpen, bandOf, allEdges, holds } from "../public/engine/graph.js";

const problems = [];
const warnings = [];
const ids = new Set(STATIONS.map((s) => s.id));
const mapIds = new Set(MAPS.map((m) => m.id));

// 1. Ids and references
const dup = (list) => list.filter((x, i) => list.indexOf(x) !== i);
for (const d of dup(STATIONS.map((s) => s.id))) problems.push(`station id used twice: ${d}`);
for (const d of dup(STATIONS.map((s) => s.idea))) problems.push(`idea on two stations: ${d} (one idea per station)`);
for (const s of STATIONS) if (!mapIds.has(s.map)) problems.push(`${s.id}: unknown map ${s.map}`);
for (const m of MAPS) {
  if (!ids.has(m.entry) || STATIONS.find((s) => s.id === m.entry).map !== m.id) problems.push(`${m.id}: entry ${m.entry} is not on this map`);
  for (const sh of m.shows) if (STATIONS.find((s) => s.id === sh)?.map !== m.id) problems.push(`${m.id}: shows ${sh}, not on this map`);
  const lm = new Set(m.landmarks.map((l) => l.id));
  for (const s of STATIONS.filter((x) => x.map === m.id && x.landmark)) if (!lm.has(s.landmark)) problems.push(`${s.id}: unknown landmark ${s.landmark}`);
}
for (const e of EDGES) {
  for (const end of [e.from, e.to]) if (!ids.has(end)) problems.push(`edge ${e.from}>${e.to}: unknown station ${end}`);
  const [a, b] = [e.from, e.to].map((x) => STATIONS.find((s) => s.id === x));
  if (!a || !b) continue;
  if (e.kind === "path" && a.map !== b.map) problems.push(`path ${e.from}>${e.to} crosses maps: make it a portal`);
  if (e.kind === "portal" && a.map === b.map) problems.push(`portal ${e.from}>${e.to} stays on one map: make it a path`);
  if (!(e.nearness >= 0 && e.nearness <= 1)) problems.push(`edge ${e.from}>${e.to}: nearness must be 0 to 1`);
  if (e.gate && e.kind !== "portal") problems.push(`edge ${e.from}>${e.to}: only portals have gates`);
}
for (const d of dup(EDGES.map((e) => `${e.kind}:${e.from}>${e.to}`))) problems.push(`edge twice: ${d}`);

// 2. Reachability. A child who can do everything reaches every station; every station has a way Home;
//    a three-year-old with nothing played reaches the Tal.
const all = { age: 12, mastered: () => true, starred: () => true, flag: () => true, rounds: () => 99, visited: () => true, parent: () => true };
const none = { age: 3, mastered: () => false, starred: () => false, flag: () => false, rounds: () => 0, visited: () => false, parent: () => false };
const can = reachable(all);
for (const s of STATIONS) if (!can.has(s.id)) problems.push(`${s.id}: never reachable, even for a child who has mastered everything`);
for (const s of STATIONS) if (!allEdges().some((e) => e.from === s.id && e.to === HOME)) problems.push(`${s.id}: no way Home`);
const small = reachable(none);
for (const s of STATIONS.filter((x) => x.map === "tal")) if (!small.has(s.id)) problems.push(`${s.id}: a 3-year-old cannot reach it`);
for (const s of STATIONS.filter((x) => x.map !== "tal")) if (small.has(s.id)) problems.push(`${s.id}: a 3-year-old with nothing played reaches a school station`);
for (const m of MAPS) for (const sh of m.shows) if (!visible(sh, none)) problems.push(`${sh}: listed in shows but not visible`);

// 3. A locked way up always has an open way back down (a child never gets stuck behind a condition).
for (const e of EDGES.filter((x) => (x.kind === "path" || x.kind === "portal") && x.requires)) {
  if (!EDGES.some((x) => x.from === e.to && x.to === e.from && x.kind === e.kind && holds(x.requires, none))) {
    problems.push(`${e.from}>${e.to}: no always-open way back`);
  }
}

// 4. Layout follows nearness: related stations on the same map sit close together.
const dist = (a, b) => Math.hypot(a.pos.x - b.pos.x, a.pos.y - b.pos.y);
for (const e of EDGES) {
  const [a, b] = [e.from, e.to].map((x) => STATIONS.find((s) => s.id === x));
  if (!a || !b || a.map !== b.map) continue;
  const max = e.nearness >= 0.7 ? 250 : e.nearness >= 0.5 ? 400 : Infinity;
  if (dist(a, b) > max) warnings.push(`${a.id} and ${b.id}: nearness ${e.nearness} but ${Math.round(dist(a, b))} apart (at most ${max})`);
}

// 5. Bands: a gate's target and a relation used for review stay inside one band (reported, not an error).
const crossing = EDGES.filter((e) => e.kind === "relation" && bandOf(e.from) !== bandOf(e.to));

console.log(`${MAPS.length} maps, ${STATIONS.length} stations, ${EDGES.length} edges (+ Home).`);
console.log(`A 3-year-old reaches ${small.size}, a 6-year-old ${reachable({ ...none, age: 6 }).size}, a 9-year-old ${reachable({ ...none, age: 9 }).size} stations.`);
console.log(`${crossing.length} relations cross bands: shown to parents, never used to mix tasks.`);
for (const w of warnings) console.log(`warning: ${w}`);
for (const p of problems) console.log(`PROBLEM: ${p}`);
if (!problems.length) console.log("The universe is fine.");
process.exit(problems.length ? 1 : 0);
