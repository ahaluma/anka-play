// Sätze/sentences of the idea "sortieren", Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/sortieren/board.js) calls them with number words, as there.

export default {
  sortieren: {
    intro: {
      sehen: "Wohin gehört das? Tipp auf den richtigen Korb.",
      machen: "Sortiere alles in die Körbe.",
      forschen: "Drei gehören zusammen. Eins passt nicht.",
      anwenden: "Die Körbe haben kein Schild. Finde die Regel.",
      pruefen: "Die Eule hat sortiert. Stimmt alles?",
    },
    groups: { animal: "Tiere", fruit: "Obst", vehicle: "Fahrzeuge", flower: "Blumen", red: "rot", yellow: "gelb", green: "grün", big: "große Tiere", small: "kleine Tiere" },
    is: { animal: "Das ist ein Tier.", fruit: "Das ist Obst.", vehicle: "Das ist ein Fahrzeug.", flower: "Das ist eine Blume.", red: "Das ist rot.", yellow: "Das ist gelb.", green: "Das ist grün.", big: "Das ist ein großes Tier.", small: "Das ist ein kleines Tier." },
    are: { animal: "Tiere", fruit: "Obst", vehicle: "Fahrzeuge", flower: "Blumen", red: "rote Dinge", yellow: "gelbe Dinge", green: "grüne Dinge", big: "große Tiere", small: "kleine Tiere" },
    rules: { tierObst: "Tier oder Obst", tierFahrzeug: "Tier oder Fahrzeug", obstBlume: "Obst oder Blume", rotGelb: "rot oder gelb", rotGruen: "rot oder grün", grossKlein: "großes oder kleines Tier", dreiArten: "Tier, Obst oder Fahrzeug", dreiFarben: "rot, gelb oder grün" },
    hints: { k: "Ist es ein Tier, Obst, ein Fahrzeug oder eine Blume?", c: "Schau nur auf die Farbe.", s: "Ist das Tier in echt groß oder klein?" },
    sehen: {
      ask: (rule) => `Wohin gehört das: ${rule}?`,
      miss: (is) => `Schau genau: ${is}`,
    },
    machen: {
      ask: (rule) => `Sortiere: ${rule}! Wohin kommt das erste Ding?`,
      miss: (is) => `Schau genau: ${is}`,
      done: "Alles ist sortiert!",
    },
    forschen: {
      ask: "Drei gehören zusammen. Was passt nicht dazu?",
      miss: "Das passt zu den anderen. Was ist anders?",
      done: (are, is) => `Die anderen sind ${are}. ${is}`,
    },
    anwenden: {
      ask: "Die Körbe haben kein Schild. Schau, was schon drin ist. Wohin gehört das neue Ding?",
      miss: "Schau, was in den Körben ist. Was ist in einem Korb gleich?",
      done: (are) => `Ja! In diesem Korb sind ${are}.`,
      hint: "Ist in einem Korb alles von einer Art? Oder alles in einer Farbe?",
    },
    pruefen: {
      says: "Fertig sortiert!",
      question: (rule) => `Die Eule hat sortiert: ${rule}. Ist alles richtig?`,
      right: "Ja, alles ist richtig sortiert.",
      lookAgain: "Schau jedes Ding noch einmal an. Passt es zum Schild?",
      isRight: "Schau noch einmal: Jedes Ding passt zu seinem Korb.",
      fix: "Gut aufgepasst! Tipp auf das Ding im falschen Korb.",
      fixMiss: "Das passt in seinen Korb.",
      fixed: (is) => `Genau, das gehört in den anderen Korb. ${is}`,
    },
  },
};
