// Sentences of the camp "waage" (map berg), English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/waage/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/en.js.
import B from "../../../boards/berg/lang/en.js";

// English texts for the new world (map, round, the idea "Teile": numbers are made of numbers).
// Number words and names of the things are in /shared/lang/en.js. a, b, c … = number words ("three").
const big = (text) => text[0].toUpperCase() + text.slice(1);
// Camp 6 (waage): the things on the scales, one and many, with "the".
const WN = {
  kuerbis: ["pumpkin", "pumpkins"], apfel: ["apple", "apples"], melone: ["melon", "melons"], ananas: ["pineapple", "pineapples"],
  orange: ["orange", "oranges"], birne: ["pear", "pears"], kiste: ["crate", "crates"], buch: ["book", "books"],
  beutel: ["bag", "bags"], murmel: ["marble", "marbles"], paket: ["parcel", "parcels"], hund: ["dog", "dogs"],
  katze: ["cat", "cats"], hase: ["rabbit", "rabbits"],
};
const wn = (n, id) => `${n} ${n === "1" ? WN[id][0] : WN[id][1]}`;
const wList = (ws) => ws.map((w) => `${w} kg`).join(" and ");
const scales = (a, b) => `On the first scale: ${wn(a[0], a[1])} on the left, ${wn(a[2], a[3])} on the right. On the second: ${wn(b[0], b[1])} on the left, ${wn(b[2], b[3])} on the right. Both are level.`;

