// The four operations of the Feld as ideas: plus (apfelbaum), minus (beeren), mal (huehner), geteilt (nussbaum).
// They share think-lab's market task code (boards/rechnung/tasks.js) and board (boards/rechnung.js), so their
// idea.js is one line: export const IDEA = operation("plus"). What differs is data, written here once:
//
//   ladder   the four number ranges (groups 10, 20, 100, 1000), each with its small sub-steps and "gemischt"
//            (all of them mixed) at the top: "20/verdoppeln", "20/uebergang", "20/luecke", "20/gemischt".
//            One good round moves one rung up (the Feld policy); the stars are given on "gemischt" only.
//   bridges  a kind of mistake that came 3 times in the last 2 rounds brings a short bridge on the rung that
//            trains it (forgot the ten -> "über den Zehner")
//   inverse  in "use" the last task comes back the other way round (8 + 5 = 13, then 13 - 5)
//   card     each task is a card in the learning box (a fact like "plus:8,5", or a kind of task above 20)

import { task, check, inverse, STEPS, RANGES } from "./tasks.js";

/** The rungs of one operation: every sub-step of every range, then that range mixed. */
export function ladderOf(op) {
  return RANGES.flatMap((range) =>
    [...STEPS[op][range], "gemischt"].map((stepId, step) => ({
      id: `${range}/${stepId}`,
      group: String(range),
      age: { 10: 6, 20: 6, 100: 7, 1000: 8 }[range],
      params: { op, range, step, stepId },
    })),
  );
}

/** One task. On an "inverse" slot the engine passes the task before as `inverseOf`. */
function make({ p, op, range, step, inverseOf }, r) {
  if (inverseOf && inverseOf.gap === "c" && !inverseOf.rest) {
    const u = inverse(inverseOf);
    if (u.max <= range) return card({ ...u, stepId: inverseOf.stepId });
  }
  return card(task(op, range, step, r));
}
const card = (t) => ({ ...t, card: t.key, fact: !t.key.includes(`:${t.range}:`) });

export function operation(op, extra = {}) {
  return {
    id: op,
    board: "rechnung",
    ported: true, // the board makes its sentences itself, as at the market
    words: "rechnung", // its sentences are in boards/rechnung/lang/<language>.js (the idea's lang files hand them on)
    ladder: ladderOf(op),
    start: { byAge: { 6: `10/${STEPS[op][10][0]}` } }, // every child starts at 10; the bridge's questions may start higher
    perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
    inverseIn: ["anwenden"],
    bridges: { zehner: ["uebergang", "zeE", "carry"], kleinergroesser: ["zeze", "carry", "uebergang"], nachbar: ["reihen", "alle"], rest: ["rest"] },
    tasks: { make, check },
    // the name of a rung on the station ("Zahlen bis 20 · über den Zehner")
    rungName: (rung, W) => (rung.params.stepId === "gemischt" ? W.rechnung?.mixed : W.rechnung?.steps?.[op]?.[rung.params.stepId]),
    ...extra,
  };
}
