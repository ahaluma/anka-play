// Ported from think-lab (welt/ideas/gipfel/boards.js) with only its imports changed: engine/ui/ported.js gives it
// the round it knew there, boards/berg/ the parts every camp shares. The task is what ideas/gipfel/tasks.js made.
import { port } from "../../engine/ui/ported.js";

// The boards of the summit's own families (ideas/gipfel/tasks.js): the shared camp board
// (berg/camp.js), with the number wall of camp 12 for "mauerwaage". Texts: welt/lang under "gipfel".

import { campBoards } from "../../boards/berg/camp.js";
import { DIGITS } from "./tasks.js";
import { picture } from "../mauer/board.js";

export const TOOLS = { zaun: "🪵", stall: "🐔", rueck: "⏪", regel: "🐜", haken: "✔️", paar: "👫", waage: "⚖️", mauer: "🧱", probe: "🧪" };

export const BOARDS = campBoards("gipfel", { TOOLS, DIGITS, picture });

export const draw = port(BOARDS);
