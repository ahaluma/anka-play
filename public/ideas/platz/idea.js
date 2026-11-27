// Idea "platz" (station lichtung, map feld): little stories where the operations come together. Ported from
// think-lab's market square (welt/markt/stories.js). Five levels: 1 one step, 2 first pick + − · :, 3 two steps,
// 4 two steps and a number nobody needs, 5 backwards. One perspective: use. The clearing opens when plus and
// minus have their flag at 10 (universe.js); the stories use only operations and number ranges the child has
// finished (the flags of apfelbaum, beeren, huehner and nussbaum), handed in by `context`.

import { story, checkStory, STAGES } from "../../boards/rechnung/stories.js";
import { RANGES } from "../../boards/rechnung/tasks.js";

/** The stations of the operations, and what a story may use: the biggest range with its flag, per operation. */
const AT = { plus: "apfelbaum", minus: "beeren", mal: "huehner", geteilt: "nussbaum" };
export function allowed(facts) {
  const out = {};
  for (const [op, station] of Object.entries(AT)) {
    const top = [...RANGES].reverse().find((r) => facts.flag(station, String(r)));
    if (top) out[op] = top;
  }
  return Object.keys(out).length ? out : { plus: 10, minus: 10 };
}

function make({ stage, allowed: ops = { plus: 10, minus: 10 } }, r) {
  const s = story(stage, ops, r);
  return { ...s, story: true, allowed: ops, key: `${s.kind}:${Object.values(s.n).join(",")}` };
}

export const IDEA = {
  id: "platz",
  board: "rechnung",
  ported: true, // the board makes its sentences itself, as on the market square
  words: "rechnung", // its sentences are in boards/rechnung/lang/<language>.js (platz)
  levels: true, // the groups are the five levels, not number ranges
  ladder: STAGES.map((s) => ({ id: String(s), group: String(s), age: 6, params: { stage: s } })),
  start: { byAge: { 6: "1" } },
  perspectives: ["anwenden"],
  context: (facts) => ({ allowed: allowed(facts) }), // added to the rung's params when a task is made
  tasks: { make, check: (t) => checkStory(t, t.allowed) },
};
