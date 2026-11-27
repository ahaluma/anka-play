// Sätze/sentences of the idea "muster", English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/muster/board.js) calls them with number words, as there.

export default {
  muster: {
    intro: {
      sehen: "There is a row in the forest. How does it go on?",
      machen: "Make the row go on!",
      forschen: "Clap and stamp along! What comes next?",
      anwenden: "A bead is missing from the necklace.",
      pruefen: "The owl makes a row. Is it right?",
    },
    bigger: "You are good at this! Soon the rows get harder.",
    smaller: "Soon we take easier rows.",
    sehen: {
      ask: "What comes now?",
      miss: "Look at the start. How does the row go?",
      done: "This is how the row goes on.",
      hint: "Look: what is in the box comes again and again.",
    },
    machen: {
      ask: "Make the row go on! Tap a thing below.",
      miss: "That does not fit here. Look what comes before.",
      done: "The row goes on the right way.",
      hint: "Look: this piece comes again and again. Put it down once more.",
    },
    forschen: {
      // Clap and stamp (board.js): the row plays as a rhythm, then the child picks the next move.
      ask: "Listen and look. What comes next?",
      again: "Listen again",
      moves: { "👏": "clap", "🦶": "stamp", "🦵": "pat your knees" },
      miss: "That does not fit. Listen again.",
      done: "Yes, that is how it goes on.",
      hint: "Listen and look: what is in the box comes again and again.",
    },
    anwenden: {
      // The necklace (board.js): one bead in the middle is missing.
      ask: "A bead is missing. Which one goes in the gap?",
      miss: "That one does not fit. Look what comes before and after the gap.",
      done: "Now the necklace is whole.",
      hint: "Look: what is in the box comes again and again.",
    },
    pruefen: {
      ask: "The owl has made a row. Is it right?",
      lookAgain: "Look at every thing: does it fit the row?",
      fix: "Right, that is not true. Tap the wrong thing.",
      fixMiss: "This one fits. Keep looking!",
      right: "The row is right.",
      fixed: "Now the row is right.",
      hint: "Look: every piece must be the same.",
    },
  },
};
