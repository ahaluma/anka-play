// Idea "plan" (station garten, map fluss, the second idea there): plans, ways and scale. A plan shows from above
// where things are; a square is named by a letter and a number (B3); a way is a row of steps; one square stands for
// a real length. See docs/GRUNDSCHULE.md 3.6. It starts with a plan of 4 × 4 squares and ways of two steps.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "plan",
  board: "plan",
  ported: true, // the board makes its sentences itself (engine/ui/ported.js)
  levels: true,
  ladder: [
    { id: "1", group: "1", age: 7, params: { level: 1 } },
    { id: "2", group: "2", age: 8, params: { level: 2 } },
    { id: "3", group: "3", age: 9, params: { level: 3 } },
  ],
  start: { at: "1" },
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  cards: { machen: "ausprobieren", forschen: "vorhersagen" },
  tasks: { make: task, check },
};
