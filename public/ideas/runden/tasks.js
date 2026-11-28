// Task code of the idea "runden" (station steg, map fluss, next to the number line): rounding and estimating.
// The idea in one sentence: rounding asks which round neighbour is nearer; exactly in the middle you round up.
// With rounded numbers you calculate quickly about how much, and see whether a result can be right.
// See docs/GRUNDSCHULE.md 3.2. check() is run by tools/check-ideas.mjs on 1000 tasks per level.
//
//   task({ p, level }, r) → one task. level 1: two digits to the ten · 2: three digits to the ten or the hundred ·
//   3: estimating with plus, minus and times, and "can that be right?"
//
//   sehen     { n, unit, lo, hi, answer }              the frog sits at n between lo and hi: which is nearer?
//   machen    { n, unit, from, to, answer }            a longer stretch: tap the round number the frog hops to
//   forschen  { unit, head, tail, target, answer: [digits] }   "3☐ is rounded to 40": which digits fit?
//                                                     the number is head·☐·tail; the box is the place rounded at
//   anwenden  { op, a, b, unit, answer, options }      about how much? (round each number, then calculate)
//   pruefen   kind "round"  { n, unit, said, right, answer, why }   the owl rounds
//             kind "check"  { op, a, b, said, right, unit }         the owl calculated: can that be right?

export const LEVELS = [1, 2, 3];
const levelOf = (l) => (LEVELS.includes(l) ? l : 1);

export const roundTo = (n, unit) => Math.floor((n + unit / 2) / unit) * unit;

/** A number to round that is not round itself. Now and then exactly in the middle (35, 450). */
function number(unit, digits, r) {
  for (;;) {
    const lo = digits === 2 ? 11 : 101;
    const hi = digits === 2 ? 99 : 999;
    let n = r.int(lo, hi);
    if (r.chance(0.18)) n = Math.floor(n / unit) * unit + unit / 2; // the middle: rounded up
    if (n % unit === 0 || n < lo || n > hi) continue;
    if (unit === 100 && n % 10 === 0 && r.chance(0.5)) continue; // mostly not a whole ten when rounding to the hundred
    return n;
  }
}

function unitFor(L, r) {
  return L === 1 ? 10 : r.pick([10, 100, 100]);
}

