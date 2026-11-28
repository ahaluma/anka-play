// Sätze der Idee "zehn" (Station Teich), Deutsch. Das Board (ideas/zehn/board.js) ruft sie mit Zahlwörtern auf.
// So gesprochen, wie man mit einem Kind am Teich redet: ein Gedanke pro Satz, keine Fachwörter.
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"
const PAD = { left: "linke", right: "rechte" };
const frogs = (word, k) => (k === 1 ? "einen Frosch" : `${word} Frösche`);

export default {
  zehn: {
    intro: {
      machen: "Lass die Frösche hüpfen!",
      sehen: "Wie viele Frösche verstecken sich?",
      forschen: "Ein Frosch hüpft rüber.",
      anwenden: "Welche Zahl fehlt?",
      pruefen: "Hat die Eule richtig gezählt?",
    },
    friends: (a, b, whole) => `${big(a)} und ${b}, das sind ${whole}.`,
    machen: {
      question: (side, target, k) => `Setz ${frogs(target, k)} auf die ${PAD[side]} Seerose.`,
      how: "Tipp einen Frosch an. Hopp, er springt rüber.",
      hop: "Frosch springt rüber",
      miss: (has, target, h, k) => `Da ${h === 1 ? "sitzt einer" : `sitzen ${has}`}. Wir brauchen ${k === 1 ? "einen" : target}.`,
      hint: (side) => `Zähl die Frösche auf der ${PAD[side]}n Seerose.`,
      allQuestion: (whole) => `${big(whole)} Frösche. Wie können sie auf den zwei Seerosen sitzen?`,
      allHow: "Lass sie hüpfen. Dann tipp auf den Haken.",
      both: "Auf jeder Seerose soll ein Frosch sitzen.",
      again: "Das Bild haben wir schon. Mach es anders!",
      more: "Schön! Und wie noch?",
      allDone: (whole) => `Immer ${whole} Frösche. Sie sitzen nur anders.`,
      hintAll: "Lass einen Frosch rüberhüpfen. Dann noch einen.",
    },
    sehen: {
      story: (whole) => `Hier sitzen ${whole} Frösche.`,
      dive: "Platsch! Ein paar tauchen unter das Blatt.",
      ask: (n, k) => `${k === 1 ? "Einen" : big(n)} siehst du noch. Wie viele sind versteckt?`,
      miss: (n, chosen, sum, whole) => `${big(n)} und ${chosen}, das sind ${sum}. Es waren aber ${whole} Frösche.`,
      hint: () => "Jeder leere Platz ist ein Frosch unter dem Blatt.",
    },
    forschen: {
      story: (whole) => `Hier sitzen ${whole} Frösche.`,
      jump: { left: "Gleich hüpft ein Frosch nach links.", right: "Gleich hüpft ein Frosch nach rechts." },
      ask: { left: "Wie viele sitzen dann links?", right: "Wie viele sitzen dann rechts?" },
      more: "Einer kommt dazu. Dann sind es mehr.",
      onlyOneIn: "Es kommt nur einer dazu.",
      fewer: "Einer hüpft weg. Dann sind es weniger.",
      onlyOneOut: "Es hüpft nur einer weg.",
      done: (whole) => `Hier einer mehr, da einer weniger. Zusammen sind es immer noch ${whole}.`,
      hint: "Schau, wo der Frosch hinhüpft. Da wird es einer mehr.",
      hintShown: "Hier einer mehr, da einer weniger.",
    },
    anwenden: {
      and: "und",
      are: "sind",
      question: (n, whole) => `Hier sind ${n}. Wie viele fehlen noch bis ${whole}?`,
      miss: (n, chosen, sum, whole) => `${big(n)} und ${chosen}, das sind ${sum}. Wir wollen ${whole}.`,
      hint: "Zähl die leeren Plätze.",
    },
    pruefen: {
      says: (whole) => `Das sind ${whole}!`,
      question: (a, b, whole) => `Die Eule sagt: Hier sitzen ${whole} Frösche. Stimmt das?`,
      look: (over) => (over ? "Zähl noch mal. Ist einer zu viel?" : "Zähl noch mal. Fehlt einer?"),
      isRight: (whole) => `Zähl noch mal. Es sind genau ${whole}.`,
      fix: (whole) => `Stimmt, die Eule hat sich vertan! Es sollen ${whole} sein. Wie viele gehören nach rechts?`,
      fixMiss: (a, chosen, sum, whole) => `${big(a)} und ${chosen}, das sind ${sum}. Wir wollen ${whole}.`,
      hint: (whole) => `${big(whole)} Plätze. Alle sollen voll sein.`,
    },
  },
};
