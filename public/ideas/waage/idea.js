// Idea "waage" (camp 6 of the Berg, station waage): what weighs the same can take the other one’s place.
// Ported from think-lab's Denk-Berg (welt/ideas/waage): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/waage/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "waage",
  board: "waage",
  words: "waage", // its sentences are by story and tool, not by perspective (lang/<language>.js under "waage")
  tasks: { make: task, check },
};
