// Idea "geld" (station hofstand, map feld): money: euro coins and notes, count, pay, give change. The farm stand by the field path.
// The groups are the most money in a task: 10, 20, 100 euros.
// Ported from think-lab's welt/ideas/geld: the task code stays code (tasks.js, it picks from tables with
// rules), the five boards are ideas/geld/board.js, the sentences lang/<language>.js.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "geld",
  board: "geld",
  ported: true, // sentences as in think-lab: the board calls them with number words (engine/ui/ported.js)
  ladder: [
    { id: "10", group: "10", age: 6, params: { range: 10 } },
    { id: "20", group: "20", age: 7, params: { range: 20 } },
    { id: "100", group: "100", age: 8, params: { range: 100 } },
  ],
  start: { at: "10" }, // a concept starts at its smallest numbers, whatever the age (only plain calculation starts by age)
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  tasks: { make: task, check },
};
