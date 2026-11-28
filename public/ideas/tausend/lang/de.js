// Sentences of the idea "tausend" (big numbers in the place-value table), Deutsch. The board calls them with numbers
// already written in the digits of the language, in groups of three.

export default {
  tausend: {
    intro: {
      sehen: "Welche Zahl steht in der Stellentafel?",
      machen: "Leg die Zahl mit Plättchen.",
      forschen: "Ein Plättchen mehr oder weniger: Welche Zahl entsteht?",
      anwenden: "Große Zahlen: weiter, zurück, vergleichen.",
      pruefen: "Die Eule liest die Stellentafel. Stimmt das?",
    },
    // the columns, biggest place first: Hunderttausender, Zehntausender, Tausender, Hunderter, Zehner, Einer
    places: ["HT", "ZT", "T", "H", "Z", "E"],
    hint: "Jede Spalte ist eine Stelle. Zähl die Plättchen in jeder Spalte und schreib die Ziffern von links nach rechts.",
    zeroMiss: "Eine Spalte ist leer. Für eine leere Stelle schreibt man 0.",
    sehen: {
      ask: "Welche Zahl ist das?",
      miss: "Zähl die Plättchen Spalte für Spalte, von links nach rechts.",
      done: (n) => `Das ist ${n}.`,
    },
    machen: {
      ask: (n) => `Leg ${n} mit Plättchen. Tipp auf + und −.`,
      more: "Ein Plättchen dazu",
      less: "Ein Plättchen weg",
      check: "Fertig",
      ten: "Zehn Plättchen in einer Spalte sind ein Plättchen in der nächsten Spalte.",
      full: "Größer geht diese Tafel nicht.",
      miss: (place) => `Schau auf die Spalte ${place}: Stimmt die Zahl der Plättchen?`,
      hint: "Jede Ziffer sagt, wie viele Plättchen in ihre Spalte kommen. Bei 0 bleibt die Spalte leer.",
      done: (n) => `Das ist ${n}.`,
    },
    forschen: {
      more: (place) => `In die Spalte ${place} kommt ein Plättchen dazu. Welche Zahl entsteht?`,
      less: (place) => `Aus der Spalte ${place} geht ein Plättchen weg. Welche Zahl entsteht?`,
      miss: (place) => `Nur die Spalte ${place} ändert sich, um eins.`,
      across: "Zehn Plättchen in einer Spalte werden zu einem in der nächsten. Und wenn eine Spalte leer ist, tauscht man ein Plättchen von links in zehn.",
      hint: "Nur eine Ziffer ändert sich, außer eine Spalte wird voll oder leer.",
      done: (a, b) => `Aus ${a} wird ${b}.`,
    },
    anwenden: {
      after: (n) => `Welche Zahl kommt nach ${n}?`,
      before: (n) => `Welche Zahl kommt vor ${n}?`,
      plus: (n, step) => `Rechne ${n} + ${step}.`,
      miss: "Denk an die Stellentafel: Welche Spalte ändert sich? Wird sie voll, geht es in der nächsten weiter.",
      hint: "Schau auf die Stelle, die sich ändert. Nach 9 kommt 0, und die Stelle links wird eins größer.",
      done: (n) => `Es ist ${n}.`,
      bigger: "Welche Zahl ist größer?",
      biggerMiss: "Vergleiche von links nach rechts. Die erste Ziffer, die anders ist, entscheidet.",
      biggerHint: "Beide Zahlen haben gleich viele Stellen. Vergleiche Stelle für Stelle von links.",
      biggerDone: (n) => `${n} ist größer.`,
    },
    why: {
      gap: "Sie hat die leere Spalte vergessen. Für eine leere Stelle schreibt man 0.",
      swap: "Sie hat zwei Ziffern vertauscht.",
    },
    pruefen: {
      ask: (said) => `Die Eule sagt: Das ist ${said}. Stimmt das?`,
      look: "Lies selbst, Spalte für Spalte.",
      fix: (why) => `Gut aufgepasst! ${why} Welche Zahl ist es wirklich?`,
      fixMiss: "Jede Spalte bekommt eine Ziffer, auch die leere.",
      hint: "Die Eule vergisst gern die leeren Spalten.",
    },
  },
};
