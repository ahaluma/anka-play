// Sätze/sentences of the idea "groesse", English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/groesse/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1);

export default {
  groesse: {
    intro: {
      sehen: "What is longer, what is higher? Look closely.",
      machen: "Put the things in order of size.",
      forschen: "The balance: what is heavier? Think first!",
      anwenden: "What fits the bears?",
      pruefen: "The owl compares. Is that right?",
    },
    kinds: {
      lang: {
        one: "snake",
        smallest: "the shortest snake",
        ask: { more: { two: "Which snake is longer?", many: "Which snake is the longest?" }, less: { two: "Which snake is shorter?", many: "Which snake is the shortest?" } },
        done: { more: { two: "This snake is longer.", many: "This snake is the longest." }, less: { two: "This snake is shorter.", many: "This snake is the shortest." } },
        miss: { more: "Another snake is even longer.", less: "Another snake is even shorter." },
      },
      hoch: {
        one: "tower",
        smallest: "the lowest tower",
        ask: { more: { two: "Which tower is higher?", many: "Which tower is the highest?" }, less: { two: "Which tower is lower?", many: "Which tower is the lowest?" } },
        done: { more: { two: "This tower is higher.", many: "This tower is the highest." }, less: { two: "This tower is lower.", many: "This tower is the lowest." } },
        miss: { more: "Another tower is even higher.", less: "Another tower is even lower." },
      },
      wasser: {
        one: "glass",
        smallest: "the glass with the least water",
        ask: { more: { two: "Which glass has more water?", many: "Which glass has the most water?" }, less: { two: "Which glass has less water?", many: "Which glass has the least water?" } },
        done: { more: { two: "This glass has more water.", many: "This glass has the most water." }, less: { two: "This glass has less water.", many: "This glass has the least water." } },
        miss: { more: "Another glass has even more water.", less: "Another glass has even less water." },
      },
    },
    sehen: {
      hint: "Compare the tops: which one reaches furthest?",
      hintLine: "Move them to one line in your head. Now you see which one really reaches further.",
    },
    machen: {
      ask: (smallest) => `Put them in order of size! Tap ${smallest} first, then always the next one.`,
      missFirst: (smallest) => `First comes ${smallest}.`,
      miss: (smallest) => `Of the ones that are left, take ${smallest}.`,
      done: "Now they are in order of size: from the smallest to the biggest.",
      hint: (smallest) => `Find ${smallest}: it is glowing.`,
    },
    forschen: {
      ask: "What is heavier? Think first, then tap it!",
      miss: "Look, the balance goes down on the heavy side.",
      missTricky: "Small does not mean light! The balance goes down on the heavy side.",
      done: "Yes! The heavy side goes down.",
      doneTricky: "Yes! It is small, but heavy. The heavy side goes down.",
      hint: "Imagine carrying both. Which one is harder to carry?",
    },
    anwenden: {
      bears: ["the little bear", "the middle bear", "the big bear"],
      items: { bett: "a bed", stuhl: "a chair", schuessel: "a bowl", pulli: "a jumper", schuh: "a shoe" },
      ask: (bear, item) => `${big(bear)} needs ${item}. What fits?`,
      tooBig: "That is too big.",
      tooSmall: "That is too small.",
      done: (i) => `That fits ${["the little bear", "the middle bear", "the big bear"][i]} just right.`,
      hint: "Little bear, little things. Big bear, big things.",
    },
    pruefen: {
      says: "This one is the longest!",
      question: "The owl points at a snake and says: this one is the longest. Is that right?",
      right: "Yes, this snake is the longest.",
      lookAgain: "Compare the snakes again closely.",
      lookStart: "Look where the snakes start, too! They do not all start at the same place.",
      isRight: "Look again: no snake is longer than this one.",
      fix: "Well spotted! Which snake is really the longest? Tap it.",
      fixMiss: "That one is not the longest. Look where it starts and where it ends.",
      fixed: "Now it is right: this snake is the longest.",
      hint: "Look, now they all start at one line.",
    },
  },
};
