// Idea "haken" (camp 2 of the Berg, station haken): count every possibility in order, none twice.
// Ported from think-lab's Denk-Berg (welt/ideas/haken): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/haken/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "haken",
  board: "haken",
  words: "haken", // its sentences are by story and tool, not by perspective (lang/<language>.js under "haken")
  tasks: { make: task, check },
};
