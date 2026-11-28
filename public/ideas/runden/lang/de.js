// Sentences of the idea "runden" (rounding and estimating), Deutsch. The board calls them with numbers already in
// the digits of the language.

export default {
  runden: {
    intro: {
      sehen: "Welcher runde Nachbar ist näher?",
      machen: "Lass den Frosch zum nächsten runden Nachbarn hüpfen.",
      forschen: "Welche Ziffern passen?",
      anwenden: "Ungefähr wie viel?",
      pruefen: "Die Eule rundet. Stimmt das?",
    },
    unit: { 10: "auf Zehner", 100: "auf Hunderter" },
    hint: "Die rote Mitte teilt die Strecke. Liegt die Zahl vor der Mitte, rundet man ab. Ab der Mitte rundet man auf.",
    middle: "Die Zahl liegt genau in der Mitte. Dann rundet man auf.",
    done: (n, v) => `${n} wird zu ${v}: Das ist näher.`,
    middleDone: (n, v) => `${n} liegt genau in der Mitte. Man rundet auf: ${v}.`,
    sehen: {
      ask: (n, unit) => `Der Frosch sitzt bei ${n}. Runde ${unit}: Welcher Nachbar ist näher?`,
      miss: "Schau, welcher Nachbar näher am Frosch liegt.",
    },
    machen: {
      ask: (n, unit) => `Runde ${n} ${unit}. Tipp auf die Zahl, zu der der Frosch hüpft.`,
      miss: "Das ist ein Nachbar, aber nicht der nähere.",
      far: "Der Frosch hüpft nur zu einem direkten Nachbarn.",
    },
    forschen: {
      ask: (shown, target) => `${shown} wird zu ${target} gerundet. Welche Ziffern passen ins Kästchen? Tipp alle an.`,
      check: "Fertig",
      missing: "Es passen noch mehr Ziffern.",
      tooMany: "Eine Ziffer passt nicht. Probier sie aus: Wohin wird gerundet?",
      hint: (mid) => `Die Mitte ist ${mid}. Ab der Mitte rundet man auf, davor ab.`,
      doneUp: (list) => `Ja: ${list}. Ab 5 rundet man auf.`,
      doneDown: (list) => `Ja: ${list}. Bis 4 rundet man ab.`,
    },
    anwenden: {
      ask: (task) => `${task}: Ungefähr wie viel ist das? Runde erst, dann rechne.`,
      miss: "Runde jede Zahl, dann rechne mit den runden Zahlen.",
      hint: "Erst runden, dann rechnen.",
      done: (way, v) => `${way} = ${v}. Ungefähr ${v}.`,
    },
    why: {
      middle: "In der Mitte rundet man auf.",
      far: "Sie hat den falschen Nachbarn genommen.",
      place: "Sie hat auf Zehner gerundet statt auf Hunderter.",
    },
    pruefen: {
      askRound: (n, unit, said) => `Die Eule rundet ${n} ${unit}: ${said}. Stimmt das?`,
      askCheck: (said) => `Die Eule hat gerechnet: ${said}. Kann das stimmen? Rechne ungefähr.`,
      lookRound: "Schau auf die Mitte: Liegt die Zahl davor oder dahinter?",
      lookCheck: "Rechne ungefähr: Runde beide Zahlen und rechne mit ihnen.",
      fix: (why) => `Gut aufgepasst! ${why} Wohin wird gerundet?`,
      checkRight: (way, said) => `Ungefähr: ${way}. ${said} liegt nah dran. Das kann stimmen.`,
      checkWrong: (way, exact) => `Ungefähr: ${way}. Das ist weit weg. Richtig ist ${exact}.`,
      hintCheck: "Runde beide Zahlen. Liegt das Ergebnis der Eule nah am ungefähren Ergebnis?",
    },
  },
};
