// Sätze/sentences of the idea "sortieren", English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/sortieren/board.js) calls them with number words, as there.

export default {
  sortieren: {
    intro: {
      sehen: "Where does it go? Tap the right basket.",
      machen: "Sort everything into the baskets.",
      forschen: "Three belong together. One does not fit.",
      anwenden: "Look what is in the baskets. Where does the new one go?",
      pruefen: "The owl has sorted. Is everything right?",
    },
    groups: { animal: "animals", fruit: "fruit", vehicle: "vehicles", flower: "flowers", red: "red", yellow: "yellow", green: "green", big: "big animals", small: "small animals" },
    is: { animal: "It is an animal.", fruit: "It is fruit.", vehicle: "It is a vehicle.", flower: "It is a flower.", red: "It is red.", yellow: "It is yellow.", green: "It is green.", big: "It is a big animal.", small: "It is a small animal." },
    are: { animal: "animals", fruit: "fruit", vehicle: "vehicles", flower: "flowers", red: "red things", yellow: "yellow things", green: "green things", big: "big animals", small: "small animals" },
    rules: { tierObst: "animal or fruit", tierFahrzeug: "animal or vehicle", obstBlume: "fruit or flower", rotGelb: "red or yellow", rotGruen: "red or green", grossKlein: "big or small animal", dreiArten: "animal, fruit or vehicle", dreiFarben: "red, yellow or green" },
    hints: { k: "Is it an animal, fruit, a vehicle or a flower?", c: "Look only at the colour.", s: "Is the animal big or small in real life?" },
    sehen: {
      ask: (rule) => `Where does it go: ${rule}?`,
      miss: (is) => `Look closely: ${is}`,
    },
    machen: {
      ask: (rule) => `Sort: ${rule}! Where does the first one go?`,
      miss: (is) => `Look closely: ${is}`,
      done: "Everything is sorted!",
    },
    forschen: {
      ask: "Three belong together. Which one does not fit?",
      miss: "That one fits with the others. What is different?",
      done: (are, is) => `The others are ${are}. ${is}`,
    },
    anwenden: {
      ask: "The baskets have no sign. Look at what is already inside. Where does the new thing go?",
      miss: "Look at what is in the baskets. What is the same in one basket?",
      done: (are) => `Yes! This basket has ${are}.`,
      hint: "Is everything in one basket of one kind? Or all one colour?",
    },
    pruefen: {
      says: "All sorted!",
      question: (rule) => `The owl has sorted: ${rule}. Is everything right?`,
      right: "Yes, everything is sorted right.",
      lookAgain: "Look at each thing again. Does it fit the sign?",
      isRight: "Look again: every thing fits its basket.",
      fix: "Right, that is not true. Tap the thing in the wrong basket.",
      fixMiss: "That one fits its basket.",
      fixed: (is) => `Right, that belongs in the other basket. ${is}`,
    },
  },
};
