// First-visit questions: a portal may ask a few tasks on the child's first visit to its target station,
// whichever way the child comes in first. It never blocks; the answers only choose the starting rung.
// See docs/DESIGN.md, section 4.4. Pure functions; engine/ui/gate.js asks them.
//
//   gate = { perspective: "sehen", levels: ["20", "100", "1000"] }   (on an edge in content/universe.js)

import { gateOf } from "./graph.js";
import * as L from "./learner.js";

/** The questions of a station's gate for one idea: one task per level that is a rung of its ladder. */
export function questions(stationId, def) {
  const gate = gateOf(stationId);
  if (!gate || !def.perspectives.includes(gate.perspective)) return [];
  return gate.levels.filter((id) => L.rung(def, id)).map((id) => ({ p: gate.perspective, rung: id }));
}

/** Are the questions due? Only before the first visit and only once. */
export const due = (rec, stationId, def) => questions(stationId, def).length > 0 && !rec.ideas[def.id]?.gate && !rec.ideas[def.id]?.rounds;

/** The starting rung: the highest rung answered right at the first try; with none, the first rung. */
export function start(def, answers) {
  const right = answers.filter((a) => a.first).map((a) => L.rungIndex(def, a.rung));
  return right.length ? def.ladder[Math.max(...right)].id : def.ladder[0].id;
}

/** Saves the answers and the starting rung. Returns the rung. */
export function save(rec, def, answers, day = L.today()) {
  const s = L.slot(rec, def.id);
  const at = start(def, answers);
  s.gate = { day, answers, start: at };
  s.level = at;
  return at;
}
