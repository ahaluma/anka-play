// Idea "schriftlich" (station scheune, map feld): written calculation. Place by place from the right; ten of one
// place move on as one of the next (the carry). Minus trades a ten for ten ones, as at the flower field.
// Divided goes from the left: what is left of a place moves on to the next. See docs/GRUNDSCHULE.md 3.1.
//
// The groups are the four operations (Stufe 1 plus, 2 minus, 3 times, 4 divided), each with small sub-steps and
// "gemischt" at the top, as everywhere in the Feld: one good round moves one sub-step, the stars are won on
// "gemischt". The number range is no level here: the method is the idea, and it starts at its smallest case
// (27 + 15: two digits and one carry).

import { task, check, STEPS, OPS } from "./tasks.js";

const ladder = OPS.flatMap((op, i) =>
  [...STEPS[op], "gemischt"].map((stepId) => ({
    id: `${op}/${stepId}`,
    group: String(i + 1),
    age: 8,
    params: { op, stepId },
  })),
);

export const IDEA = {
  id: "schriftlich",
  board: "schriftlich",
  ported: true, // the board makes its sentences itself (engine/ui/ported.js)
  levels: true, // the groups are named "Stufe 1" … with the operation as the sub-step's name
  ladder,
  start: { at: "plus/zwei" }, // the method starts at its smallest case, whatever the age
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  cards: { forschen: "rueckwaerts", pruefen: "nachpruefen" },
  tasks: { make: task, check },
  rungName: (rung, W) => W.schriftlich?.steps?.[rung.params.op]?.[rung.params.stepId],
};
