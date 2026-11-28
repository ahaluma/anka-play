// Task code of the idea "daten" (station weide, map fluss): data and chance. You count with tally marks, five in a
// bundle. A chart shows the counts as bars: the longest bar is the biggest count. What comes out by chance you do
// not know before, but you can say what is certain, possible or impossible, and what is more likely.
// See docs/GRUNDSCHULE.md 3.8. The bag of balls and the weather chart came from the sunny rock (idea "zeit"),
// which keeps the clock and the calendar. check() is run by tools/check-ideas.mjs on 1000 tasks per level.
//
//   task({ p, range }, r) → one task. range (a level) 1: pictures and tally marks up to 10 · 2: bars with a scale,
//   up to 20 · 3: a scale in steps of two, up to 30, and the dice
//
//   sehen     { counts: { bird: n }, ask: bird, answer }          a tally list: how many blackbirds?
//   machen    { counts, step }                                    build the chart from the tally list (bars by step)
//   forschen  { range, bag: { colour: count }, kind, colour?, answer }   the bag of balls (as at the sunny rock)
//   anwenden  { range, kind, … }   "most" | "count" | "diff" (the weather of two weeks, as at the sunny rock) ·
//                                  "dice" { a: event, b: event, answer: "a" | "b" | "same" } (level 3)
//   pruefen   { counts, step, ask, said, right, why, answer }     the owl reads the chart

export const RANGES = [1, 2, 3];
export const COLOURS = ["red", "blue", "yellow", "green"];
export const WEATHER = ["sun", "cloud", "rain", "snow"];
export const BIRDS = ["bird", "duck", "frog", "butterfly", "bee"]; // the animals that come to the willow
/** Events of one dice throw, with the faces that make them. */
export const EVENTS = {
  six: [6], even: [2, 4, 6], odd: [1, 3, 5], over4: [5, 6], under3: [1, 2], oneOrTwo: [1, 2], notSix: [1, 2, 3, 4, 5], three: [3],
};
const MAX = { 1: 10, 2: 20, 3: 30 };
const STEP = { 1: 1, 2: 1, 3: 2 };

const rangeOf = (range) => (RANGES.includes(range) ? range : 1);

/** Counts of 2 or 3 birds, all different, the biggest at most MAX (level 3: even numbers, the scale goes by two). */
function birds(R, r) {
  for (;;) {
    const kinds = r.sample(BIRDS, R === 1 ? 2 : 3);
    const counts = {};
    for (const k of kinds) counts[k] = STEP[R] * r.int(1, MAX[R] / STEP[R]);
    const v = Object.values(counts);
    if (new Set(v).size === v.length && Math.max(...v) >= (R === 1 ? 5 : 8)) return counts;
  }
}

/** Two weeks of weather: 14 days, one weather that clearly comes most. */
function fortnight(R, r) {
  const kinds = r.shuffle(WEATHER).slice(0, R === 1 ? 3 : 4);
  for (;;) {
    const days = Object.fromEntries(kinds.map((k) => [k, 0]));
    for (let i = 0; i < 14; i++) days[r.pick(kinds)]++;
    const counts = Object.values(days).sort((a, b) => b - a);
    if (counts[0] > counts[1] && counts[counts.length - 1] > 0) return days;
  }
}

