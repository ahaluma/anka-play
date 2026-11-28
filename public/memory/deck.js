// The memory world: three tables, each a memory game with its own kind of pairs. Pure: the decks and the
// level rule, no screen (memory.js draws them, tools/check-memory.mjs checks them).
//
//   zahlen   a number and that many dots: 4 and ••••, later up to 20
//   formen   the same shape twice; later the second one turned, smaller or in another colour
//   rechnen  a sum and its result: 2 + 3 and 5. Plus first, then minus, then both up to 20, later times and
//            divided
//
// A card: { pair, kind, value } kind tells the screen how to draw it. Each table has a ladder of levels; a board
// solved with few misses moves one level up, many misses one down.

export const TABLES = ["zahlen", "formen", "rechnen"];

export const SHAPES = ["kreis", "quadrat", "dreieck", "rechteck", "stern", "herz", "sechseck", "raute"];
export const COLORS = ["#e0604f", "#2f6fd6", "#3aa35f", "#f0b232", "#a57ad8", "#2fbfb8"];

const L = (pairs, extra) => ({ pairs, ...extra });
export const LADDERS = {
  zahlen: [
    L(3, { from: 1, to: 3, open: true }),
    L(3, { from: 1, to: 5, open: true }),
    L(3, { from: 1, to: 5 }),
    L(4, { from: 1, to: 6 }),
    L(5, { from: 1, to: 8 }),
    L(6, { from: 1, to: 10 }),
    // Beyond ten, as the old number memory had it (asked for 28.11.): the dots in rows of five.
    L(6, { from: 5, to: 12 }),
    L(6, { from: 8, to: 15 }),
    L(6, { from: 11, to: 20 }),
  ],
  formen: [
    L(3, { shapes: 4, same: true, open: true }),
    L(3, { shapes: 4, same: true }),
    L(4, { shapes: 6, same: true }),
    L(4, { shapes: 6, same: false }), // the twin is turned, smaller or in another colour
    L(6, { shapes: 8, same: false }),
  ],
  rechnen: [
    L(3, { ops: ["+"], to: 5 }),
    L(4, { ops: ["+"], to: 10 }),
    L(4, { ops: ["-"], to: 10 }),
    L(5, { ops: ["+", "-"], to: 10 }),
    L(5, { ops: ["+", "-"], to: 20 }),
    L(5, { ops: ["*"], to: 50 }),
    L(5, { ops: [":"], to: 50 }),
    L(6, { ops: ["*", ":"], to: 100 }),
  ],
};

/** The level a child starts at, by age (no age: the first). */
export function startLevel(table, age) {
  if (!age || age <= 4) return 0;
  const byAge = { zahlen: [0, 0, 0, 0, 0, 2, 3, 4], formen: [0, 0, 0, 0, 0, 1, 2, 3], rechnen: [0, 0, 0, 0, 0, 0, 1, 3, 4, 5, 6, 7] };
  const a = byAge[table];
  return Math.min(a[Math.min(age, a.length - 1)], LADDERS[table].length - 1);
}

/** After a board: one level up when solved with few misses, one down with many. Face-down boards always cost
 *  some misses; "few" is at most as many misses as pairs. */
export function nextLevel(table, level, pairs, misses) {
  const top = LADDERS[table].length - 1;
  if (misses <= pairs) return Math.min(top, level + 1);
  if (misses > pairs * 3) return Math.max(0, level - 1);
  return level;
}

const pickFrom = (list, n, rnd) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
};
const between = (rnd, lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/** One sum, written as { a, op, b, c } with a op b = c, inside the level's limits. */
function sum(op, to, rnd) {
  if (op === "+") {
    const c = between(rnd, 2, to);
    const a = between(rnd, 1, c - 1);
    return { a, op, b: c - a, c };
  }
  if (op === "-") {
    const a = between(rnd, 2, to);
    const b = between(rnd, 1, a - 1);
    return { a, op, b, c: a - b };
  }
  // times and divided: the small times table, products up to `to`
  const a = between(rnd, 2, 10);
  const b = between(rnd, 2, Math.max(2, Math.min(10, Math.floor(to / a))));
  return op === "*" ? { a, op, b, c: a * b } : { a: a * b, op, b: a, c: b };
}

/** The cards of one board, shuffled. Every pair has its own value, so no card fits two pairs. */
export function deal(table, level, rnd = Math.random) {
  const lv = LADDERS[table][level];
  const cards = [];
  if (table === "zahlen") {
    for (const [i, n] of pickFrom(range(lv.from, lv.to), lv.pairs, rnd).entries()) cards.push({ pair: i, kind: "zahl", value: n }, { pair: i, kind: "punkte", value: n });
  } else if (table === "formen") {
    for (const [i, s] of pickFrom(SHAPES.slice(0, lv.shapes), lv.pairs, rnd).entries()) {
      const color = COLORS[i % COLORS.length];
      const twin = lv.same ? { shape: s, color, turn: 0, size: 1 } : { shape: s, color: rnd() < 0.5 ? color : COLORS[(i + 3) % COLORS.length], turn: [0, 45, 90, 180][between(rnd, 1, 3)], size: rnd() < 0.5 ? 0.65 : 1 };
      cards.push({ pair: i, kind: "form", value: { shape: s, color, turn: 0, size: 1 } }, { pair: i, kind: "form", value: twin });
    }
  } else {
    const used = new Set();
    let i = 0;
    for (let tries = 0; i < lv.pairs && tries < 500; tries++) {
      const s = sum(lv.ops[Math.floor(rnd() * lv.ops.length)], lv.to, rnd);
      if (used.has(s.c)) continue; // one result per board, so a result card fits only its own sum
      used.add(s.c);
      cards.push({ pair: i, kind: "aufgabe", value: s }, { pair: i, kind: "ergebnis", value: s.c });
      i++;
    }
  }
  return { cards: pickFrom(cards, cards.length, rnd), open: !!lv.open, pairs: cards.length / 2 };
}

/** Do two cards make a pair? */
export const isPair = (x, y) => x !== y && x.pair === y.pair;
