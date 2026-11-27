// One round: a few tasks of one idea in one perspective. Which tasks (the slots), how misses lead to help,
// when an easier task comes in. Pure: no DOM, no storage; engine/ui/play.js draws it and saves the facts.
// See docs/DESIGN.md, section 7.1.
//
// Slots:
//   cur       a task of the round's perspective at the child's rung. Only these count for the star.
//   easier    after 3 misses in a row (policy easierAfter): the next task comes one rung easier. Not counted.
//   review    one task from a near station of the same band the child has mastered (policy review). Not counted.
//   surprise  at the end, one task from another perspective the child has already played (policy surprise;
//             only for ideas with 2 or more perspectives). Not counted.
//   backpack  (Berg) a task from a camp the child has mastered (the summit: from every camp). Counted with the
//             round, as the mountain did. The tasks come in as `backpack` (engine/ui/play.js picks them); without
//             one the slot is one more cur.
//
// A policy with `slots` (Feld) lays the round out itself, every slot counted:
//   cur       as above
//   review    with review.from "below": a task from the top rung of the group below (the market's backpack);
//             without a group below, one more cur
//   inverse   in a perspective of the idea's inverseIn: the task before, the other way round (8 + 5, then 13 - 5)
//   bridge    the first three cur slots, when a kind of mistake came often: the rung that trains it (bridge())

import { pick } from "./random.js";

/**
 * The slots of a round.
 *   def      the idea; p the perspective; rung the child's rung
 *   pol      the policy (engine/policy.js policyFor); size the number of counted tasks
 *   played   (p) => has the child played this perspective before?
 *   review   { idea, p, rung } from a near mastered station, or null
 */
export function plan({ def, p, rung, pol, size, played = () => false, review = null, below = null, bridge = null, backpack = [], r = Math.random }) {
  const cur = { kind: "cur", idea: def.id, p, rung, counted: true };
  let slots;
  if (pol.slots) {
    const pack = [...backpack];
    slots = pol.slots.slice(0, size).map((kind) => {
      if (kind === "backpack" && pack.length) return { kind: "backpack", ...pack.shift(), counted: true };
      if (kind === "review" && pol.review?.from === "below" && below) return { ...cur, kind: "review", rung: below };
      if (kind === "inverse" && def.inverseIn?.includes(p)) return { ...cur, kind: "inverse" };
      return { ...cur };
    });
    if (bridge) for (const s of slots.filter((x) => x.kind === "cur").slice(0, 3)) Object.assign(s, { kind: "bridge", rung: bridge });
  } else {
    slots = Array.from({ length: size }, () => ({ ...cur }));
    if (review && pol.review?.perRound) slots.splice(Math.max(1, size - 1), 0, { kind: "review", ...review, counted: false });
  }
  const others = def.perspectives.filter((x) => x !== p && x !== "spielen" && played(x));
  if (pol.surprise && def.perspectives.length >= 2 && others.length) {
    slots.push({ kind: "surprise", idea: def.id, p: pick(others, r), rung, counted: false });
  }
  return slots;
}

/**
 * The state of a round as it is played:
 *   const round = new Round(slots, pol, easierRung);
 *   round.slot            the slot being played
 *   round.miss()          a wrong answer: returns { help: index into pol.help or -1 }
 *   round.solve()         a right answer: returns { first: right at the first try?, done: was it the last? }
 *   round.result          { first, tasks } of the counted tasks
 */
export class Round {
  constructor(slots, pol, easierRung = null) {
    this.slots = slots;
    this.pol = pol;
    this.easierRung = easierRung; // the rung below the child's, or null
    this.at = 0;
    this.misses = 0; // misses in this task
    this.missRun = 0; // misses in a row, across tasks
    this.first = 0;
    this.easierUsed = false;
  }

  get slot() {
    return this.slots[this.at];
  }

  get done() {
    return this.at >= this.slots.length;
  }

  miss() {
    this.misses++;
    this.missRun++;
    const k = this.misses - this.pol.hintAfter;
    return { help: k >= 0 ? Math.min(k, this.pol.help.length - 1) : -1 };
  }

  /** Ask for help without a miss (the 💡 button): the next step of the help ladder. */
  helpStep() {
    return Math.max(0, Math.min(this.misses - this.pol.hintAfter + 1, this.pol.help.length - 1));
  }

  solve() {
    const first = this.misses === 0;
    const slot = this.slot;
    if (first && slot.counted) this.first++;
    if (first) this.missRun = 0;
    // 3 misses in a row: the next task comes one rung easier (once a round, never after the last task)
    if (this.missRun >= this.pol.easierAfter && this.easierRung && !this.easierUsed && this.at + 1 < this.slots.length) {
      this.easierUsed = true;
      this.missRun = 0;
      this.slots.splice(this.at + 1, 0, { kind: "easier", idea: slot.idea, p: slot.p, rung: this.easierRung, counted: false });
    }
    this.at++;
    this.misses = 0;
    return { first, done: this.done };
  }

  get result() {
    return { first: this.first, tasks: this.slots.filter((s) => s.counted).length };
  }
}
