// Idea "fels" (camp 9 of the Berg, station fels): count in order and turn things in your head.
// Ported from think-lab's Denk-Berg (welt/ideas/fels): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/fels/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "fels",
  board: "fels",
  words: "fels", // its sentences are by story and tool, not by perspective (lang/<language>.js under "fels")
  tasks: { make: task, check },
};
