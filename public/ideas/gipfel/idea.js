// Idea "gipfel" (the summit of the Berg): competition rounds. Ported from think-lab's summit (welt/berg/gipfel/):
// a round has four tasks from the camps below at their top level (three to transfer, one where the owl is checked)
// and one of the summit's own families that needs two tools at once (ideas/gipfel/tasks.js). Before each task
// the child picks the tool to start with (boards/berg/summit.js); afterwards "and this works too" shows every
// tool that fits. No clock and no points. The summit opens when every camp is mastered (content/universe.js).
//
// One perspective, "transfer". The four camp tasks are the round's backpack (content/policies.js, berg): here it
// takes from every camp, at level 4.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";
import { pickTool } from "../../boards/berg/summit.js";

export const IDEA = {
  ...CAMP,
  id: "gipfel",
  board: "gipfel",
  words: "gipfel", // its sentences are by story and tool, not by perspective (lang/<language>.js under "gipfel")
  ladder: [{ id: "4", group: "4", age: 9, params: { range: 4 } }],
  start: { at: "4" },
  mastery: "4",
  perspectives: ["anwenden"],
  policy: {
    slots: ["backpack", "cur", "backpack", "backpack", "backpack"],
    backpack: { from: "map", perspectives: ["anwenden", "anwenden", "anwenden", "pruefen"], rung: "top", each: true },
    surprise: false,
  },
  around: pickTool, // the tool from the backpack, before every task
  tasks: { make: (level, r) => task(r), check: (t) => check(t) },
};
