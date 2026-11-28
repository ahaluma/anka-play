// Task code of the idea "schriftlich" (station scheune, map feld): written calculation, place by place, with the
// carry (plus, times), with trading a ten (minus, "Entbündeln") and with the rest moving on (divided by one digit).
// The generators search (exactly one carry, a zero in the middle, a rest inside), so this is task code, not a
// recipe (docs/DESIGN.md 6.5). check() is run by tools/check-ideas.mjs on 1000 tasks per rung.
//
// The idea in one sentence: you calculate place by place; ten of one place are one of the next place.
//
//   task({ p, op, step }, r) → one task. op = "plus" | "minus" | "mal" | "geteilt"; step = the sub-step:
//     plus, minus  "zwei" two digits, one carry or trade · "drei" three digits, one · "viele" two or more · "gemischt"
//     mal          "zwei" two digits times one digit · "drei" three digits times one digit · "gemischt"
//     geteilt      "ohne" no rest at the end · "rest" a rest at the end · "gemischt"
//
//   Every task has { op, a, b, result, rest } (rest only for geteilt) and:
//   sehen     kind "step":  { col, options: [{ id }], answer }   one column: what do you write, what moves on?
//             kind "align": { layouts: [shift], answer }         which of three is written right (ones under ones)?
//   machen    {}                                                 the child calculates column by column
//   forschen  { hide: { row: "a" | "b", col }, answer }          one digit is missing: which one?
//   anwenden  { story }                                          a short story, the sum already written down
//   pruefen   { said, right, kind }                              the owl calculated; kind of her mistake
//
// Columns are counted from the right: col 0 is the ones, col 1 the tens …

export const OPS = ["plus", "minus", "mal", "geteilt"];
export const STEPS = { plus: ["zwei", "drei", "viele"], minus: ["zwei", "drei", "viele"], mal: ["zwei", "drei"], geteilt: ["ohne", "rest"] };

/** The digits of n, ones first. */
export const digitsOf = (n) => String(n).split("").reverse().map(Number);
const len = (n) => String(n).length;

/** How many carries a written plus has. */
export function carries(a, b) {
  const A = digitsOf(a), B = digitsOf(b);
  let c = 0, n = 0;
  for (let i = 0; i < Math.max(A.length, B.length); i++) {
    c = (A[i] ?? 0) + (B[i] ?? 0) + c >= 10 ? 1 : 0;
    n += c;
  }
  return n;
}

/** How many trades a written minus needs (a ten turned into ten ones, also over a zero). */
export function trades(a, b) {
  const A = digitsOf(a), B = digitsOf(b);
  let borrow = 0, n = 0;
  for (let i = 0; i < A.length; i++) {
    const top = A[i] - borrow;
    if (top < (B[i] ?? 0)) (borrow = 1, n++);
    else borrow = 0;
  }
  return n;
}

/** The carries of a written times (one digit below) that move on to a digit of the first number. */
export function timesCarries(a, b) {
  const A = digitsOf(a);
  let c = 0, n = 0;
  A.forEach((d, i) => {
    c = Math.floor((d * b + c) / 10);
    if (c && i < A.length - 1) n++;
  });
  return n;
}

/** The rests that move on inside a written division (not the last one). */
export function innerRests(a, b) {
  const A = digitsOf(a).reverse();
  let rest = 0, n = 0;
  A.forEach((d, i) => {
    rest = (rest * 10 + d) % b;
    if (rest && i < A.length - 1) n++;
  });
  return n;
}

export const resultOf = (op, a, b) => (op === "plus" ? a + b : op === "minus" ? a - b : op === "mal" ? a * b : Math.floor(a / b));

// ---------- The typical mistakes (the owl makes them, and a typed answer is checked against them)

