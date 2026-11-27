// Sätze der Idee "zahl" (die Wiese), Deutsch. Ein Schlüssel je `ask` eines Rezepts.
// v = die Werte der Aufgabe (und bei einer Antwort v.given), h = Helfer: h.w(3) = "drei", h.big("drei") = "Drei".
export default {
  zahl: {
    intro: {
      sehen: "Schau genau! Wie viele Blumen sind es?",
      machen: "Pflück Blumen in den Korb.",
      forschen: "Der Frosch hüpft über die Steine.",
      anwenden: "Mehr oder weniger? Dazu und weg.",
      pruefen: "Die Eule zählt. Stimmt das?",
    },

    sehen: {
      look: "Schau genau!",
      ask: (v) => (v.seen ? "Wie viele Blumen waren es?" : "Wie viele Blumen sind es?"),
      right: (v, h) => (v.n === 1 ? "Es ist eins." : `Es sind ${h.w(v.n)}.`),
      miss: "Schau noch einmal!",
      hint: "Zähl in Ruhe. Die Blumen bleiben da.",
    },

    machen: {
      ask: (v, h) => (v.n === 1 ? "Pflück eine Blume in den Korb!" : `Pflück ${h.w(v.n)} Blumen in den Korb!`),
      miss: (v, h) => (v.given === 0 ? "Der Korb ist noch leer. Tipp auf eine Blume!" : `Im Korb ${v.given === 1 ? "ist eins" : "sind " + h.w(v.given)}. Du brauchst ${h.w(v.n)}.`),
      right: (v, h) => `Im Korb ${v.n === 1 ? "ist eins" : "sind " + h.w(v.n)}. Genau richtig!`,
      hint: "Tipp auf eine Blume. Sie hüpft in den Korb.",
    },

    forschen: {
      ask: (v) => (v.back ? "Der Frosch hüpft zurück. Welche Zahl fehlt?" : "Welche Zahl fehlt?"),
      miss: (v, h) => (v.back ? `Rückwärts kommt nach ${h.w(v.before)} nicht ${h.w(v.given)}.` : `Nach ${h.w(v.before)} kommt nicht ${h.w(v.given)}.`),
      right: (v, h) => (v.back ? `Rückwärts: Nach ${h.w(v.before)} kommt ${h.w(v.answer)}.` : `Nach ${h.w(v.before)} kommt ${h.w(v.answer)}.`),
      hint: (v) => (v.back ? "Der Frosch hüpft zurück. Es ist immer einer weniger." : "Zähl die Punkte. Es ist immer einer mehr."),
    },

    ordnen: {
      ask: "Die Steine liegen durcheinander. Leg den Weg: die kleinste Zahl zuerst!",
      miss: (v, h) => (v.first ? "Such zuerst die kleinste Zahl." : `Nach ${h.w(v.prev)} kommt nicht ${h.w(v.chosen)}.`),
      right: (v, h) => `Der Weg ist fertig: von ${h.w(v.first)} bis ${h.w(v.last)}.`,
      hint: (v) => (v.next ? "Der leuchtende Stein kommt als Nächstes." : "Der leuchtende Stein hat die kleinste Zahl."),
    },

    vergleich: {
      ask: (v) => (v.ask === "more" ? "Wo sind mehr? Tipp darauf!" : "Wo sind weniger? Tipp darauf!"),
      miss: (v) => (v.given === "same" ? "Zähl nochmal. Sind es wirklich gleich viele?" : "Zähl beide Seiten."),
      right: (v, h) =>
        v.a === v.b
          ? `Auf beiden Seiten ${v.a === 1 ? "ist eins" : "sind " + h.w(v.a)}. Gleich viele!`
          : `${h.big(h.w(v.target))} sind ${v.ask === "more" ? "mehr" : "weniger"} als ${h.w(v.rest)}.`,
      hint: "Schau auf die Zahlen.",
    },

    dazu: {
      start: (v, h) => (v.n === 1 ? "Auf der Wiese ist ein Tier." : `Auf der Wiese sind ${h.w(v.n)} Tiere.`),
      change: (v, h) =>
        v.d > 0 ? (v.k === 1 ? "Eins kommt dazu." : `${h.big(h.w(v.k))} kommen dazu.`) : v.k === 1 ? "Eins geht weg." : `${h.big(h.w(v.k))} gehen weg.`,
      ask: "Wie viele sind es jetzt?",
      miss: (v, h) =>
        `${v.n === 1 ? "Es war eins" : "Es waren " + h.w(v.n)}, dann ${
          v.d > 0 ? (v.k === 1 ? "kam " : "kamen ") + h.w(v.k) + " dazu. Jetzt sind es mehr" : (v.k === 1 ? "ging " : "gingen ") + h.w(v.k) + " weg. Jetzt sind es weniger"
        } als ${h.w(v.n)}.`,
      right: (v, h) => `${h.big(h.w(v.n))} und ${h.w(v.k)} ${v.d > 0 ? "dazu" : "weg"}, das ${v.now === 1 ? "ist" : "sind"} ${h.w(v.now)}.`,
      hint: (v, h) =>
        v.d > 0
          ? v.k === 1 ? "Eins kam dazu. Zähl weiter: Es ist eins mehr." : `${h.big(h.w(v.k))} kamen dazu. Zähl weiter: Es sind ${h.w(v.k)} mehr.`
          : v.k === 1 ? "Eins ging weg. Es ist eins weniger." : `${h.big(h.w(v.k))} gingen weg. Es sind ${h.w(v.k)} weniger.`,
    },

    gleich: {
      ask: (v) => (v.how === "weg" ? "Mach beide Seiten gleich! Tipp auf ein Tier, dann geht es nach Hause." : "Mach beide Seiten gleich! Tipp auf das Haus, dann kommt ein Tier heraus."),
      miss: (v, h) => {
        const d = Math.abs(v.given - v.goal);
        return v.given > v.goal
          ? d === 1 ? "Auf deiner Seite ist eins zu viel." : `Auf deiner Seite sind ${h.w(d)} zu viel.`
          : d === 1 ? "Auf deiner Seite fehlt noch eins." : `Auf deiner Seite fehlen noch ${h.w(d)}.`;
      },
      right: (v, h) =>
        `${v.diff === 1 ? "Eins ist" : h.big(h.w(v.diff)) + " sind"} ${v.how === "weg" ? "nach Hause gegangen" : "herausgekommen"}. Jetzt ${
          v.goal === 1 ? "ist auf beiden Seiten eins" : "sind es auf beiden Seiten " + h.w(v.goal)
        }.`,
      hint: "Immer eins hier und eins dort gehören zusammen. Die hellen Tiere haben keinen Partner.",
    },

    pruefen: {
      ask: (v, h) => `Die Eule sagt: ${v.said === 1 ? "Das ist " + h.thing(v.thing).one : "Das sind " + h.w(v.said) + " " + h.thing(v.thing).many}. Stimmt das?`,
      miss: "Zähl nochmal nach!",
      fix: "Gut aufgepasst! Wie viele sind es?",
      fixMiss: "Noch nicht. Zähl nochmal!",
      right: (v, h) => (v.n === 1 ? "Ja! Es ist eins." : `Ja! Es sind ${h.w(v.n)}.`),
      fixed: (v, h) => (v.n === 1 ? "Jetzt stimmt es: Es ist eins." : `Jetzt stimmt es: Es sind ${h.w(v.n)}.`),
      hint: "Zähl mit: eins, zwei, drei …",
    },
  },
};
