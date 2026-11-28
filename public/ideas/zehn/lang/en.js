// Sentences of the idea "zehn" (station Teich), English. The board (ideas/zehn/board.js) calls them with number words.
// Said the way one talks to a child at the pond: one thought per sentence, no school words.
const big = (text) => text[0].toUpperCase() + text.slice(1);
const frogs = (word, k) => (k === 1 ? "one frog" : `${word} frogs`);

export default {
  zehn: {
    intro: {
      machen: "Make the frogs hop!",
      sehen: "How many frogs are hiding?",
      forschen: "A frog hops over.",
      anwenden: "Which number is missing?",
      pruefen: "Did the owl count right?",
    },
    friends: (a, b, whole) => `${big(a)} and ${b}, that's ${whole}.`,
    machen: {
      question: (side, target, k) => `Put ${frogs(target, k)} on the ${side} lily pad.`,
      how: "Tap a frog. Hop, it jumps over.",
      hop: "Frog jumps over",
      miss: (has, target) => `There are ${has} there. We need ${target}.`,
      hint: (side) => `Count the frogs on the ${side} lily pad.`,
      allQuestion: (whole) => `${big(whole)} frogs. How can they sit on the two lily pads?`,
      allHow: "Make them hop. Then tap the tick.",
      both: "Each lily pad should have a frog.",
      again: "We have that picture. Make it different!",
      more: "Nice! What else?",
      allDone: (whole) => `Always ${whole} frogs. They just sit differently.`,
      hintAll: "Let one frog hop over. Then another one.",
    },
    sehen: {
      story: (whole) => `Here are ${whole} frogs.`,
      dive: "Splash! Some dive under the leaf.",
      ask: (n) => `You can still see ${n}. How many are hiding?`,
      miss: (n, chosen, sum, whole) => `${big(n)} and ${chosen}, that's ${sum}. But there were ${whole} frogs.`,
      hint: () => "Every empty place is a frog under the leaf.",
    },
    forschen: {
      story: (whole) => `Here are ${whole} frogs.`,
      jump: { left: "A frog is about to hop to the left.", right: "A frog is about to hop to the right." },
      ask: { left: "How many sit on the left then?", right: "How many sit on the right then?" },
      more: "One comes over. Then there are more.",
      onlyOneIn: "Only one comes over.",
      fewer: "One hops away. Then there are fewer.",
      onlyOneOut: "Only one hops away.",
      done: (whole) => `One more here, one fewer there. Together it's still ${whole}.`,
      hint: "Look where the frog hops to. There it gets one more.",
      hintShown: "One more here, one fewer there.",
    },
    anwenden: {
      and: "and",
      are: "make",
      question: (n, whole) => `Here are ${n}. How many more to make ${whole}?`,
      miss: (n, chosen, sum, whole) => `${big(n)} and ${chosen}, that's ${sum}. We want ${whole}.`,
      hint: "Count the empty places.",
    },
    pruefen: {
      says: (whole) => `That's ${whole}!`,
      question: (a, b, whole) => `The owl says: there are ${whole} frogs here. Is that right?`,
      look: (over) => (over ? "Count again. Is there one too many?" : "Count again. Is one missing?"),
      isRight: (whole) => `Count again. It's exactly ${whole}.`,
      fix: (whole) => `Right, the owl got it wrong! It should be ${whole}. How many belong on the right?`,
      fixMiss: (a, chosen, sum, whole) => `${big(a)} and ${chosen}, that's ${sum}. We want ${whole}.`,
      hint: (whole) => `${big(whole)} places. They should all be full.`,
    },
  },
};
