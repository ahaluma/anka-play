// Idea "teile" (station bau, map tal): numbers are made of numbers, a whole and its two parts.
// Ported from think-lab's welt/ideas/teile: its task code is now the recipes below, its five boards are
// ideas/teile/board.js (pictures that exist only here: the burrow, two leaves, the hollow tree), its
// sentences are lang/<language>.js.

import { BURROW, TO_SHARE, SCENES } from "./data.js";

const WHOLE = ["int", "$lo", "$hi"];
const OWN = { mode: "own", value: null, options: null }; // the board checks the answer itself

export const IDEA = {
  id: "teile",
  board: "teile",
  ported: true, // sentences as in think-lab: the board calls them with number words (engine/ui/ported.js)
  // The groups are the number ranges: wholes from 3 to 5, then from 6 to 10.
  ladder: [
    { id: "5", group: "5", age: 3, params: { range: 5, lo: 3, hi: 5 } },
    { id: "10", group: "10", age: 5, params: { range: 10, lo: 6, hi: 10 } },
  ],
  start: { byAge: { 3: "5", 6: "10" } },
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  roundTasks: { forschen: 3 }, // the hollow tree takes long: three trees are a round

  recipes: {
    // See: animals live in the burrow; `outside` are seen, `inside` are hiding: how many?
    sehen: {
      board: "teile",
      vars: { total: WHOLE, inside: ["int", 1, ["-", "$total", 1]], outside: ["-", "$total", "$inside"], animal: ["oneOf", BURROW] },
      answer: OWN,
      ask: "teile.sehen",
      key: ["total", "inside"],
    },
    // Make: put `total` things on two leaves, in two different ways (the child moves them by hand: 15 at most).
    machen: {
      board: "teile",
      vars: { total: ["int", "$lo", ["min", "$hi", 15]], thing: ["oneOf", TO_SHARE] },
      answer: OWN,
      ask: "teile.machen",
      key: ["total"],
    },
    // Explore: the hollow tree. x nuts in, total − x nuts out (at least 4, so there are three numbers to try).
    forschen: {
      board: "teile",
      vars: { total: ["int", ["max", "$lo", 4], "$hi"] },
      answer: OWN,
      ask: "teile.forschen",
      key: ["total"],
    },
    // Use: a little scene; the whole and one part are known.
    anwenden: {
      board: "teile",
      vars: { scene: ["oneOf", SCENES], total: WHOLE, known: ["int", 1, ["-", "$total", 1]], answer: ["-", "$total", "$known"] },
      answer: OWN,
      ask: "teile.anwenden",
      key: ["total", "known"],
    },
    // Check: the owl says "a and b are `said`". A wrong claim is one or two off, never below the bigger part.
    pruefen: {
      board: "teile",
      vars: {
        total: WHOLE,
        a: ["int", 1, ["-", "$total", 1]],
        b: ["-", "$total", "$a"],
        right: ["chance", 0.5],
        off: ["oneOf", [-1, 1, 2, -2]],
        said: ["if", "$right", "$total", ["+", "$total", "$off"]],
        thing: ["oneOf", TO_SHARE],
      },
      where: [["or", "$right", [">", "$said", ["max", "$a", "$b"]]]],
      answer: OWN,
      ask: "teile.pruefen",
      key: ["a", "b", "said"],
    },
  },
};
