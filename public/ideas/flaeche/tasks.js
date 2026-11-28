// Task code of the idea "flaeche" (station garten, map fluss): area and perimeter. The area says how much room is
// inside: you count equal squares (the garden's paving slabs). The perimeter says how long the edge is: you count
// the pieces of fence all round. The same area does not mean the same fence. See docs/GRUNDSCHULE.md 3.5.
// check() is run by tools/check-ideas.mjs on 1000 tasks per level.
//
//   task({ p, level }, r) → one task. level 1: area by counting · 2: the fence by counting, and both ·
//   3: rectangles with their measures (area = length times width)
//
//   A shape is a list of cells [x, y] on a grid of w × h.
//   sehen     { w, h, cells, ask: "area" | "fence", answer }
//   machen    { w, h, area, fence?, rect? }       lay a bed: so many slabs (and so much fence, or a rectangle)
//   forschen  { w, h, a: cells, b: cells, ask, answer: "a" | "b" | "same" }   which is bigger / needs more fence?
//   anwenden  { len, wid, grid, ask, answer }      a rectangle: len × wid (with its grid up to level 2)
//   pruefen   { w, h, cells, ask, said, right, why, answer }   the owl counted

export const LEVELS = [1, 2, 3];
const levelOf = (l) => (LEVELS.includes(l) ? l : 1);

const key = (c) => `${c[0]},${c[1]}`;

/** The pieces of fence round a shape: every side of a cell that does not touch another cell of it. */
export function fence(cells) {
  const set = new Set(cells.map(key));
  let n = 0;
  for (const [x, y] of cells) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!set.has(key([x + dx, y + dy]))) n++;
  return n;
}

/** Cells that are on the edge (the owl counts them instead of the fence). */
export const edgeCells = (cells) => {
  const set = new Set(cells.map(key));
  return cells.filter(([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !set.has(key([x + dx, y + dy])))).length;
};

/** Is the shape a full rectangle? */
export function isRect(cells) {
  if (!cells.length) return false;
  const xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1]);
  const w = Math.max(...xs) - Math.min(...xs) + 1, h = Math.max(...ys) - Math.min(...ys) + 1;
  return w * h === cells.length;
}

/** A connected shape of n cells on a w × h grid, grown from one cell. */
export function grow(n, w, h, r) {
  for (;;) {
    const cells = [[r.int(0, w - 1), r.int(0, h - 1)]];
    const set = new Set(cells.map(key));
    for (let tries = 0; cells.length < n && tries < 400; tries++) {
      const [x, y] = r.pick(cells);
      const [dx, dy] = r.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      const c = [x + dx, y + dy];
      if (c[0] < 0 || c[1] < 0 || c[0] >= w || c[1] >= h || set.has(key(c))) continue;
      cells.push(c);
      set.add(key(c));
    }
    if (cells.length === n) return cells;
  }
}

/** A rectangle of a × b cells placed on the grid. */
function rect(a, b, w, h, r) {
  const x0 = r.int(0, w - a), y0 = r.int(0, h - b);
  const out = [];
  for (let y = 0; y < b; y++) for (let x = 0; x < a; x++) out.push([x0 + x, y0 + y]);
  return out;
}

const GRID = { 1: [6, 5], 2: [7, 6], 3: [8, 6] };

