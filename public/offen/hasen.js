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

/** Questions per event at the burrow: long sequences, but not overdone. */
export const MIN_Q = 3;
export const MAX_Q = 5;

/**
 * One event at the burrow: n hares sit in front of it, the child taps them into the burrow (nothing to get
 * wrong), then `out` come out one by one. Then a sequence of MIN_Q to MAX_Q questions, `steps`, each one of
 *   { ask: "out", skill }                    "Wie viele sind draußen?"     counting
 *   { ask: "in", skill }                     "Wie viele sind noch drin?"   zerlegen bis 5 or 10: the hares
 *                                            inside cannot be seen
 *   { change: "raus" | "rein", ask, skill }  one more comes out or goes back in (seen, not told), then
 *                                            "Wie viele sind jetzt draußen?" (einer mehr / einer weniger, or
 *                                            counting while those are not open) or "… noch drin?"
 * Returns { n, out, steps }. While splitting is not open yet, the burrow still has counting and the hares that
 * come and go.
 */
export function plan(rec, rnd = Math.random, now = Date.now()) {
  const want = (id) => isOpen(rec, id, now) && rnd() < often(rec, id, now);
  const tenOpen = isOpen(rec, "zerlegen10", now);
  const n = tenOpen && rnd() < 0.6 ? between(rnd, 6, 10) : between(rnd, 2, 5);
  const out = between(rnd, 1, n - 1);
  const split = splitSkill(n);
  const inOpen = rec.wrongRow < 3 && isOpen(rec, split, now);
  const askIn = rec.wrongRow < 3 && want(split);
  const cs = countSkill(out);
  const askOut = isOpen(rec, cs, now) && (!askIn || rnd() < (DRAN.includes(stand(rec, cs, now)) ? 0.8 : often(rec, cs, now)));
  const steps = [];
  if (askOut || !askIn) steps.push({ ask: "out", skill: cs });
  if (askIn) steps.push({ ask: "in", skill: split });
  // Then hares come and go, each change followed by a question, up to the sequence's length.
  const length = MIN_Q + (rnd() < 0.4 ? 1 : 0) + (rnd() < 0.2 ? 1 : 0);
  let outside = out;
  while (steps.length < Math.min(length, MAX_Q)) {
    const kinds = [];
    if (outside < n) kinds.push("raus");
    if (outside > 0) kinds.push("rein");
    const change = kinds[Math.floor(rnd() * kinds.length)];
    outside += change === "raus" ? 1 : -1;
    if (inOpen && rnd() < 0.4) steps.push({ change, ask: "in", skill: split });
    else {
      const one = change === "raus" ? "dazu" : "weg";
      steps.push({ change, ask: "out", skill: isOpen(rec, one, now) ? one : countSkill(outside) });
    }
  }
  return { n, out, steps };
}
