// What a child has done, and what follows from it. One record per child, kept on this device only
// (engine/store.js, key "learner:<child>"). See docs/DESIGN.md, section 8.
//
// Only facts are saved: tasks, rounds, stars, the level of each idea, the first-visit answers. Everything
// else (mastered, open, visible, reachable, the suggestion) is computed from them, so a rule can change
// later without migrating anyone. Rungs are saved by id, never by index.
//
// Pure functions over a plain record, no DOM and no storage: the same code runs in the browser and in
// tools/check-engine.mjs.
//
//   { v: 1, kid: "k1",
//     ideas: { zahl: { level: "10", lowered: false, weakInRow: 0, rounds: 12, visited: "2026-11-27",
//                      gate: { day, answers: [...], start: "10" },
//                      cells: { "sehen@10": { n: 10, first: 8, recent: [1,1,0,1,1], last: "2026-11-27", star: "2026-11-27" } },
//                      mistakes: [{ kind: "oneOff", day: "2026-11-27" }] } },
//     cards: { vergleichen: 4 },                                   the thinking cards a child got
//     box: { "plus:8,5": { box: 3, seen: "2026-11-27", n: 6, wrong: 1 } },   the learning box (Feld, engine/box.js)
//     daily: { "2026-11-27": { right: 14, wrong: 3, rounds: 3 } }, parent: { berg: false } }

import { station, STATIONS_BY_ID } from "./graph.js";

export const RECENT = 10; // a cell keeps the last 10 tasks
export const DAYS_KEPT = 60; // the counts per day are kept this long
export const MISTAKES_KEPT = 30;

