// Idea "zaun" (camp 1 of the Berg, station zaun): posts and gaps: count the gaps, not the posts.
// Ported from think-lab's Denk-Berg (welt/ideas/zaun): the task code stays code (tasks.js: its generators search,
// and check() proves the one answer by trying every case, docs/DESIGN.md 6.5), the five boards are
// ideas/zaun/board.js with the parts every camp shares (boards/berg/), the sentences lang/<language>.js.

import { task, check } from "./tasks.js";
import { CAMP } from "../../boards/berg/idea.js";

export const IDEA = {
  ...CAMP,
  id: "zaun",
  board: "zaun",
  words: "zaun", // its sentences are by story and tool, not by perspective (lang/<language>.js under "zaun")
  cards: { sehen: "luecken", anwenden: "luecken" },
  tasks: { make: task, check },
};
