// Task code of the idea "geld" (station hofstand, map feld), ported from think-lab (welt/ideas/geld/tasks.js) as it
// was. It picks from tables with rules, which recipes cannot say (docs/DESIGN.md 6.5). idea.js hands it to the engine
// (engine/recipe.js taskOf); check() is run by tools/check-ideas.mjs on 1000 tasks per level.

// The tasks of the idea "Geld": money (euro coins and notes). The money stand at the market.
// One function per perspective makes one task as plain data: no DOM, no texts. Whole euros only.
//
//   task({ p, range }, r) → one task. range = 10, 20 or 100 (the most money in a task):
//     10   coins of 1 € and 2 €, the 5 € note
//     20   also the 10 € note
//     100  also 20 € and 50 € notes
//     500  euros and cents (docs/GRUNDSCHULE.md 3.9): coins of 1, 2, 5, 10, 20, 50 cent, 1 € and 2 €, up to 5 €.
//          Every amount is in cents here (250 = 2,50 €). Typed answers become three choices (`options`), since the
//          comma is the point: 2,05 € next to 2,50 €. The owl's new mistake "comma": she writes 2 € 5 ct as 2,5 €.
//
//   sehen     { range, money: [values], answer }          coins and notes on the counter: how much?
//   machen    { range, price }                            pay exactly `price` with coins and notes
//   forschen  { range, price, ways }                      pay `price` in `ways` different ways
//   anwenden  { range, kind, … }
//               "total"  { items: [{ thing, price }], answer }          two things: together?
//               "change" { thing, price, paid, answer }                  pay with a note: back?
//               "enough" { thing, price, money: [values], answer: bool } is it enough?
//   pruefen   { range, money: [values], said, right, kind }  the owl counted: "these are `said` €".
//                                                           kind "pieces": she counted coins, not euros
//   key – short text that tells tasks apart, for "not the same task again".

export const RANGES = [10, 20, 100, 500];
/** The coins and notes of each range, biggest first. */
export const MONEY = { 10: [5, 2, 1], 20: [10, 5, 2, 1], 100: [50, 20, 10, 5, 2, 1], 500: [200, 100, 50, 20, 10, 5, 2, 1] };
export const THINGS = ["bread", "cheese", "honey", "melon", "pumpkin", "cake", "ball", "book"];

const rangeOf = (range) => (RANGES.includes(range) ? range : 10);
const sum = (list) => list.reduce((a, b) => a + b, 0);

/** The comma read wrong: 2,05 € ↔ 2,5 € (that is 2,50 €). null when the cents have no such twin. */
export function commaTwin(n) {
  const e = Math.floor(n / 100), c = n % 100;
  if (c > 0 && c < 10) return e * 100 + c * 10;
  if (c >= 10 && c % 10 === 0) return e * 100 + c / 10;
  return null;
}

/** Three amounts to choose from: the right one, its comma twin, and one a coin away. */
function choices(n, r) {
  const near = r.shuffle([n + 10, n - 10, n + 100, n - 100, n + 50, n - 50].filter((x) => x > 0 && x <= 1000));
  const twin = commaTwin(n);
  const others = [...new Set([...(twin ? [twin] : []), ...near])].filter((x) => x !== n);
  return r.shuffle([n, ...others.slice(0, 2)]);
}

/** Some coins and notes worth between lo and hi, a few of each, biggest first. */
function purse(R, r, lo, hi) {
  for (;;) {
    const kinds = MONEY[R];
    const money = [];
    const n = r.int(2, R === 10 ? 5 : R === 500 ? 7 : 6);
    for (let i = 0; i < n; i++) money.push(r.pick(kinds));
    const s = sum(money);
    if (s >= lo && s <= hi) return money.sort((a, b) => b - a);
  }
}

/** The fewest pieces that make n (greedy works for euro values). */
export function fewest(n, R) {
  const out = [];
  for (const v of MONEY[R]) while (n >= v) (out.push(v), (n -= v));
  return out;
}

