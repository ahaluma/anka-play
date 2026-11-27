// Idea "huetten" (camp 3 of the Berg, station huetten): logic puzzles solved by ruling out (each one checked by a solver: exactly one solution).
// Ported from think-lab's Denk-Berg (welt/ideas/huetten): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/huetten/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "huetten",
  board: "huetten",
  words: "huetten", // its sentences are by story and tool, not by perspective (lang/<language>.js under "huetten")
  tasks: { make: task, check },
};
