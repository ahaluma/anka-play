// Idea "zehn" (station teich, map tal): friends of five (a hand) and friends of ten (the ten-frame):
// two numbers that fill the whole together. Ported from think-lab's welt/ideas/zehn: its task code is now
// the recipes below, its five boards are ideas/zehn/board.js (lily pads, the nut box, the staircase).

const OWN = { mode: "own", value: null, options: null }; // the board checks the answer itself
const N = ["int", "$lo", "$hi"]; // never 0 or the whole, so both friends are there

export const IDEA = {
  id: "zehn",
  board: "zehn",
  ported: true, // sentences as in think-lab: the board calls them with number words (engine/ui/ported.js)
  // The groups are the wholes: friends of five, then friends of ten. most: the biggest answer button.
  ladder: [
    { id: "5", group: "5", age: 3, params: { whole: 5, lo: 1, hi: 4, most: 4 } },
    { id: "10", group: "10", age: 5, params: { whole: 10, lo: 1, hi: 9, most: 9 } },
  ],
  start: { at: "5" }, // a concept starts at its smallest numbers, whatever the age (only plain calculation starts by age)
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  cards: { machen: "ausprobieren", pruefen: "nachpruefen" },

  recipes: {
    // See: frogs on the lily pads. How many pads are free?
    sehen: { board: "zehn", vars: { n: N, answer: ["-", "$whole", "$n"] }, answer: OWN, ask: "zehn.sehen", key: ["n"] },
    // Make: n nuts are in the box. Take as many as still fit.
    machen: { board: "zehn", vars: { n: N, answer: ["-", "$whole", "$n"] }, answer: OWN, ask: "zehn.machen", key: ["n"] },
    // Explore: one more here, one fewer there, together it stays the same. Three kinds of task, from the
    // picture to the numbers: the frog hops (mostly at five), the stone stairs, and the staircase of pairs
    // with a missing number (mostly at ten).
    forschen: {
      variants: [
        // A frog hops from one lily pad to the other. How many sit on one of them then? Both pads keep a frog.
        {
          weight: ["if", ["==", "$whole", 5], 3, 1],
          when: ["<=", "$whole", 10],
          board: "zehn",
          vars: {
            a: ["int", 1, ["-", "$whole", 1]],
            b: ["-", "$whole", "$a"],
            left: ["chance", 0.5], // it hops to the left pad
            more: ["chance", 0.5], // asked: the pad it lands on (else the one it leaves)
            from: ["if", "$left", "$b", "$a"],
            to: ["if", "$left", "$a", "$b"],
            answer: ["if", "$more", ["+", "$to", 1], ["-", "$from", 1]],
          },
          where: [[">=", "$from", 2]],
          show: { as: "huepfen" },
          answer: OWN,
          ask: "zehn.forschen",
          key: ["a", "left", "more"],
        },
        // Towers of the whole number of stones, red below and blue above, one more red each time. One is missing.
        {
          weight: 2,
          when: ["<=", "$whole", 10],
          board: "zehn",
          vars: {
            start: ["int", 0, ["-", "$whole", 3]],
            back: ["chance", 0.4],
            first: ["if", "$back", ["+", "$start", 3], "$start"],
            step: ["if", "$back", -1, 1],
            rows: [
              ["$first", ["-", "$whole", "$first"]],
              [["+", "$first", "$step"], ["-", "$whole", ["+", "$first", "$step"]]],
              [["+", "$first", ["*", 2, "$step"]], ["-", "$whole", ["+", "$first", ["*", 2, "$step"]]]],
              [["+", "$first", ["*", 3, "$step"]], ["-", "$whole", ["+", "$first", ["*", 3, "$step"]]]],
            ],
            gap: ["int", 1, 3],
            answer: ["+", "$first", ["*", "$gap", "$step"]],
          },
          where: [[">=", "$answer", 1], ["<=", "$answer", "$most"]],
          show: { as: "treppe" },
          answer: OWN,
          ask: "zehn.forschen",
          key: ["first", "step", "gap"],
        },
        // The staircase of pairs as numbers: 5 + 0, 4 + 1, 3 + ?, 2 + 3. One partner is missing.
        {
          weight: ["if", ["==", "$whole", 5], 1, 2],
          board: "zehn",
          vars: {
            start: ["int", 0, ["-", "$whole", 3]],
            back: ["chance", 0.4],
            first: ["if", "$back", ["+", "$start", 3], "$start"],
            step: ["if", "$back", -1, 1],
            rows: [
              ["$first", ["-", "$whole", "$first"]],
              [["+", "$first", "$step"], ["-", "$whole", ["+", "$first", "$step"]]],
              [["+", "$first", ["*", 2, "$step"]], ["-", "$whole", ["+", "$first", ["*", 2, "$step"]]]],
              [["+", "$first", ["*", 3, "$step"]], ["-", "$whole", ["+", "$first", ["*", 3, "$step"]]]],
            ],
            gap: ["int", 1, 3],
            answer: ["-", "$whole", ["+", "$first", ["*", "$gap", "$step"]]],
          },
          where: [[">=", "$answer", 1], ["<=", "$answer", "$most"]],
          answer: OWN,
          ask: "zehn.forschen",
          key: ["first", "step", "gap"],
        },
      ],
    },
    // Use: which number makes it full? The gap is mostly the second friend.
    anwenden: {
      board: "zehn",
      vars: { n: N, late: ["chance", 0.7], gap: ["if", "$late", "b", "a"], answer: ["-", "$whole", "$n"] },
      answer: OWN,
      ask: "zehn.anwenden",
      key: ["n", "gap"],
    },
    // Check: the owl names two friends. Right, or one off?
    pruefen: {
      board: "zehn",
      vars: { a: N, right: ["chance", 0.5], off: ["oneOf", [-1, 1]], b: ["if", "$right", ["-", "$whole", "$a"], ["+", ["-", "$whole", "$a"], "$off"]] },
      where: [[">=", "$b", 1], ["<=", "$b", "$most"]],
      answer: OWN,
      ask: "zehn.pruefen",
      key: ["a", "b"],
    },
  },
};
