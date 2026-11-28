// Idea "masse" (station muehle, map fluss): sizes and units. You measure with equal pieces; a big unit is made of
// many small ones (1 m = 100 cm, 1 kg = 1000 g, 1 l = 1000 ml), and every thing has a unit that fits it best.
// At the water mill: sacks of flour on the scale, the mill's jugs, the miller's measuring rod. See
// docs/GRUNDSCHULE.md 3.4. It starts with length (1 m = 100 cm), the unit a child knows from the ruler.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "masse",
  board: "masse",
  ported: true, // the board makes its sentences itself (engine/ui/ported.js)
  levels: true, // the groups are levels (1 to 3), not number ranges
  ladder: [
    { id: "1", group: "1", age: 7, params: { level: 1 } },
    { id: "2", group: "2", age: 8, params: { level: 2 } },
    { id: "3", group: "3", age: 9, params: { level: 3 } },
  ],
  start: { at: "1" },
  perspectives: ["machen", "sehen", "forschen", "anwenden", "pruefen"],
  cards: { forschen: "vorhersagen", anwenden: "vergleichen" },
  tasks: { make: task, check },
};