const makers = {
  sehen(R, r) {
    const money = purse(R, r, R === 10 ? 3 : R === 20 ? 8 : R === 500 ? 30 : 25, R);
    const answer = sum(money);
    return { range: R, money, answer, ...(R === 500 && { options: choices(answer, r) }), key: money.join("+") };
  },
  machen(R, r) {
    const price = R === 10 ? r.int(3, 10) : R === 20 ? r.int(8, 20) : R === 500 ? 5 * r.int(4, 80) : r.int(23, 99);
    return { range: R, price, key: `${price}` };
  },
  forschen(R, r) {
    const price = R === 10 ? r.int(4, 9) : R === 20 ? r.int(7, 18) : R === 500 ? 10 * r.int(3, 25) : r.int(15, 60);
    return { range: R, price, ways: 2, key: `${price}` };
  },
  anwenden(R, r) {
    const kind = R === 10 ? r.pick(["total", "total", "enough"]) : r.pick(["total", "change", "change", "enough"]);
    const things = r.shuffle(THINGS);
    if (R === 500 && kind !== "enough") {
      // prices in cents, in steps of 5 cents
      if (kind === "total") {
        const a = 5 * r.int(4, 50);
        const b = 5 * r.int(4, Math.min(60, 100 - a / 5));
        const answer = a + b;
        return { range: R, kind, items: [{ thing: things[0], price: a }, { thing: things[1], price: b }], answer, options: choices(answer, r), key: `t${a}+${b}` };
      }
      const paid = r.pick([200, 500]);
      const price = 5 * r.int(paid / 20, paid / 5 - 1);
      const answer = paid - price;
      return { range: R, kind, thing: things[0], price, paid, answer, options: choices(answer, r), key: `c${price}/${paid}` };
    }
    if (kind === "total") {
      const top = R === 10 ? 10 : R === 20 ? 20 : 100;
      const a = r.int(1, Math.floor(top / 2) - (R === 100 ? 5 : 0));
      const b = r.int(1, top - a);
      return { range: R, kind, items: [{ thing: things[0], price: a }, { thing: things[1], price: b }], answer: a + b, key: `t${a}+${b}` };
    }
    if (kind === "change") {
      const paid = R === 20 ? r.pick([10, 20]) : r.pick([20, 50, 100]);
      const price = r.int(Math.max(1, Math.floor(paid / 4)), paid - 1);
      return { range: R, kind, thing: things[0], price, paid, answer: paid - price, key: `c${price}/${paid}` };
    }
    const money = purse(R, r, 3, R);
    const have = sum(money);
    const near = R === 500 ? r.pick([-30, -20, -10, -5, 0, 5, 10, 20, 30]) : r.pick([-3, -2, -1, 0, 1, 2, 3]);
    const price = Math.max(1, Math.min(R, have + near));
    return { range: R, kind, thing: things[0], price, money, answer: have >= price, key: `e${money.join("+")}:${price}` };
  },
  pruefen(R, r) {
    let money;
    const few = R === 500 && r.chance(0.6); // mostly a few cents: 2 € and 5 ct, the comma's trap
    do money = purse(R, r, R === 10 ? 3 : R === 500 ? 101 : 8, R);
    while (new Set(money).size < 2 || (R === 500 && !commaTwin(sum(money))) || (few && sum(money) % 100 >= 10));
    const total = sum(money);
    const right = r.chance(0.4);
    const extra = R === 500 ? { options: choices(total, r) } : {};
    if (right) return { range: R, money, said: total, right, kind: null, ...extra, key: `${money.join("+")}=` };
    if (R === 500 && total % 100 < 10 && r.chance(0.7)) {
      // 2 € and 5 ct, and she writes 2,5 €
      return { range: R, money, said: commaTwin(total), short: true, right, kind: "comma", ...extra, key: `${money.join("+")}=,` };
    }
    // Her mistakes: she counts the pieces, not the euros; or she misses one coin.
    const options = [[money.length, "pieces"], [total - money[money.length - 1], "missed"], [total + money[money.length - 1], "twice"]];
    const [said, kind] = r.pick(options.filter(([x, k]) => x !== total && x > 0 && !(R === 500 && k === "pieces")));
    return { range: R, money, said, right, kind, ...extra, key: `${money.join("+")}=${said}` };
  },
};

export function task(level, r) {
  const make = makers[level.p];
  if (!make) throw new Error(`geld: unknown perspective ${level.p}`);
  return { p: level.p, ...make(rangeOf(level.range), r) };
}

/** Problems with a task (empty list = fine), for tools/check-welt.mjs. */
export function check(t, level) {
  const R = rangeOf(level.range);
  const problems = [];
  const legal = (list) => list.every((v) => MONEY[R].includes(v));
  if (R === 500 && t.options && (t.options.length !== 3 || new Set(t.options).size !== 3 || !t.options.includes(t.answer ?? sum(t.money)))) problems.push("options");
  if (R === 500 && level.p === "pruefen" && t.kind === "comma" && (!t.short || t.said !== commaTwin(sum(t.money)) || sum(t.money) % 100 >= 10)) problems.push("comma");
  if (level.p === "sehen") {
    if (!legal(t.money) || sum(t.money) !== t.answer || t.answer > R) problems.push("money");
  } else if (level.p === "machen" || level.p === "forschen") {
    if (t.price < 1 || t.price > R) problems.push(`price ${t.price}`);
    if (level.p === "forschen" && t.price < 3) problems.push("only one way");
  } else if (level.p === "anwenden") {
    if (t.kind === "total" && (sum(t.items.map((i) => i.price)) !== t.answer || t.answer > R)) problems.push("total");
    if (t.kind === "change" && (t.answer !== t.paid - t.price || t.answer < 1 || t.paid > R)) problems.push("change");
    if (t.kind === "enough" && (!legal(t.money) || t.answer !== sum(t.money) >= t.price)) problems.push("enough");
  } else if (level.p === "pruefen") {
    if (!legal(t.money) || (t.said === sum(t.money)) !== t.right || t.said < 1) problems.push("pruefen");
  }
  return problems;
}
