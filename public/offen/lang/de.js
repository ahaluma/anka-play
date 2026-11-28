// Sätze des offenen Tals (Teich), Deutsch. Ein Satz pro Schritt, so wie Eltern zu einem kleinen Kind sprechen.
// w = Zahlwort ("drei"), W = großgeschrieben ("Drei").
const PAD = { rot: "roten", gruen: "grünen" };
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

  count: (pad) => `Wie viele Frösche sitzen auf der ${PAD[pad]} Seerose?`,
  countMiss: (pad, k, w) => `Zähl mit mir. Auf der ${PAD[pad]} Seerose ${sitzen(k, w)}.`,

  grumble: "Hier ist es zu voll!",
  joke: "Die Frösche erzählen Quatsch.",
  compare: "Wo sitzen mehr Frösche?",
  same: "Gleich viele",
  compareSame: "Beide Seerosen haben gleich viele. Die Frösche haben nur Spaß gemacht.",
  compareMiss: (pad, m, mw, l, lw) => `Auf der ${PAD[pad]} Seerose ${sitzen(m, mw)}, auf der anderen ${l === 1 ? "einer" : l === 0 ? "keiner" : lw}. Auf der ${PAD[pad]} sind mehr.`,
  compareSameMiss: (k, w) => `Auf jeder Seerose ${sitzen(k, w)}. Das ist gleich viel.`,

  share: "Mach es gerecht. Auf jeder Seerose gleich viele.",
  shareHow: "Lass Frösche hinüberhüpfen. Dann tipp auf Fertig.",
  done: "Fertig",
  shareRight: (k, w) => `Gerecht! Auf jeder Seerose ${sitzen(k, w)}.`,
  shareMiss: (a, b) => `Noch nicht gleich: ${a} und ${b}. Einer muss noch hüpfen.`,

  dive: (pad) => `Die Frösche auf der ${PAD[pad]} Seerose tauchen unter.`,
  partner: (n, pad, k, w, other) => `${n === 5 ? "Fünf" : "Zehn"} Frösche. Auf der ${PAD[pad]} ${sitzen(k, w)}. Wie viele sind auf der ${PAD[other]}?`,
  partnerMiss: (a, b, n) => `${a} und ${b} sind ${n}.`,

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
      vergleich5: "mehr, weniger, gleich bis 5",
      zaehlen10: "zählen bis 10",
      vergleich10: "mehr, weniger, gleich bis 10",
      umverteilen: "umverteilen, bis es gleich ist",
      fuenfer: "Fünferfreunde",
      zehner: "Zehnerfreunde",
    },
    stands: { zu: "noch nicht dran", neu: "neu", uebt: "übt", sicher: "sicher", lange: "lange sicher", wackelt: "wackelt" },
  },
};
