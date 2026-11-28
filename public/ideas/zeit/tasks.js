// Task code of the idea "zeit" (station sonnenfels, map fluss), ported from think-lab (welt/ideas/zeit/tasks.js) as it
// was. It picks from tables with rules, which recipes cannot say (docs/DESIGN.md 6.5). idea.js hands it to the engine
// (engine/recipe.js taskOf); check() is run by tools/check-ideas.mjs on 1000 tasks per level.

// The tasks of the idea "Zeit": the clock and the calendar. (Charts and chance moved to the willow, idea "daten",
// docs/GRUNDSCHULE.md 3.8.) One function per perspective makes one task as plain data: no DOM, no texts.
//
//   task({ p, range }, r) → one task. range = 1, 2 or 3 (a level):
//     1 full hours; how many hours from … to …; in n hours, in n days
//     2 half and quarter hours; how many minutes from … to …; the months
//     3 every five minutes; spans over the full hour; how many days a month has
//
//   sehen     { range, h, m, choices: [{ h, m }] }       read the clock: which time is it?
//   machen    { range, h, m, step, startH, startM }      set the clock to h:m (minute buttons by step)
//   forschen  { range, from: { h, m }, to: { h, m }, unit: "h" | "min", answer }   how long from … to …?
//   anwenden  { range, kind, … }
//               "later" { h, add, answer }                               h o'clock, in `add` hours?
//               "day"   { today, add, answer }                           which weekday in `add` days?
//               "month" { month, add, answer }                           which month `add` months after?
//               "monthDays" { month, answer: 28 | 30 | 31 }              how many days has this month?
//   pruefen   { range, h, m, said: { h, m }, right, choices }  the owl reads the clock
//   key – short text that tells tasks apart, for "not the same task again".
//
// Weekdays are 0 = Monday … 6 = Sunday. Hours are 1 … 12 on the clock face.

export const RANGES = [1, 2, 3];
/** Days of the months in a normal year, January first. */
export const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MINUTES = { 1: [0], 2: [0, 30, 15, 45], 3: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] };

const rangeOf = (range) => (RANGES.includes(range) ? range : 1);
const same = (a, b) => a.h === b.h && a.m === b.m;
const hour = (h) => ((h - 1 + 120) % 12) + 1;

function time(R, r) {
  return { h: r.int(1, 12), m: r.pick(MINUTES[R]) };
}

/** Wrong readings children (and the owl) make: the hands swapped, the hour one off (half past: the
 *  hour hand is already past the number). */
function wrongs(t, R) {
  const out = [];
  const swapped = { h: t.m === 0 ? 12 : t.m / 5, m: (t.h % 12) * 5 };
  if (!same(swapped, t) && Number.isInteger(swapped.h)) out.push(swapped);
  if (t.m >= 30) out.push({ h: hour(t.h + 1), m: t.m });
  out.push({ h: hour(t.h - 1), m: t.m }, { h: hour(t.h + 1), m: t.m });
  if (R > 1 && t.m !== 0) out.push({ h: t.h, m: (t.m + 30) % 60 });
  return out.filter((w) => !same(w, t));
}

function choices(t, R, r) {
  const list = [t];
  for (const w of r.shuffle(wrongs(t, R))) if (list.length < 3 && !list.some((x) => same(x, w))) list.push(w);
  return r.shuffle(list);
}

