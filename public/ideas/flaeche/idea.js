// Idea "flaeche" (station garten, map fluss): area and perimeter. The area: how many equal squares fit inside (the
// garden's paving slabs). The perimeter: how many pieces of fence go all round. The same area does not mean the
// same fence. See docs/GRUNDSCHULE.md 3.5. It starts with a bed of a few slabs, counted.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "flaeche",
  board: "flaeche",
  ported: true, // the board makes its sentences itself (engine/ui/ported.js)
  levels: true,
  ladder: [
    { id: "1", group: "1", age: 7, params: { level: 1 } },
    { id: "2", group: "2", age: 8, params: { level: 2 } },
    { id: "3", group: "3", age: 9, params: { level: 3 } },
  ],
  start: { at: "1" },
  perspectives: ["machen", "sehen", "forschen", "anwenden", "pruefen"],
  cards: { forschen: "vorhersagen", pruefen: "nachpruefen" },
  tasks: { make: task, check },
};
