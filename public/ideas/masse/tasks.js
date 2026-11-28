// Task code of the idea "masse" (station muehle, map fluss): sizes and units. You measure with equal pieces, the
// units. A big unit is made of many small ones: 1 m = 100 cm, 1 kg = 1000 g, 1 l = 1000 ml. Every thing has a unit
// that fits it best. See docs/GRUNDSCHULE.md 3.4. check() is run by tools/check-ideas.mjs on 1000 tasks per level.
//
//   task({ p, level }, r) → one task. level 1: length (cm, m) · 2: weight (g, kg) and volume (ml, l) ·
//   3: all of them, also mm and km, and half and quarter (½ kg = 500 g)
//
//   sehen     { thing, value, unit, options: [unit], answer: unit }      a pencil is 15 …? cm or m
//   machen    { dim, target, pieces: [amount], show }                    put pieces together until it is exactly so much
//   forschen  { dim, from: [amount, unit] rows, ask, answer }            1 m = 100 cm, 2 m = 200 cm, 3 m 40 cm = ? cm
//   anwenden  kind "guess" { thing, options: [value], answer }           how heavy is an apple? 15 g, 150 g, 1500 g
//             kind "story" { story, numbers, answer, unit }              a short story with two units
//   pruefen   { from, to, said, right, why, answer }                     the owl converts: 3 kg = 300 g?
//
// Amounts are kept in the smallest unit of their kind (mm, g, ml); `show` says how they are written.

export const LEVELS = [1, 2, 3];
const levelOf = (l) => (LEVELS.includes(l) ? l : 1);

/** The units, each in the smallest unit of its kind. */
export const UNITS = {
  len: { mm: 1, cm: 10, m: 1000, km: 1000000 },
  mass: { g: 1, kg: 1000 },
  vol: { ml: 1, l: 1000 },
};
export const DIM_OF = { mm: "len", cm: "len", m: "len", km: "len", g: "mass", kg: "mass", ml: "vol", l: "vol" };

/** Things from everyday life, with the size that is true for them (a support point, "Stützpunkt"). */
export const THINGS = [
  { id: "pencil", icon: "✏️", value: 15, unit: "cm" },
  { id: "banana", icon: "🍌", value: 20, unit: "cm" },
  { id: "key", icon: "🔑", value: 6, unit: "cm" },
  { id: "book", icon: "📕", value: 25, unit: "cm" },
  { id: "door", icon: "🚪", value: 2, unit: "m" },
  { id: "bed", icon: "🛏️", value: 2, unit: "m" },
  { id: "car", icon: "🚗", value: 4, unit: "m" },
  { id: "bus", icon: "🚌", value: 12, unit: "m" },
  { id: "tree", icon: "🌳", value: 10, unit: "m" },
  { id: "giraffe", icon: "🦒", value: 5, unit: "m" },
  { id: "ant", icon: "🐜", value: 5, unit: "mm", from: 3 },
  { id: "ladybird", icon: "🐞", value: 8, unit: "mm", from: 3 },
  { id: "school", icon: "🏫", value: 2, unit: "km", from: 3 },
  { id: "mountain", icon: "⛰️", value: 3, unit: "km", from: 3 },
  { id: "apple", icon: "🍎", value: 150, unit: "g", from: 2 },
  { id: "egg", icon: "🥚", value: 60, unit: "g", from: 2 },
  { id: "chocolate", icon: "🍫", value: 100, unit: "g", from: 2 },
  { id: "bread", icon: "🍞", value: 1, unit: "kg", from: 2 },
  { id: "potatoes", icon: "🥔", value: 5, unit: "kg", from: 2 },
  { id: "pumpkin", icon: "🎃", value: 5, unit: "kg", from: 2 },
  { id: "dog", icon: "🐕", value: 20, unit: "kg", from: 2 },
  { id: "child", icon: "🧒", value: 30, unit: "kg", from: 2 },
  { id: "cup", icon: "☕", value: 200, unit: "ml", from: 2 },
  { id: "juice", icon: "🧃", value: 200, unit: "ml", from: 2 },
  { id: "teaspoon", icon: "🥄", value: 5, unit: "ml", from: 2 },
  { id: "teapot", icon: "🫖", value: 1, unit: "l", from: 2 },
  { id: "bucket", icon: "🪣", value: 10, unit: "l", from: 2 },
  { id: "bathtub", icon: "🛁", value: 150, unit: "l", from: 2 },
];

