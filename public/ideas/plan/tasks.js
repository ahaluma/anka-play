// Task code of the idea "plan" (station garten, map fluss, the second idea there): plans, ways and scale. A plan
// shows from above where things are. A square has a name made of a letter and a number (B3: column B, row 3).
// A way is a row of steps (→ → ↑). On the plan everything is smaller: one square stands for a real length.
// See docs/GRUNDSCHULE.md 3.6. check() is run by tools/check-ideas.mjs on 1000 tasks per level.
//
//   task({ p, level }, r) → one task. level 1: naming squares, short ways · 2: longer ways round stones,
//   1 square = 10 m · 3: 1 square = 5 m or 100 m, longer ways, from metres back to squares
//
//   Squares are [col, row], col 0 = A, row 0 = 1 (rows counted from the top, as on a town map).
//   sehen     { n, things: [{ id, at }], ask: id, options: [[c, r]], answer: [c, r] }   where is the duck?
//   machen    { n, duck, nest, stones }                 build a way of arrows from the duck to the nest
//   forschen  { n, duck, stones, way: [dir], answer }    where does the duck end up?
//   anwenden  { n, a: { id, at }, b: { id, at }, scale, unit, ask: "metres" | "squares", answer }
//   pruefen   { n, things, ask, said, right, answer, why }   the owl names the square

export const LEVELS = [1, 2, 3];
const levelOf = (l) => (LEVELS.includes(l) ? l : 1);
export const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
export const THINGS = ["duck", "tree", "house", "flower", "bench", "well"];
const SIZE = { 1: 4, 2: 5, 3: 6 };

const same = (a, b) => a[0] === b[0] && a[1] === b[1];
const cell = (n, r) => [r.int(0, n - 1), r.int(0, n - 1)];
const inside = (n, c) => c[0] >= 0 && c[1] >= 0 && c[0] < n && c[1] < n;

/** The shortest way from a to b round the stones (breadth first), or null. */
export function shortest(n, a, b, stones) {
  const blocked = new Set(stones.map((s) => `${s}`));
  const seen = new Map([[`${a}`, 0]]);
  const queue = [a];
  while (queue.length) {
    const c = queue.shift();
    if (same(c, b)) return seen.get(`${c}`);
    for (const [dx, dy] of Object.values(DIRS)) {
      const d = [c[0] + dx, c[1] + dy];
      if (!inside(n, d) || blocked.has(`${d}`) || seen.has(`${d}`)) continue;
      seen.set(`${d}`, seen.get(`${c}`) + 1);
      queue.push(d);
    }
  }
  return null;
}

/** Walk a way from `start`. Returns { at, ok } (ok false: off the plan or into a stone, `at` is where it stopped). */
export function walk(n, start, way, stones = []) {
  let at = start;
  for (const d of way) {
    const next = [at[0] + DIRS[d][0], at[1] + DIRS[d][1]];
    if (!inside(n, next) || stones.some((s) => same(s, next))) return { at, ok: false };
    at = next;
  }
  return { at, ok: true };
}

/** Distinct squares, none of them on `avoid`. */
function spots(n, count, r, avoid = []) {
  const out = [];
  while (out.length < count) {
    const c = cell(n, r);
    if (![...out, ...avoid].some((x) => same(x, c))) out.push(c);
  }
  return out;
}

