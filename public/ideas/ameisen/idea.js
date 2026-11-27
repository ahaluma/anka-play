// Idea "ameisen" (camp 5 of the Berg, station ameisen): find the rule of a row and jump far ahead.
// Ported from think-lab's Denk-Berg (welt/ideas/ameisen): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/ameisen/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "ameisen",
  board: "ameisen",
  words: "ameisen", // its sentences are by story and tool, not by perspective (lang/<language>.js under "ameisen")
  tasks: { make: task, check },
};