/** Which units each level uses. Level 2 is weight and volume; level 3 everything. */
const LEVEL_UNITS = { 1: ["cm", "m"], 2: ["g", "kg", "ml", "l"], 3: ["mm", "cm", "m", "km", "g", "kg", "ml", "l"] };
const thingsFor = (L) => THINGS.filter((t) => LEVEL_UNITS[L].includes(t.unit) && (t.from ?? 1) <= L);
const dimsFor = (L) => (L === 1 ? ["len"] : L === 2 ? ["mass", "vol"] : ["len", "mass", "vol"]);

/** The pieces to measure with (in the smallest unit): rods, weights, jugs. */
export const PIECES = {
  len: { 1: [1000, 100, 10], 3: [1000, 500, 100, 10] }, // 1 m, (50 cm), 10 cm, 1 cm
  mass: { 2: [1000, 500, 200, 100, 50, 20, 10], 3: [1000, 500, 200, 100, 50, 20, 10] },
  vol: { 2: [1000, 500, 250, 100, 50], 3: [1000, 500, 250, 100, 50] },
};
const piecesFor = (dim, L) => PIECES[dim][L] ?? PIECES[dim][dim === "len" ? 1 : 2];

/** Half, quarter, three quarters (level 3), as [share of the big unit, sign]. */
export const PARTS = [[0.5, "½"], [0.25, "¼"], [0.75, "¾"]];

const big = { len: "m", mass: "kg", vol: "l" };
const small = { len: "cm", mass: "g", vol: "ml" };

