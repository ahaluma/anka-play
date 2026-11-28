// Idea "zahl" (station wiese, map tal): a number says how many; more, fewer, the same.
// An idea written ONLY as data: its ladder and one recipe per perspective. No drawing code, no task code.
// Its sentences are in lang/de.js, lang/en.js, lang/ne.js under the same keys as `ask`.
// The content is think-lab's welt/ideas/zahl (the old games Blitzblick, Wie viele?, Zahlenzug, Wo sind mehr?,
// Wer kommt dazu? and the first levels of Gleich machen), ported one to one into recipes.

const FLOWERS = ["🌼", "🌷", "🌻", "🌸"];
const ANIMALS = ["butterfly", "bee", "ladybird", "snail"];
const TO_COUNT = ["apple", "strawberry", "carrot", "banana", "star", "flower"];
const BIG = [">", "$max", 5]; // the range up to 10
const STRIP = ["range", 1, ["max", 5, "$max"]]; // the number buttons 1 to 5, or 1 to 10

export const IDEA = {
  id: "zahl",
  // The ladder: groups are the number ranges, each rung has a fixed id, the age it is made for and params.
  // lo: the smallest number of a task (from 10 the small ones are left out, they are known by then).
  ladder: [
    { id: "5", group: "5", age: 3, params: { lo: 1, max: 5 } },
    { id: "10", group: "10", age: 5, params: { lo: 4, max: 10 } },
  ],
  start: { at: "5" }, // a concept starts at its smallest numbers, whatever the age (only plain calculation starts by age)
  // The station's perspectives (1 to 5) in the order the owl leads through them: counting starts with the hands.
  perspectives: ["machen", "sehen", "forschen", "anwenden", "pruefen"],
  cards: { machen: "nachpruefen", anwenden: "vergleichen" },

  recipes: {
    // See: flowers on the meadow at a glance. From the second round on they show only for a short look.
    sehen: {
      board: "menge",
      vars: { n: ["int", "$lo", "$max"], thing: ["oneOf", FLOWERS] },
      show: { things: "$thing", n: "$n", flash: true },
      answer: { mode: "choose", value: "$n", options: STRIP },
      ask: "zahl.sehen",
      key: ["n"],
    },

    // Make: pick n flowers into the basket.
    machen: {
      board: "menge",
      vars: { n: ["int", "$lo", "$max"], thing: ["oneOf", FLOWERS] },
      show: { things: "$thing", n: 0, pool: ["max", 5, "$max"] },
      answer: { mode: "build", value: "$n", options: null },
      ask: "zahl.machen",
      key: ["n"],
    },

    // Explore: stepping stones over the stream. One is missing; sometimes the frog hops back.
    // Or the stones lie mixed up: lay the path, the smallest first.
    forschen: {
      variants: [
        {
          weight: ["if", BIG, 7, 8],
          board: "reihe",
          vars: {
            top: ["max", 5, "$max"],
            back: ["chance", ["if", BIG, 0.35, 0.25]],
            step: ["if", "$back", -1, 1],
            from: ["int", ["if", "$back", 5, 1], ["if", "$back", "$top", ["-", "$top", 4]]],
            gap: ["int", 1, 4], // never the first stone: "after three comes …" needs a stone before
            answer: ["+", "$from", ["*", "$gap", "$step"]],
            before: ["-", "$answer", "$step"],
          },
          show: { from: "$from", step: "$step", len: 5, missing: "$gap", look: "stones", dots: ["<=", "$top", 10] },
          answer: { mode: "choose", value: "$answer", options: ["range", 1, "$top"] },
          ask: "zahl.forschen",
          key: ["from", "step", "gap"],
        },
        {
          weight: ["if", BIG, 3, 2],
          board: "reihe",
          vars: {
            top: ["max", 5, "$max"],
            from: ["int", 1, ["-", "$top", 3]],
            path: ["range", "$from", ["+", "$from", 3]],
            mixed: ["shuffled", "$path"],
            first: "$from",
            last: ["+", "$from", 3],
          },
          show: { mixed: "$mixed", dots: ["<=", "$top", 10] },
          answer: { mode: "order", value: "$path", options: null },
          ask: "zahl.ordnen",
          key: ["from"],
        },
      ],
    },

    // Use: where are more (fewer, the same)? One comes, one goes: how many now? Make both sides the same.
    anwenden: {
      variants: [
        {
          weight: 2,
          board: "vergleich",
          vars: {
            same: ["chance", 0.2],
            a: ["int", "$lo", "$max"],
            other: ["int", "$lo", "$max"],
            b: ["if", "$same", "$a", "$other"],
            ask: ["oneOf", ["if", BIG, ["more", "more", "more", "fewer", "fewer"], ["more"]]],
            left: ["oneOf", ANIMALS],
            right: ["oneOf", ANIMALS],
            target: ["if", ["==", "$ask", "more"], ["max", "$a", "$b"], ["min", "$a", "$b"]],
            rest: ["if", ["==", "$ask", "more"], ["min", "$a", "$b"], ["max", "$a", "$b"]],
          },
          // small numbers differ by any amount; bigger ones are close together, so counting is needed
          where: [
            ["!=", "$left", "$right"],
            ["or", "$same", ["and", ["!=", "$other", "$a"], ["or", ["not", BIG], ["<=", ["abs", ["-", "$a", "$other"]], 3]]]],
          ],
          show: { left: { things: "$left", n: "$a" }, right: { things: "$right", n: "$b" }, ask: "$ask" },
          answer: {
            mode: "choose",
            value: ["if", ["==", "$a", "$b"], "same", ["if", ["==", "$a", "$target"], "left", "right"]],
            options: ["left", "right", "same"],
          },
          ask: "zahl.vergleich",
          key: ["a", "b", "ask"],
        },
        {
          weight: 1,
          board: "menge",
          vars: {
            sign: ["oneOf", [1, -1]],
            k: ["oneOf", ["if", BIG, [1, 1, 2], [1]]],
            d: ["*", "$sign", "$k"],
            n: ["int", ["max", ["if", BIG, ["-", "$lo", 2], 1], 1, ["-", 1, "$d"]], ["min", "$max", ["-", "$max", "$d"]]],
            now: ["+", "$n", "$d"],
            animal: ["oneOf", ANIMALS],
          },
          show: { things: "$animal", n: "$n", change: "$d" },
          answer: { mode: "choose", value: "$now", options: STRIP },
          ask: "zahl.dazu",
          key: ["n", "d"],
        },
        {
          weight: 1,
          board: "vergleich",
          vars: {
            a: ["int", "$lo", "$max"],
            b: ["int", "$lo", "$max"],
            how: ["oneOf", ["if", BIG, ["weg", "weg", "weg", "dazu", "dazu"], ["weg"]]],
            left: ["oneOf", ANIMALS],
            right: ["oneOf", ANIMALS],
            goal: ["if", ["==", "$how", "weg"], ["min", "$a", "$b"], ["max", "$a", "$b"]],
            diff: ["abs", ["-", "$a", "$b"]],
          },
          where: [["!=", "$a", "$b"], ["<=", "$diff", ["if", BIG, 5, 3]], ["!=", "$left", "$right"]],
          show: { left: { things: "$left", n: "$a" }, right: { things: "$right", n: "$b" }, make: "$how" },
          answer: { mode: "build", value: "$goal", options: null },
          ask: "zahl.gleich",
          key: ["a", "b", "how"],
        },
      ],
    },

    // Check: the owl has counted. Right, or one off? If not: how many are there?
    pruefen: {
      board: "menge",
      vars: {
        n: ["int", "$lo", "$max"],
        ok: ["chance", 0.5],
        dir: ["oneOf", [-1, 1]],
        said: ["if", "$ok", "$n", ["if", ["==", "$n", 1], 2, ["+", "$n", "$dir"]]],
        thing: ["oneOf", TO_COUNT],
      },
      show: { things: "$thing", n: "$n", owl: { says: "$said" } },
      answer: { mode: "yesNo", value: "$ok", options: [true, false], fix: "$n", fixOptions: STRIP },
      ask: "zahl.pruefen",
      key: ["n", "said"],
    },
  },

  // What a wrong answer means. Shared kinds from content/boards.js MISTAKES.
  mistakes: { oneOff: { when: ["and", ["==", "$type", "number"], ["==", ["abs", ["-", "$given", "$right"]], 1]] } },
};