const makers = {
  sehen(L, r) {
    const [w, h] = GRID[L];
    const ask = L === 1 ? "area" : r.pick(["area", "fence", "fence"]);
    const cells = L === 3 && r.chance(0.5) ? rect(r.int(2, 6), r.int(2, 5), w, h, r) : grow(r.int(L === 1 ? 3 : 4, L === 1 ? 9 : 12), w, h, r);
    return { w, h, cells, ask, answer: ask === "area" ? cells.length : fence(cells), key: `${ask}:${cells.map(key).sort().join(";")}` };
  },
  machen(L, r) {
    const [w, h] = GRID[L];
    if (L === 1) {
      const area = r.int(3, 10);
      return { w, h, area, key: `a${area}` };
    }
    if (L === 3 && r.chance(0.5)) {
      // a rectangle: with this many slabs
      const area = r.pick([6, 8, 9, 10, 12, 15, 16, 18, 20]);
      return { w, h, area, rect: true, key: `r${area}` };
    }
    // a shape that really exists gives area and fence that fit together
    const shape = grow(r.int(4, 8), w, h, r);
    return { w, h, area: shape.length, fence: fence(shape), key: `a${shape.length}f${fence(shape)}` };
  },
  forschen(L, r) {
    const [w, h] = [5, 4];
    if (L === 1) {
      const n = r.int(3, 8);
      const m = r.chance(0.3) ? n : Math.max(2, n + r.pick([-2, -1, 1, 2]));
      const a = grow(n, w, h, r), b = grow(m, w, h, r);
      return { w, h, a, b, ask: "area", answer: n === m ? "same" : n > m ? "a" : "b", key: `${a.map(key)}|${b.map(key)}` };
    }
    // the same number of slabs: who needs more fence?
    for (;;) {
      const n = r.int(4, 8);
      const a = r.chance(0.5) && n % 2 === 0 ? rect(2, n / 2, w, h, r) : grow(n, w, h, r);
      const b = grow(n, w, h, r);
      const fa = fence(a), fb = fence(b);
      if (fa === fb && r.chance(0.7)) continue;
      return { w, h, a, b, ask: "fence", answer: fa === fb ? "same" : fa > fb ? "a" : "b", key: `${a.map(key)}|${b.map(key)}` };
    }
  },
  anwenden(L, r) {
    const len = r.int(2, L === 3 ? 9 : 6), wid = r.int(2, L === 3 ? 7 : 5);
    const ask = L === 1 ? "area" : r.pick(["area", "fence"]);
    return { len, wid, grid: L < 3, ask, answer: ask === "area" ? len * wid : 2 * (len + wid), key: `${len}x${wid}${ask}` };
  },
  pruefen(L, r) {
    const [w, h] = GRID[L];
    const ask = L === 1 ? "area" : r.pick(["area", "fence"]);
    const cells = grow(r.int(4, L === 1 ? 9 : 10), w, h, r);
    const answer = ask === "area" ? cells.length : fence(cells);
    const wrongs = ask === "area" ? [[fence(cells), "fence"], [answer + 1, "twice"], [answer - 1, "missed"]] : [[cells.length, "area"], [edgeCells(cells), "cells"], [answer - 2, "missed"]];
    const options = wrongs.filter(([x]) => x !== answer && x > 0);
    const right = r.chance(0.4) || !options.length;
    const [said, why] = right ? [answer, null] : r.pick(options);
    return { w, h, cells, ask, said, right, why, answer, key: `${ask}:${cells.map(key).sort().join(";")}=${said}` };
  },
};

export function task(level, r) {
  const L = levelOf(level.level);
  const make = makers[level.p];
  if (!make) throw new Error(`flaeche: unknown perspective ${level.p}`);
  return { p: level.p, level: L, ...make(L, r) };
}

/** Problems with a task (empty list = fine). */
export function check(t) {
  const problems = [];
  const inside = (cells) => cells.every(([x, y]) => x >= 0 && y >= 0 && x < t.w && y < t.h);
  if (t.p === "sehen" || t.p === "pruefen") {
    if (!inside(t.cells)) problems.push("outside");
    const want = t.ask === "area" ? t.cells.length : fence(t.cells);
    if ((t.p === "sehen" ? t.answer : t.answer) !== want) problems.push("answer");
    if (t.p === "pruefen" && (t.said === want) !== t.right) problems.push("right does not match");
  } else if (t.p === "machen") {
    if (t.area > t.w * t.h) problems.push("too big");
    if (t.rect && ![1, 2, 3, 4, 5, 6, 7, 8].some((a) => t.area % a === 0 && a <= t.w && t.area / a <= t.h)) problems.push("no rectangle fits");
  } else if (t.p === "forschen") {
    if (!inside(t.a) || !inside(t.b)) problems.push("outside");
    const [x, y] = t.ask === "area" ? [t.a.length, t.b.length] : [fence(t.a), fence(t.b)];
    if (t.answer !== (x === y ? "same" : x > y ? "a" : "b")) problems.push("answer");
    if (t.ask === "fence" && t.a.length !== t.b.length) problems.push("not the same area");
  } else if (t.p === "anwenden") {
    if (t.answer !== (t.ask === "area" ? t.len * t.wid : 2 * (t.len + t.wid))) problems.push("answer");
  }
  return problems;
}