/** Plus without carrying: each column on its own, only the ones of it. */
function plusNoCarry(a, b) {
  const A = digitsOf(a), B = digitsOf(b);
  let out = 0;
  for (let i = Math.max(A.length, B.length) - 1; i >= 0; i--) out = out * 10 + (((A[i] ?? 0) + (B[i] ?? 0)) % 10);
  return out;
}
/** Minus "the smaller from the bigger" in every column, no trading. */
function minusSmallFromBig(a, b) {
  const A = digitsOf(a), B = digitsOf(b);
  let out = 0;
  for (let i = A.length - 1; i >= 0; i--) out = out * 10 + Math.abs(A[i] - (B[i] ?? 0));
  return out;
}
/** Minus with trading, but the ten taken is not taken away on the left. */
function minusKeepTen(a, b) {
  const A = digitsOf(a), B = digitsOf(b);
  let out = 0;
  for (let i = A.length - 1; i >= 0; i--) {
    const top = A[i] < (B[i] ?? 0) ? A[i] + 10 : A[i];
    out = out * 10 + (top - (B[i] ?? 0));
  }
  return out;
}
/** Times without the carry: only the ones of each product. */
function malNoCarry(a, b) {
  const A = digitsOf(a);
  let out = 0;
  for (let i = A.length - 1; i >= 0; i--) out = out * 10 + ((A[i] * b) % 10);
  return out;
}
/** Times with the carry added before multiplying: (digit + carry) · b. */
function malCarryFirst(a, b) {
  const A = digitsOf(a);
  let c = 0;
  const res = [];
  for (const d of A) {
    const v = (d + c) * b;
    res.push(v % 10);
    c = Math.floor(v / 10);
  }
  if (c) res.push(...digitsOf(c));
  return Number(res.reverse().join(""));
}
/** Divided, the zero of the quotient left out (624 : 3 = 28 instead of 208). */
function divNoZero(a, b) {
  const q = String(Math.floor(a / b));
  const inner = q.slice(1).replace(/0/g, "");
  return Number(q[0] + inner);
}
/** Divided, each digit on its own: the rest of a place is dropped. */
function divDropRest(a, b) {
  return Number(digitsOf(a).reverse().map((d) => Math.floor(d / b)).join(""));
}
/** One number moved one place to the left (not ones under ones). */
const shifted = (op, a, b) => (op === "plus" ? a + b * 10 : a - b * 10);

/** The owl's wrong results of a task, each with its kind. Only ones that differ from the right result. */
export function mistakes(t) {
  const { op, a, b, result } = t;
  const out = [];
  if (op === "plus") {
    out.push([plusNoCarry(a, b), "carry"]);
    if (len(a) !== len(b)) out.push([shifted(op, a, b), "align"]);
  } else if (op === "minus") {
    out.push([minusSmallFromBig(a, b), "smallFromBig"], [minusKeepTen(a, b), "keepTen"]);
    if (len(a) !== len(b) && a - b * 10 > 0) out.push([shifted(op, a, b), "align"]);
  } else if (op === "mal") {
    out.push([malNoCarry(a, b), "carry"], [malCarryFirst(a, b), "carryFirst"]);
  } else {
    out.push([divNoZero(a, b), "zero"], [divDropRest(a, b), "dropRest"]);
  }
  return out.filter(([x]) => x !== result && x >= 0);
}

// ---------- Making the numbers

const int = (r, lo, hi) => r.int(lo, hi);

function plusPair(step, r) {
  for (;;) {
    const s = step === "gemischt" ? r.pick(STEPS.plus) : step;
    let a, b;
    if (s === "zwei") (a = int(r, 11, 89), (b = int(r, 11, 89)));
    else if (s === "drei") (a = int(r, 102, 899), (b = r.chance(0.3) ? int(r, 11, 99) : int(r, 102, 899)));
    else (a = int(r, 102, 999), (b = r.chance(0.2) ? int(r, 11, 99) : int(r, 102, 999)));
    const c = carries(a, b);
    if (s === "zwei" && (c !== 1 || a + b > 99)) continue;
    if (s === "drei" && (c !== 1 || a + b > 999)) continue;
    if (s === "viele" && c < 2) continue;
    return { a, b, s };
  }
}

function minusPair(step, r) {
  for (;;) {
    const s = step === "gemischt" ? r.pick(STEPS.minus) : step;
    let a, b;
    if (s === "zwei") (a = int(r, 21, 99), (b = int(r, 11, a - 1)));
    else if (s === "drei") (a = int(r, 120, 999), (b = r.chance(0.3) ? int(r, 11, 99) : int(r, 101, a - 1)));
    else {
      // two trades; now and then a zero in the middle (503 − 248), the hardest place
      a = r.chance(0.35) ? 100 * int(r, 2, 9) + int(r, 1, 8) : int(r, 200, 999);
      b = int(r, 101, a - 1);
    }
    if (b >= a) continue;
    const n = trades(a, b);
    if (s === "zwei" && n !== 1) continue;
    if (s === "drei" && (n !== 1 || len(a) !== 3)) continue;
    if (s === "viele" && n < 2) continue;
    return { a, b, s };
  }
}