const makers = {
  sehen(L, r) {
    const unit = unitFor(L, r);
    const n = number(unit, unit === 100 || L > 1 ? 3 : 2, r);
    const lo = Math.floor(n / unit) * unit;
    return { n, unit, lo, hi: lo + unit, answer: roundTo(n, unit), key: `${n}/${unit}` };
  },
  machen(L, r) {
    const unit = unitFor(L, r);
    const n = number(unit, unit === 100 || L > 1 ? 3 : 2, r);
    const lo = Math.floor(n / unit) * unit;
    // a stretch of three gaps, the frog's two neighbours inside it
    const from = Math.max(0, lo - unit * r.int(0, 1));
    return { n, unit, from, to: from + 3 * unit, answer: roundTo(n, unit), key: `${n}/${unit}` };
  },
  forschen(L, r) {
    const unit = unitFor(L, r);
    const up = r.chance(0.5);
    // the digit in the box is the one right of the rounding place: 3☐ to the ten, 4☐7 to the hundred
    const head = unit === 10 ? r.int(1, 9) * (L === 1 ? 1 : 10) + (L === 1 ? 0 : r.int(0, 9)) : r.int(1, 9);
    const tail = unit === 100 ? r.int(0, 9) : null;
    const base = unit === 10 ? head * 10 : head * 100;
    const target = up ? base + unit : base;
    const answer = up ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
    return { unit, head, tail, target, answer, key: `${head}_${tail}>${target}` };
  },
  anwenden(L, r) {
    const op = L === 3 ? r.pick(["plus", "minus", "mal"]) : r.pick(["plus", "plus", "minus"]);
    for (;;) {
      let a, b, unit;
      if (op === "mal") {
        unit = 10;
        a = r.int(2, 9);
        b = r.int(12, 98);
      } else {
        unit = L === 1 ? 10 : r.pick([10, 100]);
        const big = unit === 100;
        a = big ? r.int(120, 880) : r.int(12, 88);
        b = big ? r.int(110, 880) : r.int(11, 88);
        if (op === "minus" && a < b) [a, b] = [b, a];
      }
      const ra = op === "mal" ? a : roundTo(a, unit);
      const rb = roundTo(b, unit);
      if (op !== "mal" && (a % unit === 0 || b % unit === 0)) continue;
      if (op === "mal" && b % 10 === 0) continue;
      const answer = op === "plus" ? ra + rb : op === "minus" ? ra - rb : ra * rb;
      if (answer <= 0 || (op === "minus" && ra === rb)) continue;
      const step = op === "mal" ? a * 10 : unit;
      const options = r.shuffle([answer, answer + step, answer - step].filter((x) => x > 0));
      if (options.length < 3) continue;
      return { op, a, b, unit, answer, options, key: `${a}${op}${b}` };
    }
  },
  pruefen(L, r) {
    if (L === 3 && r.chance(0.6)) {
      // the owl calculated: is it about right? Her slips: a place too many, a ten too far, two digits swapped
      const op = r.pick(["plus", "minus", "mal"]);
      let a, b, exact;
      for (;;) {
        if (op === "mal") (a = r.int(3, 9), (b = r.int(21, 98)));
        else (a = r.int(110, 890), (b = r.int(110, 890)));
        if (op === "minus" && a < b) [a, b] = [b, a];
        exact = op === "plus" ? a + b : op === "minus" ? a - b : a * b;
        if (exact > 50) break;
      }
      const right = r.chance(0.45);
      const said = right ? exact : r.pick([exact * 10, exact + (op === "mal" ? 10 * a : 300), Math.max(1, exact - (op === "mal" ? 10 * a : 300))]);
      return { kind: "check", op, a, b, said, right, exact, key: `c${a}${op}${b}=${said}` };
    }
    const unit = unitFor(L, r);
    const n = number(unit, unit === 100 || L > 1 ? 3 : 2, r);
    const answer = roundTo(n, unit);
    const lo = Math.floor(n / unit) * unit;
    const right = r.chance(0.4);
    // her mistakes: the middle rounded down; the wrong neighbour; the wrong place (to the ten instead of the hundred)
    const wrongs = [];
    if (n - lo === unit / 2) wrongs.push([lo, "middle"]);
    wrongs.push([answer === lo ? lo + unit : lo, "far"]);
    if (unit === 100 && roundTo(n, 10) !== answer && roundTo(n, 10) % 100 !== 0) wrongs.push([roundTo(n, 10), "place"]);
    const [said, why] = right ? [answer, null] : r.pick(wrongs);
    return { kind: "round", n, unit, said, right, answer, why, lo, hi: lo + unit, key: `r${n}/${unit}=${said}` };
  },
};

export function task(level, r) {
  const make = makers[level.p];
  if (!make) throw new Error(`runden: unknown perspective ${level.p}`);
  return { p: level.p, level: levelOf(level.level), ...make(levelOf(level.level), r) };
}

/** Problems with a task (empty list = fine). */
export function check(t) {
  const problems = [];
  if (t.p === "sehen" || t.p === "machen") {
    if (t.answer !== roundTo(t.n, t.unit) || t.n % t.unit === 0) problems.push("round");
    if (t.p === "machen" && (t.answer < t.from || t.answer > t.to || t.n < t.from || t.n > t.to)) problems.push("stretch");
  } else if (t.p === "forschen") {
    const num = (d) => (t.unit === 10 ? t.head * 10 + d : t.head * 100 + d * 10 + t.tail);
    const fits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => roundTo(num(d), t.unit) === t.target);
    if (JSON.stringify(fits) !== JSON.stringify(t.answer)) problems.push(`digits ${fits} not ${t.answer}`);
  } else if (t.p === "anwenden") {
    if (!t.options.includes(t.answer) || new Set(t.options).size !== 3) problems.push("options");
  } else if (t.p === "pruefen") {
    if (t.kind === "round") {
      if ((t.said === roundTo(t.n, t.unit)) !== t.right) problems.push("right does not match");
    } else if ((t.said === t.exact) !== t.right || t.said <= 0) problems.push("check");
  }
  return problems;
}
