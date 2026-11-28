// The burrow of the open Tal: its simulated world and what the owl plans there. Pure, no screen (bau.js draws
// it, tools/check-offen.mjs plays it).
//
// State: { inside, outside } hares in the burrow and in front of it. The number that live here is inside +
// outside and never changes during an event.
// Events:
//   { type: "wohnen", n }   n hares live here, all inside (a new event starts)
//   { type: "raus" }        one hare comes out
//   { type: "rein" }        one hare goes back in
// An event that cannot happen is refused and changes nothing.

import { isOpen, often, stand } from "./skills.js";

const RULES = {
  wohnen: (s, e) => (e.n > 0 ? { inside: e.n, outside: 0 } : null),
  raus: (s) => (s.inside > 0 ? { inside: s.inside - 1, outside: s.outside + 1 } : null),
  rein: (s) => (s.outside > 0 ? { inside: s.inside + 1, outside: s.outside - 1 } : null),
};

export function next(state, event) {
  const rule = RULES[event.type];
  return rule ? rule(state, event) : null;
}

export function create(state = { inside: 0, outside: 0 }) {
  const w = {
    state: { ...state },
    send(event) {
      const s = next(w.state, event);
      if (!s) return false;
      w.state = s;
      return true;
    },
  };
  return w;
}

const DRAN = ["neu", "uebt", "wackelt"];
const between = (rnd, lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
export const countSkill = (k) => (k <= 5 ? "zaehlen5" : "zaehlen10");
export const splitSkill = (n) => (n <= 5 ? "zerlegen5" : "zerlegen10");

/**
 * One event at the burrow: n hares live here, all go in, `out` come out one by one. Then the questions, in order:
 *   "Wie viele sind draußen?"      counting (askOut)
 *   "Wie viele sind noch drin?"    zerlegen bis 5 or 10 (askIn): the hares inside cannot be seen
 *   one more comes out or goes in, "Wie viele sind jetzt draußen?"   einer mehr / einer weniger (change)
 * Returns { n, out, askOut, askIn, change: null | "raus" | "rein" }. While splitting is not open yet, the burrow
 * still has counting and one more, one fewer.
 */
export function plan(rec, rnd = Math.random, now = Date.now()) {
  const want = (id) => isOpen(rec, id, now) && rnd() < often(rec, id, now);
  const tenOpen = isOpen(rec, "zerlegen10", now);
  const n = tenOpen && rnd() < 0.6 ? between(rnd, 6, 10) : between(rnd, 2, 5);
  const out = between(rnd, 1, n - 1);
  const askIn = rec.wrongRow < 3 && want(splitSkill(n));
  const cs = countSkill(out);
  const askOut = isOpen(rec, cs, now) && (!askIn || rnd() < (DRAN.includes(stand(rec, cs, now)) ? 0.8 : often(rec, cs, now)));
  let change = null;
  if (rec.wrongRow < 3) {
    const kinds = [];
    if (want("dazu") && out < n) kinds.push("raus");
    if (want("weg") && out > 0) kinds.push("rein");
    if (kinds.length && rnd() < 0.6) change = kinds[Math.floor(rnd() * kinds.length)];
  }
  // Never an event without a question: count those outside.
  return { n, out, askOut: askOut || (!askIn && !change), askIn, change };
}