export default {
  ...B,
  // ---------- Camp 6 on the thinking mountain: Swap it (welt/ideas/waage/)
  waage: {
    intro: {
      sehen: "Camp 6. A market in the middle of the mountain, with an old pair of scales. What weighs the same may swap.",
      machen: "Put things on yourself. The scales tell you right away if it is right.",
      forschen: "First one, then two, then three. How many small ones is that each time?",
      anwenden: "New scales, new trick. The same tool: swap.",
      pruefen: "The owl weighs with its eyes. That often goes wrong.",
    },
    bigger: "Too easy? The market woman brings out the heavy things.",
    smaller: "Okay, less on the scales. The trick stays.",
    grew: "Logbook: what weighs the same can stand in for each other.",
    kg: (n) => `${n} kg`,
    stories: {
      tausch: (a) => [`On the market scales: 1 ${WN[a.big][0]} weighs as much as ${wn(a.k, a.small)}. Now there are ${wn(a.nb, a.big)} and ${wn(a.ns, a.small)} on the left.`, `How many ${WN[a.small][1]} must go on the right to make the scales level?`],
      zwei: (a) => [scales(["1", a.big, a.k, a.mid], ["1", a.mid, a.m, a.small]), `How many ${WN[a.small][1]} weigh as much as ${wn(a.n, a.big)}?`],
      korb: (a) => [`There are ${wn(a.c, a.thing)} in the basket, all the same weight. Together with the basket they weigh ${a.w} kg. The empty basket weighs ${a.b} kg.`, `How heavy is one ${WN[a.thing][0]}?`],
      taschen: (a) => [`Anna's and Ben's school bags weigh ${a.s} kg together. Anna's bag is ${a.d} kg heavier than Ben's.`, "How heavy is Anna's bag?"],
      hunde: (a) => [`The dogs Rex and Pip weigh ${a.s} kg together. Rex is ${a.d} kg heavier than Pip.`, "How heavy is Rex?"],
      kisten: (a) => [`Two crates in the storeroom weigh ${a.s} kg together. The red one is ${a.d} kg heavier than the blue one.`, "How heavy is the red crate?"],
      drei: (a) => [`At the vet: dog and cat weigh ${a.xy} kg together, cat and rabbit ${a.yz} kg, dog and rabbit ${a.xz} kg.`, "How heavy are all three together?"],
      dreieins: (a) => [`At the vet: dog and cat weigh ${a.xy} kg together, cat and rabbit ${a.yz} kg, dog and rabbit ${a.xz} kg.`, "How heavy is the cat?"],
      kette: (a) => [scales([a.p, a.big, a.q, a.mid], [a.u, a.mid, a.v, a.small]), `How many ${WN[a.small][1]} weigh as much as ${wn(a.n, a.big)}?`],
      gewichte: (a) => [`I have three weights: 1 kg, 3 kg and 9 kg. On the left there is the parcel${a.left.length ? ` and ${wList(a.left)}` : ""}, on the right ${wList(a.right)}. The scales are level.`, "How heavy is the parcel?"],
      kiste: (a) => [`A crate full of the same books weighs ${a.full} kg. I take out half of the books. Now it weighs ${a.half} kg.`, "How heavy is the empty crate?"],
      picknick: (a) => [`Our picnic basket with all the food weighs ${a.full} kg. After the picnic half of it is eaten, and it only weighs ${a.half} kg.`, "How heavy is the empty basket?"],
    },
    units: { tausch: "", zwei: "", korb: "kg", taschen: "kg", hunde: "kg", kisten: "kg", drei: "kg", dreieins: "kg", kette: "", gewichte: "kg", kiste: "kg", picknick: "kg" },
    rules: {
      ersetzen: "What weighs the same may swap: each big thing for as many small ones as it weighs.",
      zwei: "Two scales: swap twice, until only one kind is left.",
      abziehen: "What is the same on both sides can go: take the basket away first, then share.",
      summe: "Sum and difference: add the difference, then it is two heavy ones. Halve.",
      drei: "All pairs together: every thing is in there twice. Halve.",
      kette: "Find a number that swaps with nothing left over. Then go on in those steps.",
      gewichte: "A weight next to the parcel counts minus, one on the other side plus.",
      rueck: "What is gone was half. Twice that is all of it, the rest is the empty container. A tool from camp 4.",
    },
    hints: {
      ersetzen: "Swap each big thing for the small ones. How many is that? Then add the small ones.",
      zwei: "Swap with the first scale first, then with the second.",
      abziehen: "Take the basket away. How much do the things weigh alone?",
      summe: "If the light one were as heavy as the heavy one: how much would it be together?",
      drei: "Add all three scales. How often is each animal in there?",
      kette: "With how many of the first kind does the swap come out even? Make a table.",
      gewichte: "On the right plus, on the left next to the parcel minus.",
      rueck: "How much does the half that is gone weigh? Then you know what everything weighs.",
    },
    miss: {
      ersetzen: "Not quite. Each big thing is several small ones. Don't forget the small ones already there.",
      zwei: "Not quite. Swap twice.",
      abziehen: "Not quite. First take away the basket, then share.",
      summe: "Not quite. Add the difference, then halve.",
      drei: "Not quite. In all the scales together, each animal is there twice.",
      kette: "Not quite. Go in steps that swap with nothing left over.",
      gewichte: "Not quite. Weights next to the parcel count minus.",
      rueck: "Not quite. The half that is gone, times 2, is everything. The rest is the container.",
    },
    tables: {
      tausch: (a) => [WN[a.big][1], WN[a.small][1]],
      zwei: (a) => [WN[a.big][1], WN[a.small][1]],
      kette: (a) => [WN[a.big][1], WN[a.small][1]],
    },
    tableIntro: {
      tausch: (f, a) => `1 ${WN[a.big][0]} weighs as much as ${wn(a.k, a.small)}. And more ${WN[a.big][1]}?`,
      zwei: (f, a) => `1 ${WN[a.big][0]} weighs as much as ${wn(a.k, a.mid)}, 1 ${WN[a.mid][0]} as much as ${wn(a.m, a.small)}.`,
      kette: (f, a) => `${wn(a.p, a.big)} for ${wn(a.q, a.mid)}, ${wn(a.u, a.mid)} for ${wn(a.v, a.small)}. With these numbers it comes out even:`,
    },
    reasons: {
      rest: "It forgot the small things that were already on the scales.",
      all: "It swapped the small things again too.",
      add: "It added instead of swapping.",
      once: "It swapped only once, not twice.",
      basket: "It did not take the basket away.",
      other: "It worked out the lighter one, not the heavier one.",
      half: "It just halved and forgot the difference.",
      twice: "It forgot that each animal was weighed twice.",
      side: "It did not take away the weight next to the parcel.",
      books: "It only took the half that is gone.",
    },
    tools: { ersetzen: "Swap", zwei: "Swap twice", abziehen: "Take away the same", summe: "Sum and difference", drei: "All together, halve", kette: "Even steps", gewichte: "Plus and minus", rueck: "Backwards (camp 4)", probe: "Check", bild: "Draw strips", tabelle: "Table" },
    ways: {
      tausch: (a) => [["ersetzen", `Swap: ${wn(a.nb, a.big)} are ${a.nb} × ${a.k} = ${a.swapped} ${WN[a.small][1]}, plus the ${a.ns}: ${a.answer}.`], ["bild", `Draw each big thing as a parcel of ${a.k} ${WN[a.small][1]}. Then count them all.`], ["probe", `Check: ${a.swapped} + ${a.ns} = ${a.answer}. Both sides the same.`]],
      zwei: (a) => [["zwei", `${wn(a.n, a.big)} are ${a.n} × ${a.k} = ${a.nk} ${WN[a.mid][1]}, and that is ${a.nk} × ${a.m} = ${a.answer} ${WN[a.small][1]}.`], ["tabelle", `Work out first: 1 ${WN[a.big][0]} = ${a.per} ${WN[a.small][1]}. Then times ${a.n}.`]],
      korb: (a) => [["abziehen", `Basket away first: ${a.w} − ${a.b} = ${a.rest} kg. ${a.rest} ÷ ${a.c} = ${a.answer} kg.`], ["probe", `Check: ${a.c} × ${a.answer} + ${a.b} = ${a.w}.`]],
      summe: (a) => [["summe", `Add the difference: ${a.s} + ${a.d} = ${a.twice}. That is two heavy ones: ${a.twice} ÷ 2 = ${a.answer}.`], ["bild", "Draw two strips, one longer by the difference. Make the short one longer, then both are the same."], ["probe", `Check: ${a.answer} + ${a.light} = ${a.s}, and the difference is ${a.d}.`]],
      drei: (a) => [["drei", `All scales together: ${a.xy} + ${a.yz} + ${a.xz} = ${a.sum}. Each animal is in there twice: ${a.sum} ÷ 2 = ${a.all}.`], ["probe", `Check: dog + cat + rabbit = ${a.all}, and ${a.all} − ${a.yz} is the dog alone.`]],
      dreieins: (a) => [["drei", `All together: (${a.xy} + ${a.yz} + ${a.xz}) ÷ 2 = ${a.all}. Without the cat, dog and rabbit weigh ${a.without}: ${a.all} − ${a.without} = ${a.answer}.`], ["ersetzen", "Another way: dog and cat minus dog and rabbit is cat minus rabbit. With cat and rabbit together: sum and difference."]],
      kette: (a) => [["kette", `${wn(a.step, a.big)} are exactly ${wn(a.stepC, a.small)}. ${a.n} is ${a.times} times as many: ${a.times} × ${a.stepC} = ${a.answer}.`], ["tabelle", "A table with even steps: each row the same amount more."]],
      gewichte: (a) => [["gewichte", `On the right ${a.r} kg. Next to the parcel ${a.l} kg. The parcel: ${a.r} − ${a.l} = ${a.answer} kg.`], ["probe", `Check: ${a.answer} + ${a.l} = ${a.r}. The same weight.`]],
      rueck: (a) => [["rueck", `Half weighs ${a.full} − ${a.half} = ${a.gone} kg. So all of it is ${a.things} kg. Empty: ${a.full} − ${a.things} = ${a.answer} kg.`], ["probe", `Check: ${a.answer} + ${a.things} = ${a.full}, and ${a.answer} + ${a.gone} = ${a.half}.`]],
    },
    machen: {
      leftDown: "The left is heavier.",
      rightDown: "The right is heavier.",
      level: "The same weight!",
      add: "Put one on",
      take: "Take one off",
      fillText: (a) => `1 ${WN[a.big][0]} weighs as much as ${wn(a.k, a.small)}. On the left there are ${wn(a.nb, a.big)} and ${wn(a.ns, a.small)}.`,
      fillAsk: (a) => `Put ${WN[a.small][1]} on the right until the scales are level.`,
      fillHint: (a) => `In your head, swap each big thing for ${a.k} ${WN[a.small][1]}. Then add the ${a.ns} already on the left.`,
      filled: (a) => `Level! ${wn(a.answer, a.small)}.`,
      kgLong: (n) => `${n} kilograms`,
      where: { off: "off", right: "right", left: "left" },
      weightsText: (a) => `The ${WN[a.thing][0]} weighs ${a.n} kg. You have three weights: 1, 3 and 9 kg.`,
      weightsAsk: "Tap the weights: to the right, to the left, or off. Until the scales are level.",
      weightsHint: "A weight on the left next to the thing counts minus. 9 on the right and 1 on the left make 8.",
      weighed: (a) => `Level! ${a.n} kg with only three weights.`,
    },
  },
};
