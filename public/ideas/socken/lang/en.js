// Sentences of the camp "socken" (map berg), English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/socken/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/en.js.
import B from "../../../boards/berg/lang/en.js";

// Camp 10 (socken): colours in the box, as a list with "and".
const SCOL = { rot: "red", blau: "blue", gruen: "green", gelb: "yellow", lila: "purple", schwarz: "black" };
const sList = (colors, thing) => `${colors.map(([id, n]) => `${n} ${SCOL[id]}`).reduce((s, x, i, all) => (i === 0 ? x : i === all.length - 1 ? `${s} and ${x}` : `${s}, ${x}`), "")} ${thing}`;
const SEACH = (a) => [["jede", `Worst luck: first all ${a.others} of the other colours, the rarest one last. Then one more: ${a.answer}.`], ["probe", "Check with the rarest colour: if it comes at the very end, how many are drawn already?"]];

export default {
  ...B,
  // ---------- Camp 10 on the thinking mountain: The worst case (welt/ideas/socken/)
  socken: {
    intro: {
      sehen: "Camp 10. A sock box, and the light is off. If you want to be sure, think of the worst luck.",
      machen: "A goblin sits in the box and always gives you the worst sock.",
      forschen: "More colours, more bad luck. How much more exactly?",
      anwenden: "Sweets, birthdays, dots: the same goblin everywhere.",
      pruefen: "The owl hopes for luck. We count on bad luck.",
    },
    bigger: "Too easy? The goblin gets really mean now.",
    smaller: "Okay, fewer colours. The goblin stays.",
    grew: "Logbook: sure means it works even with the worst luck.",
    stories: {
      socken: (a) => [`The box holds ${sList(a.colors, "socks")}. It is pitch dark.`, `How many socks must you take at least to be sure of ${a.k} of the same colour?`],
      bonbons: (a) => [`The bag holds ${sList(a.colors, "sweets")}. You reach in without looking.`, `How many must you take at least to be sure of ${a.k} of the same colour?`],
      murmeln: (a) => [`The pouch holds ${sList(a.colors, "marbles")}. You can't look inside.`, `How many must you take at least to be sure of ${a.k} of the same colour?`],
      sockenjede: (a) => [`The box holds ${sList(a.colors, "socks")}. It is pitch dark.`, "How many must you take at least to be sure of one of each colour?"],
      bonbonsjede: (a) => [`The bag holds ${sList(a.colors, "sweets")}. You reach in without looking.`, "How many must you take at least to be sure of one of each colour?"],
      zweirot: (a) => [`The box holds ${sList(a.colors, "socks")}. It is pitch dark.`, `How many must you take at least to be sure of ${a.k} ${SCOL[a.want]} ones?`],
      klasse: (a) => [`${a.n} children at a school are in the drama club.`, "At least how many have their birthday in the same month? That many for sure."],
      monate: (a) => [`We want to be sure to find ${a.k} children with a birthday in the same month.`, "How many children do we need at least?"],
      punkte: (a) => [`A square is cut into ${a.s} by ${a.s} small squares. You draw dots in it.`, "How many dots must you draw to be sure two are in the same small square?"],
      reste: (a) => [`You write numbers on cards and divide each one by ${a.m}.`, `How many cards do you need to be sure ${a.k} have the same remainder?`],
      farben: (a) => [`A sock box with ${a.c} different colours, lots of each. It is dark.`, "How many socks must you take to be sure two are the same?"],
      gleich: (a) => [`A box with ${a.c} colours, lots of each. It is dark.`, `How many must you take to be sure of ${a.k} of the same colour?`],
    },
    units: { socken: "socks", bonbons: "sweets", murmeln: "marbles", sockenjede: "socks", bonbonsjede: "sweets", zweirot: "socks", klasse: "children", monate: "children", punkte: "dots", reste: "cards", farben: "socks", gleich: "socks" },
    rules: {
      schlimm: "The worst case: as many of each colour as possible without winning. Then one more, and it works for sure.",
      jede: "In the worst case, everything that does not help comes first. Only then what you need.",
      schubfach: "More things than boxes: one box gets at least two. Share out as evenly as you can, then round up.",
      rest: "Each number goes in the box of its remainder. Dividing by m gives m boxes. A tool from camp 8.",
    },
    hints: {
      schlimm: "Imagine the worst luck: how many can you take without it working?",
      jede: "Which come first in the worst case? The ones that are no use to you.",
      schubfach: "What are the boxes here? Share out as evenly as possible.",
      rest: "How many different remainders are there when you divide by this number?",
    },
    miss: {
      schlimm: "Not quite. Count on bad luck: as many of each colour as possible, then one more.",
      jede: "Not quite. First come all the ones that don't help. How many is that?",
      schubfach: "Not quite. Share out evenly into the boxes, then round up.",
      rest: "Not quite. Each remainder is a box.",
    },
    tables: { farben: ["colours", "socks"], gleich: ["the same", "socks"] },
    tableIntro: {
      farben: () => "How many socks do you need to be sure of two the same? With 1, 2, 3 colours:",
      gleich: (f) => `A box with ${f} colours. How many socks to be sure of 2, 3, 4 the same?`,
    },
    reasons: {
      best: "It counted on good luck, not on the worst case.",
      plusone: "It forgot the one that decides it.",
      toomany: "It took too many. Fewer are already sure.",
      small: "It thought the biggest colour comes last. In the worst case it is the smallest.",
      round: "It rounded down instead of up.",
    },
    tools: { schlimm: "The worst case", jede: "First all that doesn't help", schubfach: "Boxes", rest: "Remainders as boxes (camp 8)", probe: "Check", tabelle: "Table", bild: "Try it" },
    ways: {
      schlimm: (a) => [["schlimm", `Worst luck: ${a.km1} of each of the ${a.c} colours, that is ${a.worst} without success. The next one makes it sure: ${a.answer}.`], ["schubfach", `The colours are the boxes. With ${a.answer} socks, one box must get ${a.k}.`]],
      sockenjede: SEACH,
      bonbonsjede: SEACH,
      zweirot: (a) => [["jede", `Worst luck: first all ${a.others} others, then ${a.k}. ${a.others} + ${a.k} = ${a.answer}.`], ["probe", "With luck, fewer are enough. But only this many is sure."]],
      klasse: (a) => [["schubfach", `12 months are 12 boxes. ${a.n} ÷ 12 = ${a.full} remainder ${a.rest}. Round up: ${a.answer}.`], ["bild", "Share the children out over 12 boxes as evenly as you can."]],
      monate: (a) => [["schubfach", `Worst luck: ${a.km1} in each of the 12 months, that is ${a.worst}. The next child makes ${a.k}: ${a.answer}.`], ["schlimm", "Like the socks: the months are the colours."]],
      punkte: (a) => [["schubfach", `${a.boxes} small squares are ${a.boxes} boxes. With ${a.answer} dots, two are together.`], ["bild", "Draw one dot in each small square. Where does the next one go?"]],
      rest: (a) => [["rest", `Dividing by ${a.m} gives ${a.m} remainders. Worst luck: ${a.km1} for each remainder, that is ${a.worst}. Plus one: ${a.answer}.`], ["schlimm", "Like the socks: the remainders are the colours."]],
    },
    machen: {
      draw: "Draw",
      goblin: "A goblin hides inside and always gives you what helps least.",
      ask: "Draw until it works.",
      count: (n) => `Drawn: ${n}`,
      got: "Done! Worse luck is not possible.",
      howMany: "How many did you have to draw?",
      countAgain: "Count what is in your hand.",
      done: (n) => `With ${n} it works for sure, however mean the goblin is.`,
      hint: "Tap Draw. The goblin always picks the sock that helps you least.",
    },
  },
};
