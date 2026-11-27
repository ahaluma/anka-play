// Sentences of the camp "steine" (map berg), Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/steine/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/de.js.
import B from "../../../boards/berg/lang/de.js";

// Deutsche Texte für die neue Welt (Karte, Runde, die Idee "Teile").
// Zahlwörter und Namen der Dinge stehen in /shared/lang/de.js. a, b, c … = Zahlwörter ("drei").
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"

export default {
  ...B,
  // ---------- Lager 11 am Denk-Berg: Vom Ende her (welt/ideas/steine/)
  steine: {
    intro: {
      sehen: "Lager 11. Ein Steinhaufen, und die Eule will spielen. Wer gewinnt, denkt vom Ende her.",
      machen: "Spiel gegen die Eule. Sie spielt gut. Finde den Trick.",
      forschen: "Welche Haufen sind Fallen? Fang ganz klein an.",
      anwenden: "Kekse, Zählspiele, Schokolade: überall dasselbe Ende.",
      pruefen: "Die Eule nimmt gern viel auf einmal. Das ist nicht immer klug.",
    },
    bigger: "Zu leicht? Die Haufen werden größer, die Eule schlauer.",
    smaller: "Okay, kleinere Haufen. Der Trick bleibt.",
    grew: "Logbuch: Wer vom Ende her denkt, weiß schon am Anfang, wer gewinnt.",
    choices: { who: ["Ich, ich fange an", "Die Eule"] },
    stories: {
      steine: (a) => [`Vor dir liegen ${a.n} Steine. Du und die Eule nehmt abwechselnd 1 bis ${a.k} Steine. Wer den letzten nimmt, gewinnt. Du fängst an.`, "Wie viele Steine musst du jetzt nehmen, damit du sicher gewinnst?"],
      hoelzer: (a) => [`${a.n} Streichhölzer liegen auf dem Tisch. Abwechselnd nehmt ihr 1 bis ${a.k}. Wer das letzte nimmt, gewinnt. Du bist zuerst dran.`, "Wie viele musst du nehmen, damit du sicher gewinnst?"],
      kekse: (a) => [`Auf dem Teller liegen ${a.n} Kekse. Du und dein Bruder nehmt abwechselnd 1 bis ${a.k}. Wer den letzten bekommt, darf den Abwasch auslassen. Du fängst an.`, "Wie viele Kekse nimmst du zuerst, um sicher zu gewinnen?"],
      chili: (a) => [`In der Schale sind ${a.n} Bonbons. Das letzte ist ein Chili-Bonbon! Abwechselnd nehmt ihr 1 bis ${a.k}. Wer das letzte nehmen muss, verliert. Du fängst an.`, "Wie viele nimmst du zuerst, damit die Eule das Chili-Bonbon bekommt?"],
      zaehlen: (a) => [`Ein Zählspiel: Ihr fangt bei 0 an. Abwechselnd zählt jeder 1 bis ${a.k} dazu und sagt die neue Zahl. Wer ${a.T} sagt, gewinnt. Du fängst an.`, "Welche Zahl musst du als erste sagen, um sicher zu gewinnen?"],
      zwei: (a) => [`Zwei Steinhaufen: ${a.x} und ${a.y} Steine. Wer dran ist, nimmt beliebig viele, aber nur von einem Haufen. Wer den letzten nimmt, gewinnt. Du fängst an.`, "Wie viele Steine nimmst du zuerst, um sicher zu gewinnen?"],
      schokolade: (a) => [`Eine Tafel Schokolade mit ${a.m} mal ${a.n} Stücken. Bei jedem Bruch brichst du ein Stück entlang einer Linie in zwei Teile.`, "Wie viele Brüche brauchst du, bis alles einzelne Stücke sind?"],
      schokower: (a) => [`Eine Tafel Schokolade mit ${a.m} mal ${a.n} Stücken. Du und die Eule brecht abwechselnd ein Stück in zwei Teile. Wer den letzten Bruch macht, gewinnt. Du fängst an.`, "Wer gewinnt?"],
      fallen: (a) => [`Jetzt liegen ${a.n} Steine da. Ihr nehmt 1 bis ${a.k}, wer den letzten nimmt, gewinnt. Du fängst an.`, "Wie viele nimmst du, damit die Eule in einer Falle sitzt?"],
    },
    units: { steine: "", hoelzer: "", kekse: "", chili: "", zaehlen: "", zwei: "", schokolade: "Brüche", schokower: "", fallen: "" },
    rules: {
      falle: `Vom Ende her: Wer vor k + 1 Steinen dran ist, verliert. Also auch vor dem Doppelten, dem Dreifachen … Lass der Eule immer so einen Haufen.`,
      letzter: "Wenn der letzte verliert: Lass der Eule genau 1, oder 1 mehr als eine Fallen-Zahl.",
      zaehlen: "Vom Ende her: Wer das Ziel sagt, gewinnt. Also gewinnt auch, wer k + 1 davor sagt, und so weiter bis ganz nach unten.",
      gleich: "Zwei Haufen: Mach sie gleich groß. Dann mach immer nach, was die Eule macht, nur auf dem anderen Haufen.",
      brueche: "Jeder Bruch macht aus einem Stück zwei. Von 1 Stück bis m · n Stücke sind es m · n − 1 Brüche, ganz egal wie.",
      paar: "Die Zahl der Brüche steht fest. Ist sie ungerade, macht der Erste den letzten. Werkzeug aus Lager 8.",
    },
    hints: {
      falle: "Mit wie vielen Steinen ist man verloren, wenn man dran ist? Fang bei ganz wenigen an.",
      letzter: "Wer vor nur 1 Stein steht, verliert. Wie viele sind noch eine Falle?",
      zaehlen: "Wer das Ziel sagen kann, gewinnt. Welche Zahl davor ist sicher?",
      gleich: "Was passiert, wenn beide Haufen gleich groß sind und die Eule dran ist?",
      brueche: "Zähl nicht die Linien. Zähl, wie viele Stücke jeder Bruch mehr macht.",
      paar: "Wie viele Brüche gibt es insgesamt? Gerade oder ungerade?",
    },
    miss: {
      falle: "Nicht ganz. Lass der Eule eine Fallen-Zahl: ein Vielfaches von k + 1.",
      letzter: "Nicht ganz. Diesmal muss die Eule am Ende vor genau 1 stehen.",
      zaehlen: "Nicht ganz. Rechne vom Ziel in Schritten von k + 1 zurück.",
      gleich: "Nicht ganz. Mach beide Haufen gleich groß.",
      brueche: "Nicht ganz. Jeder Bruch macht genau ein Stück mehr.",
      paar: "Nicht ganz. Zähl die Brüche und schau, ob die Zahl gerade ist.",
    },
    tables: { fallen: ["Falle Nummer", "Steine"] },
    tableIntro: { fallen: (f, a) => `Ihr nehmt 1 bis ${a.k}. Bei welchen Haufen verliert, wer dran ist? Das sind Fallen:` },
    reasons: {
      greedy: "Sie hat einfach so viele genommen wie möglich.",
      kplus: "Sie hat in Schritten von k gerechnet statt von k + 1.",
      last: "Sie hat vergessen, dass hier der letzte verliert.",
      equal: "Sie hat die Haufen nicht gleich groß gemacht.",
      breaks: "Sie hat Stücke oder Linien gezählt statt Brüche.",
      parity: "Sie hat nicht geprüft, ob die Zahl der Brüche gerade ist.",
    },
    tools: { falle: "Fallen vom Ende her", letzter: "Der letzte verliert", zaehlen: "Zielzahlen rückwärts", gleich: "Gleich machen, nachmachen", brueche: "Ein Bruch, ein Stück mehr", paar: "Gerade oder ungerade (Lager 8)", tabelle: "Tabelle", probe: "Probe", bild: "Spielen" },
    ways: {
      falle: (a) => [["falle", `Fallen sind ${a.k1}, das Doppelte, das Dreifache … Die nächste unter ${a.n} ist ${a.trap}. Also ${a.n} − ${a.trap} = ${a.answer} nehmen.`], ["tabelle", `Tabelle: 1 bis ${a.k} Steine gewinnt man sofort, ${a.k1} verliert man. Danach wiederholt es sich.`], ["probe", `Probe: Nimmt die Eule danach x, nimm du ${a.k1} − x. So bleibt sie in der Falle.`]],
      letzter: (a) => [["letzter", `Die Eule soll vor 1 Stein stehen, oder vor 1 + ${a.k1}, 1 + 2 · ${a.k1} … Die nächste unter ${a.n} ist ${a.trap}. Also ${a.answer} nehmen.`], ["probe", "Spiel es mit ein paar Steinen durch."]],
      zaehlen: (a) => [["zaehlen", `Vom Ziel ${a.T} zurück in ${a.k1}er-Schritten: …, ${a.next}, ${a.answer}. Sag ${a.answer}, dann immer bis zur nächsten.`], ["tabelle", "Schreib die Gewinnzahlen von oben nach unten auf."]],
      gleich: (a) => [["gleich", `Mach die Haufen gleich: ${a.big} − ${a.small} = ${a.answer} vom großen nehmen. Dann mach der Eule alles nach.`], ["probe", "Mit zwei kleinen Haufen ausprobieren: 1 und 1, 2 und 2 …"]],
      brueche: (a) => [["brueche", `Jeder Bruch macht ein Stück mehr. Von 1 bis ${a.pieces} Stücken: ${a.pieces} − 1 = ${a.answer} Brüche.`], ["bild", "Eine kleine Tafel aus Papier wirklich zerbrechen und zählen."]],
      paar: (a) => [["paar", `Es gibt immer ${a.pieces} − 1 = ${a.breaks} Brüche, egal wie. Ich mache Bruch 1, 3, 5 … Antwort: ${a.answer}.`], ["brueche", "Ein Bruch, ein Stück mehr: Die Zahl der Brüche steht vorher fest."]],
    },
    machen: {
      take: (n) => `${n} nehmen`,
      rules: (a) => `${a.n} Steine. Du und die Eule nehmt abwechselnd 1 bis ${a.k}. Wer den letzten nimmt, gewinnt. Du fängst an.`,
      ask: "Wie viele nimmst du?",
      start: (n) => `Noch ${n} Steine.`,
      moves: (j, o, n) => `Du nimmst ${j}, die Eule ${o}. Noch ${n}.`,
      youWin: "Du hast den letzten! Gewonnen.",
      owlWins: "Die Eule hat den letzten. Noch mal von vorn!",
      won: (a) => `Der Trick: Lass der Eule immer ein Vielfaches von ${a.k1}.`,
      hint: (a) => `Lass der Eule ${a.k1} Steine, oder das Doppelte, oder das Dreifache …`,
    },
  },
};
