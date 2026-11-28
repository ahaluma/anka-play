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
  same: "Sitzen auf beiden gleich viele?",
  yes: "Ja",
  no: "Nein",
  point: (word) => `Wo sind ${word}? Zeig!`,

  share: "Mach es gerecht!",
  done: "Fertig",

  look: (pad) => `Schau auf die ${TO[pad]}!`,
  sum: (a, b, c, minus = false) => `${a[0].toUpperCase()}${a.slice(1)} ${minus ? "minus" : "plus"} ${b} ist ${c}.`,
  won: (pad) => `Yeaaah! ${pad === "rot" ? "Rot" : "Grün"} hat gewonnen!`,
  masked: (pad) => `Wie viele waren auf der ${PAD[pad]}?`,
  partner: (n, pad, k, w, other) => `${n === 5 ? "Fünf" : "Zehn"} Frösche. Auf der ${PAD[pad]} ${k === 1 ? "einer" : k === 0 ? "keiner" : w}. Wie viele auf der ${PAD[other]}?`,

  // Die Orte und ihre Portale (places.js): jeder Ort führt direkt zu zwei anderen.
  places: { teich: "Teich", apfelbaum: "Apfelbaum", bau: "Bau" },
  portals: "Wege zu anderen Orten",

  apfel: {
    title: "Apfelbaum",
    apple: "Apfel",
    basket: "Korb",
    hare: "Hase",
    grow: "Tipp auf den Baum, bis alle Äpfel rot sind!",
    pick: (k, w) => (k === 1 ? "Pflück einen Apfel!" : `Pflück ${w} Äpfel!`),
    first: "Wie viele Äpfel hängen auf dem Baum?",
    left: "Wie viele hängen noch am Baum?",
    inBasket: "Wie viele Äpfel sind im Korb?",
    basketNow: "Wie viele sind jetzt im Korb?",
    share: "Gib jedem Hasen gleich viele!",
    shareRest: "Was übrig bleibt, bleibt im Korb.",
    each: "Wie viele hat jeder Hase?",
    rest: "Wie viele bleiben übrig?",
  },

  bau: {
    title: "Bau",
    sendIn: "Schick die Hasen in den Bau!",
    out: "Wie viele sind draußen?",
    inside: "Wie viele sind noch drin?",
    now: "Wie viele sind jetzt draußen?",
  },

  next: "Weiter",

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
      zerlegen5: "zerlegen bis 5: wie viele noch drin",
      zerlegen10: "zerlegen bis 10",
      teilen: "gerecht teilen",
      rest: "teilen mit Rest",
    },
    stands: { zu: "noch nicht dran", neu: "neu", uebt: "übt", sicher: "sicher", lange: "lange sicher", wackelt: "wackelt" },
  },
};
