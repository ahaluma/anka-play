// Sätze des offenen Tals (Teich), Deutsch. Ein Satz pro Schritt, so wie Eltern zu einem kleinen Kind sprechen.
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

  arrive: (k) => (k === 1 ? "Ein Frosch kommt ans Ufer." : "Frösche kommen ans Ufer."),
  place: "Setz die Frösche auf die Seerosen.",
  how: "Tipp einen Frosch an, dann eine Seerose.",

  right: "Richtig!",
  wrong: "Falsch.",
  make: (pad, k, w) => `Setz ${k === 1 ? "einen Frosch" : `${w} Frösche`} auf die ${TO[pad]} Seerose.`,
  rest: (pad) => `Setz die anderen auf die ${TO[pad]} Seerose.`,
  madeIs: (pad, k, w) => `So ${k === 1 ? "sitzt einer" : `sitzen ${w}`} auf der ${PAD[pad]} Seerose.`,
  shareOut: "Verteil die Frösche gerecht auf die zwei Seerosen.",
  shareOutRest: "Verteil die Frösche gerecht auf die zwei Seerosen. Was übrig bleibt, bleibt am Ufer.",
  leftIs: "Einer bleibt übrig. Er sitzt am Ufer.",
  total: "Wie viele Frösche sind es insgesamt?",
  totalIs: (k, w) => `Es sind ${k === 1 ? "einer" : w}.`,
  hopOn: (pad) => `Ein Frosch hüpft auf die ${TO[pad]} Seerose.`,
  hopOff: (pad) => `Ein Frosch springt von der ${PAD[pad]} Seerose ins Wasser.`,
  now: "Wie viele sind es jetzt?",
  each: "Wie viele sitzen jetzt auf jeder Seerose?",
  count: (pad) => `Wie viele Frösche sitzen auf der ${PAD[pad]} Seerose?`,
  countMiss: (pad, k, w) => `Zähl mit mir. Auf der ${PAD[pad]} Seerose ${sitzen(k, w)}.`,

  grumble: "Hier ist es zu voll!",
  joke: "Die Frösche haben nur Spaß gemacht.",
  same: "Sitzen auf beiden Seerosen gleich viele Frösche?",
  yes: "Ja",
  no: "Nein",
  notSame: (a, b) => `Auf der roten sitzen ${a}, auf der grünen ${b}. Das ist nicht gleich viel.`,
  sameMiss: (k, w) => `Auf jeder Seerose ${sitzen(k, w)}. Das ist gleich viel.`,
  point: (word) => `Zeig das Blatt, wo ${word} Frösche sitzen.`,
  diffMiss: (pad, m, mw, l, lw, word) => `Auf der ${PAD[pad]} Seerose ${sitzen(m, mw)}, auf der anderen ${l === 1 ? "einer" : l === 0 ? "keiner" : lw}. Auf der ${PAD[pad]} sind ${word}.`,

  share: "Mach es gerecht. Auf jeder Seerose gleich viele.",
  shareHow: "Lass Frösche hinüberhüpfen. Dann tipp auf Fertig.",
  done: "Fertig",

  dive: (pad) => `Die Frösche auf der ${PAD[pad]} Seerose tauchen unter.`,
  partner: (n, pad, k, w, other) => `${n === 5 ? "Fünf" : "Zehn"} Frösche. Auf der ${PAD[pad]} ${sitzen(k, w)}. Wie viele sind auf der ${PAD[other]}?`,

  bye: "Die Frösche springen ins Wasser. Platsch!",
  next: "Weiter",
  owlNext: "Gleich kommen neue Frösche.",

  parents: {
    title: "Für Eltern: was gezählt wird",
    note: "Sicher ist eine Fähigkeit ab 20 Antworten, wenn 18 der letzten 20 richtig sind.",
    head: ["Fähigkeit", "richtig", "falsch", "letzte 20", "Stand"],
    of: (r, n) => `${r} von ${n}`,
    skills: {
      zaehlen5: "zählen bis 5",
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
