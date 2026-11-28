// Task code of the idea "tausend" (station blumenfeld, map fluss, next to "stellen"): big numbers up to a million.
// The idea in one sentence: ten of one place make one of the next place, on and on (ten hundreds are a thousand, ten
// thousands a ten-thousand); an empty place is written as 0. See docs/GRUNDSCHULE.md 3.3.
// The picture is the place-value table with counters, as in school. check() is run by tools/check-ideas.mjs.
//
//   task({ p, range }, r) → one task. range 10000: four places (T H Z E), the thousand is new ·
//   range 1000000: six places (HT ZT T H Z E)
//
//   sehen     { places, n }                         counters in the table: which number?
//   machen    { places, n }                         lay n with counters; ten in a column become one in the next
//   forschen  { places, n, place, dir, answer, options }   one counter more (dir 1) or less (-1) in a column:
//                                                   which number comes out? Say first, then see
//   anwenden  { places, kind, n, answer } | { kind: "bigger", a, b, answer }   just numbers:
//               "after" the number after n · "before" the number before n · "plus" n + 10^place (place in `step`)
//               "bigger" which of two numbers with the same digits is bigger
//   pruefen   { places, n, said, right, why }       the owl reads the table. why: gap (leaves out the empty place),
//                                                   swap (two places swapped)

export const RANGES = [10000, 1000000];
const rangeOf = (range) => (RANGES.includes(range) ? range : 10000);
export const placesOf = (range) => (rangeOf(range) === 10000 ? 4 : 6);

/** The digits of n in `places` places, the biggest place first. */
export const digitsOf = (n, places) => String(n).padStart(places, "0").split("").map(Number);
export const fromDigits = (d) => Number(d.join(""));

/** A number of the range with all its places, often with an empty place in the middle. */
function number(places, r, { small = false, zero = 0.5 } = {}) {
  for (;;) {
    const d = [];
    const top = small ? (places === 6 ? 3 : 5) : 9;
    for (let i = 0; i < places; i++) d.push(r.int(i === 0 ? 1 : 0, top));
    if (r.chance(zero)) d[r.int(1, places - 1)] = 0;
    if (places === 6 && r.chance(0.35)) d[0] = 0; // also five places: 45 300
    const n = fromDigits(d);
    if (n < 10 ** (places - 2)) continue; // no second leading zero
    return n;
  }
}

/** The owl reads only the columns with counters (3 T, 0 H, 5 Z, 0 E → 35 instead of 3 050). */
const gap = (n, places) => fromDigits(digitsOf(n, places).filter((x) => x > 0));

