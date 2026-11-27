// Idea "stellen" (station blumenfeld, map fluss): ten ones make a ten, ten tens make a hundred (tens and ones).
// Flowers in the flower field: ten flowers are tied into a bunch, ten bunches go into a basket.
// Ported from think-lab's welt/ideas/stellen: the task code stays code (tasks.js, it picks from tables with
// rules), the five boards are ideas/stellen/board.js, the sentences lang/<language>.js.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "stellen",
  board: "stellen",
  ported: true, // sentences as in think-lab: the board calls them with number words (engine/ui/ported.js)
  ladder: [
    { id: "20", group: "20", age: 6, params: { range: 20 } },
    { id: "50", group: "50", age: 7, params: { range: 50 } },
    { id: "100", group: "100", age: 8, params: { range: 100 } },
    { id: "1000", group: "1000", age: 9, params: { range: 1000 } },
  ],
  start: { at: "20" }, // a concept starts at its smallest numbers, whatever the age (only plain calculation starts by age)
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  cards: { anwenden: "vergleichen" },
  tasks: { make: task, check },
};
