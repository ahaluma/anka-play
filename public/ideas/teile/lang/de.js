// Sätze/sentences of the idea "teile", Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/teile/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"

export default {
  teile: {
    intro: {
      sehen: "Tiere gehen in den Bau. Wie viele sind drinnen?",
      machen: "Leg alles auf die zwei Blätter. Es gibt viele Wege!",
      forschen: "Schüttel den Apfelbaum! Wie viele bleiben oben?",
      anwenden: "Schau gut hin, was passiert!",
      pruefen: "Die Eule sagt etwas. Stimmt das?",
    },
    together: (a, b, c) => `${big(a)} und ${b} sind zusammen ${c}.`,
    sehen: {
      // Die Geschichte in drei Schritten: alle sind da, manche gehen hinein, die Frage.
      all: (total, thing) => `Hier wohnen ${total} ${thing.many}.`,
      hide: "Husch! Manche gehen in den Bau.",
      ask: "Wie viele sind jetzt im Bau?",
      miss: (chosen, outside, sum, total) => `${big(chosen)} und ${outside} sind ${sum}. Es sind aber ${total}.`,
      hint: "Schau: So viele sind es zusammen. Wie viele fehlen?",
      denLabel: "Der Bau",
    },
    machen: {
      question: (total, thing) => `Leg ${total} ${thing.many} auf die zwei Blätter!`,
      another: "Geht es auch anders?",
      both: "Leg auf jedes Blatt etwas.",
      had: "Das hattest du schon. Mach es anders!",
      done: (a, b, c, d, total) => `${big(a)} und ${b}, oder ${c} und ${d}. Beides sind ${total}!`,
      hint: "Zieh es mit dem Finger auf ein Blatt.",
      hintMove: "Nimm eins weg. Leg es auf das andere Blatt.",
      leaf: "Blatt",
      basket: "Korb",
      check: "Fertig",
    },
    forschen: {
      // Shake the apple tree (board.js): all apples hang in the tree, some fall, the others stay up.
      question: (total) => `Am Baum hängen ${total} Äpfel. Wie viele sollen herunterfallen? Tipp auf eine Zahl.`,
      out: (n, m, wn, wm) => `${n === 1 ? "Einer fällt" : big(wn) + " fallen"} herunter. ${m === 1 ? "Einer bleibt" : big(wm) + " bleiben"} oben.`,
      more: "Probier eine andere Zahl!",
      know: "Ich weiß es!",
      ready: "Weißt du jetzt, wie viele oben bleiben? Dann tipp auf die Lampe.",
      predict: (x, wx) => `Erst denken: ${x === 1 ? "Einer fällt" : big(wx) + " fallen"} herunter. Wie viele bleiben oben?`,
      predictMiss: (y, wy) => `Schau: ${y === 1 ? "Einer bleibt" : big(wy) + " bleiben"} oben.`,
      rule: (x, y, total) => `Zusammen sind es immer ${total}: ${x} unten und ${y} oben.`,
      hint: "Tipp auf eine Zahl. So viele Äpfel fallen herunter.",
      hintPredict: "Die blassen Äpfel fallen gleich. Zähl die anderen.",
      tried: "Das hast du ausprobiert",
    },
    anwenden: {
      frogs: (total, n, known) =>
        [`${big(total)} Frösche sitzen im Schilf.`, `${n === 1 ? "Einer hüpft" : big(known) + " hüpfen"} auf das große Blatt.`, "Wie viele sind noch im Schilf?"],
      eggs: (total, n, known) =>
        [`Im Nest liegen ${total} Eier.`, `${n === 1 ? "Ein Küken schlüpft" : big(known) + " Küken schlüpfen"}.`, "Wie viele Eier sind noch zu?"],
      apples: (total, n, known) =>
        [`Am Baum hängen ${total} Äpfel.`, `${n === 1 ? "Einer fällt" : big(known) + " fallen"} ins Gras.`, "Wie viele hängen noch am Baum?"],
      hint: "Schau: So viele sind es zusammen. Wie viele fehlen?",
    },
    pruefen: {
      question: (a, b, said) => `Die Eule sagt: ${big(a)} und ${b} sind ${said}. Stimmt das?`,
      yes: "Stimmt",
      no: "Stimmt nicht",
      countAgain: "Zähl nochmal nach!",
      fix: "Gut aufgepasst! Wie viele sind es zusammen?",
      fixMiss: "Noch nicht. Zähl alle zusammen!",
      right: (a, b, c) => `Ja! ${big(a)} und ${b} sind ${c}.`,
      fixed: (a, b, c) => `Jetzt stimmt es: ${big(a)} und ${b} sind ${c}.`,
      hint: "Zähl beide Gruppen zusammen.",
    },
  },
};
