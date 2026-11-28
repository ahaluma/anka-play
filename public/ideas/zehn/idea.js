// Idea "zehn" (station teich, map tal): a number is two parts, and however the parts change, the whole stays.
// One picture for every way of playing: frogs on two lily pads. First 3 and 4 frogs, then 5 (a hand), then
// 10 (two rows of five pads). No signs: the parts are named in words ("drei und zwei sind fünf"); digits come
// in only in Anwenden, after the dots. The boards are ideas/zehn/board.js.

const OWN = { mode: "own", value: null, options: null }; // the board checks the answer itself
const WHOLE = ["int", "$lo", "$hi"]; // how many frogs in all
const PART = ["int", 1, ["-", "$whole", 1]]; // one pad's frogs: never none, never all

export const IDEA = {
  id: "zehn",
  board: "zehn",
  ported: true, // sentences as in think-lab: the board calls them with number words (engine/ui/ported.js)
  // The groups: 3 and 4 frogs, then 5, then 10. most: the biggest answer button.
  // marks: how Anwenden shows a number: dots, dots with the digit, the digit.
  ladder: [
    { id: "4", group: "4", age: 3, params: { lo: 3, hi: 4, most: 4, marks: "dots" } },
    { id: "5", group: "5", age: 3, params: { lo: 5, hi: 5, most: 5, marks: "both" } },
    { id: "10", group: "10", age: 5, params: { lo: 10, hi: 10, most: 10, marks: "digits" } },
  ],
  start: { at: "4" }, // a concept starts at its smallest numbers, whatever the age
  // From the hand to the head: make it, see it, predict it, numbers only, find the owl's mistake.
  perspectives: ["machen", "sehen", "forschen", "anwenden", "pruefen"],
  cards: { machen: "ausprobieren", pruefen: "nachpruefen" },

  recipes: {
    // Make: the frogs sit on the left pad; a tap makes one hop across. Either to a given number on one pad,
    // or every way of sharing them out (with 10: four ways).
    machen: {
      variants: [
        {
          weight: 2,
          board: "zehn",
          vars: { whole: WHOLE, target: PART, left: ["chance", 0.5], answer: "$target" },
          answer: OWN,
          ask: "zehn.machen",
          key: ["whole", "target", "left"],
        },
        {
          weight: 1,
          board: "zehn",
          vars: { whole: WHOLE, all: true, ways: ["min", ["-", "$whole", 1], 4], answer: "$ways" },
          answer: OWN,
          ask: "zehn.machen",
          key: ["whole", "all"],
        },
      ],
    },
    // See: all frogs are seen, then a leaf covers the right pad. How many are under it?
    sehen: { board: "zehn", vars: { whole: WHOLE, n: PART, answer: ["-", "$whole", "$n"] }, answer: OWN, ask: "zehn.sehen", key: ["whole", "n"] },
    // Explore: one frog hops from one pad to the other. How many sit on one of them then? Both pads keep a frog.
    forschen: {
      board: "zehn",
      vars: {
        whole: WHOLE,
        a: PART,
        b: ["-", "$whole", "$a"],
        left: ["chance", 0.5], // it hops to the left pad
        more: ["chance", 0.5], // asked: the pad it lands on (else the one it leaves)
        from: ["if", "$left", "$b", "$a"],
        to: ["if", "$left", "$a", "$b"],
        answer: ["if", "$more", ["+", "$to", 1], ["-", "$from", 1]],
      },
      where: [[">=", "$from", 2]],
      answer: OWN,
      ask: "zehn.forschen",
      key: ["whole", "a", "left", "more"],
    },
    // Use: no frogs any more. "3 and ? are 5" with dots, then with digits.
    anwenden: { board: "zehn", vars: { whole: WHOLE, n: PART, answer: ["-", "$whole", "$n"] }, answer: OWN, ask: "zehn.anwenden", key: ["whole", "n"] },
    // Check: the owl has put frogs on the pads and says they are all. Right, or one too many or too few?
    // If not: how many must sit on the right?
    pruefen: {
      board: "zehn",
      vars: {
        whole: WHOLE,
        a: PART,
        right: ["chance", 0.5],
        off: ["oneOf", [-1, 1]],
        b: ["if", "$right", ["-", "$whole", "$a"], ["+", ["-", "$whole", "$a"], "$off"]],
        answer: ["-", "$whole", "$a"],
      },
      where: [[">=", "$b", 1], ["<=", "$b", "$most"]],
      answer: OWN,
      ask: "zehn.pruefen",
      key: ["whole", "a", "b"],
    },
  },
};
