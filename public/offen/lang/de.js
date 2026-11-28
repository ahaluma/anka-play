// Sätze des offenen Tals (Teich), Deutsch. Ein Satz pro Schritt, so wie Eltern zu einem kleinen Kind sprechen.
// Bild und Ton ergänzen sich: Was das Bild allein zeigt (Frösche kommen, einer springt ins Wasser, Masken auf,
// alle platschen ins Wasser, die Zahl auf dem Schild), wird nicht auch noch gesagt. Gesagt wird, was das Kind
// zum Handeln braucht (Frage, Anweisung), Richtig/Falsch, und Wörter, die das Bild nicht trägt (mehr, übrig).
// Jede Frage nach einer Zahl nennt den Ort: auf der roten, auf beiden zusammen, auf jeder Seerose.
// w = Zahlwort ("drei"), W = großgeschrieben ("Drei").
const PAD = { rot: "roten", gruen: "grünen" }; // auf der roten Seerose
const TO = { rot: "rote", gruen: "grüne" }; // auf die rote Seerose
const sitzen = (k, w) => (k === 1 ? "sitzt einer" : k === 0 ? "sitzt keiner" : `sitzen ${w}`);

export default {
  title: "Teich",
  open: "Teich frei spielen",
  stars: "Sterne",
  pads: { rot: "rote Seerose", gruen: "grüne Seerose", shore: "Ufer" },
  frog: "Frosch",

  place: "Setz die Frösche auf die Seerosen.",
  how: "Frosch antippen, dann Seerose.",

  right: "Richtig!",
  wrong: "Falsch.",
  make: (pad, k, w) => `${k === 1 ? "Einen Frosch" : `${w[0].toUpperCase()}${w.slice(1)} Frösche`} auf die ${TO[pad]} Seerose!`,
  rest: (pad) => `Die anderen auf die ${TO[pad]}!`,
  shareOut: "Verteil gerecht! Auf jede Seerose gleich viele.",
  shareOutRest: "Verteil gerecht! Was übrig ist, bleibt am Ufer.",
  leftIs: "Einer bleibt übrig.",
  total: "Wie viele auf beiden zusammen?",
  now: (pad) => `Wie viele jetzt auf der ${PAD[pad]}?`,
  each: "Wie viele auf jeder Seerose?",
  count: (pad) => `Wie viele auf der ${PAD[pad]}?`,

  grumble: "Hier ist es zu voll!",
  joke: "Nur Spaß!",
  same: "Auf beiden gleich viele?",
  yes: "Ja",
  no: "Nein",
  sameMiss: (k, w) => `Doch, gleich viele: auf jeder ${k === 1 ? "einer" : w}.`,
  point: (word) => `Wo sind ${word}? Zeig!`,
  diffMiss: (pad, m, mw, l, lw, word) => `Auf der ${PAD[pad]} sind ${word}: ${mw} und ${l === 0 ? "keiner" : lw}.`,

  share: "Mach es gerecht!",
  shareHow: "Frösche umsetzen, dann Fertig.",
  done: "Fertig",

  look: (pad) => `Schau auf die ${TO[pad]}!`,
  won: (pad) => `Yeaaah! ${pad === "rot" ? "Rot" : "Grün"} hat gewonnen!`,
  masked: (pad) => `Wie viele waren auf der ${PAD[pad]}?`,
  partner: (n, pad, k, w, other) => `${n === 5 ? "Fünf" : "Zehn"} Frösche. Auf der ${PAD[pad]} ${k === 1 ? "einer" : k === 0 ? "keiner" : w}. Wie viele auf der ${PAD[other]}?`,

  next: "Weiter",
  owlNext: "Gleich kommen neue Frösche.",

  parents: {
    title: "Für Eltern: was gezählt wird",
    note: "Sicher ist eine Fähigkeit ab 20 Antworten, wenn 18 der letzten 20 richtig sind.",
    head: ["Fähigkeit", "richtig", "falsch", "letzte 20", "Stand"],
    of: (r, n) => `${r} von ${n}`,
    skills: {
      zaehlen5: "zählen bis 5",
      merken: "Menge merken bis 5",
      mehr: "zeigen, wo mehr sind",
      gleich: "gleich viele oder nicht",
      weniger: "zeigen, wo weniger sind",
      legen: "eine Menge legen",
      zaehlen10: "zählen bis 10",
      dazu: "einer mehr",
      weg: "einer weniger",
      verteilen: "gerecht verteilen",
      umverteilen: "umverteilen, bis es gleich ist",
      fuenfer: "Fünferfreunde",
      zehner: "Zehnerfreunde",
    },
    stands: { zu: "noch nicht dran", neu: "neu", uebt: "übt", sicher: "sicher", lange: "lange sicher", wackelt: "wackelt" },
  },
};
