// Sentences of the camp "fels" (map berg), Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/fels/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/de.js.
import B from "../../../boards/berg/lang/de.js";

// Lager 9 (fels): wie viele Seiten eines kleinen Würfels bemalt sind.
const FK = { 0: "gar keine bemalte Seite", 1: "genau 1 bemalte Seite", 2: "genau 2 bemalte Seiten", 3: "genau 3 bemalte Seiten" };
const FFAN = (a) => (a.h === "1" ? "" : ` und ${a.h === "2" ? "eine Linie" : `${Number(a.h) - 1} Linien`} quer`);
const FQUAD = (a) => [["ordnung", `Nach Größe: ${a.bySize.join(" + ")} = ${a.answer}.`], ["bild", "Ein Quadrat aus Papier ausschneiden und über das Gitter schieben."]];

export default {
  ...B,
  // ---------- Lager 9 am Denk-Berg: Ordentlich zählen, im Kopf drehen (welt/ideas/fels/)
  fels: {
    intro: {
      sehen: "Lager 9. Ein Fels voller alter Zeichen. Wer sie zählen will, braucht Ordnung.",
      machen: "Such selbst. Aber der Reihe nach, sonst fehlt einer.",
      forschen: "Kleine Figuren zuerst. Dann siehst du, wie es wächst.",
      anwenden: "Uhren, Würfel, Papier: alles im Kopf drehen.",
      pruefen: "Die Eule zählt nur, was sie sofort sieht. Die großen versteckten vergisst sie.",
    },
    bigger: "Zu leicht? Die Zeichen weiter oben sind verwinkelter.",
    smaller: "Okay, einfachere Zeichen. Ordnung bleibt.",
    grew: "Logbuch: Wer der Reihe nach zählt, vergisst keinen.",
    stories: {
      faecher: (a) => [`Auf dem Fels ist ein großes Dreieck eingeritzt, mit Linien von der Spitze nach unten${FFAN(a)}.`, "Wie viele Dreiecke siehst du, große und kleine?"],
      zelt: (a) => [`Ein Zelt von vorn: Stangen von der Spitze bis zum Boden${FFAN(a)}.`, "Wie viele Dreiecke stecken darin, große und kleine?"],
      segel: (a) => [`Ein Segel mit Nähten von der Spitze nach unten${FFAN(a)}.`, "Wie viele Dreiecke findest du, große und kleine?"],
      fliesen: (a) => [`Ein Stück Fliesenboden, ${a.w} Fliesen breit und ${a.h} hoch.`, "Wie viele Quadrate siehst du, große und kleine?"],
      fenster: (a) => [`Ein Sprossenfenster mit ${a.w} mal ${a.h} Scheiben.`, "Wie viele Quadrate siehst du, große und kleine?"],
      schokolade: (a) => [`Eine Tafel Schokolade, ${a.w} Stücke breit und ${a.h} hoch.`, "Wie viele Quadrate kannst du am Stück herausbrechen, große und kleine?"],
      uhr: () => ["Im Spiegel siehst du die Uhr im Flur. Sie hat keine Zahlen, nur einen Punkt bei der 12. Der Minutenzeiger steht oben.", "Wie viel Uhr ist es wirklich?"],
      netz: (a) => ["Aus diesem Netz faltest du einen Würfel.", `Welche Zahl liegt dann gegenüber der ${a.x}?`],
      papier: (a) => [`Ich falte ein Blatt Papier ${a.folds}-mal in der Mitte. Dann steche ich ${a.holes === "1" ? "ein Loch" : `${a.holes} Löcher`} hinein, nicht am Rand.`, "Wie viele Löcher hat das Blatt, wenn ich es wieder auffalte?"],
      wuerfel: (a) => [`Ein großer Holzwürfel wird rundherum rot angemalt. Dann wird er in ${a.n} mal ${a.n} mal ${a.n} kleine Würfel zersägt.`, `Wie viele kleine Würfel haben ${FK[a.kKey]}?`],
      rechtecke: (a) => [`Ein Gitter mit ${a.w} mal ${a.h} Kästchen.`, "Wie viele Rechtecke gibt es darin? Quadrate zählen auch."],
      faechergross: (a) => [`Ein riesiges Dreieck auf dem Fels: ${a.rays} Linien laufen von der Spitze nach unten, unten sind ${a.m} kleine Dreiecke nebeneinander.`, "Wie viele Dreiecke gibt es insgesamt?"],
      quadratgross: (a) => [`Ein Schachbrett mit ${a.n} mal ${a.n} Feldern.`, "Wie viele Quadrate gibt es darin, große und kleine?"],
    },
    units: { faecher: "Dreiecke", zelt: "Dreiecke", segel: "Dreiecke", fliesen: "Quadrate", fenster: "Quadrate", schokolade: "Quadrate", uhr: "Uhr", netz: "", papier: "Löcher", wuerfel: "Würfel", rechtecke: "Rechtecke", faechergross: "Dreiecke", quadratgross: "Quadrate" },
    rules: {
      ordnung: "Ordentlich zählen: erst die kleinen, dann die größeren. Keins doppelt, keins vergessen.",
      spiegel: "Ein Spiegel tauscht links und rechts. Bei der Uhr: 12 minus die Stunde im Spiegel.",
      netz: "Im Kopf falten: In einer Reihe aus drei Feldern liegen das erste und das dritte gegenüber.",
      falten: "Jedes Falten verdoppelt die Lagen. Ein Loch wird beim Auffalten zu 2, 4, 8.",
      wuerfel: "Ecken haben 3 bemalte Seiten, Kanten 2, Flächen 1, das Innere keine.",
      haken: "Ein Rechteck braucht zwei senkrechte und zwei waagrechte Linien. Zähl die Paare in jede Richtung und nimm sie mal. Werkzeug aus Lager 2.",
    },
    hints: {
      ordnung: "Zähl erst die kleinsten, dann die nächstgrößeren. Oder: Welche zwei Linien bilden ein Dreieck?",
      spiegel: "Stell dir die Uhr von hinten vor. Wohin zeigt der Zeiger dann?",
      netz: "Such eine gerade Reihe aus drei Feldern. Das erste und das dritte liegen gegenüber.",
      falten: "Wie viele Lagen Papier liegen nach dem Falten übereinander?",
      wuerfel: "Wo sitzen die kleinen Würfel: an einer Ecke, an einer Kante, auf einer Fläche, innen?",
      haken: "Wähle zwei senkrechte Linien und zwei waagrechte. Wie viele Paare gibt es?",
    },
    miss: {
      ordnung: "Nicht ganz. Vergiss die großen nicht, die aus mehreren kleinen bestehen.",
      spiegel: "Nicht ganz. Im Spiegel ist links und rechts vertauscht.",
      netz: "Nicht ganz. Zwei Felder, die sich im Netz berühren, liegen nie gegenüber.",
      falten: "Nicht ganz. Jedes Falten verdoppelt.",
      wuerfel: "Nicht ganz. Denk an Ecken, Kanten, Flächen und das Innere.",
      haken: "Nicht ganz. Zähl die Paare von Linien in beide Richtungen und nimm mal.",
    },
    tables: { faecher: ["unten", "Dreiecke"], quadrate: ["Seite", "Quadrate"], kanten: ["Würfel je Seite", "mit 2 Farben"] },
    tableIntro: {
      faecher: () => "Dreiecke mit Linien von der Spitze: unten 1, 2, 3 kleine nebeneinander. Wie viele Dreiecke insgesamt?",
      quadrate: () => "Quadrate in Gittern: 1 mal 1, 2 mal 2, 3 mal 3. Wie viele Quadrate, große und kleine?",
      kanten: () => "Ein angemalter Würfel wird in kleine Würfel zersägt. Wie viele kleine haben genau 2 bemalte Seiten?",
    },
    reasons: {
      small: "Sie hat nur die kleinen gezählt.",
      size: "Sie hat nur eine Größe zusätzlich gezählt, nicht alle.",
      mirror: "Sie hat vergessen, dass der Spiegel links und rechts tauscht.",
      next: "Sie hat ein Feld genommen, das die Zahl berührt. Das liegt nie gegenüber.",
      fold: "Sie hat zusammengezählt statt zu verdoppeln.",
      corners: "Sie hat Ecken, Kanten und Flächen verwechselt.",
      lines: "Sie hat Linien nur in eine Richtung gezählt.",
      double: "Sie hat manche doppelt gezählt.",
    },
    tools: { ordnung: "Ordentlich zählen", spiegel: "Spiegeln", netz: "Im Kopf falten", falten: "Verdoppeln", wuerfel: "Ecken, Kanten, Flächen", haken: "Alle Paare (Lager 2)", tabelle: "Tabelle", probe: "Probe", bild: "Nachbauen" },
    ways: {
      ordnung: (a) => [["ordnung", `Jedes Dreieck hat zwei Linien von der Spitze. Von ${a.rays} Linien gibt es ${a.one} Paare${a.h === "1" ? "" : `, und jede Querlinie schließt sie: mal ${a.h}`}. Zusammen ${a.answer}.`], ["tabelle", `Nach Größe: ${a.small} kleine, dann die aus 2, aus 3 … bis zum großen.`]],
      fliesen: FQUAD,
      fenster: FQUAD,
      schokolade: FQUAD,
      uhr: (a) => [["spiegel", `Im Spiegel ist links und rechts vertauscht: 12 − ${a.shown} = ${a.answer} Uhr.`], ["bild", "Ein Blatt mit der Uhr gegen das Licht halten und von hinten anschauen."]],
      netz: (a) => [["netz", `Im Kopf falten: In einer geraden Reihe aus drei Feldern liegen die äußeren gegenüber. Gegenüber der ${a.x}: ${a.answer}.`], ["bild", "Das Netz abmalen, ausschneiden und falten."]],
      papier: (a) => [["falten", `${a.folds}-mal falten gibt ${a.layers} Lagen. ${a.holes} · ${a.layers} = ${a.answer} Löcher.`], ["bild", "Mit einem echten Blatt und einem Bleistift ausprobieren."]],
      wuerfel: (a) => [["wuerfel", `Ecken: 8 mit 3 Farben. Kanten: 12 · ${a.inner} mit 2. Flächen: 6 · ${a.inner} · ${a.inner} mit 1. Innen: ${a.inner} · ${a.inner} · ${a.inner} ohne. Gesucht: ${a.answer}.`], ["tabelle", "Tabelle mit kleinen Würfeln: 2, 3, 4 je Seite. Wie wächst es?"]],
      rechtecke: (a) => [["haken", `Senkrechte Linien: ${a.down}, davon ${a.pairsDown} Paare. Waagrechte: ${a.across}, davon ${a.pairsAcross} Paare. ${a.pairsDown} · ${a.pairsAcross} = ${a.answer}.`], ["ordnung", "Nach Größe zählen geht auch: 1 mal 1, 1 mal 2, … aber das dauert."]],
      faechergross: (a) => [["ordnung", `Zwei Linien von der Spitze machen ein Dreieck. ${a.rays} Linien haben ${a.answer} Paare.`], ["tabelle", "Tabelle: 1, 3, 6, 10 … es kommt jedes Mal eins mehr dazu."]],
      quadratgross: (a) => [["ordnung", `Nach Größe: ${a.n} · ${a.n} kleine, dann die 2er, 3er … bis zum großen. Zusammen ${a.answer}.`], ["tabelle", "Tabelle: 1, 5, 14, 30 … es kommen Quadratzahlen dazu."]],
    },
    machen: {
      ask: "Tipp zwei Buchstaben unten an. Das ist ein Dreieck. Finde alle!",
      found: (n) => `Gefunden: ${n}`,
      again: "Das hast du schon. Geh der Reihe nach: erst alle mit A, dann alle mit B …",
      done: (n) => `Alle ${n} gefunden!`,
      hint: "Der Reihe nach: AB, AC, AD … dann BC, BD … So fehlt keins.",
    },
  },
};
