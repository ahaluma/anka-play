// Idea "daten" (station weide, map fluss): data and chance. Birds on the willow are counted with tally marks, five
// in a bundle; a chart shows the counts as bars; the bag of balls and the dice show what is certain, possible and
// more likely. See docs/GRUNDSCHULE.md 3.8. The bag and the weather chart came from the sunny rock.

import { task, check } from "./tasks.js";

export const IDEA = {
  id: "daten",
  board: "daten",
  ported: true, // the board makes its sentences itself (engine/ui/ported.js)
  levels: true,
  ladder: [
    { id: "1", group: "1", age: 6, params: { range: 1 } },
    { id: "2", group: "2", age: 7, params: { range: 2 } },
    { id: "3", group: "3", age: 8, params: { range: 3 } },
  ],
  start: { at: "1" },
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  cards: { forschen: "vorhersagen", anwenden: "vergleichen" },
  tasks: { make: task, check },
};
