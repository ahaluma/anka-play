// Sätze der Idee "zehn" (Station Teich), Deutsch. Das Board (ideas/zehn/board.js) ruft sie mit Zahlwörtern auf.
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"
const SIDE = { left: "links", right: "rechts" };

export default {
  zehn: {
    intro: {
      machen: "Setz die Frösche auf die zwei Seerosen!",
      sehen: "Ein paar Frösche verstecken sich. Wie viele?",
      forschen: "Ein Frosch hüpft hinüber. Was bleibt gleich?",
      anwenden: "Welche Zahl fehlt?",
      pruefen: "Die Eule hat Frösche verteilt. Stimmt das?",
    },
    friends: (a, b, whole) => `${big(a)} und ${b} sind ${whole}.`,
    machen: {
      question: (whole, side, target, k) => `${big(whole)} Frösche. ${big(SIDE[side])} ${k === 1 ? "soll einer sitzen" : `sollen ${target} sitzen`}.`,
      allQuestion: (whole, ways) => `${big(whole)} Frösche auf zwei Seerosen. Finde ${ways} Arten, sie zu verteilen!`,
      how: "Tipp einen Frosch an, dann hüpft er hinüber.",
      hop: "Frosch hüpft hinüber",
      miss: (side, has, target, h, k) => `${big(SIDE[side])} ${h === 1 ? "sitzt einer" : `sitzen ${has}`}. ${k === 1 ? "Es soll einer sein." : `Es sollen ${target} sein.`}`,
      both: "Auf jeder Seerose soll ein Frosch sitzen.",
      again: "Das hast du schon. Probier eine andere Art!",
      more: (word, k) => (k === 1 ? "Gut! Noch eine Art." : `Gut! Noch ${word} Arten.`),
      allDone: (whole) => `Immer ${whole} Frösche, nur anders verteilt.`,
      hint: (side, target, k) => `Zähl ${SIDE[side]}. ${k === 1 ? "Es soll einer sein." : `Es sollen ${target} sein.`}`,
      hintAll: "Lass einen Frosch hinüberhüpfen, dann noch einen.",
    },
    sehen: {
      story: (whole) => `${big(whole)} Frösche sitzen auf den Seerosen.`,
      dive: "Ein paar tauchen unter das Blatt.",
      ask: (n, k) => `${k === 1 ? "Einen" : big(n)} siehst du. Wie viele sind versteckt?`,
      miss: (n, chosen, sum, whole) => `${big(n)} und ${chosen} sind ${sum}. Es sind aber ${whole} Frösche.`,
      hint: (whole) => `Hier sind ${whole} Plätze. Die leeren sind unter dem Blatt.`,
    },
    forschen: {
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
    anwenden: {
      and: "und",
      are: "sind",
      question: (n, whole) => `${big(n)} und wie viele sind ${whole}?`,
      miss: (n, chosen, sum, whole) => `${big(n)} und ${chosen} sind ${sum}, nicht ${whole}.`,
      hint: "Die leeren Plätze fehlen noch.",
    },
    pruefen: {
      says: (whole) => `Das sind ${whole}!`,
      question: (a, b, whole) => `Die Eule sagt: ${big(a)} und ${b} sind ${whole}. Stimmt das?`,
      look: (over) => (over ? "Zähl nach. Ist einer zu viel?" : "Zähl nach. Fehlt einer?"),
      isRight: (whole) => `Zähl nach. Es sind genau ${whole}.`,
      fix: (whole) => `Richtig, das stimmt nicht. Wie viele müssen rechts sitzen, damit es ${whole} sind?`,
      fixMiss: (a, chosen, sum, whole) => `${big(a)} und ${chosen} sind ${sum}, nicht ${whole}.`,
      hint: (whole) => `Alle ${whole} Plätze sollen voll sein, keiner übrig.`,
    },
  },
};
