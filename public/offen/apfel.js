// The apple tree of the open Tal: its simulated world and what the owl plans there. Pure, no screen
// (apfelbaum.js draws it, tools/check-offen.mjs plays it).
//
// State: { tree, basket, hares: [a, b, …] } apples on the tree, in the basket, in front of each hare.
// Events:
//   { type: "wachsen", n }        n apples grow on the tree (a new event starts; hares and basket empty)
//   { type: "leer" }              a new event starts with a bare tree (hares and basket empty)
//   { type: "wachs" }             one apple grows on the tree (the child taps the crown)
//   { type: "pflueck" }           one apple from the tree into the basket
//   { type: "zurueck" }           one apple from the basket back onto the tree
//   { type: "hasen", n }          n hares come to share (two, later three)
//   { type: "gib", to }           one apple from the basket to hare `to`
//   { type: "nimm", from }        one apple from hare `from` back into the basket
// An event that cannot happen is refused and changes nothing.

import { isOpen, isSure, often, stand } from "./skills.js";

const RULES = {
  wachsen: (s, e) => (e.n > 0 ? { tree: e.n, basket: 0, hares: [] } : null),
  leer: () => ({ tree: 0, basket: 0, hares: [] }),
  wachs: (s) => (s.tree < 10 ? { ...s, tree: s.tree + 1 } : null),
  pflueck: (s) => (s.tree > 0 ? { ...s, tree: s.tree - 1, basket: s.basket + 1 } : null),
  zurueck: (s) => (s.basket > 0 ? { ...s, tree: s.tree + 1, basket: s.basket - 1 } : null),
  hasen: (s, e) => (e.n >= 2 && e.n <= 3 ? { ...s, hares: Array(e.n).fill(0) } : null),
  gib: (s, e) => (s.basket > 0 && e.to in s.hares ? { ...s, basket: s.basket - 1, hares: s.hares.map((h, i) => (i === e.to ? h + 1 : h)) } : null),
  nimm: (s, e) => (s.hares[e.from] > 0 ? { ...s, basket: s.basket + 1, hares: s.hares.map((h, i) => (i === e.from ? h - 1 : h)) } : null),
};

export function next(state, event) {
  const rule = RULES[event.type];
  return rule ? rule(state, event) : null;
}

export function create(state = { tree: 0, basket: 0, hares: [] }) {
  const w = {
    state: { ...state, hares: [...state.hares] },
    send(event) {
      const s = next(w.state, event);
      if (!s) return false;
      w.state = s;
      return true;
    },
  };
  return w;
}

/** Is every hare's pile the same, with fewer apples left in the basket than there are hares? */
export const fair = (s) => s.hares.length > 0 && s.hares.every((h) => h === s.hares[0]) && s.basket < s.hares.length;

const DRAN = ["neu", "uebt", "wackelt"];
/** How often the apples fall by themselves instead of being picked. */
export const FALL = 0.2;
const between = (rnd, lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
export const countSkill = (k) => (k <= 5 ? "zaehlen5" : "zaehlen10");
/** The skill of "Wie viele sind jetzt im Korb?" after one more apple fell: one more, once it is open. */
export const oneMoreSkill = (rec, k, now = Date.now()) => (isOpen(rec, "dazu", now) ? "dazu" : countSkill(k));

/** Questions per event at the tree (picking not counted): long sequences, but not overdone. */
export const MIN_Q = 3;
export const MAX_Q = 5;

/** How many questions a plan asks. */
export const questions = (p) => [p.askFirst, p.askBasket, p.askLeft, p.oneFalls, !!p.share].filter(Boolean).length;

/**
 * One event at the tree. It starts with the child tapping the bare crown until n apples have grown (nothing to
 * get wrong), then:
 *   { n, pick, share: null | { hares, each, rest }, askFirst, askBasket, askLeft, oneFalls, fall }
 * in this order: "Wie viele Äpfel hängen auf dem Baum?" (askFirst), picking, "Wie viele Äpfel sind im Korb?"
 * (askBasket), "Wie viele hängen noch am Baum?" (askLeft), one more apple falls: "Wie viele sind jetzt im
 * Korb?" (oneFalls, one more), sharing among hares. At least MIN_Q questions per event.
 * n apples grow; "Pflück vier Äpfel." (Menge legen) takes `pick` of them, or about every fifth time (fall)
 * they fall into the basket by themselves; "Wie viele hängen noch?" (counting)
 * when askLeft. Once sharing fairly is open (sicher at the pond first), the owl often brings hares: the picked
 * apples are shared among them, "Gib jedem gleich viele.", and once that is sicher sometimes with a rest:
 * "Wie viele bleiben übrig?". Up to 5 until counting to 10 is open.
 */
export function plan(rec, rnd = Math.random, now = Date.now()) {
  const big = isOpen(rec, "zaehlen10", now);
  const top = big ? 10 : 5;
  const wantShare = rec.wrongRow < 3 && isOpen(rec, "teilen", now) && rnd() < often(rec, "teilen", now);
  let share = null;
  let pick;
  if (wantShare) {
    const hares = isSure(rec, "teilen", now) && big && rnd() < 0.5 ? 3 : 2;
    const withRest = isOpen(rec, "rest", now) && rnd() < Math.max(often(rec, "rest", now), 0.3);
    const rest = withRest ? between(rnd, 1, hares - 1) : 0;
    const most = Math.floor((top - rest) / hares);
    const each = between(rnd, 1, Math.max(1, Math.min(most, big ? 4 : 2)));
    pick = hares * each + rest;
    share = { hares, each, rest };
  } else pick = between(rnd, 1, Math.min(top - 1, big ? 6 : 4));
  const n = Math.min(top, pick + between(rnd, 1, big ? 4 : 2));
  // Counting what still hangs: almost always while counting is practised, now and then once it is sicher.
  const left = n - pick;
  const skill = countSkill(left);
  // About every fifth time the apples fall into the basket by themselves (seen, not told): no picking, so the
  // owl always asks what still hangs.
  const fall = rnd() < FALL;
  const askLeft = isOpen(rec, skill, now) && (fall || rnd() < (DRAN.includes(stand(rec, skill, now)) ? 0.9 : often(rec, skill, now) + 0.15));
  // "Wie viele Äpfel hängen auf dem Baum?" first: every round while counting this many is practised, then about
  // every third round.
  const first = countSkill(n);
  const askFirst = isOpen(rec, first, now) && (DRAN.includes(stand(rec, first, now)) || rnd() < 1 / 3);
  // Fill up to MIN_Q questions: the basket, one more falling (not while sharing: the basket goes to the hares),
  // what still hangs, and the first question last, so it keeps its own rhythm (every third round once sure).
  const p = { n, pick, share, askFirst, askBasket: rnd() < 0.3, askLeft, oneFalls: false, fall };
  const basketSkill = countSkill(pick);
  if (!isOpen(rec, basketSkill, now)) p.askBasket = false;
  const fill = [
    () => isOpen(rec, basketSkill, now) && !p.askBasket && (p.askBasket = true),
    () => !share && !p.oneFalls && (p.oneFalls = true),
    () => isOpen(rec, skill, now) && !p.askLeft && (p.askLeft = true),
    () => isOpen(rec, first, now) && !p.askFirst && (p.askFirst = true),
  ];
  for (const f of fill) if (questions(p) < MIN_Q) f();
  if (questions(p) > MAX_Q) p.askBasket = false;
  return p;
}