const makers = {
  sehen(L, r) {
    const t = r.pick(thingsFor(L));
    const dim = DIM_OF[t.unit];
    const units = LEVEL_UNITS[L].filter((u) => DIM_OF[u] === dim);
    const options = r.shuffle(units.length > 3 ? r.shuffle(units.filter((u) => u !== t.unit)).slice(0, 2).concat(t.unit) : units);
    return { thing: t.id, icon: t.icon, value: t.value, unit: t.unit, options: r.shuffle(options), answer: t.unit, key: t.id };
  },
  machen(L, r) {
    const dim = r.pick(dimsFor(L));
    const pieces = piecesFor(dim, L);
    let target, show;
    if (L === 3 && r.chance(0.5)) {
      const [share, sign] = r.pick(PARTS);
      const whole = r.int(0, 1);
      target = (whole + share) * 1000;
      show = { whole, part: sign, unit: big[dim] };
    } else if (dim === "len") {
      target = 10 * r.int(25, 250); // 25 cm to 2 m 50 cm, in mm
      show = { mixed: true };
    } else {
      target = (dim === "mass" ? 10 : 50) * r.int(dim === "mass" ? 6 : 2, dim === "mass" ? 200 : 40);
      show = { mixed: true };
    }
    return { dim, target, pieces, show, key: `${dim}:${target}` };
  },
  forschen(L, r) {
    const kinds = L === 1 ? ["mToCm", "mixedLen", "cmToM"] : L === 2 ? ["kgToG", "lToMl", "mixedMass", "gToKg"] : ["kmToM", "cmToMm", "part", "part", "mixedLen", "mixedMass"];
    const kind = r.pick(kinds);
    const k = r.int(2, 9);
    // three rows: the rule (1 big = so many small), one more example, and the one asked
    const rule = { mToCm: ["m", "cm", 100], mixedLen: ["m", "cm", 100], cmToM: ["cm", "m", 100], kgToG: ["kg", "g", 1000], mixedMass: ["kg", "g", 1000], gToKg: ["g", "kg", 1000], lToMl: ["l", "ml", 1000], kmToM: ["km", "m", 1000], cmToMm: ["cm", "mm", 10], part: null }[kind];
    if (kind === "part") {
      const dim = r.pick(["len", "mass", "vol"]);
      const [share, sign] = r.pick(PARTS);
      const f = dim === "len" ? 100 : 1000;
      return { kind, rows: [[1, big[dim], f], ["½", big[dim], f / 2]].filter((x, i) => i === 0 || sign !== "½"), ask: [sign, big[dim], small[dim]], answer: share * f, key: `p${dim}${sign}` };
    }
    const [from, to, f] = rule;
    const down = kind === "cmToM" || kind === "gToKg";
    if (down) return { kind, rows: [[f, from, 1], [2 * f, from, 2]], ask: [k * f, from, to], answer: k, key: `${kind}${k}` };
    if (kind === "mixedLen" || kind === "mixedMass") {
      const part = kind === "mixedLen" ? r.pick([r.int(1, 9), 10 * r.int(1, 9) + r.int(0, 9)]) : r.pick([r.int(1, 9) * 100, r.int(1, 9) * 100 + r.int(1, 9) * 10, r.int(5, 95)]);
      return { kind, rows: [[1, from, f], [2, from, 2 * f]], ask: [[k, part], from, to], answer: k * f + part, key: `${kind}${k}:${part}` };
    }
    return { kind, rows: [[1, from, f], [2, from, 2 * f]], ask: [k, from, to], answer: k * f, key: `${kind}${k}` };
  },
  anwenden(L, r) {
    if (L === 3 && r.chance(0.5)) {
      const story = r.pick(["glasses", "rope", "flour"]);
      if (story === "glasses") {
        const each = r.pick([100, 200, 250]), n = r.int(2, each === 250 ? 3 : 4);
        return { kind: "story", story, numbers: [n, each], answer: 1000 - n * each, unit: "ml", key: `s${story}${n}${each}` };
      }
      if (story === "rope") {
        const cut = 10 * r.int(2, 9);
        return { kind: "story", story, numbers: [cut], answer: 100 - cut, unit: "cm", key: `s${story}${cut}` };
      }
      const n = r.int(2, 4), each = r.pick([200, 250]);
      return { kind: "story", story, numbers: [n, each], answer: n * each, unit: "g", key: `s${story}${n}${each}` };
    }
    const t = r.pick(thingsFor(L));
    const v = t.value;
    const options = v % 10 === 0 && v >= 20 ? [v / 10, v, v * 10] : [v, v * 10, v * 100];
    return { kind: "guess", thing: t.id, icon: t.icon, unit: t.unit, options: r.shuffle(options), answer: v, key: `g${t.id}` };
  },
  pruefen(L, r) {
    const f = this.forschen(L, r);
    const right = r.chance(0.4);
    const factor = f.kind === "part" ? 1 : { mToCm: 100, mixedLen: 100, cmToM: 100, kgToG: 1000, mixedMass: 1000, gToKg: 1000, lToMl: 1000, kmToM: 1000, cmToMm: 10 }[f.kind];
    let said = f.answer, why = null;
    if (!right) {
      if (f.kind === "part") (said = f.answer / 10, (why = "part"));
      else if (f.kind === "mixedLen" || f.kind === "mixedMass") {
        const [k, part] = f.ask[0];
        // the zero forgotten (2 m 5 cm = 25 cm) or the parts added up as they stand (2 m 40 cm = 42 cm)
        said = Number(`${k}${part}`);
        why = "joined";
        if (said === f.answer) (said = k + part, (why = "added"));
      } else if (f.kind === "cmToM" || f.kind === "gToKg") (said = f.answer * 10, (why = "factor"));
      else (said = f.answer / (factor === 10 ? 10 : 10), (why = "factor"));
    }
    if (!Number.isInteger(said) || said === f.answer && !right) return this.pruefen(L, r);
    return { ...f, said, right, why, key: `o${f.key}=${said}` };
  },
};

export function task(level, r) {
  const L = levelOf(level.level);
  const make = makers[level.p];
  if (!make) throw new Error(`masse: unknown perspective ${level.p}`);
  return { p: level.p, level: L, ...make.call(makers, L, r) };
}

/** Problems with a task (empty list = fine). */
export function check(t) {
  const problems = [];
  if (t.p === "sehen") {
    if (!t.options.includes(t.answer) || new Set(t.options).size !== t.options.length || t.options.length < 2) problems.push("options");
    if (t.options.some((u) => DIM_OF[u] !== DIM_OF[t.answer])) problems.push("mixed kinds");
  } else if (t.p === "machen") {
    const small = Math.min(...t.pieces);
    if (t.target % small || t.target <= 0) problems.push(`target ${t.target} cannot be made`);
  } else if (t.p === "forschen" || t.p === "pruefen") {
    if (!Number.isInteger(t.answer) || t.answer <= 0) problems.push(`answer ${t.answer}`);
    if (t.p === "pruefen" && (t.said === t.answer) !== t.right) problems.push("right does not match");
  } else if (t.p === "anwenden") {
    if (t.kind === "guess" && (!t.options.includes(t.answer) || new Set(t.options).size !== 3)) problems.push("options");
    if (t.kind === "story" && !(t.answer > 0)) problems.push("story");
  }
  return problems;
}
