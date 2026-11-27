// Idea "lage" (station huegel, map tal): where is it? On, under, next to, in front, behind.
// Ported from think-lab's welt/ideas/lage: the task code stays code (tasks.js, it picks from tables with
// rules), the five boards are ideas/lage/board.js, the sentences lang/<language>.js.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "lage",
  board: "lage",
  ported: true, // sentences as in think-lab: the board calls them with number words (engine/ui/ported.js)
  levels: true, // the groups are levels (1 to 3), not number ranges
  ladder: [
    { id: "1", group: "1", age: 3, params: { range: 1 } },
    { id: "2", group: "2", age: 4, params: { range: 2 } },
    { id: "3", group: "3", age: 5, params: { range: 3 } },
  ],
  start: { at: "1" }, // a concept starts at its smallest numbers, whatever the age (only plain calculation starts by age)
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  tasks: { make: task, check },
};
