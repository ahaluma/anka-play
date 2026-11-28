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
  places: {
    home: "Zuhause", teich: "Teich", apfelbaum: "Apfelbaum", bau: "Bau", wiese: "Wiese", waldrand: "Waldrand", himmel: "Himmel",
    nester: "Nester", pfuetze: "Pfütze", huegel: "Hügel", bach: "Bach",
  },
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

  wiese: {
    title: "Wiese",
    lay: "Tipp auf die Wiese! Dann liegt der Weg.",
    stone: (n) => `Stein ${n}`,
    nach: (w) => `Welche Zahl kommt nach ${w}?`,
    vor: (w) => `Welche Zahl kommt vor ${w}?`,
    falter: "Wie viele Schmetterlinge?",
  },

  waldrand: {
    title: "Waldrand",
    grow: "Tipp auf den Waldrand! Dann wächst die Reihe.",
    next: "Was wächst als Nächstes?",
    fehler: "Wo stimmt die Reihe nicht?",
    things: { pilz: "Pilz", blatt: "Blatt", beere: "Beere", zapfen: "Zapfen" },
  },

  himmel: {
    title: "Himmel",
    fly: "Tipp auf die Vögel! Dann fliegen sie los.",
    rang: ["Wer fliegt als Erster?", "Wer fliegt als Zweiter?", "Wer fliegt als Dritter?", "Wer fliegt als Vierter?"],
    last: "Wer fliegt als Letzter?",
    vorher: "Was war vorher?",
    danach: "Was kommt danach?",
    bird: "Vogel",
    pics: {
      wolke: "Wolke", regen: "Regen", regenbogen: "Regenbogen", ei: "Ei", riss: "Das Ei bricht auf", kueken: "Küken",
      samen: "Samen in der Erde", keim: "Keim", bluete: "Blume",
    },
  },

  nester: {
    title: "Nester",
    call: "Tipp in den Himmel! Dann kommen Vögel.",
    nest: "In welches Nest gehört der Vogel?",
    anders: "Welcher Vogel passt hier nicht?",
    bird: "Vogel",
    nests: { blau: "blaues Nest", gelb: "gelbes Nest", rot: "rotes Nest", gross: "großes Nest", klein: "kleines Nest" },
  },

  pfuetze: {
    title: "Pfütze",
    drop: "Tipp ins Wasser!",
    blatt: "Wo lag das Blatt?",
    blaetter: "Wo lagen die Blätter?",
    spiegel: "Was ist im Spiegelbild anders?",
    spot: "Stelle auf dem Wasser",
    things: { blume: "Blume", stein: "Stein", schnecke: "Schnecke", pilz: "Pilz", gras: "Gras" },
  },

  huegel: {
    title: "Hügel",
    sit: "Tipp auf einen Platz! Dann setzt sich ein Tier dorthin.",
    animals: { hase: ["der Hase", "den Hasen"], frosch: ["der Frosch", "den Frosch"], maus: ["die Maus", "die Maus"], vogel: ["der Vogel", "den Vogel"] },
    // wo es sitzt (Dativ) und wohin es soll (Akkusativ)
    at: { auf: "auf der Bank", unter: "unter der Bank", neben: "neben der Bank", vor: "vor der Bank", hinter: "hinter dem Stein", zwischen: "zwischen der Bank und dem Stein" },
    to: { auf: "auf die Bank", unter: "unter die Bank", neben: "neben die Bank", vor: "vor die Bank", hinter: "hinter den Stein", zwischen: "zwischen die Bank und den Stein" },
    wer: (at) => `Wer sitzt ${at}?`,
    setz: (animal, to) => `Setz ${animal} ${to}!`,
    spot: "Platz",
  },

  bach: {
    title: "Bach",
    wash: "Tipp ins Wasser! Dann bringt der Bach Steine.",
    form: { kreis: "Zeig mir den runden Stein!", dreieck: "Zeig mir das Dreieck!", quadrat: "Zeig mir das Quadrat!", rechteck: "Zeig mir das Rechteck!" },
    noch: { kreis: "Wo ist noch ein Kreis?", dreieck: "Wo ist noch ein Dreieck?", quadrat: "Wo ist noch ein Quadrat?", rechteck: "Wo ist noch ein Rechteck?" },
    names: { kreis: "Kreis", dreieck: "Dreieck", quadrat: "Quadrat", rechteck: "Rechteck" },
    laenger: "Welcher Stock ist länger?",
    kuerzer: "Welcher Stock ist kürzer?",
    schwerer: "Was ist schwerer?",
    leichter: "Was ist leichter?",
    hoeher: "Welcher Turm ist höher?",
    niedriger: "Welcher Turm ist niedriger?",
    ordnen: "Leg die Stöcke vom kurzen zum langen!",
    stick: "Stock",
    tower: "Turm",
    things: { kuerbis: "Kürbis", kiesel: "Kiesel" },
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
      reihe10: "Zahlenreihe bis 10, vor und zurück",
      zaehlen20: "zählen bis 20",
      muster2: "Muster mit zwei Dingen fortsetzen",
      muster3: "Muster mit drei Dingen, Fehler finden",
      erster: "Erster, Zweiter, Letzter",
      vorher: "vorher und nachher",
      sortieren: "nach einem Merkmal sortieren",
      regel: "eine Regel finden: was passt nicht",
      vergleichen: "genau vergleichen",
      bildmerken: "ein Bild merken",
      lage1: "auf, unter, neben",
      lage2: "vor, hinter, zwischen",
      formen: "Formen erkennen",
      formen2: "Formen gedreht, groß und klein",
      laenger: "länger und kürzer",
      schwerer: "höher und schwerer",
      ordnen3: "drei Dinge der Größe nach ordnen",
    },
    stands: { zu: "noch nicht dran", neu: "neu", uebt: "übt", sicher: "sicher", lange: "lange sicher", wackelt: "wackelt" },
  },
};
