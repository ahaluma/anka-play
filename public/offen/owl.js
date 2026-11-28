// The owl of the open Tal decides what happens next at the pond, from the stands of the skills (skills.js).
// Pure functions with a chance source `rnd` (0 to 1), so tools/check-offen.mjs can play thousands of events.
//
// An event at the pond:
//   1. n frogs sit on the shore. "Setz die Frösche auf die Seerosen." Every way is right.
//      or, to make a quantity: "Setz drei Frösche auf die rote Seerose." legen
//   2. "Wie viele sitzen auf der roten Seerose?" (and the green one)   zaehlen5 / zaehlen10
//      "Wie viele sind es insgesamt?"                                  zaehlen5 / zaehlen10
//      "Ein Frosch hüpft dazu (springt ins Wasser). Wie viele sind es jetzt?"   dazu / weg
//   3. "Sitzen auf beiden Seerosen gleich viele?" Ja / Nein             gleich
//      Not the same: "Zeig das Blatt, wo mehr Frösche sitzen."         mehr
//                    "Zeig das Blatt, wo weniger Frösche sitzen."      weniger
//      While mehr or weniger is practised, only a clear difference (at least 2: 1 against 4, not 4 against 5).
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
/** "Setz drei Frösche auf die rote Seerose.": the pad and how many, or null when the owl lets the child place
 *  freely. Up to 5 until counting to 10 is open; never all and never none, so the rest go on the other pad. */
export function target(rec, n, rnd = Math.random, now = Date.now()) {
  const want = isOpen(rec, "legen", now) && rnd() < often(rec, "legen", now);
  if (!want || n < 2) return null;
  const most = Math.min(n - 1, isOpen(rec, "zaehlen10", now) ? 10 : 5);
  return { pad: rnd() < 0.5 ? "rot" : "gruen", k: between(rnd, 1, most) };
}

/** A difference a child sees without counting, while the comparing words are still practised. */
export const clear = (a, b) => Math.abs(a - b) >= 2;
export const partnerSkill = (n) => (n === 5 ? "fuenfer" : n === 10 ? "zehner" : null);

/**
 * The questions after the frogs sit: red has a, green has b.
 * Returns a list of steps: { kind: "count", pad: "rot" | "gruen" } | { kind: "same" } | { kind: "more" } |
 * { kind: "less" } | { kind: "total" } | { kind: "plus" | "minus", pad } | { kind: "share" } |
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
  // "Wie viele sind es insgesamt?": the frogs of both pads together.
  const all = countSkill(n);
  if (isOpen(rec, all, now) && rnd() < often(rec, all, now) / 2) out.push({ kind: "total" });
  // Comparing: "gleich viele?" first, then point at more and at fewer. Close amounts only once the word is sicher.
  const pointable = (id) => a !== b && (clear(a, b) || !dran(rec, id, now));
  if (want("gleich")) out.push({ kind: "same" });
  if (pointable("mehr") && want("mehr")) out.push({ kind: "more" });
  if (pointable("weniger") && want("weniger")) out.push({ kind: "less" });
  // One more, one fewer: a frog hops onto a pad or jumps into the water. Up to 5 until counting to 10 is open.
  const top = isOpen(rec, "zaehlen10", now) ? 10 : 5;
  const padFor = (ok) => ["rot", "gruen"].filter((p) => ok(p === "rot" ? a : b));
  const onto = padFor((k) => k < top);
  const off = padFor((k) => k > 0);
  if (!easy && onto.length && want("dazu")) out.push({ kind: "plus", pad: onto[Math.floor(rnd() * onto.length)] });
  else if (!easy && off.length && want("weg")) out.push({ kind: "minus", pad: off[Math.floor(rnd() * off.length)] });
  if (!easy) {
    if (a !== b && n % 2 === 0 && want("umverteilen")) out.push({ kind: "share" });
    if (want(partnerSkill(n))) out.push({ kind: "partner", shown: rnd() < 0.5 ? "rot" : "gruen" });
  }
  // Never an event without a question: a skill that is being practised, otherwise any open one, so "Wie viele?"
  // still comes now and then but no more often than the others.
  if (!out.length) {
    const can = [
      ["count", { kind: "count", pad: a >= b ? "rot" : "gruen" }, countSkill(Math.max(a, b))],
      ["same", { kind: "same" }, "gleich"],
      ["total", { kind: "total" }, all],
      ["plus", { kind: "plus", pad: onto[0] }, !easy && onto.length && "dazu"],
      ["minus", { kind: "minus", pad: off[0] }, !easy && off.length && "weg"],
      ["more", { kind: "more" }, pointable("mehr") && "mehr"],
      ["less", { kind: "less" }, pointable("weniger") && "weniger"],
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
  if (step.kind === "total") return countSkill(a + b);
  if (step.kind === "plus") return "dazu";
  if (step.kind === "minus") return "weg";
  if (step.kind === "same") return "gleich";
  if (step.kind === "more") return "mehr";
  if (step.kind === "less") return "weniger";
  if (step.kind === "share") return "umverteilen";
  return partnerSkill(a + b);
}
