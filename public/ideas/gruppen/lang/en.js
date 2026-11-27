// Sätze/sentences of the idea "gruppen", English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/gruppen/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1);

export default {
  gruppen: {
    intro: {
      sehen: "Every nest has the same number of eggs.",
      machen: "Share fairly! Every animal gets the same.",
      forschen: "Think first: does every animal get the same?",
      anwenden: "Cherries for the birds. For how many is it enough?",
      pruefen: "The owl has shared. Is that fair?",
    },
    bigger: "You are good at this! Soon there is more to share.",
    smaller: "Soon there is less to share.",
    sehen: {
      all: "Every nest has the same number of eggs.",
      sit: "The hen sits down on a nest.",
      ask: "How many eggs are under the hen?",
      miss: "Look into another nest. Every nest has the same.",
      done: (k) => `Every nest has ${k}.`,
      hint: "Count the eggs in another nest.",
    },
    machen: {
      ask: "Share everything! Every animal gets the same.",
      miss: "Not fair yet. One animal has more.",
      done: (k) => `Fair! Every animal has ${k}.`,
      hint: "Give every animal one. Then every animal one more.",
      animal: "Animal",
      pile: "Pile",
      check: "Done",
    },
    forschen: {
      ask: "Think first: does every animal get the same?",
      yes: "Yes, that works",
      no: "No, something is left over",
      watch: "Look, we share them out.",
      fair: (k) => `It works. Every animal gets ${k}.`,
      unfair: (n, rest) => (n === 1 ? "One is left over." : `${big(rest)} are left over.`),
      hint: "In your head, give every animal one. Then every animal one more.",
    },
    anwenden: {
      story: (total, k) => [`Here are ${total} cherries.`, `Every bird gets ${k}.`, "For how many birds is it enough?"],
      miss: "Look: this is what one bird gets.",
      done: (g, k) => `It is enough for ${g} birds. Each one has ${k}.`,
      hint: "Look: this many belong together. Count the groups.",
    },
    pruefen: {
      ask: "The owl has shared. Does every animal have the same?",
      lookAgain: "Count for every animal!",
      fix: "Well spotted! Who has too many? Tap it.",
      fixMiss: "This animal does not have too many. Keep looking!",
      right: (k) => `Yes! Every animal has ${k}.`,
      fixed: (k) => `Now it is fair: every animal has ${k}.`,
      hint: "Look at the numbers. Who has more?",
    },
  },
};