const makers = {
  sehen(places, r) {
    const n = number(places, r);
    return { n, key: `${n}` };
  },
  machen(places, r) {
    const n = number(places, r, { small: true, zero: 0.6 });
    return { n, key: `${n}` };
  },
  forschen(places, r) {
    for (;;) {
      const dir = r.chance(0.65) ? 1 : -1;
      const place = r.int(0, places - 2); // 0 = the ones, 1 the tens …; not the biggest place
      const step = 10 ** place;
      let n = number(places, r);
      if (r.chance(0.35)) {
        // across a column: 9 counters and one more, 0 counters and one less
        const d = digitsOf(n, places);
        d[places - 1 - place] = dir === 1 ? 9 : 0;
        n = fromDigits(d);
      }
      const answer = n + dir * step;
      if (answer < 1000 || answer >= 10 ** places) continue;
      const wrong = [n + dir * step * 10, n + dir * (step === 1 ? 10 : step / 10)];
      // across a column the trap is to write 10 in the column (2 950 + 1 H → 2 1050 is no number) or forget the carry
      const d = digitsOf(n, places);
      const col = places - 1 - place;
      if (dir === 1 && d[col] === 9) wrong.push(answer - 10 * step);
      if (dir === -1 && d[col] === 0) wrong.push(answer + 10 * step);
      const opts = [...new Set([answer, ...wrong.filter((x) => x > 0 && x < 10 ** places)])];
      if (opts.length < 3) continue;
      const options = r.shuffle([answer, ...r.shuffle(opts.slice(1)).slice(0, 2)]);
      return { n, place, dir, answer, options, key: `${n}${dir > 0 ? "+" : "-"}${step}` };
    }
  },
  anwenden(places, r) {
    const kind = r.pick(["after", "before", "plus", "bigger"]);
    if (kind === "bigger") {
      for (;;) {
        const a = number(places, r, { zero: 0.3 });
        const d = digitsOf(a, places);
        const lo = places === 6 && d[0] === 0 ? 2 : 1; // the leading digit stays
        const i = r.int(lo, places - 1);
        const j = r.int(lo, places - 1);
        if (i === j || d[i] === d[j]) continue;
        [d[i], d[j]] = [d[j], d[i]];
        const b = fromDigits(d);
        return { kind, a, b, answer: Math.max(a, b), key: `${a}?${b}` };
      }
    }
    for (;;) {
      // round crossings are the point: 9 999 + 1, 40 000 − 1, 3 990 + 10
      const n = number(places, r);
      const step = kind === "plus" ? 10 ** r.int(1, places - 2) : 1;
      let m = n;
      if (r.chance(0.6)) {
        const d = digitsOf(n, places);
        const col = places - 1 - Math.log10(step);
        const run = r.int(0, 2); // the column and up to two to its left: 3 999 + 1, 40 000 − 1
        for (let i = col; i >= Math.max(kind === "before" ? 1 : 0, col - run); i--) d[i] = kind === "before" ? 0 : 9;
        m = fromDigits(d);
      }
      const answer = kind === "before" ? m - 1 : m + step;
      if (answer > 10 ** places || answer < 1000 || m < 1000) continue;
      return { kind, n: m, step, answer, key: `${kind}${m}+${step}` };
    }
  },
  pruefen(places, r) {
    for (;;) {
      const n = number(places, r, { zero: 1 });
      const right = r.chance(0.4);
      const wrongs = [];
      const g = gap(n, places);
      if (g !== n) wrongs.push([g, "gap", 3]);
      const d = digitsOf(n, places);
      const i = d.findIndex((x) => x > 0);
      if (i < places - 1 && d[i] !== d[i + 1]) {
        const s = [...d];
        [s[i], s[i + 1]] = [s[i + 1], s[i]];
        if (s[0] !== 0 || places === 6) wrongs.push([fromDigits(s), "swap", 1]);
      }
      if (!right && !wrongs.length) continue;
      const pool = wrongs.flatMap((w) => Array(w[2]).fill(w));
      const [said, why] = right ? [n, null] : r.pick(pool);
      if (!right && said < 10) continue;
      return { n, said, right, why, key: `${n}=${said}` };
    }
  },
};

export function task(level, r) {
  const make = makers[level.p];
  if (!make) throw new Error(`tausend: unknown perspective ${level.p}`);
  const places = placesOf(level.range);
  return { p: level.p, range: rangeOf(level.range), places, ...make(places, r) };
}

/** Problems with a task (empty list = fine). */
export function check(t) {
  const problems = [];
  const max = 10 ** t.places;
  const inside = (x) => Number.isInteger(x) && x >= 1000 && x < max;
  if (t.n !== undefined && !inside(t.n)) problems.push(`n ${t.n}`);
  if (t.p === "machen" && digitsOf(t.n, t.places).reduce((a, b) => a + b, 0) > 20) problems.push("too many counters");
  if (t.p === "forschen") {
    if (t.answer !== t.n + t.dir * 10 ** t.place) problems.push("answer");
    if (!t.options.includes(t.answer) || new Set(t.options).size !== 3) problems.push("options");
  }
  if (t.p === "anwenden") {
    if (t.kind === "bigger") {
      if (t.a === t.b || t.answer !== Math.max(t.a, t.b)) problems.push("bigger");
      if ([...String(t.a)].sort().join("") !== [...String(t.b)].sort().join("")) problems.push("same digits");
    } else {
      const want = t.kind === "before" ? t.n - 1 : t.n + t.step;
      if (t.answer !== want || t.answer > max || t.answer < 1000) problems.push("answer");
    }
  }
  if (t.p === "pruefen") {
    if ((t.said === t.n) !== t.right) problems.push("right does not match");
    if (!t.right && !["gap", "swap"].includes(t.why)) problems.push("why");
  }
  return problems;
}
