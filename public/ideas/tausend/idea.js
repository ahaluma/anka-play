// Idea "tausend" (station blumenfeld, map fluss, next to "stellen"): big numbers up to a million in the place-value
// table. Ten of one place make one of the next, on and on; an empty place is written as 0. See docs/GRUNDSCHULE.md 3.3.
// It starts at the first four-digit numbers, where the thousand is new.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "tausend",
  board: "tausend",
  ported: true, // the board makes its sentences itself (engine/ui/ported.js)
  ladder: [
    { id: "10000", group: "10000", age: 9, params: { range: 10000 } },
    { id: "1000000", group: "1000000", age: 10, params: { range: 1000000 } },
  ],
  start: { at: "10000" }, // a concept starts at its smallest numbers, whatever the age
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  cards: { forschen: "vorhersagen", pruefen: "nachpruefen" },
  tasks: { make: task, check },
};
