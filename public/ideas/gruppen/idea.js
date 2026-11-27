// Idea "gruppen" (station obstbaum, map tal): groups of the same size, sharing fairly.
// Ported from think-lab's welt/ideas/gruppen: its task code is now the recipes below, its five boards are
// ideas/gruppen/board.js (nests, animals with their shares, cherries in the grass).

import { PAIRS, MAX_EACH } from "./data.js";

const OWN = { mode: "own", value: null, options: null }; // the board checks the answer itself
/** A fair way to share: 2 to 5 groups of `each`, all together between fewest and most. */
const WAY = (minEach = 1) => ({ groups: ["int", 2, 5], each: ["int", minEach, MAX_EACH], all: ["*", "$groups", "$each"] });
const FITS = (most = "$most") => [["<=", "$all", most], [">=", "$all", "$fewest"]];
const PAIR = ["int", 0, PAIRS.length - 1];

export const IDEA = {
  id: "gruppen",
  board: "gruppen",
  ported: true, // sentences as in think-lab: the board calls them with number words (engine/ui/ported.js)
  // The groups of the ladder are how many things there are to share in all: up to 6, then 4 to 10.
  ladder: [
    { id: "5", group: "5", age: 3, params: { range: 5, most: 6, fewest: 0 } },
    { id: "10", group: "10", age: 5, params: { range: 10, most: 10, fewest: 4 } },
  ],
  start: { at: "5" }, // a concept starts at its smallest numbers, whatever the age (only plain calculation starts by age)
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
  cards: { sehen: "teilen", machen: "teilen", anwenden: "teilen" },

  recipes: {
    // See: nests in the grass, each with the same number of eggs.
    sehen: { board: "gruppen", vars: WAY(), where: FITS(), answer: OWN, ask: "gruppen.sehen", key: ["groups", "each"] },
    // Make: share the food out to the animals (the child moves every thing by hand: 15 at most).
    machen: {
      board: "gruppen",
      vars: { ...WAY(2), total: "$all", pair: PAIR },
      where: FITS(["min", "$most", 15]),
      answer: OWN,
      ask: "gruppen.machen",
      key: ["groups", "each"],
    },
    // Explore: does it come out fair? Sometimes some are left over.
    forschen: {
      board: "gruppen",
      vars: {
        ...WAY(),
        some: ["chance", 0.5],
        left: ["int", 1, ["-", "$groups", 1]],
        rest: ["if", "$some", "$left", 0],
        total: ["+", "$all", "$rest"],
        fair: ["==", "$rest", 0],
        pair: PAIR,
      },
      where: FITS(),
      answer: OWN,
      ask: "gruppen.forschen",
      key: ["total", "groups"],
    },
    // Use: cherries on the grass; one bird gets this many. How many birds?
    anwenden: { board: "gruppen", vars: { ...WAY(2), total: "$all" }, where: FITS(), answer: OWN, ask: "gruppen.anwenden", key: ["groups", "each"] },
    // Check: the owl has shared. Fair, or did one get some of another's?
    pruefen: {
      board: "gruppen",
      vars: {
        ...WAY(2),
        pair: PAIR,
        fair: ["chance", 0.4],
        one: ["int", 0, ["-", "$groups", 1]],
        two: ["int", 0, ["-", "$groups", 1]],
        from: ["if", "$fair", -1, "$one"],
        to: ["if", "$fair", -1, "$two"],
      },
      where: [...FITS(), ["or", "$fair", ["!=", "$one", "$two"]]],
      answer: OWN,
      ask: "gruppen.pruefen",
      key: ["groups", "each", "from"],
    },
  },
};
