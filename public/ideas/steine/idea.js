// Idea "steine" (camp 11 of the Berg, station steine): games against the owl, thought from the end.
// Ported from think-lab's Denk-Berg (welt/ideas/steine): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/steine/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "steine",
  board: "steine",
  words: "steine", // its sentences are by story and tool, not by perspective (lang/<language>.js under "steine")
  tasks: { make: task, check },
};
