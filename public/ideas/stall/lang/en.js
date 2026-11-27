// Sentences of the camp "stall" (map berg), English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/stall/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/en.js.
import B from "../../../boards/berg/lang/en.js";

// English texts for the new world (map, round, the idea "Teile": numbers are made of numbers).
// Number words and names of the things are in /shared/lang/en.js. a, b, c … = number words ("three").
const big = (text) => text[0].toUpperCase() + text.slice(1);
// Camp 7 (stall): the small and the big kind, and what is counted.
const SSMALL = { stall: "hens", fahrrad: "bikes", tische: "tables for 4", boote: "boats for 2", spinnen: "beetles", muenzen: "2-euro coins", gewicht: "hens" };
const SBIG = { stall: "goats", fahrrad: "tricycles", tische: "tables for 6", boote: "boats for 4", spinnen: "spiders", muenzen: "5-euro coins", gewicht: "goats" };
const SWHAT = { stall: "legs", fahrrad: "wheels", tische: "chairs", boote: "seats", spinnen: "legs", muenzen: "euros", gewicht: "kg", quiz: "points", drei: "legs" };

export default {
  ...B,
  // ---------- Camp 7 on the thinking mountain: Assume and improve (welt/ideas/stall/)
  stall: {
    intro: {
      sehen: "Camp 7. A stable full of animals, all running around. Counting doesn't work. Assuming does.",
      machen: "At first they are all the same. Then you swap until it fits.",
      forschen: "None swapped, one swapped, two swapped. What happens each time?",
      anwenden: "Other things, the same trick: assume first, then improve.",
      pruefen: "The owl guesses. We check.",
    },
    bigger: "Too easy? Now the stable gets really full.",
    smaller: "Okay, fewer animals. The trick stays.",
    grew: "Logbook: if you assume cleverly, you don't have to guess.",
    what: SWHAT,
    stories: {
      stall: (a) => [`There are hens and goats in the stable. Together they have ${a.n} heads and ${a.total} legs.`, "How many goats are there?"],
      fahrrad: (a) => [`Bikes and tricycles stand in the school yard, ${a.n} of them with ${a.total} wheels.`, "How many tricycles are there?"],
      tische: (a) => [`The restaurant has ${a.n} tables, some with 4 chairs, some with 6. There are ${a.total} chairs in all.`, "How many tables have 6 chairs?"],
      boote: (a) => [`There are ${a.n} boats on the lake, for 2 and for 4. All are full: ${a.total} children are out on the water.`, "How many boats for 4 are there?"],
      spinnen: (a) => [`The bug box has beetles with 6 legs and spiders with 8 legs, ${a.n} animals with ${a.total} legs.`, "How many spiders are there?"],
      muenzen: (a) => [`My money box has ${a.n} coins, only 2-euro and 5-euro coins. Together they make ${a.total} euros.`, "How many 5-euro coins are there?"],
      quiz: (a) => [`The quiz has ${a.n} questions. Right gives 5 points, wrong costs 2 points. I answered all of them and have ${a.total} points.`, "How many questions did I get right?"],
      drei: (a) => [`Hens, ducks and goats run around the yard: ${a.n} heads and ${a.total} legs. ${a.d} of them are ducks.`, "How many hens are there?"],
      gewicht: (a) => [`There are ${a.n} animals in the stable: hens of 2 kg each and goats of ${a.vb} kg each. Together they weigh ${a.total} kg.`, "How many goats are there?"],
    },
    units: { stall: "goats", fahrrad: "tricycles", tische: "tables", boote: "boats", spinnen: "spiders", muenzen: "coins", quiz: "right", drei: "hens", gewicht: "goats" },
    rules: {
      annehmen: "Assume all are the small kind. What is missing, divided by the difference, gives the big kind.",
      drei: "Hens and ducks have the same number of legs: count them as one kind first, then take away the ducks.",
      quiz: "Assume all are right. Each wrong answer costs 5 + 2 = 7 points.",
      waage: "The same with weights: assume all are light, the rest divided by the difference. A tool from camp 6.",
    },
    hints: {
      annehmen: "Imagine they are all the small kind. How much is still missing? How much does one swap bring?",
      drei: "Hens and ducks both have 2 legs. Count them together first.",
      quiz: "How many points would it be if all were right? How much does a wrong answer really cost?",
      waage: "Imagine they are all hens. How many kg are missing? How much heavier is a goat?",
    },
    miss: {
      annehmen: "Not quite. Assume all small first, then divide the rest by the difference.",
      drei: "Not quite. Find the goats first, then take the ducks away from the birds.",
      quiz: "Not quite. A wrong answer costs 7 points compared with a right one.",
      waage: "Not quite. Assume all light first, then divide the rest by the difference.",
    },
    tables: { tausch: (a) => [SBIG[a.kind], SWHAT[a.kind]] },
    tableIntro: { tausch: (f, a) => `Imagine all ${a.n} are ${SSMALL[a.kind]}. Then you swap one after another:` },
    reasons: {
      other: "It counted the other kind.",
      divide: "It forgot to divide by the difference.",
      base: "It just divided, as if all were the big kind.",
      minus: "It forgot that a wrong answer costs points.",
      ducks: "It counted the ducks too.",
      half: "It just took half.",
    },
    tools: { annehmen: "Assume and improve", drei: "Put the same together", quiz: "Assume all right", waage: "With weight (camp 6)", tabelle: "Table", probe: "Check", bild: "Draw" },
    ways: {
      annehmen: (a) => [["annehmen", `All ${a.n} as ${SSMALL[a.kind]}: ${a.n} × ${a.vs} = ${a.base}. Missing: ${a.total} − ${a.base} = ${a.extra}. Each swap brings ${a.diff}: ${a.extra} ÷ ${a.diff} = ${a.answer}.`], ["bild", `Draw ${a.n} circles, give each ${a.vs} ${SWHAT[a.kind]}. Share the other ${a.extra} out in groups of ${a.diff}.`], ["probe", `Check: ${a.answer} × ${a.vb} + ${a.small} × ${a.vs} = ${a.total}.`]],
      waage: (a) => [["waage", `All ${a.n} as hens: ${a.base} kg. Missing: ${a.extra} kg. A goat is ${a.diff} kg heavier: ${a.extra} ÷ ${a.diff} = ${a.answer}.`], ["probe", `Check: ${a.answer} × ${a.vb} + ${a.small} × 2 = ${a.total}.`]],
      drei: (a) => [["drei", `Assume all have 2 legs: ${a.base}. ${a.extra} are missing, that is ${a.goats} goats. Birds: ${a.birds}, without the ${a.d} ducks: ${a.answer} hens.`], ["probe", `Check: ${a.goats} goats, ${a.d} ducks, ${a.answer} hens make ${a.n} heads and ${a.total} legs.`]],
      quiz: (a) => [["quiz", `All right would be ${a.all} points. ${a.lost} are missing. Each wrong one costs 7: ${a.lost} ÷ 7 = ${a.wrong} wrong, so ${a.answer} right.`], ["tabelle", "Table: 0 wrong, 1 wrong, 2 wrong … 7 points fewer each time."], ["probe", `Check: ${a.answer} × 5 − ${a.wrong} × 2 = ${a.total}.`]],
    },
    machen: {
      swap: "Swap",
      ask: "Tap to swap, until the number fits exactly.",
      now: (cur, goal, what) => `${what}: ${cur} of ${goal}`,
      done: (n) => `Exactly! ${n} swapped.`,
      hint: (a) => `Each swap brings ${a.diff} more. At the start ${a.extra} are missing.`,
    },
  },
};
