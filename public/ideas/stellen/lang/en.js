// Sentences of the idea "stellen", English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/stellen/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1);
const pv = (k, word) => (k === "1" ? word : word + "s"); // "1 ten", "3 tens"

/** 1st, 2nd, 3rd, 4th … 11th, 12th, 13th, 21st (for dates in the stories). */

export default {
  stellen: {
    intro: {
      sehen: "Bunches and flowers. How many flowers are there?",
      machen: "Make the number with bunches and flowers.",
      forschen: "One more flower, one more bunch. What happens?",
      anwenden: "Tens and ones. Which number is it?",
      pruefen: "The owl has counted. Is that right?",
    },
    bigger: "You are good at this! Bigger numbers are coming soon.",
    short: { h: "H", z: "T", e: "O" },
    parts: ({ h, z, e }, num) =>
      h ? `${num(h)} ${h === 1 ? "hundred" : "hundreds"}, ${num(z)} ${z === 1 ? "ten" : "tens"} and ${num(e)} ${e === 1 ? "one" : "ones"}` : `${num(z)} ${z === 1 ? "ten" : "tens"} and ${num(e)} ${e === 1 ? "one" : "ones"}`,
    label: {
      h: (k, v) => `${k} ${k === "1" ? "basket" : "baskets"}${v ? ` = ${v}` : ""}`,
      z: (k, v) => `${k} ${k === "1" ? "bunch" : "bunches"}${v ? ` = ${v}` : ""}`,
      e: (k) => `${k} ${k === "1" ? "flower" : "flowers"}`,
    },
    miss: {
      swap: (z, z10) => `Bunches first: ${z} bunches are ${z10} flowers.`,
      counted: "A bunch has ten flowers, not one.",
      ten: "Nearly! Count the bunches again.",
      other: "First count the bunches in tens: ten, twenty, thirty … Then add the flowers.",
    },
    sehen: {
      ask: "How many flowers are there?",
      done: (n, parts) => `There are ${n}: ${parts}.`,
      hint: "A bunch has ten flowers. Count the bunches in tens.",
    },
    machen: {
      question: (n) => `Make ${n} flowers!`,
      addH: "Add a basket",
      addZ: "Add a bunch",
      addE: "Add a flower",
      check: "Done",
      miss: (value, n) => `That is ${value}. You need ${n}.`,
      tie: "We tie ten flowers into a bunch!",
      pack: "Ten bunches go into a basket!",
      done: (n, parts) => `Exactly ${n}: ${parts}.`,
      hint: "The table shows how many bunches and flowers you need.",
    },
    forschen: {
      question: "Tap + and −. What happens to the number?",
      opName: (op) =>
        ({ 1: "One more flower.", "-1": "One flower fewer.", 10: "One more bunch.", "-10": "One bunch fewer.", 100: "One more basket.", "-100": "One basket fewer." })[op],
      edge: "That does not work here. Try something else!",
      more: "Try some more!",
      ready: "Do you know what happens? Then tap the lamp.",
      know: "I know!",
      predict: (from, op) =>
        `Think first: ${from} and ${({ 1: "one more flower", "-1": "one flower fewer", 10: "one more bunch", "-10": "one bunch fewer", 100: "one more basket", "-100": "one basket fewer" })[op]}. Which number is that?`,
      yes: (from, answer) => `Yes! ${big(String(from))} becomes ${answer}.`,
      predictMiss: (from, answer) => `Look: ${from} becomes ${answer}.`,
      done: "You know how the number grows!",
      hintTry: "Tap + 10 and watch which digit changes.",
      hint: (op) => (Math.abs(op) === 1 ? "Only the ones change, unless they make ten." : Math.abs(op) === 10 ? "Only the tens change. The ones stay the same." : "Only the hundreds change."),
    },
    anwenden: {
      build: (h, z, e, withH) => (withH ? `${h} ${pv(h, "hundred")}, ${z} ${pv(z, "ten")} and ${e} ${pv(e, "one")}. Which number is it?` : `${z} ${pv(z, "ten")} and ${e} ${pv(e, "one")}. Which number is it?`),
      swap: (h, z, e, withH) => (withH ? `${e} ${pv(e, "one")}, ${z} ${pv(z, "ten")} and ${h} ${pv(h, "hundred")}. Which number is it?` : `${e} ${pv(e, "one")} and ${z} ${pv(z, "ten")}. Which number is it?`),
      split: (n, ask) => `How many ${({ h: "hundreds", z: "tens", e: "ones" })[ask]} does ${n} have?`,
      missSplit: (ask) => ({ h: "The hundreds are at the very front.", z: "The tens come before the ones.", e: "The ones are at the very end." })[ask],
      missOver: "Ten ones make a ten. Bundle them!",
      doneSplit: (n, parts) => `${n} has ${parts}.`,
      done: (n, parts) => `${big(String(n))}: ${parts}.`,
      hint: "Look at the bunches and flowers.",
      hintOver: "Ten flowers become a bunch. Then count the bunches.",
    },
    pruefen: {
      question: (said) => `The owl says: these are ${said} flowers. Is that right?`,
      look: "Count again: first the bunches, then the flowers.",
      fix: "Well spotted! How many are there?",
      right: (n, parts) => `Yes! There are ${n}: ${parts}.`,
      fixed: (n, parts) => `Now it is right: ${n}, that is ${parts}.`,
      hint: "Every bunch counts as ten.",
    },
  },
};
