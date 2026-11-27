// Sentences of the idea "zahl" (the meadow), English. One key per recipe `ask`.
// v = the task's values (and v.given for an answer), h = helpers: h.w(3) = "three", h.big("three") = "Three".
export default {
  zahl: {
    intro: {
      sehen: "Look closely! How many flowers are there?",
      machen: "Pick flowers into the basket.",
      forschen: "The frog hops over the stones.",
      anwenden: "More or fewer? One more, one less.",
      pruefen: "The owl counts. Is that right?",
    },

    sehen: {
      look: "Look closely!",
      ask: (v) => (v.seen ? "How many flowers were there?" : "How many flowers are there?"),
      right: (v, h) => `There are ${h.w(v.n)}.`,
      miss: "Look once more!",
      hint: "Take your time and count. The flowers stay.",
    },

    machen: {
      ask: (v, h) => (v.n === 1 ? "Pick one flower into the basket!" : `Pick ${h.w(v.n)} flowers into the basket!`),
      miss: (v, h) => (v.given === 0 ? "The basket is still empty. Tap a flower!" : `There are ${h.w(v.given)} in the basket. You need ${h.w(v.n)}.`),
      right: (v, h) => `There are ${h.w(v.n)} in the basket. Just right!`,
      hint: "Tap a flower. It hops into the basket.",
    },

    forschen: {
      ask: (v) => (v.back ? "The frog hops back. Which number is missing?" : "Which number is missing?"),
      miss: (v, h) => (v.back ? `Counting back, ${h.w(v.given)} does not come after ${h.w(v.before)}.` : `After ${h.w(v.before)} it is not ${h.w(v.given)}.`),
      right: (v, h) => (v.back ? `Counting back: after ${h.w(v.before)} comes ${h.w(v.answer)}.` : `After ${h.w(v.before)} comes ${h.w(v.answer)}.`),
      hint: (v) => (v.back ? "The frog hops back. It is always one less." : "Count the dots. It is always one more."),
    },

    ordnen: {
      ask: "The stones are all mixed up. Lay the path: the smallest number first!",
      miss: (v, h) => (v.first ? "Look for the smallest number first." : `${h.big(h.w(v.chosen))} does not come after ${h.w(v.prev)}.`),
      right: (v, h) => `The path is ready: from ${h.w(v.first)} to ${h.w(v.last)}.`,
      hint: (v) => (v.next ? "The glowing stone comes next." : "The glowing stone has the smallest number."),
    },

    vergleich: {
      ask: (v) => (v.ask === "more" ? "Where are more? Tap there!" : "Where are fewer? Tap there!"),
      miss: (v) => (v.given === "same" ? "Count again. Are there really the same number?" : "Count both sides."),
      right: (v, h) =>
        v.a === v.b
          ? `There ${v.a === 1 ? "is one" : "are " + h.w(v.a)} on each side. The same!`
          : `${h.big(h.w(v.target))} is ${v.ask === "more" ? "more" : "fewer"} than ${h.w(v.rest)}.`,
      hint: "Look at the numbers.",
    },

    dazu: {
      start: (v, h) => (v.n === 1 ? "There is one animal on the meadow." : `There are ${h.w(v.n)} animals on the meadow.`),
      change: (v, h) =>
        v.d > 0 ? (v.k === 1 ? "One more comes." : `${h.big(h.w(v.k))} more come.`) : v.k === 1 ? "One goes away." : `${h.big(h.w(v.k))} go away.`,
      ask: "How many are there now?",
      miss: (v, h) =>
        `There ${v.n === 1 ? "was one" : "were " + h.w(v.n)}, then ${v.d > 0 ? h.w(v.k) + " came. Now there are more" : h.w(v.k) + " went away. Now there are fewer"} than ${h.w(v.n)}.`,
      right: (v, h) => (v.d > 0 ? `${h.big(h.w(v.n))} and ${h.w(v.k)} more make ${h.w(v.now)}.` : `${h.big(h.w(v.n))} and ${h.w(v.k)} away leaves ${h.w(v.now)}.`),
      hint: (v, h) =>
        v.d > 0
          ? v.k === 1 ? "One came. Count on: it is one more." : `${h.big(h.w(v.k))} came. Count on: it is ${h.w(v.k)} more.`
          : v.k === 1 ? "One went away. It is one less." : `${h.big(h.w(v.k))} went away. It is ${h.w(v.k)} less.`,
    },

    gleich: {
      ask: (v) => (v.how === "weg" ? "Make both sides the same! Tap an animal and it goes home." : "Make both sides the same! Tap the house and an animal comes out."),
      miss: (v, h) => {
        const d = Math.abs(v.given - v.goal);
        return v.given > v.goal
          ? d === 1 ? "Your side has one too many." : `Your side has ${h.w(d)} too many.`
          : d === 1 ? "Your side still needs one more." : `Your side still needs ${h.w(d)} more.`;
      },
      right: (v, h) =>
        `${v.diff === 1 ? "One" : h.big(h.w(v.diff))} ${v.how === "weg" ? "went home" : "came out"}. Now there ${v.goal === 1 ? "is one" : "are " + h.w(v.goal)} on each side.`,
      hint: "One here and one there belong together. The pale animals have no partner.",
    },

    pruefen: {
      ask: (v, h) => `The owl says: ${v.said === 1 ? "that is " + h.thing(v.thing).one : "these are " + h.w(v.said) + " " + h.thing(v.thing).many}. Is that right?`,
      miss: "Count again!",
      fix: "Well spotted! How many are there?",
      fixMiss: "Not yet. Count again!",
      right: (v, h) => `Yes! There are ${h.w(v.n)}.`,
      fixed: (v, h) => `Now it is right: there are ${h.w(v.n)}.`,
      hint: "Count along: one, two, three …",
    },
  },
};