export function today(date = new Date()) {
  const z = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${z(date.getMonth() + 1)}-${z(date.getDate())}`;
}

export const blank = (kid = "guest") => ({ v: 1, kid, ideas: {}, cards: {}, box: {}, daily: {}, parent: {} });

/** A record read from storage: a fresh one when it is missing or of another version. */
export const valid = (rec, kid) => (rec && rec.v === 1 && rec.ideas ? rec : blank(kid));

/** The part of the record for one idea (made when missing). */
export function slot(rec, idea) {
  return (rec.ideas[idea] ??= { level: null, lowered: false, weakInRow: 0, rounds: 0, visited: null, cells: {}, mistakes: [] });
}

// ---------- The ladder of an idea

export const rung = (def, id) => def.ladder.find((r) => r.id === id) ?? null;
export const rungIndex = (def, id) => def.ladder.findIndex((r) => r.id === id);
/** The groups of the ladder, easy to hard ("5", "10"). Stars are counted per group. */
export const groups = (def) => [...new Set(def.ladder.map((r) => r.group))];
export const groupOf = (def, id) => rung(def, id)?.group ?? null;
/** The first rung of a group. */
export const firstOf = (def, group) => def.ladder.find((r) => r.group === group)?.id ?? null;
/** The group an idea is mastered in: its own `mastery`, else its highest group. */
export const masteryGroup = (def) => def.mastery ?? groups(def).at(-1);
export const isGame = (def) => def.perspectives.length === 1 && def.perspectives[0] === "spielen";

/** The rung a child of this age starts on (start.byAge: { 3: "5", 6: "10" }): the highest age not above it. */
export function byAge(def, age) {
  const table = Object.entries(def.start?.byAge ?? {}).map(([a, id]) => [Number(a), id]).sort((a, b) => a[0] - b[0]);
  let at = def.ladder[0].id;
  for (const [a, id] of table) if (age !== null && age !== undefined && age >= a && rung(def, id)) at = id;
  if (def.start?.at && rung(def, def.start.at)) at = def.start.at; // every child starts here (the mountain)
  return at;
}

/**
 * The rung to play now. The saved one; before the first round the first-visit answers (gate) or the age.
 * A child whose age now starts higher than the saved rung (a birthday) moves up to it, unless two weak
 * rounds took the child down (lowered): then it stays where it is.
 */
export function level(rec, def, age) {
  const s = rec.ideas[def.id];
  const start = s?.gate?.start && rung(def, s.gate.start) ? s.gate.start : byAge(def, age);
  if (!s?.level || !rung(def, s.level)) return start;
  if (!s.lowered && rungIndex(def, byAge(def, age)) > rungIndex(def, s.level)) return byAge(def, age);
  return s.level;
}

// ---------- Cells: one perspective at one rung

export const cellKey = (p, rungId) => `${p}@${rungId}`;
export const cell = (rec, idea, p, rungId) => rec.ideas[idea]?.cells[cellKey(p, rungId)] ?? null;

/** Has the child played this perspective (at any rung)? */
export const played = (rec, idea, p) =>
  Object.entries(rec.ideas[idea]?.cells ?? {}).some(([k, c]) => k.startsWith(`${p}@`) && c.n > 0);

/** Can the child choose this perspective? The first one is open from the start; each further one opens once
 *  the one before it has been played. One already played stays open, so a child with progress keeps it. */
export function wayOpen(rec, def, p) {
  const i = def.perspectives.indexOf(p);
  return i === 0 || (i > 0 && (played(rec, def.id, p) || played(rec, def.id, def.perspectives[i - 1])));
}

/** A star in exactly this group. */
export function starred(rec, def, p, group) {
  const cells = rec.ideas[def.id]?.cells ?? {};
  return def.ladder.some((r) => r.group === group && cells[cellKey(p, r.id)]?.star);
}

/** A star in this group or a harder one (a star at 10 also says the child can do it at 5). */
export function starredFrom(rec, def, p, group) {
  const gs = groups(def);
  return gs.slice(gs.indexOf(group)).some((g) => starred(rec, def, p, g));
}

/** An idea is mastered when every perspective it has (1 to 5) has its star in the mastery group.
 *  A pure game (one perspective, "spielen") is mastered from the start. */
export function ideaMastered(rec, def) {
  if (!def) return false;
  if (isGame(def)) return true;
  return def.perspectives.every((p) => starredFrom(rec, def, p, masteryGroup(def)));
}

/** The flag of a group: every perspective of the idea starred in it (or above it). */
export const ideaFlag = (rec, def, group) => !!def && (isGame(def) || def.perspectives.every((p) => starredFrom(rec, def, p, group)));

// ---------- Writing facts

function count(rec, what, day) {
  const d = (rec.daily[day] ??= { right: 0, wrong: 0, rounds: 0 });
  d[what]++;
  for (const old of Object.keys(rec.daily).sort().slice(0, -DAYS_KEPT)) delete rec.daily[old];
}

/** One task done. `counted`: a task of the round's own perspective (not a surprise, review or easier task). */
export function task(rec, idea, p, rungId, firstTry, { counted = true, day = today() } = {}) {
  const s = slot(rec, idea);
  s.visited = day;
  const c = (s.cells[cellKey(p, rungId)] ??= { n: 0, first: 0, recent: [], last: day });
  if (counted) {
    c.n++;
    if (firstTry) c.first++;
  } else {
    c.extra = (c.extra ?? 0) + 1;
  }
  c.recent = [...c.recent, firstTry ? 1 : 0].slice(-RECENT);
  c.last = day;
  count(rec, firstTry ? "right" : "wrong", day);
}

/** A typical mistake (content/boards.js MISTAKES, or an idea's own kind), for the parents' page. */
export function mistake(rec, idea, kind, day = today()) {
  const s = slot(rec, idea);
  s.mistakes = [...s.mistakes, { kind, day, round: s.rounds }].slice(-MISTAKES_KEPT);
}

/**
 * A kind of mistake that came `after` times or more in the last two rounds of an idea (and the round being
 * played), or null. The Feld answers it with a short bridge (policy bridgeAfter, round.js plan).
 */
export function oftenWrong(rec, idea, after) {
  const s = rec.ideas[idea];
  if (!s || !after) return null;
  const counts = {};
  for (const m of s.mistakes) if ((m.round ?? -9) >= s.rounds - 2) counts[m.kind] = (counts[m.kind] ?? 0) + 1;
  const [kind, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? [];
  return n >= after ? kind : null;
}

/** The rung of the bridge for a kind of mistake: the rung of the child's group the idea names for it (idea.bridges). */
export function bridgeRung(def, level, kind) {
  const want = def.bridges?.[kind];
  if (!want) return null;
  const g = groupOf(def, level);
  return def.ladder.find((r) => r.group === g && want.includes(r.params?.stepId))?.id ?? null;
}

/** The top rung of the group below the child's, or null (the Feld's review slot: the market's backpack). */
export function belowTop(def, level) {
  const gs = groups(def);
  const g = gs[gs.indexOf(groupOf(def, level)) - 1];
  return g ? def.ladder.filter((r) => r.group === g).at(-1).id : null;
}

export function visit(rec, idea, day = today()) {
  slot(rec, idea).visited = day;
}

/** The thinking card a round gave, and the round itself in the counts of the day. */
export function roundDone(rec, idea, card, day = today()) {
  slot(rec, idea).rounds++;
  if (card) rec.cards[card] = (rec.cards[card] ?? 0) + 1;
  count(rec, "rounds", day);
}

// ---------- What the graph needs to know (engine/graph.js `facts`)

/**
 * The facts of a child for the graph. `defs` holds the loaded ideas by id; an idea that is not written
 * yet (no folder) can never be mastered. `ready(station)`: has the station something to play?
 */
export function facts(rec, { age = null, defs = {} } = {}) {
  const ideasOf = (s) => station(s)?.ideas ?? [];
  return {
    age,
    ideaMastered: (idea) => ideaMastered(rec, defs[idea]),
    mastered: (s) => ideasOf(s).length > 0 && ideasOf(s).every((i) => ideaMastered(rec, defs[i])),
    starred: (s, p) => ideasOf(s).some((i) => defs[i] && starredFrom(rec, defs[i], p, groups(defs[i])[0])),
    flag: (s, group) => ideasOf(s).every((i) => defs[i] && ideaFlag(rec, defs[i], group)),
    rounds: (s) => ideasOf(s).reduce((n, i) => n + (rec.ideas[i]?.rounds ?? 0), 0),
    visited: (s) => ideasOf(s).some((i) => rec.ideas[i]?.visited),
    parent: (key) => !!rec.parent?.[key],
    ready: (s) => !!STATIONS_BY_ID[s] && ideasOf(s).every((i) => defs[i]),
  };
}

/** The perspective to play next: one never played (in the idea's order), then one without its star in the
 *  child's group, then the one played longest ago. */
export function suggest(rec, def, age) {
  const g = groupOf(def, level(rec, def, age));
  const ps = def.perspectives;
  const lastOf = (p) => Object.entries(rec.ideas[def.id]?.cells ?? {}).filter(([k]) => k.startsWith(`${p}@`)).map(([, c]) => c.last).sort().at(-1) ?? "";
  return ps.find((p) => !played(rec, def.id, p)) ?? ps.find((p) => !starred(rec, def, p, g)) ?? [...ps].sort((a, b) => lastOf(a).localeCompare(lastOf(b)))[0];
}
