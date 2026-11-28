// Idea "wuerfel" (station kisten, map fluss): buildings of boxes, their plan from above, nets of the cube.
// A building can be written down as a plan: each square says how many boxes stand on top of each other. The boxes you
// do not see carry the ones on top. See docs/GRUNDSCHULE.md 3.7. It starts with one row of a few boxes.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "wuerfel",
  board: "wuerfel",
  ported: true, // the board makes its sentences itself (engine/ui/ported.js)
  levels: true, // the groups are levels (1 to 3), not number ranges
  ladder: [
    { id: "1", group: "1", age: 6, params: { level: 1 } },
    { id: "2", group: "2", age: 8, params: { level: 2 } },
    { id: "3", group: "3", age: 9, params: { level: 3 } },
  ],
  start: { at: "1" }, // a concept starts at its smallest case, whatever the age
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  cards: { forschen: "vorhersagen", pruefen: "nachpruefen" },
  tasks: { make: task, check },
};
