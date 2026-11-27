// Idea "socken" (camp 10 of the Berg, station socken): to be sure, think of the worst luck.
// Ported from think-lab's Denk-Berg (welt/ideas/socken): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/socken/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "socken",
  board: "socken",
  words: "socken", // its sentences are by story and tool, not by perspective (lang/<language>.js under "socken")
  tasks: { make: task, check },
};
