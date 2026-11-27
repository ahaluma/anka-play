// The parents' report: what a child's saved record says, map by map and station by station.
// Pure functions over the learner record (engine/learner.js) and the universe, no DOM: the parents' page
// (eltern/eltern.js) draws it, tools/check-engine.mjs checks it.
//
// The same shared perspectives everywhere (content/perspectives.js), so every station reads the same way:
// its 1 to 5 perspectives, each with or without its star in the child's group. A pure game (number memory)
// is always open and has no stars to earn: it is reported as a game with its rounds, never as an achievement.

import { MAPS, STATIONS, EDGES } from "../content/universe.js";
import { reachable, stationOpen, bandOf, BANDS } from "./graph.js";
import * as L from "./learner.js";

export const DAYS_SHOWN = 14;
const MISTAKE_ROUNDS = 15; // a typical mistake: from the last 15 rounds of the idea
const MISTAKE_MIN = 2; // and at least twice

/** One idea of a station: the group the child is in, the perspectives with their stars, rounds, mistakes. */
export function ideaReport(rec, def, age) {
  const s = rec.ideas[def.id] ?? null;
  const game = L.isGame(def);
  const rung = L.level(rec, def, age);
  const group = L.groupOf(def, rung);
  const gs = L.groups(def);
  const perspectives = def.perspectives.map((p) => {
    let n = 0;
    let first = 0;
    for (const r of def.ladder) {
      if (r.group !== group) continue;
      const c = L.cell(rec, def.id, p, r.id);
      n += c?.n ?? 0;
      first += c?.first ?? 0;
    }
    return { id: p, star: !game && L.starred(rec, def, p, group), played: L.played(rec, def.id, p), n, first };
  });
  // The kind of mistake that came most in the last rounds (at least twice), else null.
  const counts = {};
  for (const m of s?.mistakes ?? []) if ((m.round ?? 0) >= (s.rounds ?? 0) - MISTAKE_ROUNDS) counts[m.kind] = (counts[m.kind] ?? 0) + 1;
  const [kind, times] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? [];
  return {
    id: def.id,
    game,
    rung,
    group,
    groupIndex: gs.indexOf(group),
    groups: gs.length,
    mastered: !game && L.ideaMastered(rec, def),
    perspectives,
    stars: perspectives.filter((p) => p.star).length,
    rounds: s?.rounds ?? 0,
    visited: s?.visited ?? null,
    gate: s?.gate?.start ? { start: s.gate.start, group: L.groupOf(def, s.gate.start), day: s.gate.day ?? null } : null,
    lowered: !!s?.lowered,
    mistake: times >= MISTAKE_MIN ? kind : null,
    box: boxReport(rec, def.id),
  };
}

/** The learning box of an idea (Feld): how many practised facts sit firmly, and which still wobble.
 *  A fact is a card like "plus:8,5"; a kind of task above 20 ("plus:100:zeE") is not counted. */
export function boxReport(rec, idea) {
  const facts = Object.entries(rec.box ?? {}).filter(([k]) => k.startsWith(idea + ":") && k.split(":")[1]?.includes(","));
  if (!facts.length) return null;
  const shaky = facts
    .filter(([, c]) => c.box <= 2 && c.n >= 2)
    .sort((a, b) => a[1].box - b[1].box || b[1].wrong - a[1].wrong)
    .slice(0, 6)
    .map(([k]) => k.split(":")[1].split(",").map(Number));
  return { facts: facts.length, known: facts.filter(([, c]) => c.box >= 4).length, shaky };
}

/** Related stations in a later band ("counting leads to the number line"): shown to parents only. */
export function leadsTo(stationId) {
  const order = Object.keys(BANDS);
  const band = order.indexOf(bandOf(stationId));
  return EDGES.filter((e) => e.kind === "relation" && (e.from === stationId || e.to === stationId))
    .map((e) => (e.from === stationId ? e.to : e.from))
    .filter((id, i, all) => all.indexOf(id) === i && order.indexOf(bandOf(id)) > band);
}

/** The counts of the last days, oldest first: [{ day: "2026-11-27", date, right, wrong, rounds }]. */
export function lastDays(rec, now = new Date(), n = DAYS_SHOWN) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const day = L.today(date);
    const d = rec.daily?.[day];
    out.push({ day, date, right: d?.right ?? 0, wrong: d?.wrong ?? 0, rounds: d?.rounds ?? 0 });
  }
  return out;
}

/**
 * The whole report of one child. `defs`: the loaded ideas by id; `facts`: L.facts of the same record.
 *   { maps: [{ id, stations: [...], learn, mastered, played }], days, cards }
 * A station: { id, game, open, reachable, played, mastered, ideas: [ideaReport…], leadsTo }
 * `learn` counts the stations with something to master (games left out), `mastered` how many are.
 */
export function report(rec, { defs, age = null, facts, now = new Date() }) {
  const reach = reachable(facts);
  const maps = MAPS.map((m) => {
    const stations = STATIONS.filter((s) => s.map === m.id && s.ideas.every((i) => defs[i])).map((s) => {
      const ideas = s.ideas.map((i) => ideaReport(rec, defs[i], age));
      const game = !!s.game || ideas.every((i) => i.game);
      return {
        id: s.id,
        icon: s.icon,
        game,
        open: reach.has(s.id) && stationOpen(s.id, facts),
        reachable: reach.has(s.id),
        played: ideas.some((i) => i.rounds > 0),
        mastered: !game && ideas.every((i) => i.mastered),
        ideas,
        leadsTo: leadsTo(s.id),
      };
    });
    const learn = stations.filter((s) => !s.game);
    return {
      id: m.id,
      stations,
      learn: learn.length,
      mastered: learn.filter((s) => s.mastered).length,
      played: stations.some((s) => s.played),
      open: stations.some((s) => s.open),
    };
  });
  const cards = Object.entries(rec.cards ?? {}).filter(([, n]) => n > 0).map(([id, n]) => ({ id, n }));
  return { maps, days: lastDays(rec, now), cards };
}