const makers = {
  sehen(R, r) {
    const counts = birds(R === 3 ? 2 : R, r);
    const ask = r.pick(Object.keys(counts));
    return { counts, ask, answer: counts[ask], key: `t${JSON.stringify(counts)}${ask}` };
  },
  machen(R, r) {
    const counts = birds(R, r);
    return { counts, step: STEP[R], max: MAX[R], key: `m${JSON.stringify(counts)}` };
  },
  forschen(R, r) {
    // the bag of balls, as it was at the sunny rock
    const kind = R === 1 ? "most" : r.pick(["most", "chance"]);
    const n = R === 1 ? 2 : 3;
    const cols = r.shuffle(COLOURS).slice(0, n);
    const bag = {};
    if (kind === "most") {
      const big = R === 1 ? r.int(5, 7) : r.int(3, 5);
      cols.forEach((c, i) => (bag[c] = i === 0 ? big : r.int(1, big - (R === 3 ? 1 : 2))));
      if (R > 1 && r.chance(0.2)) bag[cols[1]] = big;
      const max = Math.max(...Object.values(bag));
      const top = cols.filter((c) => bag[c] === max);
      return { range: R, bag, kind, answer: top.length > 1 ? "same" : top[0], key: `m${JSON.stringify(bag)}` };
    }
    cols.forEach((c) => (bag[c] = r.int(1, 4)));
    const pick = r.int(1, 3);
    let colour, answer;
    if (pick === 1) {
      colour = cols[0];
      for (const c of cols.slice(1)) delete bag[c];
      bag[colour] = r.int(3, 6);
      answer = "sure";
    } else if (pick === 2) {
      colour = r.pick(COLOURS.filter((c) => !(c in bag)));
      answer = "never";
    } else {
      colour = r.pick(cols);
      answer = "maybe";
    }
    return { range: R, bag, kind, colour, answer, key: `c${JSON.stringify(bag)}${colour}` };
  },
  anwenden(R, r) {
    if (R === 3 && r.chance(0.5)) {
      const names = Object.keys(EVENTS);
      let a, b;
      do [a, b] = r.sample(names, 2);
      while (JSON.stringify(EVENTS[a]) === JSON.stringify(EVENTS[b]));
      const na = EVENTS[a].length, nb = EVENTS[b].length;
      return { range: R, kind: "dice", a, b, answer: na === nb ? "same" : na > nb ? "a" : "b", key: `d${a}${b}` };
    }
    const days = fortnight(R, r);
    const kinds = Object.keys(days);
    const kind = R === 1 ? r.pick(["most", "count"]) : r.pick(["count", "diff", "diff"]);
    if (kind === "most") {
      const max = Math.max(...Object.values(days));
      return { range: R, kind, days, answer: kinds.find((k) => days[k] === max), key: `w${JSON.stringify(days)}` };
    }
    if (kind === "count") {
      const ask = r.pick(kinds);
      return { range: R, kind, days, ask, answer: days[ask], key: `c${JSON.stringify(days)}${ask}` };
    }
    let a, b;
    do [a, b] = r.shuffle(kinds).slice(0, 2);
    while (days[a] === days[b]);
    if (days[a] < days[b]) [a, b] = [b, a];
    return { range: R, kind, days, a, b, answer: days[a] - days[b], key: `x${JSON.stringify(days)}${a}${b}` };
  },
  pruefen(R, r) {
    const counts = birds(Math.max(2, R), r);
    const kinds = Object.keys(counts);
    const ask = r.pick(kinds);
    const answer = counts[ask];
    const right = r.chance(0.4);
    // her mistakes: she reads the bar next to it; with the scale by two she counts the lines, not the numbers
    const wrongs = kinds.filter((k) => k !== ask).map((k) => [counts[k], "neighbour"]);
    if (R === 3) wrongs.push([answer / 2, "lines"]);
    const options = wrongs.filter(([x]) => x !== answer);
    const [said, why] = right ? [answer, null] : r.pick(options);
    return { counts, step: R === 3 ? 2 : 1, max: MAX[Math.max(2, R)], ask, said, right, why, answer, key: `p${JSON.stringify(counts)}${ask}=${said}` };
  },
};

export function task(level, r) {
  const make = makers[level.p];
  if (!make) throw new Error(`daten: unknown perspective ${level.p}`);
  return { p: level.p, range: rangeOf(level.range), ...make(rangeOf(level.range), r) };
}

/** Problems with a task (empty list = fine). */
export function check(t, level) {
  const R = rangeOf(level.range);
  const problems = [];
  if (t.p === "sehen") {
    if (t.answer !== t.counts[t.ask] || t.answer > MAX[R]) problems.push("tally");
  } else if (t.p === "machen") {
    if (Object.values(t.counts).some((v) => v % t.step || v > t.max)) problems.push("counts");
  } else if (t.p === "forschen") {
    const cols = Object.keys(t.bag);
    if (t.kind === "most") {
      const max = Math.max(...Object.values(t.bag));
      const top = cols.filter((c) => t.bag[c] === max);
      if (t.answer !== (top.length > 1 ? "same" : top[0])) problems.push("most");
    } else {
      const want = !(t.colour in t.bag) ? "never" : cols.length === 1 ? "sure" : "maybe";
      if (want !== t.answer) problems.push("chance");
    }
  } else if (t.p === "anwenden") {
    if (t.kind === "dice") {
      const na = EVENTS[t.a].length, nb = EVENTS[t.b].length;
      if (t.answer !== (na === nb ? "same" : na > nb ? "a" : "b")) problems.push("dice");
    } else {
      const sum = Object.values(t.days).reduce((a, b) => a + b, 0);
      if (sum !== 14) problems.push("not 14 days");
      if (t.kind === "count" && t.answer !== t.days[t.ask]) problems.push("count");
      if (t.kind === "diff" && (t.answer !== t.days[t.a] - t.days[t.b] || t.answer < 1)) problems.push("diff");
    }
  } else if (t.p === "pruefen") {
    if ((t.said === t.counts[t.ask]) !== t.right || !Number.isInteger(t.said)) problems.push("pruefen");
  }
  return problems;
}