const makers = {
  sehen(L, r) {
    const n = SIZE[L];
    const ids = r.sample(THINGS, 3);
    const at = spots(n, 3, r);
    const things = ids.map((id, i) => ({ id, at: at[i] }));
    const ask = things[0];
    // the wrong names: row and column swapped, a neighbour
    const [c, w] = ask.at;
    const wrongs = [[w, c], [c + 1 < n ? c + 1 : c - 1, w], [c, w + 1 < n ? w + 1 : w - 1]].filter((x) => !same(x, ask.at) && inside(n, x));
    const options = r.shuffle([ask.at, ...r.shuffle(wrongs).slice(0, 2)]);
    if (options.length < 3) return makers.sehen(L, r);
    return { n, things, ask: ask.id, options, answer: ask.at, key: `s${things.map((t) => t.at).join("|")}` };
  },
  machen(L, r) {
    const n = SIZE[L];
    for (;;) {
      const [duck, nest] = spots(n, 2, r);
      const stones = L === 1 ? [] : spots(n, L === 2 ? 3 : 5, r, [duck, nest]);
      const d = shortest(n, duck, nest, stones);
      if (d === null || d < (L === 1 ? 2 : 3) || d > (L === 1 ? 4 : L === 2 ? 6 : 8)) continue;
      return { n, duck, nest, stones, steps: d, key: `m${duck}>${nest}:${stones.join("|")}` };
    }
  },
  forschen(L, r) {
    const n = SIZE[L];
    const len = L === 1 ? r.int(2, 3) : L === 2 ? r.int(4, 5) : r.int(6, 7);
    for (;;) {
      const duck = cell(n, r);
      const stones = L === 1 ? [] : spots(n, L === 2 ? 2 : 4, r, [duck]);
      const way = Array.from({ length: len }, () => r.pick(Object.keys(DIRS)));
      const w = walk(n, duck, way, stones);
      if (!w.ok || same(w.at, duck)) continue;
      return { n, duck, stones, way, answer: w.at, key: `f${duck}:${way.join("")}` };
    }
  },
  anwenden(L, r) {
    const n = SIZE[L];
    const scale = L === 1 ? 1 : L === 2 ? 10 : r.pick([5, 100]);
    const unit = L === 1 ? "steps" : "m";
    // two things in one row or one column, so the distance is plain to count
    for (;;) {
      const [a, b] = spots(n, 2, r);
      if (a[0] !== b[0] && a[1] !== b[1]) continue;
      const k = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
      if (k < 2) continue;
      const ids = r.sample(["house", "tree", "well", "bench"], 2);
      const ask = L === 3 && r.chance(0.4) ? "squares" : "metres";
      return { n, a: { id: ids[0], at: a }, b: { id: ids[1], at: b }, scale, unit, ask, squares: k, answer: ask === "squares" ? k : k * scale, key: `a${a}${b}${scale}${ask}` };
    }
  },
  pruefen(L, r) {
    const s = makers.sehen(L, r);
    const right = r.chance(0.4);
    const wrong = s.options.filter((o) => !same(o, s.answer));
    const said = right ? s.answer : r.pick(wrong);
    const why = right ? null : said[0] === s.answer[1] && said[1] === s.answer[0] ? "swap" : "near";
    return { ...s, said, right, why, key: `p${s.key}=${said}` };
  },
};

export function task(level, r) {
  const L = levelOf(level.level);
  const make = makers[level.p];
  if (!make) throw new Error(`plan: unknown perspective ${level.p}`);
  return { p: level.p, level: L, ...make(L, r) };
}

/** Problems with a task (empty list = fine). */
export function check(t) {
  const problems = [];
  if (t.p === "sehen" || t.p === "pruefen") {
    const ask = t.things.find((x) => x.id === t.ask);
    if (!same(ask.at, t.answer) || !t.options.some((o) => same(o, t.answer)) || new Set(t.options.map(String)).size !== 3) problems.push("options");
    if (t.p === "pruefen" && same(t.said, t.answer) !== t.right) problems.push("right does not match");
  } else if (t.p === "machen") {
    if (shortest(t.n, t.duck, t.nest, t.stones) !== t.steps) problems.push("no way");
  } else if (t.p === "forschen") {
    const w = walk(t.n, t.duck, t.way, t.stones);
    if (!w.ok || !same(w.at, t.answer)) problems.push("walk");
  } else if (t.p === "anwenden") {
    if (t.answer !== (t.ask === "squares" ? t.squares : t.squares * t.scale)) problems.push("answer");
  }
  return problems;
}
