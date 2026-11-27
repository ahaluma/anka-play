// Task code of the idea "muster", ported from think-lab (welt/ideas/muster/tasks.js) as it was. It picks from tables
// with rules (filters, searches), which recipes cannot say (docs/DESIGN.md 6.5). idea.js hands it to the engine
// (engine/recipe.js taskOf); check() is run by tools/check-ideas.mjs on 1000 tasks per level.

// The tasks of the idea "Muster": a row goes on and on, because one piece comes again and again.
// The forest on the map. One function per perspective makes one task as plain data: no DOM, no texts.
//
//   task({ p, range }, r) → one task. p = perspective id. range says how long the piece is:
//     5  → two things, turn by turn        🍄🌲 🍄🌲
//     10 → three things in a piece         🍄🌲🌲  ·  🍄🍄🌲  ·  🍄🌲🌼
//     20 → two by two, or three            🍄🍄🌲🌲 · 🍄🌲🌼
//
//   A piece ("unit") is written as letters, "ABB". `icons` gives every letter its picture.
//
//   sehen     { unit, icons, shown, answer, choices }   the row stops: what comes next?
//   machen    { unit, icons, shown, fill, kinds }       lay the next `fill` things yourself
//   forschen  { unit, icons, shown, choices, answer }   clap and stamp: the row is a rhythm (icons are moves:
//                                                       👏 🦶 🦵). It plays, then: what comes next?
//   anwenden  { unit, icons, shown, gap, choices, answer }   a necklace with a gap in the middle: which bead?
//
//   think-lab asked "which piece comes again and again?" and "which other row goes the same way?". Both ask the
//   child to think about the pattern instead of going on with it: school work, too hard for 3 to 6 (decided
//   with the parents, 2026-11-27). Clapping and the necklace keep the concept and show it in other ways.
//   pruefen   { unit, icons, shown, wrongAt, wrong }    the owl laid a row. wrongAt = place of the one
//                                                       wrong thing (or -1), wrong = its letter
//   key – short text that tells tasks apart, for "not the same task again".
//
// This is the idea of the old game "Muster-Kette", in the frame of the new world.

// Preschool patterns only. think-lab also had ABAC, ABBC, AABC and ABCD at the top level: four things in a piece are
// school work, so they are out. A row never has more than three different things.
export const UNITS = {
  5: ["AB"],
  10: ["ABB", "AAB", "ABC"],
  20: ["AABB", "ABC"],
};
// Each thing its own colour and shape, so no two can be mixed up on a small phone (think-lab's leaf, chestnut and
// snail were all brown). Old, well-known emoji: old phones show them too.
export const FOREST = ["🍄", "🌲", "🌼", "🦋", "🦊", "🦔"];
/** Clap, stamp, pat the knees: a pattern to hear and to do with the body. */
export const MOVES = ["👏", "🦶", "🦵"];
/** Beads of a necklace: one colour each. */
export const BEADS = ["🔴", "🔵", "🟡", "🟢"];
export const MAX_SHOWN = 10; // more things get too small in one row on a small phone

const letters = (unit) => [...new Set(unit)];
/** The thing at place i of the endless row. */
export const at = (unit, i) => unit[i % unit.length];
/** "ABB" → "ABB", "BBA" → "AAB": the letters renamed in the order they come. */
const renamed = (u) => {
  const names = {};
  return [...u].map((l) => (names[l] ??= "ABCD"[Object.keys(names).length])).join("");
};
/**
 * Is v the row of u, only started at another place or made of other things? "ABB" and "AAB" are:
 * 🍄🌰🌰🍄🌰🌰 is 🌰🌰🍄🌰🌰🍄 one step later. Such a pair must never be "right" and "wrong" in one task.
 */
export const sameWay = (u, v) => {
  const n = u.length * v.length;
  const long = (w) => Array.from({ length: n * 2 }, (_, i) => at(w, i)).join("");
  for (let shift = 0; shift < u.length; shift++) if (renamed(long(u).slice(shift, shift + n)) === renamed(long(v).slice(0, n))) return true;
  return false;
};

/** A piece of the range and a picture for each of its letters. */
function pattern(range, r, not = []) {
  const unit = r.pick((UNITS[range] || UNITS[5]).filter((u) => !not.includes(u)));
  const pics = r.shuffle(FOREST);
  const icons = Object.fromEntries(letters(unit).map((l, i) => [l, pics[i]]));
  return { unit, icons };
}

/** How many things are shown: two full pieces and a bit, so the piece is seen twice. */
const shownFor = (unit, r, extraMax = unit.length - 1) => Math.min(MAX_SHOWN - 1, unit.length * 2 + r.int(0, extraMax));

