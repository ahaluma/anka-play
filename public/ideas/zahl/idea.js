// Idea "zahl" (station wiese, map tal): a number says how many; more, fewer, the same.
// An idea written ONLY as data: its ladder and one recipe per perspective. No drawing code, no task code.
// Its sentences are in lang/de.js, lang/en.js, lang/ne.js under the same keys as `ask`.
// This is the example for docs/DESIGN.md, section 6; the content follows think-lab's welt/ideas/zahl.

export const IDEA = {
  id: "zahl",
  // The ladder: groups are the number ranges, each rung has fixed id, the age it is made for and params.
  ladder: [
    { id: "5", group: "5", age: 3, params: { max: 5 } },
    { id: "10", group: "10", age: 5, params: { max: 10 } },
  ],
  start: { byAge: { 3: "5", 6: "10" } },
  cards: { machen: "nachpruefen", anwenden: "vergleichen" },

  recipes: {
    // See: flowers at a glance. From the second round on they show only for a moment.
    sehen: {
      board: "menge",
      vars: { n: ["int", 1, "$max"], thing: ["thing"] },
      show: { things: "$thing", n: "$n", layout: "rows5", flash: { fromRound: 2 } },
      answer: { mode: "choose", value: "$n" },
      ask: "zahl.sehen",
      key: ["n"],
    },
    // Make: pick n flowers.
    machen: {
      board: "menge",
      vars: { n: ["int", 1, "$max"], thing: ["thing"] },
      show: { things: "$thing", n: 0, layout: "rows5", pool: ["+", "$max", 2] },
      answer: { mode: "build", value: "$n", options: null },
      ask: "zahl.machen",
      key: ["n"],
    },
    // Explore: the missing stepping stone, forwards or backwards.
    forschen: {
      board: "reihe",
      vars: {
        len: ["min", 5, "$max"],
        from: ["int", 1, ["-", ["+", "$max", 1], "$len"]],
        miss: ["int", 1, ["-", "$len", 2]],
        back: ["oneOf", [false, false, true]],
        gap: ["+", "$from", "$miss"],
      },
      show: { from: "$from", to: ["+", "$from", ["-", "$len", 1]], step: 1, missing: "$gap", back: "$back", look: "stones" },
      answer: { mode: "choose", value: "$gap" },
      ask: "zahl.forschen",
      key: ["from", "miss", "back"],
    },
    // Use: two groups; more, fewer or the same (its own answer).
    anwenden: {
      board: "vergleich",
      vars: { a: ["int", 1, "$max"], b: ["int", 1, "$max"], thing: ["thing"], rel: ["cmp", "$a", "$b"] },
      where: [["<=", ["abs", ["-", "$a", "$b"]], 3]],
      show: { left: { things: "$thing", n: "$a" }, right: { things: "$thing", n: "$b" }, ask: "more" },
      answer: { mode: "choose", value: "$rel", options: ["more", "same", "fewer"] },
      ask: "zahl.anwenden",
      key: ["a", "b"],
    },
    // Check: the owl has counted. Right, or one off?
    pruefen: {
      board: "menge",
      vars: { n: ["int", 1, "$max"], d: ["oneOf", [-1, 0, 0, 1]], thing: ["thing"], claim: ["+", "$n", "$d"] },
      where: [[">=", "$claim", 1]],
      show: { things: "$thing", n: "$n", layout: "scatter", owl: { says: "$claim" } },
      answer: { mode: "yesNo", value: ["==", "$d", 0], options: [true, false] },
      ask: "zahl.pruefen",
      key: ["n", "d"],
    },
  },

  // Optional: what a wrong answer means. Shared kinds from content/boards.js MISTAKES.
  mistakes: { oneOff: { when: ["==", ["abs", ["-", "$given", "$right"]], 1] } },
};
