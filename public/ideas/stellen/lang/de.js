// Sentences of the idea "stellen", Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/stellen/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"

export default {
  stellen: {
    intro: {
      sehen: "Sträuße und Blumen. Wie viele Blumen sind es?",
      machen: "Leg die Zahl mit Sträußen und Blumen.",
      forschen: "Eine Blume mehr, ein Strauß mehr. Was passiert?",
      anwenden: "Zehner und Einer. Welche Zahl ist das?",
      pruefen: "Die Eule hat gezählt. Stimmt das?",
    },
    bigger: "Das kannst du gut! Bald kommen größere Zahlen.",
    short: { h: "H", z: "Z", e: "E" },
    parts: ({ h, z, e }, num) =>
      h ? `${num(h)} Hunderter, ${num(z)} Zehner und ${num(e)} Einer` : `${num(z)} Zehner und ${num(e)} Einer`,
    label: {
      h: (k, v) => `${k} ${k === "1" ? "Korb" : "Körbe"}${v ? ` = ${v}` : ""}`,
      z: (k, v) => `${k} ${k === "1" ? "Strauß" : "Sträuße"}${v ? ` = ${v}` : ""}`,
      e: (k) => `${k} ${k === "1" ? "Blume" : "Blumen"}`,
    },
    miss: {
      swap: (z, z10) => `Die Sträuße zuerst: ${z} Sträuße sind ${z10} Blumen.`,
      counted: "In einem Strauß sind zehn Blumen, nicht eine.",
      ten: "Fast! Zähl die Sträuße noch einmal.",
      other: "Zähl erst die Sträuße in Zehnern: zehn, zwanzig, dreißig … Dann die Blumen dazu.",
    },
    sehen: {
      ask: "Wie viele Blumen sind es?",
      done: (n, parts) => `Es sind ${n}: ${parts}.`,
      hint: "Ein Strauß hat zehn Blumen. Zähl die Sträuße in Zehnern.",
    },
    machen: {
      question: (n) => `Leg ${n} Blumen!`,
      addH: "Einen Korb dazu",
      addZ: "Einen Strauß dazu",
      addE: "Eine Blume dazu",
      check: "Fertig",
      miss: (value, n) => `Das sind ${value}. Du brauchst ${n}.`,
      tie: "Zehn Blumen binden wir zu einem Strauß!",
      pack: "Zehn Sträuße kommen in einen Korb!",
      done: (n, parts) => `Genau ${n}: ${parts}.`,
      hint: "Die Tafel zeigt, wie viele Sträuße und Blumen du brauchst.",
    },
    forschen: {
      question: "Tipp auf + und −. Was passiert mit der Zahl?",
      opName: (op) =>
        ({ 1: "Eine Blume mehr.", "-1": "Eine Blume weniger.", 10: "Ein Strauß mehr.", "-10": "Ein Strauß weniger.", 100: "Ein Korb mehr.", "-100": "Ein Korb weniger." })[op],
      edge: "Das geht hier nicht. Probier etwas anderes!",
      more: "Probier noch mehr!",
      ready: "Weißt du, was passiert? Dann tipp auf die Lampe.",
      know: "Ich weiß es!",
      predict: (from, op) =>
        `Erst denken: ${from} und ${({ 1: "eine Blume mehr", "-1": "eine Blume weniger", 10: "ein Strauß mehr", "-10": "ein Strauß weniger", 100: "ein Korb mehr", "-100": "ein Korb weniger" })[op]}. Welche Zahl ist das?`,
      yes: (from, answer) => `Ja! Aus ${from} wird ${answer}.`,
      predictMiss: (from, answer) => `Schau: Aus ${from} wird ${answer}.`,
      done: "Du weißt, wie die Zahl wächst!",
      hintTry: "Tipp auf + 10 und schau, welche Ziffer sich ändert.",
      hint: (op) => (Math.abs(op) === 1 ? "Nur die Einer ändern sich, außer es werden zehn." : Math.abs(op) === 10 ? "Nur die Zehner ändern sich. Die Einer bleiben gleich." : "Nur die Hunderter ändern sich."),
    },
    anwenden: {
      build: (h, z, e, withH) => (withH ? `${h} Hunderter, ${z} Zehner und ${e} Einer. Welche Zahl ist das?` : `${z} Zehner und ${e} Einer. Welche Zahl ist das?`),
      swap: (h, z, e, withH) => (withH ? `${e} Einer, ${z} Zehner und ${h} Hunderter. Welche Zahl ist das?` : `${e} Einer und ${z} Zehner. Welche Zahl ist das?`),
      split: (n, ask) => `Wie viele ${({ h: "Hunderter", z: "Zehner", e: "Einer" })[ask]} hat ${n}?`,
      missSplit: (ask) =>
        ({ h: "Die Hunderter stehen ganz vorne.", z: "Die Zehner stehen vor den Einern.", e: "Die Einer stehen ganz hinten." })[ask],
      missOver: "Zehn Einer sind ein Zehner. Bündle sie!",
      doneSplit: (n, parts) => `${n} hat ${parts}.`,
      done: (n, parts) => `${big(String(n))}: ${parts}.`,
      hint: "Schau dir die Sträuße und Blumen an.",
      hintOver: "Aus zehn Blumen wird ein Strauß. Dann zähl die Sträuße.",
    },
    pruefen: {
      question: (said) => `Die Eule sagt: Das sind ${said} Blumen. Stimmt das?`,
      look: "Zähl nochmal: erst die Sträuße, dann die Blumen.",
      fix: "Gut aufgepasst! Wie viele sind es?",
      right: (n, parts) => `Ja! Es sind ${n}: ${parts}.`,
      fixed: (n, parts) => `Jetzt stimmt es: ${n}, das sind ${parts}.`,
      hint: "Jeder Strauß zählt zehn.",
    },
  },
};
