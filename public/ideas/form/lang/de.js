// Sätze/sentences of the idea "form", Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/form/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"

export default {
  form: {
    intro: {
      sehen: "Kennst du die Formen? Tipp auf die richtige.",
      machen: "Bau das Bild aus Formen.",
      forschen: "Such alle Formen von einer Art.",
      anwenden: "Formen sind überall. Welche Form hat das?",
      pruefen: "Die Eule sagt, wie die Form heißt. Stimmt das?",
    },
    names: {
      kreis: { name: "Kreis", the: "den Kreis", a: "ein Kreis", many: "Kreise" },
      dreieck: { name: "Dreieck", the: "das Dreieck", a: "ein Dreieck", many: "Dreiecke" },
      quadrat: { name: "Quadrat", the: "das Quadrat", a: "ein Quadrat", many: "Quadrate" },
      rechteck: { name: "Rechteck", the: "das Rechteck", a: "ein Rechteck", many: "Rechtecke" },
    },
    facts: {
      kreis: "Ein Kreis ist ganz rund und hat keine Ecken.",
      dreieck: "Ein Dreieck hat drei Ecken und drei Seiten.",
      quadrat: "Ein Quadrat hat vier Ecken und vier gleich lange Seiten, auch wenn es schief steht.",
      rechteck: "Ein Rechteck hat vier Ecken: zwei lange und zwei kurze Seiten.",
    },
    pictures: { haus: "das Haus", schneemann: "den Schneemann", baum: "den Baum", eis: "das Eis", auto: "das Auto", boot: "das Boot", rakete: "die Rakete", roboter: "den Roboter", zug: "den Zug" },
    things: { uhr: "die Uhr", keks: "der Keks", donut: "der Donut", muenze: "die Münze", pizza: "das Pizzastück", kaese: "das Käsestück", sandwich: "das Sandwich", segel: "das Segel", fenster: "das Fenster", waffel: "die Waffel", wuerfel: "die Seite vom Würfel", tuer: "die Tür", buch: "das Buch", brief: "der Brief", handy: "das Handy" },
    sehen: {
      ask: (the) => `Tipp auf ${the}!`,
      miss: (a, fact) => `Das ist ${a}. ${fact}`,
      done: (a, fact) => `Das ist ${a}. ${fact}`,
    },
    machen: {
      ask: (picture) => `Bau ${picture}! Welche Form passt in das leuchtende Teil?`,
      next: "Und jetzt das nächste Teil.",
      miss: (a, fact) => `${big(a)} passt hier nicht. ${fact}`,
      done: (picture) => `Fertig! Du hast ${picture} gebaut.`,
      hint: (fact) => `Schau das leuchtende Teil an. ${fact}`,
    },
    forschen: {
      ask: (many) => `Finde alle ${many}!`,
      miss: (a, fact) => `Das ist ${a}. ${fact}`,
      done: (n, many) => `Du hast alle gefunden: ${n} ${many}.`,
      hint: "Manche sind klein oder gedreht.",
    },
    anwenden: {
      ask: (thing) => `Welche Form hat ${thing}?`,
      miss: (fact) => `${fact} Passt das?`,
      done: (thing, a) => `${big(thing)} ist wie ${a}.`,
      hint: "Fahr mit dem Finger am Rand entlang. Gibt es Ecken? Wie viele?",
    },
    pruefen: {
      question: (a) => `Die Eule sagt: Das ist ${a}. Stimmt das?`,
      right: (a, fact) => `Ja, das ist ${a}. ${fact}`,
      lookAgain: (fact) => `${fact} Ist das hier so?`,
      isRight: (fact) => `Schau noch einmal. ${fact}`,
      fix: "Richtig, das stimmt nicht. Wie heißt die Form?",
      fixMiss: (fact) => `${fact} Passt das?`,
      fixed: (a) => `Jetzt stimmt es: Das ist ${a}.`,
      hint: "Zähl die Ecken. Sind alle Seiten gleich lang?",
    },
  },
};
