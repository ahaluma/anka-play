// Idea "runden" (station steg, map fluss, the second idea there next to the number line): rounding and estimating.
// Rounding asks which round neighbour is nearer; exactly in the middle you round up. See docs/GRUNDSCHULE.md 3.2.
// It starts with two digits rounded to the ten (37 is nearer to 40), the smallest case of rounding.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "runden",
  board: "runden",
  ported: true, // the board makes its sentences itself (engine/ui/ported.js)
  levels: true, // the groups are levels (1 to 3), not number ranges
  ladder: [
    { id: "1", group: "1", age: 7, params: { level: 1 } },
    { id: "2", group: "2", age: 8, params: { level: 2 } },
    { id: "3", group: "3", age: 9, params: { level: 3 } },
  ],
  start: { at: "1" }, // a concept starts at its smallest numbers, whatever the age
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  cards: { forschen: "vorhersagen", pruefen: "nachpruefen" },
  tasks: { make: task, check },
};
