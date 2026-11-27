// Idea "vorrat" (camp 4 of the Berg, station vorrat): think backwards: undo every step, the last one first.
// Ported from think-lab's Denk-Berg (welt/ideas/vorrat): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/vorrat/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "vorrat",
  board: "vorrat",
  words: "vorrat", // its sentences are by story and tool, not by perspective (lang/<language>.js under "vorrat")
  tasks: { make: task, check },
};
