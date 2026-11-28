// Sentences of the idea "plan" (plans, ways and scale), Deutsch. The board calls them with numbers already in the
// digits of the language.

export default {
  plan: {
    intro: {
      sehen: "Wo ist es auf dem Plan?",
      machen: "Bring die Ente zum Nest.",
      forschen: "Wo kommt die Ente an?",
      anwenden: "Wie weit ist es in echt?",
      pruefen: "Die Eule liest den Plan. Stimmt das?",
    },
    things: { duck: "die Ente", tree: "der Baum", house: "das Haus", flower: "die Blume", bench: "die Bank", well: "der Brunnen" },
    dirs: { up: "nach oben", down: "nach unten", left: "nach links", right: "nach rechts" },
    hint: "Erst der Buchstabe oben, dann die Zahl an der Seite.",
    swap: "Buchstabe und Zahl sind vertauscht. Der Buchstabe steht oben, die Zahl an der Seite.",
    sehen: {
      ask: (thing) => `Wo ist ${thing}? Welches Feld?`,
      miss: "Geh von dem Ding nach oben zum Buchstaben und nach links zur Zahl.",
      done: (thing, name) => `Ja: ${thing[0].toUpperCase() + thing.slice(1)} ist auf ${name}.`,
    },
    machen: {
      ask: "Bau einen Weg aus Pfeilen. Dann tipp auf ▶.",
      askStones: "Bau einen Weg aus Pfeilen um die Steine herum. Dann tipp auf ▶.",
      empty: "Noch kein Pfeil",
      go: "Los",
      notThere: "Die Ente ist noch nicht am Nest. Zähl die Felder bis zum Nest.",
      bump: "Bumm! Da ist ein Stein oder der Rand. Such einen anderen Weg.",
      hint: "Ein Pfeil ist ein Feld weit. Zähl erst nach rechts oder links, dann nach oben oder unten.",
      doneShort: (n) => `Geschafft, mit ${n} Schritten. Kürzer geht es nicht.`,
      done: (n, best) => `Geschafft, mit ${n} Schritten. Es geht sogar mit ${best}.`,
    },
    forschen: {
      ask: "Die Ente geht diese Pfeile. Wo kommt sie an? Tipp auf das Feld.",
      miss: "Geh die Pfeile mit dem Finger nach, einen nach dem anderen.",
      hint: "Jeder Pfeil ist ein Feld weit.",
      done: (name) => `Ja, sie kommt auf ${name} an.`,
    },
    anwenden: {
      scale: (s) => `1 Kästchen = ${s} m`,
      askSteps: (a, b) => `Wie viele Kästchen sind es von ${a} bis zu ${b}?`,
      ask: (a, b) => `Wie viele Meter sind es in echt von ${a} bis zu ${b}?`,
      askSquares: (a, b, m) => `In echt sind es ${m} m. Wie viele Kästchen sind es auf dem Plan? Zähl nach.`,
      miss: "Zähl die Kästchen zwischen den beiden genau.",
      missScale: "Das sind die Kästchen. Ein Kästchen ist in echt länger.",
      hintSteps: "Zähl die Schritte von einem zum anderen.",
      hint: (s) => `Zähl die Kästchen. Jedes ist in echt ${s} m.`,
      doneSteps: (n) => `Ja, ${n} Kästchen.`,
      done: (k, s, n) => `${k} Kästchen mal ${s} m sind ${n} m.`,
      doneSquares: (m, n) => `Ja: ${n} Kästchen sind in echt ${m} m.`,
    },
    pruefen: {
      ask: (thing, name) => `Die Eule sagt: ${thing[0].toUpperCase() + thing.slice(1)} ist auf ${name}. Stimmt das?`,
      look: "Lies selbst: erst der Buchstabe oben, dann die Zahl an der Seite.",
      near: "Sie hat ein Feld daneben gelesen.",
      fix: (why) => `Gut aufgepasst! ${why} Welches Feld ist es?`,
    },
  },
};
