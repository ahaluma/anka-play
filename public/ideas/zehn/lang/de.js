// Sätze/sentences of the idea "zehn", Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/zehn/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"

export default {
  zehn: {
    intro: {
      sehen: "Frösche sitzen auf den Seerosen. Wie viele Blätter sind frei?",
      machen: "Füll die Nusskiste ganz voll!",
      forschen: "Einer mehr hier, einer weniger dort. Was fehlt?",
      anwenden: "Welche Zahl macht voll?",
      pruefen: "Die Eule sagt zwei Zahlen. Machen sie voll?",
    },
    friends: (a, b, whole) => `${big(a)} und ${b} sind zusammen ${whole}.`,
    sehen: {
      story: (whole, n, nWord) => `Im Teich sind ${whole} Seerosenblätter. ${n === 1 ? "Ein Frosch sitzt" : big(nWord) + " Frösche sitzen"} darauf.`,
      ask: "Wie viele Blätter sind frei?",
      look: "Nochmal schauen",
      miss: (chosen, n, sum, whole) => `${big(n)} und ${chosen} sind ${sum}. Es sind aber ${whole} Blätter.`,
      rows: (five) => `Eine volle Reihe sind ${five}.`,
      hint: "Schau auf die Reihen. Die leeren Blätter sind frei.",
    },
    machen: {
      question: (whole, n) => `In die Kiste passen ${whole} Nüsse. ${n === "eins" ? "Eine ist" : big(n) + " sind"} schon drin. Nimm so viele, wie noch passen!`,
      paw: "Das hat das Eichhörnchen in der Hand",
      take: "Eine Nuss nehmen",
      back: "Nuss zurücklegen",
      pour: "Hinein!",
      tooFew: (k, word) => (k === 1 ? "Ein Loch ist noch frei. Nimm noch eine!" : `${big(word)} Löcher sind noch frei.`),
      tooMany: (k, word) => (k === 1 ? "Eine Nuss passt nicht mehr hinein." : `${big(word)} Nüsse passen nicht mehr hinein.`),
      hint: "Zähl die leeren Löcher.",
    },
    forschen: {
      question: "Schau die Reihen an. Welche Zahl fehlt?",
      questionTwenty: "Oben sind es zehn, unten zwanzig. Welche Zahl fehlt?",
      miss: (chosen) => `Mit ${chosen} wird es nicht voll.`,
      missTwenty: (n, chosen, sum) => `${big(n)} und ${chosen} sind ${sum}.`,
      done: (whole) => `Immer einer mehr und einer weniger. Zusammen bleibt es ${whole}.`,
      doneTwenty: (a, b, n) => `${big(a)} und ${b} sind zehn. Also sind ${n} und ${b} zwanzig.`,
      hint: "Eine Zahl wird größer, die andere kleiner.",
      hintRows: "Schau von Reihe zu Reihe: + 1 links, − 1 rechts.",
      hintTwenty: (a, n) => `Schau oben: Was braucht die ${a}? Die ${n} braucht genauso viele.`,
    },
    huepfen: {
      story: (whole) => `${big(whole)} Frösche sitzen auf zwei Seerosen.`,
      jump: { left: "Ein Frosch hüpft nach links.", right: "Ein Frosch hüpft nach rechts." },
      ask: { left: "Wie viele sitzen dann links?", right: "Wie viele sitzen dann rechts?" },
      more: "Einer kommt dazu. Dann sind es mehr.",
      onlyOneIn: "Es kommt nur einer dazu.",
      fewer: "Einer hüpft weg. Dann sind es weniger.",
      onlyOneOut: "Es hüpft nur einer weg.",
      done: (whole) => `Hier einer mehr, dort einer weniger. Zusammen bleiben es ${whole}.`,
      hint: "Schau, wo der Frosch landet: dort einer mehr. Wo er wegspringt: einer weniger.",
      hintShown: "Hier einer mehr, dort einer weniger.",
    },
    treppe: {
      question: (whole) => `Jeder Turm hat ${whole} Steine. Bau den Turm, der fehlt!`,
      stone: (n) => `Stein ${n}: bis hier rot`,
      miss: (red, blue, r, b) => (b === 0 ? `${big(red)} rote Steine passen nicht in die Treppe.` : `${big(red)} rote und ${blue} blaue Steine passen nicht in die Treppe.`),
      done: (whole, up) => `${up ? "Rot einer mehr, Blau einer weniger" : "Rot einer weniger, Blau einer mehr"}. Jeder Turm hat ${whole} Steine.`,
      hintUp: "Von Turm zu Turm: Rot einer mehr, Blau einer weniger.",
      hintDown: "Von Turm zu Turm: Rot einer weniger, Blau einer mehr.",
    },
    anwenden: {
      question: (n, whole) => `Welche Zahl macht die ${n} zur ${whole}?`,
      miss: (n, chosen, sum, whole) => `${big(n)} und ${chosen} sind ${sum}, nicht ${whole}.`,
      hint: "Die leeren Plätze fehlen noch.",
    },
    pruefen: {
      question: (a, b, whole) => `Die Eule sagt: ${big(a)} und ${b} machen ${whole}. Stimmt das?`,
      look: "Schau, ob noch ein Platz frei ist oder einer übrig bleibt.",
      fix: (a, whole) => `Richtig, das stimmt nicht. Welche Zahl macht die ${a} zur ${whole}?`,
      fixMiss: (whole) => `Noch nicht. Zusammen sollen es ${whole} sein.`,
      hint: (whole) => `Alle ${whole} Plätze sollen voll sein, keiner übrig.`,
    },
  },
};
