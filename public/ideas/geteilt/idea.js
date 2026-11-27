// Idea "geteilt" (station nussbaum, map feld): dividing: nuts shared into bags. Ported from think-lab's market: the task code, the
// board and the sentences are shared by the four operations (boards/rechnung/), this file says which one.

import { operation } from "../../boards/rechnung/idea.js";

export const IDEA = operation("geteilt", {
  policy: { learningBox: { dueDays: [0, 1, 3, 7, 21], fastMs: 5000 } }, // the times tables may take a little longer
});
