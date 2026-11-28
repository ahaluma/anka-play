// Idea "muster" (station wald, map tal): a row goes on, because one piece comes again and again.
// Ported from think-lab's welt/ideas/muster: the task code stays code (tasks.js, it picks from tables with
// rules), the five boards are ideas/muster/board.js, the sentences lang/<language>.js.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "muster",
  board: "muster",
  ported: true, // sentences as in think-lab: the board calls them with number words (engine/ui/ported.js)
  levels: true, // the groups are how long the piece is that comes again: 2, 3 or 4 things
  ladder: [
    { id: "1", group: "1", age: 3, params: { range: 5 } },
    { id: "2", group: "2", age: 4, params: { range: 10 } },
    { id: "3", group: "3", age: 5, params: { range: 20 } },
  ],
  start: { at: "1" }, // a concept starts at its smallest numbers, whatever the age (only plain calculation starts by age)
  perspectives: ["machen", "sehen", "forschen", "anwenden", "pruefen"],
  cards: {"sehen": "wiederholen", "machen": "wiederholen", "forschen": "wiederholen", "anwenden": "rueckwaerts", "pruefen": "vergleichen"},
  tasks: { make: task, check },
};
