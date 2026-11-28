// Task code of the idea "wuerfel" (station kisten, map fluss): buildings of boxes, their plan, nets of the cube.
// The idea in one sentence: a building of cubes can be written down from above as a plan (each square says how many
// stand on top of each other); the cubes you do not see carry the ones on top. A net is six squares that fold into a
// cube. See docs/GRUNDSCHULE.md 3.7. check() is run by tools/check-ideas.mjs on 1000 tasks per level.
//
//   A building is h[row][col]: row 0 is at the back. Behind never stands a lower tower than in front, so every top
//   of a tower is seen.
//
//   task({ p, level }, r) → one task. level 1: one row, up to 6 boxes · 2: 2 × 2 and 2 × 3, up to 2 high ·
//   3: up to 3 × 3, up to 3 high, harder nets
//
//   sehen     { h, answer }                          how many boxes?
//   machen    { h, max }                             write the plan: tap each square until its number is right
//   forschen  { cells: [[x, y]], answer: bool }      six squares: do they fold into a cube?
//   anwenden  { h, options: [plan], answer: index }  which plan from above belongs to the building?
//   pruefen   { h, said, right, answer, why }        the owl counts boxes. why: tops (counts only the tops),
//                                                    seen (counts only what she sees), twice (counts one twice)

export const LEVELS = [1, 2, 3];
const levelOf = (l) => (LEVELS.includes(l) ? l : 1);

export const total = (h) => h.flat().reduce((a, b) => a + b, 0);

/** The boxes of which some face is seen (front, top or right side not covered). */
export function seen(h) {
  let n = 0;
  for (let r = 0; r < h.length; r++)
    for (let c = 0; c < h[r].length; c++)
      for (let z = 0; z < h[r][c]; z++) {
        const top = z === h[r][c] - 1;
        const front = r === h.length - 1 || h[r + 1][c] <= z;
        const right = c === h[r].length - 1 || h[r][c + 1] <= z;
        if (top || front || right) n++;
      }
  return n;
}

/** A building of the level: back never lower than front. */
function building(L, r) {
  for (;;) {
    const rows = L === 1 ? 1 : L === 2 ? 2 : r.int(2, 3);
    const cols = L === 1 ? r.int(2, 4) : r.int(2, 3);
    const max = L === 3 ? 3 : 2;
    const h = [];
    for (let row = 0; row < rows; row++) {
      h.push([]);
      for (let c = 0; c < cols; c++) {
        const behind = row === 0 ? max : h[row - 1][c];
        h[row].push(r.int(1, behind));
      }
    }
    const n = total(h);
    if (L === 1 && n > 6) continue;
    if (L === 3 && (n > 18 || !h.flat().includes(3))) continue;
    if (h.flat().every((v) => v === 1) && r.chance(0.8)) continue; // mostly something stands on top
    return h;
  }
}

const key = (h) => h.map((row) => row.join("")).join("/");

// ---------- nets: fold six squares by rolling a cube over them

// the cube's faces in the places bottom, top, north (up on the sheet), south, east, west
const ROLL = {
  // rolling one square east: the east face becomes the bottom
  "1,0": ({ b, t, n, s, e, w }) => ({ b: e, t: w, n, s, e: t, w: b }),
  "-1,0": ({ b, t, n, s, e, w }) => ({ b: w, t: e, n, s, e: b, w: t }),
  "0,1": ({ b, t, n, s, e, w }) => ({ b: s, t: n, n: b, s: t, e, w }),
  "0,-1": ({ b, t, n, s, e, w }) => ({ b: n, t: s, n: t, s: b, e, w }),
};

/** Which face of the cube each square of the net becomes (by rolling from the first square). */
export function fold(cells) {
  const at = new Map(cells.map(([x, y], i) => [`${x},${y}`, i]));
  const face = new Array(cells.length).fill(null);
  const cube = new Array(cells.length).fill(null);
  face[0] = 0;
  cube[0] = { b: 0, t: 1, n: 2, s: 3, e: 4, w: 5 };
  const queue = [0];
  while (queue.length) {
    const i = queue.shift();
    const [x, y] = cells[i];
    for (const d of Object.keys(ROLL)) {
      const [dx, dy] = d.split(",").map(Number);
      const j = at.get(`${x + dx},${y + dy}`);
      if (j === undefined || face[j] !== null) continue;
      cube[j] = ROLL[d](cube[i]);
      face[j] = cube[j].b;
      queue.push(j);
    }
  }
  return face;
}

export const folds = (cells) => new Set(fold(cells)).size === 6;

/** The squares that land on a face another square already covers. */
export function clash(cells) {
  const face = fold(cells);
  return face.map((f, i) => face.indexOf(f) !== i || face.lastIndexOf(f) !== i);
}

