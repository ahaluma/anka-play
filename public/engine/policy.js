// How a child moves on an idea's ladder after a round: the star, up, down. One engine for every map;
// the differences are data (content/policies.js). See docs/DESIGN.md, section 7.
//
// Standing rules, the same everywhere:
//   star  4 of 5 tasks of a round right at the first try (policy star.share) -> the perspective gets its star
//         in the group of the rung it was played at. At once, no waiting days. A star stays.
//   up    move "group" (Tal, Fluss, Berg): when 60 % of the idea's perspectives have their star in the current
//         group (3 of 5, 3 of 4, 2 of 3, 2 of 2, 1 of 1), the child goes on to the next group.
//         move "rung" (Feld): a good round moves one rung up.
//   down  2 weak rounds in a row (2 of 5 or fewer) -> one group (Feld: one rung) down, and the age no longer
//         moves the child up by itself (lowered).

import { POLICIES } from "../content/policies.js";
import { starsToMoveUp } from "../content/perspectives.js";
import * as L from "./learner.js";

/** The policy of a map, with an idea's own overrides (idea.policy). */
export function policyFor(mapPolicy, def) {
  const base = POLICIES[mapPolicy] ?? POLICIES.tal;
  return { ...base, ...(def?.policy ?? {}) };
}

/** How many tasks a round has for this child. */
export const roundSize = (pol, age) => (pol.young && age !== null && age !== undefined && age < pol.young.under ? pol.young.roundSize : pol.roundSize);

function step(def, from, by, pol) {
  if (pol.move === "rung") return def.ladder[L.rungIndex(def, from) + by]?.id ?? null;
  const gs = L.groups(def);
  const g = gs[gs.indexOf(L.groupOf(def, from)) + by];
  return g ? L.firstOf(def, g) : null;
}

/**
 * A finished round of one perspective. `rung` is the level the round was played at; `first` of `tasks`
 * counted tasks were right at the first try. Changes the record; returns what the done screen tells:
 *   { share, star (the perspective has its star in this group now), newStar, moved: +1 | 0 | -1, level }
 */
export function afterRound(rec, def, pol, { p, rung, first, tasks, age = null, day = L.today() }) {
  const s = L.slot(rec, def.id);
  const share = tasks ? first / tasks : 0;
  const group = L.groupOf(def, rung);
  const c = (s.cells[L.cellKey(p, rung)] ??= { n: 0, first: 0, recent: [], last: day });
  c.share = share;
  const had = L.starred(rec, def, p, group);
  if (share >= pol.star.share - 1e-9 && !c.star) c.star = day;
  const star = L.starred(rec, def, p, group);

  const now = L.level(rec, def, age);
  let moved = 0;
  let next = now;
  if (share <= pol.weak + 1e-9) s.weakInRow++;
  else s.weakInRow = 0;

  if (s.weakInRow >= (pol.down?.count ?? 2)) {
    const lower = step(def, now, -1, pol);
    s.weakInRow = 0;
    if (lower) {
      next = lower;
      moved = -1;
      s.lowered = true;
    }
  } else if (pol.up.when === "goodRound" ? share >= pol.good - 1e-9 : enoughStars(rec, def, L.groupOf(def, now))) {
    const higher = step(def, now, +1, pol);
    if (higher) {
      next = higher;
      moved = 1;
      s.lowered = false;
    }
  }
  s.level = next;
  return { share, star, newStar: star && !had, moved, level: next };
}

/** 60 % of the idea's perspectives starred in this group. */
export function enoughStars(rec, def, group) {
  const n = def.perspectives.filter((p) => L.starred(rec, def, p, group)).length;
  return n >= starsToMoveUp(def.perspectives.length);
}

/** The Berg asks "how was it?": a weak round that felt hard also moves one group down (policy down.orWeakAndHard). */
export function afterFeel(rec, def, pol, { share, feel, age = null }) {
  if (!pol.down?.orWeakAndHard || feel !== "hard" || share > pol.weak + 1e-9) return 0;
  const s = L.slot(rec, def.id);
  const lower = step(def, L.level(rec, def, age), -1, pol);
  if (!lower) return 0;
  s.level = lower;
  s.lowered = true;
  s.weakInRow = 0;
  return -1;
}
