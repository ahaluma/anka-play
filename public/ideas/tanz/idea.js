// Idea "tanz" (camp 8 of the Berg, station tanz): pairs and the rest: even and odd, groups, colours on a board.
// Ported from think-lab's Denk-Berg (welt/ideas/tanz): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/tanz/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "tanz",
  board: "tanz",
  words: "tanz", // its sentences are by story and tool, not by perspective (lang/<language>.js under "tanz")
  tasks: { make: task, check },
};