function malPair(step, r) {
  for (;;) {
    const s = step === "gemischt" ? r.pick(STEPS.mal) : step;
    const a = s === "zwei" ? int(r, 12, 98) : int(r, 102, 987);
    const b = int(r, 2, 9);
    if (a % 10 === 0) continue;
    if (timesCarries(a, b) < 1) continue;
    return { a, b, s };
  }
}

function geteiltPair(step, r) {
  for (;;) {
    const s = step === "gemischt" ? r.pick(STEPS.geteilt) : step;
    const b = int(r, 2, 9);
    const q = r.chance(0.5) ? int(r, 12, 99) : int(r, 101, 330);
    const rest = s === "rest" ? int(r, 1, b - 1) : 0;
    const a = q * b + rest;
    if (a > 999 || a < 24) continue;
    if (innerRests(a, b) < 1) continue; // the rest moving on is the idea
    return { a, b, s, rest };
  }
}

function pair(op, step, r) {
  const x = op === "plus" ? plusPair(step, r) : op === "minus" ? minusPair(step, r) : op === "mal" ? malPair(step, r) : geteiltPair(step, r);
  return { op, a: x.a, b: x.b, result: resultOf(op, x.a, x.b), rest: op === "geteilt" ? x.a % x.b : 0, sub: x.s };
}

// ---------- Sehen: one step of the method

/** The column where the method does its trick: a carry, a trade, a rest that moves on. */
function trickColumn(t, r) {
  const { op, a, b } = t;
  const A = digitsOf(a), B = digitsOf(b);
  const cols = [];
  if (op === "plus") {
    let c = 0;
    for (let i = 0; i < A.length || i < B.length; i++) {
      const v = (A[i] ?? 0) + (B[i] ?? 0) + c;
      if (v >= 10) cols.push({ col: i, x: A[i] ?? 0, y: B[i] ?? 0, cin: c, v });
      c = v >= 10 ? 1 : 0;
    }
  } else if (op === "mal") {
    let c = 0;
    for (let i = 0; i < A.length; i++) {
      const v = A[i] * b + c;
      if (v >= 10 && i < A.length - 1) cols.push({ col: i, x: A[i], y: b, cin: c, v });
      c = Math.floor(v / 10);
    }
  } else if (op === "minus") {
    // the first column that needs a trade, as it stands before trading
    let borrow = 0;
    for (let i = 0; i < A.length; i++) {
      const top = A[i] - borrow;
      if (top < (B[i] ?? 0)) {
        cols.push({ col: i, x: top, y: B[i] ?? 0, cin: borrow, v: top + 10 - (B[i] ?? 0) });
        borrow = 1;
      } else borrow = 0;
    }
  } else {
    const D = [...A].reverse();
    let rest = 0;
    D.forEach((d, k) => {
      const cur = rest * 10 + d;
      const q = Math.floor(cur / b);
      rest = cur - q * b;
      if (rest && k < D.length - 1) cols.push({ col: D.length - 1 - k, x: cur, y: b, cin: 0, v: q, left: rest });
    });
  }
  return cols.length ? r.pick(cols) : null;
}

const STEP_OPTIONS = {
  plus: ["split", "swap", "all"], // 13: "3 down, 1 moves on" · "1 down, 3 moves on" · "13 down"
  mal: ["split", "swap", "all"],
  minus: ["trade", "turn", "zero"], // 3 − 8: "trade a ten: 13 − 8" · "8 − 3" · "write 0"
  geteilt: ["next", "drop", "down"], // the rest: "to the next place" · "it falls away" · "write it below"
};

