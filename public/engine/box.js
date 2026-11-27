// The learning box (Feld): every task is a card ("plus:8,5" for a fact up to 20 or a times table, or a kind of
// task above it, "plus:100:zeE"). A card moves up a box when it is right at the first try (from box 3 on, a fact
// also has to be fast) and falls back when it is wrong. A card whose box says it is due comes sooner, so what
// still wobbles comes back. Ported from think-lab's market (welt/markt/record.js). Pure functions over the
// learner record (engine/learner.js, field `box`); the policy says the days and the time (content/policies.js).
//
//   learningBox: { dueDays: [0, 1, 3, 7, 21], fastMs: 4000, among: 8 }
//     dueDays  days until a card in box 1 … 5 is due again
//     fastMs   fast enough for box 4 and 5 (facts only)
//     among    how many tasks are made; the most due one is played

import { today } from "./learner.js";

const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

/** How much a card should come now: new cards and low boxes high, cards seen today low. */
export function score(rec, card, box, day = today()) {
  const c = rec.box?.[card];
  if (!c) return 2.5; // new: comes, but after cards that went wrong
  const age = c.seen ? daysBetween(c.seen, day) : 99;
  const due = age >= box.dueDays[c.box - 1];
  return (due ? 3 : 0) + (5 - c.box) * 0.8 - (age === 0 && c.box > 1 ? 1 : 0);
}

/** One task done. first: right at the first try. ms: the time to the answer. fact: a fact (speed counts). */
export function record(rec, card, { first, ms = 0, fact = true }, box, day = today()) {
  if (!card) return;
  const c = ((rec.box ??= {})[card] ??= { box: 1, seen: null, n: 0, wrong: 0 });
  c.n++;
  c.seen = day;
  if (first) {
    if (!fact || c.box < 3 || ms <= box.fastMs) c.box = Math.min(5, c.box + 1);
  } else {
    c.wrong++;
    c.box = c.box <= 3 ? 1 : c.box - 2;
  }
}

/** Of a few tasks, the one whose card is most due (a little chance, so it does not always go the same way). */
export function choose(rec, tasks, box, r = Math.random) {
  let best = tasks[0];
  let top = -Infinity;
  for (const t of tasks) {
    const s = score(rec, t.vars.card, box) + r() * 0.6;
    if (s > top) [best, top] = [t, s];
  }
  return best;
}
