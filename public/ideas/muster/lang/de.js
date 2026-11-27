// Sätze/sentences of the idea "muster", Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/muster/board.js) calls them with number words, as there.

export default {
  muster: {
    intro: {
      sehen: "Im Wald liegt eine Reihe. Wie geht sie weiter?",
      machen: "Leg die Reihe weiter!",
      forschen: "Klatsch und stampf mit! Wie geht es weiter?",
      anwenden: "In der Kette fehlt eine Perle.",
      pruefen: "Die Eule legt eine Reihe. Stimmt sie?",
    },
    bigger: "Das kannst du gut! Bald werden die Reihen schwerer.",
    smaller: "Bald nehmen wir leichtere Reihen.",
    sehen: {
      ask: "Was kommt jetzt?",
      miss: "Schau auf den Anfang. Wie geht die Reihe?",
      done: "So geht die Reihe weiter.",
      hint: "Schau: Was im Kasten ist, kommt immer wieder.",
    },
    machen: {
      ask: "Leg die Reihe weiter! Tipp unten auf ein Ding.",
      miss: "Das passt hier nicht. Schau, was davor kommt.",
      done: "Die Reihe geht richtig weiter.",
      hint: "Schau: Dieses Stück kommt immer wieder. Leg es noch einmal.",
    },
    forschen: {
      // Clap and stamp (board.js): the row plays as a rhythm, then the child picks the next move.
      ask: "Hör gut zu und schau. Was kommt jetzt?",
      again: "Noch einmal hören",
      moves: { "👏": "klatschen", "🦶": "stampfen", "🦵": "auf die Knie klopfen" },
      miss: "Das passt nicht. Hör noch einmal zu.",
      done: "Ja, so geht es weiter.",
      hint: "Hör und schau: Was im Kasten ist, kommt immer wieder.",
    },
    anwenden: {
      // The necklace (board.js): one bead in the middle is missing.
      ask: "Eine Perle fehlt. Welche gehört in die Lücke?",
      miss: "Die passt nicht. Schau, was vor und nach der Lücke kommt.",
      done: "Jetzt ist die Kette ganz.",
      hint: "Schau: Was im Kasten ist, kommt immer wieder.",
    },
    pruefen: {
      ask: "Die Eule hat eine Reihe gelegt. Stimmt sie?",
      lookAgain: "Schau jedes Ding an: Passt es in die Reihe?",
      fix: "Richtig, das stimmt nicht. Tipp auf das falsche Ding.",
      fixMiss: "Das passt. Such weiter!",
      right: "Die Reihe stimmt.",
      fixed: "Jetzt stimmt die Reihe.",
      hint: "Schau: Jedes Stück muss gleich sein.",
    },
  },
};
