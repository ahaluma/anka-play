// Idea "stall" (camp 7 of the Berg, station stall): assume they are all the small kind, then swap one at a time (heads and legs).
// Ported from think-lab's Denk-Berg (welt/ideas/stall): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/stall/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "stall",
  board: "stall",
  words: "stall", // its sentences are by story and tool, not by perspective (lang/<language>.js under "stall")
  tasks: { make: task, check },
};
