// Sentences of the idea "zehn" (station Teich), English. The board (ideas/zehn/board.js) calls them with number words.
const big = (text) => text[0].toUpperCase() + text.slice(1);
const SIDE = { left: "on the left", right: "on the right" };

export default {
  zehn: {
    intro: {
      machen: "Put the frogs on the two lily pads!",
      sehen: "Some frogs are hiding. How many?",
      forschen: "A frog hops across. What stays the same?",
      anwenden: "Which number is missing?",
      pruefen: "The owl has shared out frogs. Is that right?",
    },
    friends: (a, b, whole) => `${big(a)} and ${b} make ${whole}.`,
    machen: {
      question: (whole, side, target) => `${big(whole)} frogs. ${target === "one" ? "One frog should sit" : big(target) + " should sit"} ${SIDE[side]}.`,
      allQuestion: (whole, ways) => `${big(whole)} frogs on two lily pads. Find ${ways} ways to share them out!`,
      how: "Tap a frog, and it hops across.",
      hop: "Frog hops across",
      miss: (side, has, target) => `${big(has)} ${SIDE[side]}. It should be ${target}.`,
      both: "Each lily pad should have a frog.",
      again: "You have that one. Try another way!",
      more: (word, k) => (k === 1 ? "Good! One more way." : `Good! ${big(word)} more ways.`),
      allDone: (whole) => `Always ${whole} frogs, just shared out differently.`,
      hint: (side, target) => `Count ${SIDE[side]}. It should be ${target}.`,
      hintAll: "Let one frog hop across, then another.",
    },
    sehen: {
      story: (whole) => `${big(whole)} frogs sit on the lily pads.`,
      dive: "Some dive under the leaf.",
      ask: (n) => `You see ${n}. How many are hiding?`,
      miss: (n, chosen, sum, whole) => `${big(n)} and ${chosen} make ${sum}. But there are ${whole} frogs.`,
      hint: (whole) => `Here are ${whole} places. The empty ones are under the leaf.`,
    },
    forschen: {
      story: (whole) => `${big(whole)} frogs sit on two lily pads.`,
      jump: { left: "One frog hops to the left.", right: "One frog hops to the right." },
      ask: { left: "How many sit on the left then?", right: "How many sit on the right then?" },
      more: "One comes over. Then there are more.",
      onlyOneIn: "Only one comes over.",
      fewer: "One hops away. Then there are fewer.",
      onlyOneOut: "Only one hops away.",
      done: (whole) => `One more here, one fewer there. Together it stays ${whole}.`,
      hint: "Look where the frog lands: one more there. Where it leaves: one fewer.",
      hintShown: "One more here, one fewer there.",
    },
    anwenden: {
      and: "and",
      are: "make",
      question: (n, whole) => `${big(n)} and how many make ${whole}?`,
      miss: (n, chosen, sum, whole) => `${big(n)} and ${chosen} make ${sum}, not ${whole}.`,
      hint: "The empty places are still missing.",
    },
    pruefen: {
      says: (whole) => `That's ${whole}!`,
      question: (a, b, whole) => `The owl says: ${a} and ${b} make ${whole}. Is that right?`,
      look: (over) => (over ? "Count again. Is there one too many?" : "Count again. Is one missing?"),
      isRight: (whole) => `Count again. It is exactly ${whole}.`,
      fix: (whole) => `Right, that is wrong. How many must sit on the right to make ${whole}?`,
      fixMiss: (a, chosen, sum, whole) => `${big(a)} and ${chosen} make ${sum}, not ${whole}.`,
      hint: (whole) => `All ${whole} places should be full, none left over.`,
    },
  },
};
