// Sätze/sentences of the idea "teile", English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/teile/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1);

export default {
  teile: {
    intro: {
      sehen: "Animals go into the burrow. How many are inside?",
      machen: "Put everything on the two leaves. There are many ways!",
      forschen: "Shake the apple tree! How many stay up?",
      anwenden: "Look closely at what happens!",
      pruefen: "The owl says something. Is that right?",
    },
    together: (a, b, c) => `${big(a)} and ${b} make ${c}.`,
    sehen: {
      // The story in three steps: all are there, some go in, the question.
      all: (total, thing) => `${big(total)} ${thing.many} live here.`,
      hide: "Whoosh! Some go into the burrow.",
      ask: "How many are in the burrow now?",
      miss: (chosen, outside, sum, total) => `${big(chosen)} and ${outside} make ${sum}. But there are ${total}.`,
      hint: "Look: this many in all. How many are missing?",
      denLabel: "The burrow",
    },
    machen: {
      question: (total, thing) => `Put ${total} ${thing.many} on the two leaves!`,
      another: "Is there another way?",
      both: "Put something on each leaf.",
      had: "You had that one already. Do it another way!",
      done: (a, b, c, d, total) => `${big(a)} and ${b}, or ${c} and ${d}. Both make ${total}!`,
      hint: "Drag it onto a leaf with your finger.",
      hintMove: "Take one away. Put it on the other leaf.",
      leaf: "Leaf",
      basket: "Basket",
      check: "Done",
    },
    forschen: {
      // Shake the apple tree (board.js): all apples hang in the tree, some fall, the others stay up.
      question: (total) => `${big(total)} apples hang on the tree. How many shall fall down? Tap a number.`,
      out: (n, m, wn, wm) => `${n === 1 ? "One falls" : big(wn) + " fall"} down. ${m === 1 ? "One stays" : big(wm) + " stay"} up.`,
      more: "Try another number!",
      know: "I know it!",
      ready: "Do you know now how many stay up? Then tap the lamp.",
      predict: (x, wx) => `Think first: ${x === 1 ? "one falls" : wx + " fall"} down. How many stay up?`,
      predictMiss: (y, wy) => `Look: ${y === 1 ? "one stays" : wy + " stay"} up.`,
      rule: (x, y, total) => `Together it is always ${total}: ${x} down and ${y} up.`,
      hint: "Tap a number. That many apples fall down.",
      hintPredict: "The pale apples will fall. Count the others.",
      tried: "You tried these",
    },
    anwenden: {
      frogs: (total, n, known) =>
        [`${big(total)} frogs are sitting in the reeds.`, `${n === 1 ? "One hops" : big(known) + " hop"} onto the big leaf.`, "How many are still in the reeds?"],
      eggs: (total, n, known) =>
        [`There are ${total} eggs in the nest.`, `${n === 1 ? "One chick hatches" : big(known) + " chicks hatch"}.`, "How many eggs are still closed?"],
      apples: (total, n, known) =>
        [`There are ${total} apples on the tree.`, `${n === 1 ? "One falls" : big(known) + " fall"} into the grass.`, "How many are still on the tree?"],
      hint: "Look: this many in all. How many are missing?",
    },
    pruefen: {
      question: (a, b, said) => `The owl says: ${a} and ${b} make ${said}. Is that right?`,
      yes: "Right",
      no: "Not right",
      countAgain: "Count again!",
      fix: "Well spotted! How many are there in all?",
      fixMiss: "Not yet. Count them all together!",
      right: (a, b, c) => `Yes! ${big(a)} and ${b} make ${c}.`,
      fixed: (a, b, c) => `Now it is right: ${a} and ${b} make ${c}.`,
      hint: "Count both groups together.",
    },
  },
};