/** Six connected squares, moved to start at 0, 0. */
function hexomino(r) {
  const cells = [[0, 0]];
  const has = (x, y) => cells.some(([a, b]) => a === x && b === y);
  while (cells.length < 6) {
    const [x, y] = r.pick(cells);
    const [dx, dy] = r.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    if (!has(x + dx, y + dy)) cells.push([x + dx, y + dy]);
  }
  const mx = Math.min(...cells.map((c) => c[0]));
  const my = Math.min(...cells.map((c) => c[1]));
  return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

const width = (cells) => Math.max(...cells.map((c) => c[0])) + 1;
const height = (cells) => Math.max(...cells.map((c) => c[1])) + 1;
const block = (cells) => cells.some(([x, y]) => ["1,0", "0,1", "1,1"].every((d) => {
  const [dx, dy] = d.split(",").map(Number);
  return cells.some(([a, b]) => a === x + dx && b === y + dy);
}));
const longRow = (cells, n) => [...new Set(cells.map((c) => c[1]))].some((y) => cells.filter((c) => c[1] === y).length >= n) ||
  [...new Set(cells.map((c) => c[0]))].some((x) => cells.filter((c) => c[0] === x).length >= n);
/** A wrong net you see at once: four squares in a block, or five in a row. */
const plainlyWrong = (cells) => block(cells) || longRow(cells, 5);

function net(L, r) {
  const want = r.chance(0.5);
  for (;;) {
    let cells = hexomino(r);
    if (width(cells) < height(cells)) cells = cells.map(([x, y]) => [y, x]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    if (width(cells) > 5 || height(cells) > 4) continue;
    const ok = folds(cells);
    if (ok !== want) continue;
    if (L === 1 && ok && !longRow(cells, 4)) continue; // level 1: the cross and its kin (a row of four)
    if (L === 1 && !ok && !plainlyWrong(cells)) continue;
    if (L === 3 && !ok && plainlyWrong(cells)) continue; // level 3: wrong nets you have to fold in your head
    return cells;
  }
}

// ---------- plans that look alike

function swapLR(h) {
  return h.map((row) => [...row].reverse());
}
function nudge(h, r) {
  const g = h.map((row) => [...row]);
  const row = r.int(0, g.length - 1);
  const c = r.int(0, g[row].length - 1);
  g[row][c] += g[row][c] === 1 || r.chance(0.5) ? 1 : -1;
  return g;
}
function swapFB(h) {
  return [...h].reverse();
}

const makers = {
  sehen(L, r) {
    const h = building(L, r);
    return { h, answer: total(h), key: key(h) };
  },
  machen(L, r) {
    const h = building(L, r);
    return { h, max: L === 3 ? 3 : 2, key: key(h) };
  },
  forschen(L, r) {
    const cells = net(L, r);
    return { cells, answer: folds(cells), key: cells.join(";") };
  },
  anwenden(L, r) {
    for (;;) {
      const h = building(L, r);
      const others = [swapLR(h), nudge(h, r)];
      if (h.length > 1) others.push(swapFB(h));
      const pool = [h, ...r.shuffle(others)].filter((g, i, all) => all.findIndex((x) => key(x) === key(g)) === i);
      if (pool.length < 3) continue;
      const options = r.shuffle(pool.slice(0, 3));
      return { h, options, answer: options.findIndex((g) => key(g) === key(h)), key: key(h) };
    }
  },
  pruefen(L, r) {
    for (;;) {
      const h = building(L, r);
      const answer = total(h);
      const towers = h.flat().length;
      const wrongs = [];
      if (towers !== answer) wrongs.push([towers, "tops"]);
      const s = seen(h);
      if (L > 1 && s !== answer && s !== towers) wrongs.push([s, "seen"]);
      if (!wrongs.length) wrongs.push([answer + 1, "twice"]);
      const right = r.chance(0.4);
      const [said, why] = right ? [answer, null] : r.pick(wrongs);
      if (L > 1 && !right && why === "tops" && wrongs.length > 1 && r.chance(0.5)) continue; // the hidden boxes count more
      return { h, said, right, answer, why, key: `${key(h)}=${said}` };
    }
  },
};

export function task(level, r) {
  const make = makers[level.p];
  if (!make) throw new Error(`wuerfel: unknown perspective ${level.p}`);
  return { p: level.p, level: levelOf(level.level), ...make(levelOf(level.level), r) };
}

/** Problems with a task (empty list = fine). */
export function check(t) {
  const problems = [];
  if (t.h) {
    for (let row = 1; row < t.h.length; row++)
      t.h[row].forEach((v, c) => v > t.h[row - 1][c] && problems.push("front higher than back"));
    if (t.h.flat().some((v) => v < 1 || v > 3)) problems.push("height");
    if (t.level === 1 && (t.h.length !== 1 || total(t.h) > 6)) problems.push("level 1");
  }
  if (t.p === "sehen" && t.answer !== total(t.h)) problems.push("count");
  if (t.p === "forschen") {
    if (t.cells.length !== 6 || new Set(t.cells.map(String)).size !== 6) problems.push("six squares");
    if (folds(t.cells) !== t.answer) problems.push("fold");
  }
  if (t.p === "anwenden") {
    if (t.options.length !== 3 || new Set(t.options.map(key)).size !== 3) problems.push("options");
    if (key(t.options[t.answer]) !== key(t.h)) problems.push("answer");
  }
  if (t.p === "pruefen") {
    if ((t.said === t.answer) !== t.right || t.answer !== total(t.h)) problems.push("right does not match");
  }
  return problems;
}