const makers = {
  sehen(range, r) {
    const { unit, icons } = pattern(range, r);
    const shown = shownFor(unit, r);
    return { unit, icons, shown, answer: at(unit, shown), choices: r.shuffle(letters(unit)), key: `${unit}:${shown % unit.length}` };
  },
  machen(range, r) {
    const { unit, icons } = pattern(range, r);
    const shown = unit.length * 2;
    const fill = Math.min(unit.length + 1, MAX_SHOWN - shown);
    return { unit, icons, shown, fill, kinds: r.shuffle(letters(unit)), key: unit };
  },
  // Clap and stamp: the row is a rhythm the child hears and sees, one beat after the other. What comes next?
  forschen(range, r) {
    const unit = r.pick(UNITS[range] || UNITS[5]);
    const moves = r.shuffle(MOVES.slice(0, Math.max(2, letters(unit).length)));
    const icons = Object.fromEntries(letters(unit).map((l, i) => [l, moves[i]]));
    const shown = shownFor(unit, r, 0);
    return { unit, icons, shown, answer: at(unit, shown), choices: r.shuffle(letters(unit)), key: `${unit}:${moves.join("")}` };
  },
  // The necklace: one bead in the middle is missing. Which one belongs in the gap? (Never in the first piece:
  // the first piece shows how the row goes; and never the last bead: the beads after the gap help too.)
  anwenden(range, r) {
    const unit = r.pick(UNITS[range] || UNITS[5]);
    const beads = r.shuffle(BEADS);
    const icons = Object.fromEntries(letters(unit).map((l, i) => [l, beads[i]]));
    const shown = Math.min(MAX_SHOWN, unit.length * 3);
    const gap = r.int(unit.length, shown - 2);
    return { unit, icons, shown, gap, answer: at(unit, gap), choices: r.shuffle(letters(unit)), key: `${unit}:${gap}` };
  },
  pruefen(range, r) {
    const { unit, icons } = pattern(range, r);
    const shown = Math.min(MAX_SHOWN, unit.length * 3);
    const right = r.chance(0.4);
    // The wrong thing is never in the first piece: the first piece shows how the row goes.
    const wrongAt = right ? -1 : r.int(unit.length, shown - 1);
    const wrong = right ? "" : r.pick(letters(unit).filter((l) => l !== at(unit, wrongAt)));
    return { unit, icons, shown, wrongAt, wrong, key: `${unit}:${wrongAt}` };
  },
};

export function task(level, r) {
  const make = makers[level.p];
  return { p: level.p, range: level.range, ...make(level.range, r) };
}

/** Problems with a task (empty list = fine), for tools/check-welt.mjs. */
export function check(t, level) {
  const problems = [];
  const units = UNITS[level.range];
  if (!units.includes(t.unit)) problems.push(`piece ${t.unit} is not of this range`);
  for (const l of letters(t.unit)) if (!t.icons[l]) problems.push(`no picture for ${l}`);
  if (new Set(letters(t.unit).map((l) => t.icons[l])).size !== letters(t.unit).length) problems.push("two letters look the same");
  if (t.shown < t.unit.length * 2) problems.push("the piece is not shown twice");
  if (t.shown + (t.p === "sehen" ? 1 : t.p === "machen" ? t.fill : 0) > MAX_SHOWN) problems.push("row too long");
  if (t.p === "sehen") {
    if (t.answer !== at(t.unit, t.shown) || !t.choices.includes(t.answer)) problems.push("bad answer");
    if (t.choices.length < 2) problems.push("nothing to choose");
  }
  if (t.p === "machen" && (t.fill < 2 || t.kinds.length < 2)) problems.push("nothing to lay");
  if (t.p === "forschen") {
    if (t.answer !== at(t.unit, t.shown) || !t.choices.includes(t.answer)) problems.push("bad answer");
    if (Object.values(t.icons).some((x) => !MOVES.includes(x))) problems.push("not a move");
  }
  if (t.p === "anwenden") {
    if (t.gap < t.unit.length || t.gap >= t.shown - 1) problems.push("gap at a bad place");
    if (t.answer !== at(t.unit, t.gap) || !t.choices.includes(t.answer)) problems.push("bad answer");
    if (Object.values(t.icons).some((x) => !BEADS.includes(x))) problems.push("not a bead");
  }
  if (t.p === "pruefen" && t.wrongAt >= 0) {
    if (t.wrongAt < t.unit.length || t.wrongAt >= t.shown) problems.push("wrong thing at a bad place");
    if (t.wrong === at(t.unit, t.wrongAt) || !t.unit.includes(t.wrong)) problems.push("the wrong thing is not wrong");
  }
  return problems;
}
