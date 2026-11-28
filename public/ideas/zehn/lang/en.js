// Sätze/sentences of the idea "zehn", English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/zehn/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1);

export default {
  zehn: {
    intro: {
      sehen: "Frogs sit on the lily pads. How many pads are free?",
      machen: "Fill the nut box right up!",
      forschen: "One more here, one fewer there. What is missing?",
      anwenden: "Which number fills it up?",
      pruefen: "The owl says two numbers. Do they fill it up?",
    },
    friends: (a, b, whole) => `${big(a)} and ${b} make ${whole}.`,
    sehen: {
      story: (whole, n, nWord) => `The pond has ${whole} lily pads. ${n === 1 ? "One frog sits" : big(nWord) + " frogs sit"} on them.`,
      ask: "How many pads are free?",
      look: "Look again",
      miss: (chosen, n, sum, whole) => `${big(n)} and ${chosen} make ${sum}. But there are ${whole} pads.`,
      rows: (five) => `A full row is ${five}.`,
      hint: "Look at the rows. The empty pads are free.",
    },
    machen: {
      question: (whole, n) => `The box holds ${whole} nuts. ${n === "one" ? "One is" : big(n) + " are"} in already. Take as many as still fit!`,
      paw: "What the squirrel holds",
      take: "Take a nut",
      back: "Put the nut back",
      pour: "In they go!",
      tooFew: (k, word) => (k === 1 ? "One hole is still free. Take one more!" : `${big(word)} holes are still free.`),
      tooMany: (k, word) => (k === 1 ? "One nut does not fit any more." : `${big(word)} nuts do not fit any more.`),
      hint: "Count the empty holes.",
    },
    forschen: {
      question: "Look at the rows. Which number is missing?",
      questionTwenty: "At the top it is ten, below it is twenty. Which number is missing?",
      miss: (chosen) => `With ${chosen} it is not full.`,
      missTwenty: (n, chosen, sum) => `${big(n)} and ${chosen} make ${sum}.`,
      done: (whole) => `Always one more and one fewer. Together it stays ${whole}.`,
      doneTwenty: (a, b, n) => `${big(a)} and ${b} make ten. So ${n} and ${b} make twenty.`,
      hint: "One number gets bigger, the other smaller.",
      hintRows: "Go from row to row: + 1 on the left, − 1 on the right.",
      hintTwenty: (a, n) => `Look at the top: what does ${a} need? ${n} needs just as many.`,
    },
    huepfen: {
      story: (whole) => `${big(whole)} frogs sit on two lily pads.`,
      jump: { left: "One frog hops to the left.", right: "One frog hops to the right." },
      ask: { left: "How many sit on the left then?", right: "How many sit on the right then?" },
      more: "One comes over. Then there are more.",
      onlyOneIn: "Only one comes over.",
      fewer: "One hops away. Then there are fewer.",
      onlyOneOut: "Only one hops away.",
      done: (whole) => `One more here, one fewer there. Together it stays ${whole}.`,
      hint: "Look where the frog lands. There is one more there, and one fewer where it left.",
      hintShown: "One more here, one fewer there.",
    },
    treppe: {
      question: (whole) => `Every tower has ${whole} stones. Build the missing tower!`,
      stone: (n) => `Stone ${n}: red up to here`,
      miss: (red, blue, r, b) => (b === 0 ? `${big(red)} red stones do not fit the stairs.` : `${big(red)} red and ${blue} blue stones do not fit the stairs.`),
      done: (whole, up) => `${up ? "Red one more, blue one fewer" : "Red one fewer, blue one more"}. Every tower has ${whole} stones.`,
      hintUp: "From tower to tower: red one more, blue one fewer.",
      hintDown: "From tower to tower: red one fewer, blue one more.",
    },
    anwenden: {
      question: (n, whole) => `Which number turns ${n} into ${whole}?`,
      miss: (n, chosen, sum, whole) => `${big(n)} and ${chosen} make ${sum}, not ${whole}.`,
      hint: "The empty places are still missing.",
    },
    pruefen: {
      question: (a, b, whole) => `The owl says: ${a} and ${b} make ${whole}. Is that right?`,
      look: "Look whether a place is still free or one is left over.",
      fix: (a, whole) => `Right, that is not true. Which number turns ${a} into ${whole}?`,
      fixMiss: (whole) => `Not yet. Together it should be ${whole}.`,
      hint: (whole) => `All ${whole} places should be full, none left over.`,
    },
  },
};
