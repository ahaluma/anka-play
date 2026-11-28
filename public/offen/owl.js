// The owl of the open Tal decides what happens next at the pond, from the stands of the skills (skills.js).
// Pure functions with a chance source `rnd` (0 to 1), so tools/check-offen.mjs can play thousands of events.
//
// An event at the pond:
//   1. n frogs sit on the shore. "Setz die Frösche auf die Seerosen." Every way is right.
//   2. "Wie viele sitzen auf der roten Seerose?" (and the green one)   zaehlen5 / zaehlen10
//   3. The frogs grumble. "Wo sitzen mehr?"                             vergleich5 / vergleich10
//   4. "Mach es gerecht."                                              umverteilen
//   5. One pad's frogs dive. "Drei sind auf der grünen. Wie viele sind auf der roten?"   fuenfer / zehner
// Each step comes with the chance of its skill's stand: almost always while the child practises it, about every
// fourth event when it is sicher, every tenth when it is long sicher. So "Wie viele?" gets rarer by itself.

import { stand, isOpen, often } from "./skills.js";

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
export const compareSkill = (a, b) => (Math.max(a, b) <= 5 ? "vergleich5" : "vergleich10");
export const partnerSkill = (n) => (n === 5 ? "fuenfer" : n === 10 ? "zehner" : null);

/**
 * The questions after the frogs sit: red has a, green has b.
 * Returns a list of steps: { kind: "count", pad: "rot" | "gruen" } | { kind: "compare" } | { kind: "share" } |
 * { kind: "partner", shown: "rot" | "gruen" }. Never empty.
 */
export function steps(rec, a, b, rnd = Math.random, now = Date.now()) {
  const out = [];
  const easy = rec.wrongRow >= 3;
  const n = a + b;
  const want = (id) => id && isOpen(rec, id, now) && rnd() < often(rec, id, now);

  // "Wie viele?": once per event with the chance of the counting skill. While it is practised, both pads are
  // counted; once it is sicher, one pad.
  const counting = countSkill(Math.max(a, b));
  if (want(counting)) {
    if (dran(rec, counting, now)) out.push({ kind: "count", pad: "rot" }, { kind: "count", pad: "gruen" });
    else out.push({ kind: "count", pad: rnd() < 0.5 ? "rot" : "gruen" });
  }
  if (!easy) {
    if (want(compareSkill(a, b))) out.push({ kind: "compare" });
    if (a !== b && n % 2 === 0 && want("umverteilen")) out.push({ kind: "share" });
    if (want(partnerSkill(n))) out.push({ kind: "partner", shown: rnd() < 0.5 ? "rot" : "gruen" });
  }
  // Never an event without a question: a skill that is being practised, otherwise any open one, so "Wie viele?"
  // still comes now and then but no more often than the others.
  if (!out.length) {
    const can = [
      ["count", { kind: "count", pad: a >= b ? "rot" : "gruen" }, countSkill(Math.max(a, b))],
      ["compare", { kind: "compare" }, !easy && compareSkill(a, b)],
      ["share", { kind: "share" }, !easy && a !== b && n % 2 === 0 && "umverteilen"],
      ["partner", { kind: "partner", shown: rnd() < 0.5 ? "rot" : "gruen" }, !easy && partnerSkill(n)],
    ].filter(([, , id]) => id && isOpen(rec, id, now));
    const needed = can.filter(([, , id]) => dran(rec, id, now));
    const from = needed.length ? needed : can;
    out.push(from[Math.floor(rnd() * from.length)][1]);
  }
  return out;
}

/** The skill a step counts for, with the frogs as they sit when it is asked. */
export function skillOf(step, a, b) {
  if (step.kind === "count") return countSkill(step.pad === "rot" ? a : b);
  if (step.kind === "compare") return compareSkill(a, b);
  if (step.kind === "share") return "umverteilen";
  return partnerSkill(a + b);
}
