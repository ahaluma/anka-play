// Idea "groesse" (station ufer, map tal): longer, higher, heavier, in order of size.
// Ported from think-lab's welt/ideas/groesse: the task code stays code (tasks.js, it picks from tables with
// rules), the five boards are ideas/groesse/board.js, the sentences lang/<language>.js.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "groesse",
  board: "groesse",
  ported: true, // sentences as in think-lab: the board calls them with number words (engine/ui/ported.js)
  levels: true, // the groups are levels (1 to 3), not number ranges
  ladder: [
    { id: "1", group: "1", age: 3, params: { range: 1 } },
    { id: "2", group: "2", age: 4, params: { range: 2 } },
    { id: "3", group: "3", age: 5, params: { range: 3 } },
  ],
  start: { byAge: { 3: "1", 4: "2", 5: "3" } },
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  cards: {"forschen": "vorhersagen", "anwenden": "vergleichen", "pruefen": "vergleichen"},
  tasks: { make: task, check },
};
