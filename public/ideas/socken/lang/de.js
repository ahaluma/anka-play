// Sentences of the camp "socken" (map berg), Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/socken/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/de.js.
import B from "../../../boards/berg/lang/de.js";

// Lager 10 (socken): Farben in der Kiste, als Liste mit „und“.
const SCOL = { rot: "rote", blau: "blaue", gruen: "grüne", gelb: "gelbe", lila: "lila", schwarz: "schwarze" };
const sList = (colors, thing) => `${colors.map(([id, n]) => `${n} ${SCOL[id]}`).reduce((s, x, i, all) => (i === 0 ? x : i === all.length - 1 ? `${s} und ${x}` : `${s}, ${x}`), "")} ${thing}`;
const SEACH = (a) => [["jede", `Größtes Pech: erst alle ${a.others} von den anderen Farben, die seltenste zuletzt. Dann eine: ${a.answer}.`], ["probe", "Prüf mit der seltensten Farbe: Wenn sie ganz am Ende kommt, wie viele sind dann schon gezogen?"]];

export default {
  ...B,
  // ---------- Lager 10 am Denk-Berg: Der schlimmste Fall (welt/ideas/socken/)
  socken: {
    intro: {
      sehen: "Lager 10. Eine Sockenkiste, und das Licht ist aus. Wer sicher sein will, denkt an das größte Pech.",
      machen: "Ein Kobold sitzt in der Kiste und gibt dir immer die schlechteste Socke.",
      forschen: "Mehr Farben, mehr Pech. Wie viel mehr genau?",
      anwenden: "Bonbons, Geburtstage, Punkte: überall derselbe Kobold.",
      pruefen: "Die Eule hofft auf Glück. Wir rechnen mit Pech.",
    },
    bigger: "Zu leicht? Der Kobold wird jetzt richtig gemein.",
    smaller: "Okay, weniger Farben. Der Kobold bleibt.",
    grew: "Logbuch: Sicher heißt: Auch mit dem größten Pech klappt es.",
    stories: {
      socken: (a) => [`In der Kiste liegen ${sList(a.colors, "Socken")}. Es ist stockdunkel.`, `Wie viele Socken musst du mindestens ziehen, damit sicher ${a.k} von derselben Farbe dabei sind?`],
      bonbons: (a) => [`In der Tüte sind ${sList(a.colors, "Bonbons")}. Du greifst blind hinein.`, `Wie viele musst du mindestens nehmen, damit sicher ${a.k} von derselben Farbe dabei sind?`],
      murmeln: (a) => [`Im Beutel sind ${sList(a.colors, "Murmeln")}. Du kannst nicht hineinschauen.`, `Wie viele musst du mindestens ziehen, damit sicher ${a.k} gleichfarbige dabei sind?`],
      sockenjede: (a) => [`In der Kiste liegen ${sList(a.colors, "Socken")}. Es ist stockdunkel.`, "Wie viele musst du mindestens ziehen, damit sicher von jeder Farbe eine dabei ist?"],
      bonbonsjede: (a) => [`In der Tüte sind ${sList(a.colors, "Bonbons")}. Du greifst blind hinein.`, "Wie viele musst du mindestens nehmen, damit sicher von jeder Farbe eins dabei ist?"],
      zweirot: (a) => [`In der Kiste liegen ${sList(a.colors, "Socken")}. Es ist stockdunkel.`, `Wie viele musst du mindestens ziehen, damit sicher ${a.k} ${SCOL[a.want]} dabei sind?`],
      klasse: (a) => [`In einer Schule sind ${a.n} Kinder in der Theater-AG.`, "Wie viele haben mindestens im selben Monat Geburtstag? So viele sind es ganz sicher."],
      monate: (a) => [`Wir wollen ganz sicher ${a.k} Kinder finden, die im selben Monat Geburtstag haben.`, "Wie viele Kinder braucht man dafür mindestens?"],
      punkte: (a) => [`Ein Quadrat ist in ${a.s} mal ${a.s} kleine Quadrate geteilt. Du malst Punkte hinein.`, "Wie viele Punkte musst du malen, damit sicher zwei im selben kleinen Quadrat liegen?"],
      reste: (a) => [`Du schreibst Zahlen auf Karten und teilst jede durch ${a.m}.`, `Wie viele Karten brauchst du, damit sicher ${a.k} denselben Rest haben?`],
      farben: (a) => [`Eine Sockenkiste mit ${a.c} verschiedenen Farben, von jeder viele. Es ist dunkel.`, "Wie viele Socken musst du ziehen, damit sicher zwei gleiche dabei sind?"],
      gleich: (a) => [`Eine Kiste mit ${a.c} Farben, von jeder ganz viele. Es ist dunkel.`, `Wie viele musst du ziehen, damit sicher ${a.k} von derselben Farbe dabei sind?`],
    },
    units: { socken: "Socken", bonbons: "Bonbons", murmeln: "Murmeln", sockenjede: "Socken", bonbonsjede: "Bonbons", zweirot: "Socken", klasse: "Kinder", monate: "Kinder", punkte: "Punkte", reste: "Karten", farben: "Socken", gleich: "Socken" },
    rules: {
      schlimm: "Der schlimmste Fall: von jeder Farbe so viele wie möglich, ohne zu gewinnen. Dann noch eine, und es klappt sicher.",
      jede: "Im schlimmsten Fall kommen zuerst alle, die nicht helfen. Dann erst die, die du brauchst.",
      schubfach: "Mehr Dinge als Fächer: In ein Fach kommen mindestens zwei. Gleichmäßig verteilen, dann aufrunden.",
      rest: "Jede Zahl kommt in das Fach ihres Rests. Teilen durch m gibt m Fächer. Werkzeug aus Lager 8.",
    },
    hints: {
      schlimm: "Stell dir das größte Pech vor: Wie viele kannst du ziehen, ohne dass es klappt?",
      jede: "Welche kommen im schlimmsten Fall zuerst? Die, die dir nichts nützen.",
      schubfach: "Was sind hier die Fächer? Verteil so gleichmäßig wie möglich.",
      rest: "Wie viele verschiedene Reste gibt es beim Teilen durch diese Zahl?",
    },
    miss: {
      schlimm: "Nicht ganz. Rechne mit Pech: von jeder Farbe so viele wie möglich, dann eine mehr.",
      jede: "Nicht ganz. Erst kommen alle, die nicht helfen. Wie viele sind das?",
      schubfach: "Nicht ganz. Gleichmäßig auf die Fächer verteilen, dann aufrunden.",
      rest: "Nicht ganz. Jeder Rest ist ein Fach.",
    },
    tables: { farben: ["Farben", "Socken"], gleich: ["gleiche", "Socken"] },
    tableIntro: {
      farben: () => "Wie viele Socken braucht man, damit sicher zwei gleiche dabei sind? Bei 1, 2, 3 Farben:",
      gleich: (f) => `Eine Kiste mit ${f} Farben. Wie viele Socken für sicher 2, 3, 4 gleiche?`,
    },
    reasons: {
      best: "Sie hat mit Glück gerechnet, nicht mit dem schlimmsten Fall.",
      plusone: "Sie hat die eine entscheidende vergessen.",
      toomany: "Sie hat zu viele genommen. Weniger reichen schon sicher.",
      small: "Sie hat gedacht, die größte Farbe kommt zuletzt. Im schlimmsten Fall ist es die kleinste.",
      round: "Sie hat abgerundet statt aufgerundet.",
    },
    tools: { schlimm: "Der schlimmste Fall", jede: "Erst alles, was nicht hilft", schubfach: "Schubfächer", rest: "Reste als Fächer (Lager 8)", probe: "Probe", tabelle: "Tabelle", bild: "Ausprobieren" },
    ways: {
      schlimm: (a) => [["schlimm", `Größtes Pech: von jeder der ${a.c} Farben ${a.km1}, das sind ${a.worst} ohne Erfolg. Die nächste macht es sicher: ${a.answer}.`], ["schubfach", `Die Farben sind die Fächer. Mit ${a.answer} Socken muss ein Fach ${a.k} bekommen.`]],
      sockenjede: SEACH,
      bonbonsjede: SEACH,
      zweirot: (a) => [["jede", `Größtes Pech: erst alle ${a.others} anderen, dann ${a.k}. ${a.others} + ${a.k} = ${a.answer}.`], ["probe", "Mit Glück reichen weniger. Aber sicher ist es erst so."]],
      klasse: (a) => [["schubfach", `12 Monate sind 12 Fächer. ${a.n} : 12 = ${a.full} Rest ${a.rest}. Aufrunden: ${a.answer}.`], ["bild", "Verteil die Kinder so gleichmäßig wie möglich auf 12 Kästchen."]],
      monate: (a) => [["schubfach", `Größtes Pech: in jedem der 12 Monate ${a.km1}, das sind ${a.worst}. Das nächste Kind macht ${a.k}: ${a.answer}.`], ["schlimm", "Wie bei den Socken: Die Monate sind die Farben."]],
      punkte: (a) => [["schubfach", `${a.boxes} kleine Quadrate sind ${a.boxes} Fächer. Mit ${a.answer} Punkten liegen zwei zusammen.`], ["bild", "Male in jedes kleine Quadrat einen Punkt. Wohin kommt der nächste?"]],
      rest: (a) => [["rest", `Beim Teilen durch ${a.m} gibt es ${a.m} Reste. Größtes Pech: ${a.km1} für jeden Rest, das sind ${a.worst}. Dazu eine: ${a.answer}.`], ["schlimm", "Wie bei den Socken: Die Reste sind die Farben."]],
    },
    machen: {
      draw: "Ziehen",
      goblin: "Ein Kobold steckt drin und gibt dir immer das, was am wenigsten hilft.",
      ask: "Zieh, bis es klappt.",
      count: (n) => `Gezogen: ${n}`,
      got: "Geschafft! Mehr Pech geht nicht.",
      howMany: "Wie viele musstest du ziehen?",
      countAgain: "Zähl nach, was in deiner Hand liegt.",
      done: (n) => `Mit ${n} klappt es sicher, egal wie gemein der Kobold ist.`,
      hint: "Tipp auf Ziehen. Der Kobold wählt immer die Socke, die dir am wenigsten hilft.",
    },
  },
};
