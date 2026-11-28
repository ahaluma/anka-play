// The owl of the open Tal decides what happens next, from the stands of the skills (skills.js): how the frogs come
// onto the pads, and which questions of the catalogue (questions.js) a GameRun (runs.js) asks, in which order.
// Pure functions with a chance source `rnd` (0 to 1), so tools/check-offen.mjs can play thousands of events.
//
// An event at the pond: frogs come to the shore (placement: free, "Drei auf die rote!", or "Verteil gerecht!"),
// then a GameRun (runs.js): per position the owl takes questions of the catalogue (questions.js) or skips the
// position. Each question comes with the chance of its skill's stand: almost always while the child practises
// it, about every fourth event when it is sicher, every tenth when it is long sicher. So "Wie viele?" gets rarer
// by itself. While mehr or weniger is practised, only a clear difference (at least 2: 1 against 4, not 4 against 5).

import { stand, isOpen, isSure, often } from "./skills.js";
import { byId, skillOf } from "./questions.js";
import * as World from "./world.js";

const DRAN = ["neu", "uebt", "wackelt"];
const dran = (rec, id, now) => DRAN.includes(stand(rec, id, now));
const between = (rnd, lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));

/** How many frogs come. Three wrong answers in a row: at most five, and only counting. */
export function frogs(rec, rnd = Math.random, now = Date.now()) {
  if (rec.wrongRow >= 3) return between(rnd, 2, 5);
  if (dran(rec, "zehner", now) && rnd() < 0.5) return 10;
  if (dran(rec, "fuenfer", now) && rnd() < 0.5) return 5;
  if (!isOpen(rec, "zaehlen10", now)) return between(rnd, 2, 5);
  // Counting to 10 is open: mostly 6 to 10 while it is practised, otherwise anything from 3 to 10.
  return dran(rec, "zaehlen10", now) && rnd() < 0.7 ? between(rnd, 6, 10) : between(rnd, 3, 10);
}

export const countSkill = (k) => (k <= 5 ? "zaehlen5" : "zaehlen10");
/** "Setz drei Frösche auf die rote Seerose.": the pad and how many, or null when the owl lets the child place
 *  freely. Up to 5 until counting to 10 is open; never all and never none, so the rest go on the other pad. */
export function target(rec, n, rnd = Math.random, now = Date.now()) {
  const want = isOpen(rec, "legen", now) && rnd() < often(rec, "legen", now);
  if (!want || n < 2) return null;
  const most = Math.min(n - 1, isOpen(rec, "zaehlen10", now) ? 10 : 5);
  return { n, pad: rnd() < 0.5 ? "rot" : "gruen", k: between(rnd, 1, most) };
}

/**
 * How the frogs get onto the pads, and how many come:
 *   { kind: "free", n }           "Setz die Frösche auf die Seerosen."
 *   { kind: "make", n, pad, k }   "Setz drei Frösche auf die rote Seerose."            legen
 *   { kind: "share", n }          "Verteil die Frösche gerecht auf die zwei Seerosen."  verteilen
 *   { kind: "rest", n }           the same with an odd number: one stays on the shore    verteilen
 * Sharing comes in slowly: 2 and 4 frogs for the first ten answers, then 6, and up to 10 once counting to 10
 * is open. Once sharing is sicher, about every third time the number is odd and one frog is left over. That is
 * only to be seen ("geht auf" or "einer bleibt übrig"), not a skill that is practised or counted here.
 */
export function placement(rec, rnd = Math.random, now = Date.now()) {
  const want = (id) => isOpen(rec, id, now) && rnd() < often(rec, id, now);
  const kinds = [];
  if (rec.wrongRow < 3 && want("verteilen")) kinds.push("share");
  const goal = target(rec, frogs(rec, rnd, now), rnd, now);
  if (goal) kinds.push("make");
  const kind = kinds.length ? kinds[Math.floor(rnd() * kinds.length)] : "free";
  const big = isOpen(rec, "zaehlen10", now);
  if (kind === "share" && isSure(rec, "verteilen", now) && rnd() < 1 / 3) return { kind: "rest", n: 2 * between(rnd, 1, big ? 4 : 2) + 1 };
  if (kind === "share") {
    const s = rec.skills.verteilen;
    const answers = s ? s.right + s.wrong : 0;
    const most = answers < 10 ? 4 : big ? 10 : 6;
    return { kind, n: 2 * between(rnd, 1, most / 2) };
  }
  if (kind === "make") return { kind, n: goal.n, pad: goal.pad, k: goal.k };
  return { kind, n: frogs(rec, rnd, now) };
}

