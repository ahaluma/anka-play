// Idea "mauer" (camp 12 of the Berg, station mauer): number walls and riddles, narrowed down clue by clue.
// Ported from think-lab's Denk-Berg (welt/ideas/mauer): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/mauer/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "mauer",
  board: "mauer",
  words: "mauer", // its sentences are by story and tool, not by perspective (lang/<language>.js under "mauer")
  tasks: { make: task, check },
};
