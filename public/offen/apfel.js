// The apple tree of the open Tal: its simulated world and what the owl plans there. Pure, no screen
// (apfelbaum.js draws it, tools/check-offen.mjs plays it).
//
// State: { tree, basket, hares: [a, b, …] } apples on the tree, in the basket, in front of each hare.
// Events:
//   { type: "wachsen", n }        n apples grow on the tree (a new event starts; hares and basket empty)
//   { type: "pflueck" }           one apple from the tree into the basket
//   { type: "zurueck" }           one apple from the basket back onto the tree
//   { type: "hasen", n }          n hares come to share (two, later three)
//   { type: "gib", to }           one apple from the basket to hare `to`
//   { type: "nimm", from }        one apple from hare `from` back into the basket
// An event that cannot happen is refused and changes nothing.

import { isOpen, isSure, often, stand } from "./skills.js";

const RULES = {
  wachsen: (s, e) => (e.n > 0 ? { tree: e.n, basket: 0, hares: [] } : null),
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

/**
 * One event at the tree:
 *   { n, pick, share: null | { hares, each, rest }, askLeft, fall }
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
  return { n, pick, share, askLeft, fall };
}