/** A difference a child sees without counting, while the comparing words are still practised. */
export const clear = (a, b) => Math.abs(a - b) >= 2;
export const partnerSkill = (n) => (n === 5 ? "fuenfer" : n === 10 ? "zehner" : null);

/**
 * Plan a GameRun (runs.js) for the scene after placing: per position, questions from the catalogue
 * (questions.js) that fit the scene and whose skill is open, each with the chance of its skill's stand. A
 * position may stay empty. While counting is practised, both pads are counted; once it is sicher, one pad now
 * and then, so "Wie viele?" gets rarer. Then the run is filled up to `min` questions (skills being practised
 * first, any open one next, "Wie viele?" last) and cut at `max`. Later positions see the scene as the earlier
 * questions leave it: the owl plays the run ahead on a copy of the world (world.js), sending each question's
 * events (a frog hops on, the pads are made fair).
 * Returns [{ q, p }]: the catalogue question and what was chosen for it (a pad).
 */
/** What a question's `fits` may ask about the child: is a skill open, is it being practised, is it a hard moment. */
export const context = (rec, now = Date.now()) => ({ open: (id) => isOpen(rec, id, now), dran: (id) => dran(rec, id, now), easy: rec.wrongRow >= 3 });

export function plan(run, rec, scene, rnd = Math.random, now = Date.now()) {
  const ctx = context(rec, now);
  const want = (id) => id && isOpen(rec, id, now) && rnd() < often(rec, id, now);
  const chosen = []; // { q, p, at } at = index of the position
  const spare = []; // fitting questions not chosen, to fill up with
  const w = World.create(scene);
  run.positions.forEach((pos, at) => {
    const s = { ...w.state };
    const fitting = pos.questions.map((id) => byId[id]).filter((q) => q.fits(s, ctx));
    const here = [];
    for (const q of fitting) {
      if (here.length >= pos.most) break;
      if (q.id === "wie-viele") {
        const skill = countSkill(Math.max(s.rot, s.gruen));
        if (!want(skill)) {
          spare.push({ q, p: s.rot >= s.gruen ? "rot" : "gruen", at, last: true });
          continue;
        }
        // A pad whose frogs were just guessed behind the masks is known: count the other one.
        const known = chosen.find((c) => c.q.id === "maske")?.p;
        const pads = (dran(rec, skill, now) ? ["rot", "gruen"] : [rnd() < 0.5 ? "rot" : "gruen"]).filter((x) => x !== known);
        for (const p of pads) here.push({ q, p, at });
        continue;
      }
      const p = q.params ? q.params(s, rnd, ctx) : null;
      const skill = skillOf(q, s, p);
      if (!isOpen(rec, skill, now)) continue;
      if (want(skill) && rnd() < (q.chance ?? 1)) here.push({ q, p, at });
      else spare.push({ q, p, at, skill });
    }
    // One more or one fewer, not both. Comparing may ask all three in a row.
    if (pos.id === "veraendern") here.splice(1);
    for (const c of here) {
      chosen.push(c);
      for (const e of c.q.events?.(w.state, c.p) ?? []) w.send(e);
    }
  });
  // Fill up to min: skills being practised first, then any open one, "Wie viele?" last.
  const free = (c) => !chosen.some((x) => x.q === c.q && x.p === c.p) && !(run.positions[c.at].id === "veraendern" && chosen.some((x) => x.at === c.at));
  while (chosen.length < run.min) {
    const left = spare.filter(free);
    if (!left.length) break;
    const needed = left.filter((c) => !c.last && c.skill && dran(rec, c.skill, now));
    const others = left.filter((c) => !c.last);
    const from = needed.length ? needed : others.length ? others : left;
    chosen.push(from[Math.floor(rnd() * from.length)]);
  }
  chosen.sort((x, y) => x.at - y.at);
  return chosen.slice(0, run.max).map(({ q, p }) => ({ q, p }));
}