const makers = {
  sehen(R, r) {
    const t = time(R, r);
    return { range: R, ...t, choices: choices(t, R, r), key: `${t.h}:${t.m}` };
  },
  machen(R, r) {
    const t = time(R, r);
    const step = R === 1 ? 60 : R === 2 ? 15 : 5;
    let start;
    do start = { h: r.int(1, 12), m: R === 1 ? 0 : r.pick(MINUTES[R]) };
    while (same(start, t));
    return { range: R, ...t, step, startH: start.h, startM: start.m, key: `${t.h}:${t.m}` };
  },
  forschen(R, r) {
    // how long from one time to another: full hours; then minutes in quarters; then in fives, over the full hour
    if (R === 1) {
      const h = r.int(1, 10), add = r.int(1, 4);
      return { range: R, from: { h, m: 0 }, to: { h: hour(h + add), m: 0 }, unit: "h", answer: add, key: `s${h}+${add}` };
    }
    const span = R === 2 ? r.pick([15, 30, 45, 60]) : 5 * r.int(2, 19);
    const start = R === 2 ? r.pick([0, 15, 30, 45]) : 5 * r.int(0, 11);
    const h = r.int(1, 11);
    const end = start + span;
    return { range: R, from: { h, m: start }, to: { h: hour(h + Math.floor(end / 60)), m: end % 60 }, unit: "min", answer: span, key: `s${h}:${start}+${span}` };
  },
  anwenden(R, r) {
    const kinds = R === 1 ? ["later", "day"] : R === 2 ? ["later", "day", "month", "month"] : ["day", "month", "monthDays", "monthDays"];
    const kind = r.pick(kinds);
    if (kind === "later") {
      const h = r.int(1, 12);
      const add = r.int(2, 5);
      return { range: R, kind, h, add, answer: hour(h + add), key: `l${h}+${add}` };
    }
    if (kind === "day") {
      const today = r.int(0, 6);
      const add = R === 1 ? r.int(1, 3) : r.int(1, 6);
      return { range: R, kind, today, add, answer: (today + add) % 7, key: `d${today}+${add}` };
    }
    if (kind === "month") {
      const month = r.int(0, 11);
      const add = r.int(1, R === 2 ? 3 : 6);
      return { range: R, kind, month, add, answer: (month + add) % 12, key: `m${month}+${add}` };
    }
    const month = r.int(0, 11);
    return { range: R, kind, month, answer: MONTH_DAYS[month], key: `md${month}` };
  },
  pruefen(R, r) {
    const t = time(R, r);
    const right = r.chance(0.4);
    const said = right ? t : r.pick(wrongs(t, R));
    return { range: R, ...t, said, right, choices: choices(t, R, r), key: `${t.h}:${t.m}=${said.h}:${said.m}` };
  },
};

export function task(level, r) {
  const make = makers[level.p];
  if (!make) throw new Error(`zeit: unknown perspective ${level.p}`);
  return { p: level.p, ...make(rangeOf(level.range), r) };
}

/** Problems with a task (empty list = fine), for tools/check-welt.mjs. */
export function check(t, level) {
  const R = rangeOf(level.range);
  const problems = [];
  const okTime = (x) => x.h >= 1 && x.h <= 12 && MINUTES[R].includes(x.m);
  if (level.p === "sehen" || level.p === "pruefen") {
    if (!okTime(t)) problems.push(`time ${t.h}:${t.m}`);
    if (t.choices.length !== 3 || !t.choices.some((c) => same(c, t)) || new Set(t.choices.map((c) => `${c.h}:${c.m}`)).size !== 3) problems.push("choices");
    if (level.p === "pruefen" && same(t.said, t) !== t.right) problems.push("right does not match");
  } else if (level.p === "machen") {
    if (!okTime(t) || same({ h: t.startH, m: t.startM }, t) || t.m % t.step) problems.push("clock");
  } else if (level.p === "forschen") {
    const mins = (x) => (x.h % 12) * 60 + x.m;
    const d = (mins(t.to) - mins(t.from) + 720) % 720;
    if ((t.unit === "h" ? d / 60 : d) !== t.answer || t.answer <= 0) problems.push(`span ${d}`);
    if (!okTime(t.from) || !(t.to.m % 5 === 0)) problems.push("span times");
  } else if (level.p === "anwenden") {
    if (t.kind === "later") {
      if (t.answer !== hour(t.h + t.add)) problems.push("later");
    } else if (t.kind === "day") {
      if (t.answer !== (t.today + t.add) % 7) problems.push("day");
    } else if (t.kind === "month") {
      if (t.answer !== (t.month + t.add) % 12) problems.push("month");
    } else if (t.kind === "monthDays") {
      if (t.answer !== MONTH_DAYS[t.month]) problems.push("monthDays");
    } else problems.push(`kind ${t.kind}`);
  }
  return problems;
}