function sehen(t, r) {
  if ((t.op === "plus" || t.op === "minus") && len(t.a) !== len(t.b) && r.chance(0.45)) {
    // three ways to write it down: ones under ones (0), left edges together (off), one place further
    const off = len(t.a) - len(t.b);
    const layouts = r.shuffle([0, off, off === 1 ? 2 : 1]);
    return { kind: "align", layouts, answer: layouts.indexOf(0), key: `align:${t.a}${t.op}${t.b}` };
  }
  const c = trickColumn(t, r);
  const ids = STEP_OPTIONS[t.op];
  return { kind: "step", ...c, options: r.shuffle(ids), answer: ids[0], key: `step:${t.a}${t.op}${t.b}:${c.col}` };
}

// ---------- Forschen: a digit is missing

function forschen(t, r) {
  const rows = t.op === "plus" || t.op === "minus" ? ["a", "b"] : ["a"];
  const row = r.pick(rows);
  const n = row === "a" ? t.a : t.b;
  const col = r.int(0, len(n) - 1);
  return { hide: { row, col }, answer: digitsOf(n)[col], key: `gap:${t.a}${t.op}${t.b}:${row}${col}` };
}

// ---------- Anwenden: a short story

const STORIES = { plus: ["apples", "eggs", "potatoes"], minus: ["potatoes", "flour", "apples"], mal: ["eggs", "bales"], geteilt: ["nuts", "apples"] };

// ---------- Pruefen: the owl calculated

function pruefen(t, r) {
  const wrong = mistakes(t);
  const right = !wrong.length || r.chance(0.4);
  if (right) return { said: t.result, right: true, kind: null, key: `owl:${t.a}${t.op}${t.b}=` };
  const [said, kind] = r.pick(wrong);
  return { said, right: false, kind, key: `owl:${t.a}${t.op}${t.b}=${said}` };
}

export function task(level, r) {
  const t = pair(level.op, level.stepId, r);
  const base = { p: level.p, op: t.op, a: t.a, b: t.b, result: t.result, rest: t.rest, sub: t.sub };
  const key = `${t.a}${t.op}${t.b}`;
  if (level.p === "sehen") return { ...base, ...sehen(base, r) };
  if (level.p === "machen") return { ...base, key };
  if (level.p === "forschen") return { ...base, ...forschen(base, r) };
  if (level.p === "anwenden") return { ...base, story: r.pick(STORIES[t.op]), key: `story:${key}` };
  if (level.p === "pruefen") return { ...base, ...pruefen(base, r) };
  throw new Error(`schriftlich: unknown perspective ${level.p}`);
}

/** Problems with a task (empty list = fine). */
export function check(t, level) {
  const problems = [];
  if (t.op !== level.op) problems.push("op");
  if (t.result !== resultOf(t.op, t.a, t.b)) problems.push("result");
  if (t.op === "minus" && t.result <= 0) problems.push("minus below one");
  if (t.op === "geteilt" && t.a !== t.result * t.b + t.rest) problems.push("rest");
  if (t.op === "geteilt" && level.stepId === "ohne" && t.rest) problems.push("rest where there is none");
  if (t.op === "geteilt" && level.stepId === "rest" && !t.rest) problems.push("no rest");
  if (t.op === "plus" && carries(t.a, t.b) < 1) problems.push("no carry");
  if (t.op === "minus" && trades(t.a, t.b) < 1) problems.push("no trade");
  if (t.op === "mal" && timesCarries(t.a, t.b) < 1) problems.push("no carry");
  if (t.op === "geteilt" && innerRests(t.a, t.b) < 1) problems.push("no rest moves on");
  if (Math.max(t.a, t.b, t.result) > 9999) problems.push("too big");
  if (t.p === "sehen") {
    if (t.kind === "step") {
      if (t.col === undefined || !t.options.includes(t.answer) || t.options.length !== 3) problems.push("step");
    } else if (t.layouts?.[t.answer] !== 0 || new Set(t.layouts).size !== 3) problems.push("align");
  }
  if (t.p === "forschen") {
    const n = t.hide.row === "a" ? t.a : t.b;
    if (digitsOf(n)[t.hide.col] !== t.answer) problems.push("hidden digit");
  }
  if (t.p === "pruefen") {
    if ((t.said === t.result) !== t.right) problems.push("right does not match");
    if (!t.right && !mistakes(t).some(([x, k]) => x === t.said && k === t.kind)) problems.push("not a known mistake");
  }
  return problems;
}
