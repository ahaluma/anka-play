// Sätze/sentences of the idea "folge", Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/folge/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"

export default {
  folge: {
    intro: {
      sehen: "Was war zuerst? Schau die Bilder an.",
      machen: "Leg die Bildergeschichte in die richtige Reihenfolge.",
      forschen: "Was passiert danach? Erst denken!",
      anwenden: "Wer ist Erster, wer ist Zweiter?",
      pruefen: "Die Eule hat eine Geschichte gelegt. Stimmt das?",
    },
    stories: {
      flower: ["Ein Samen kommt in die Erde.", "Ein kleiner Keim wächst.", "Die Blume blüht."],
      chick: ["Ein Ei.", "Das Küken schlüpft.", "Das Küken ist da!"],
      rain: ["Wolken kommen.", "Es regnet.", "Ein Regenbogen!"],
      sleep: ["Ich bin müde.", "Ich lege mich ins Bett.", "Ich schlafe tief und fest."],
      drawing: ["Ich nehme meine Stifte.", "Ich male ein Bild.", "Ich schenke es Oma."],
      growup: ["Ein Baby.", "Ein Kind.", "Ein Erwachsener.", "Eine Oma oder ein Opa."],
      hen: ["Ein Ei.", "Das Küken schlüpft.", "Ein kleines Küken.", "Ein großes Huhn."],
      tree: ["Ein Samen kommt in die Erde.", "Ein kleiner Keim wächst.", "Die Pflanze wird größer.", "Ein großer Baum!"],
      cake: ["Eier und Mehl.", "Wir rühren den Teig.", "Der Kuchen ist fertig.", "Wir essen ein Stück."],
      soup: ["Wir waschen das Gemüse.", "Wir schneiden es klein.", "Das Essen kocht.", "Lecker, wir essen!"],
      day: ["Morgen: Die Sonne geht auf.", "Mittag: Die Sonne steht hoch.", "Abend: Die Sonne geht unter.", "Nacht: Der Mond scheint."],
    },
    ends: {
      flower: "Aus dem Samen ist eine Blume geworden!",
      chick: "Aus dem Ei ist ein Küken geschlüpft!",
      rain: "Nach dem Regen kommt der Regenbogen!",
      sleep: "Gute Nacht!",
      drawing: "Oma freut sich!",
      growup: "So werden wir langsam groß!",
      hen: "Aus dem Küken ist ein Huhn geworden!",
      tree: "Aus dem Samen ist ein Baum geworden!",
      cake: "Lecker, Kuchen!",
      soup: "Aus dem Gemüse ist ein Essen geworden!",
      day: "So geht ein Tag vorbei.",
    },
    sehen: {
      ask: "Was war zuerst? Tipp darauf.",
      miss: "Das kommt später. Was war vorher?",
      hint: "Was muss zuerst da sein, damit das andere kommen kann?",
    },
    machen: {
      ask: "Leg die Geschichte! Tipp auf das Bild, das zuerst kommt, dann immer auf das nächste.",
      missFirst: "Das kommt nicht zuerst. Wie fängt die Geschichte an?",
      miss: "Das kommt noch nicht. Was passiert als Nächstes?",
      hint: "Das Bild, das wackelt, kommt als Nächstes.",
    },
    forschen: {
      ask: "Was passiert danach?",
      askBack: "Was war davor?",
      missOther: "Das gehört zu einer anderen Geschichte.",
      missBefore: "Das war schon vorher. Was kommt danach?",
      missAfter: "Das kommt erst danach. Was war vorher?",
      hint: "Erzähl die Geschichte von Anfang an. Was kommt an diese Stelle?",
    },
    anwenden: {
      places: ["Erster", "Zweiter", "Dritter", "Vierter", "Fünfter"],
      last: "Letzter",
      ask: (place) => `Die Tiere laufen zur Fahne. Wer ist ${place}?`,
      askLast: "Die Tiere laufen zur Fahne. Wer ist Letzter?",
      miss: (pet, place) => `${big(pet)} ist ${place}.`,
      done: (pet, place) => `${big(pet)} ist ${place}.`,
      hint: "Zähl von der Fahne aus: eins, zwei, drei …",
    },
    pruefen: {
      says: "So geht die Geschichte!",
      question: "Die Eule hat die Geschichte gelegt. Stimmt die Reihenfolge?",
      right: "Ja, die Reihenfolge stimmt.",
      lookAgain: "Erzähl die Geschichte Bild für Bild. Passt alles?",
      isRight: "Erzähl sie noch einmal: Jedes Bild steht am richtigen Platz.",
      fix: "Gut aufgepasst! Leg die Geschichte richtig.",
      fixMiss: "Das kommt noch nicht. Wie geht die Geschichte?",
      fixed: "Jetzt stimmt es.",
      hint: "Was muss zuerst passieren? Was kommt am Ende?",
    },
  },
  // the animals and their names, shared with the idea "lage" (the row of animals in anwenden)
  lage: {
    pets: {
      rabbit: ["der Hase", "dem Hasen"], cat: ["die Katze", "der Katze"], dog: ["der Hund", "dem Hund"],
      bear: ["der Bär", "dem Bären"], fox: ["der Fuchs", "dem Fuchs"], frog: ["der Frosch", "dem Frosch"],
      duck: ["die Ente", "der Ente"], mouse: ["die Maus", "der Maus"], pig: ["das Schwein", "dem Schwein"],
      panda: ["der Panda", "dem Panda"], lion: ["der Löwe", "dem Löwen"],
    },
  },
};
