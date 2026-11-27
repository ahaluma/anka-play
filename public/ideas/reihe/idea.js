// Idea "reihe" (station steg, map fluss): every number has its place: the number line, order, comparing, ordinal numbers.
// The footbridge is the number line: its planks are the ticks, a frog sits at a number, ducklings carry a row.
// Ported from think-lab's welt/ideas/reihe: the task code stays code (tasks.js, it picks from tables with
// rules), the five boards are ideas/reihe/board.js, the sentences lang/<language>.js.
// The first visit asks three "where is it on the bridge?" tasks at 20, 100 and 1000 (the gate in universe.js).

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "reihe",
  board: "reihe",
  ported: true, // sentences as in think-lab: the board calls them with number words (engine/ui/ported.js)
  ladder: [
    { id: "20", group: "20", age: 6, params: { range: 20 } },
    { id: "100", group: "100", age: 7, params: { range: 100 } },
    { id: "1000", group: "1000", age: 9, params: { range: 1000 } },
  ],
  start: { byAge: { 6: "20", 7: "100", 9: "1000" } },
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  cards: { anwenden: "vergleichen", pruefen: "vergleichen" },
  tasks: { make: task, check },
};
