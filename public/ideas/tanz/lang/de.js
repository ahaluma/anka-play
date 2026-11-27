// Sentences of the camp "tanz" (map berg), Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/tanz/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/de.js.
import B from "../../../boards/berg/lang/de.js";

// Lager 8 (tanz): Listen mit „und“, das abgesägte Schachbrett, Wochentage.
const tList = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} und ${xs.at(-1)}`);
const TCUT = { opposite: "Zwei gegenüberliegende Ecken werden abgesägt.", row: "Die beiden Ecken der obersten Reihe werden abgesägt.", neighbour: "Eine Ecke und das Feld daneben werden abgesägt.", one: "Eine Ecke wird abgesägt." };
const TDAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

export default {
  ...B,
  // ---------- Lager 8 am Denk-Berg: Paare bilden (welt/ideas/tanz/)
  tanz: {
    intro: {
      sehen: "Lager 8. Ein Tanzplatz auf der Alm. Wer findet einen Partner, wer bleibt übrig?",
      machen: "Bilde selbst Gruppen. Was übrig bleibt, verrät die Regel.",
      forschen: "Erst kleine Zahlen. Dann siehst du, was sich wiederholt.",
      anwenden: "Lichtschalter, Münzen, Schachbretter: überall Paare.",
      pruefen: "Die Eule rechnet alles aus. Manchmal reicht ein Blick auf gerade und ungerade.",
    },
    bigger: "Zu leicht? Jetzt tanzt das ganze Dorf.",
    smaller: "Okay, weniger Tänzer. Die Paare bleiben.",
    grew: "Logbuch: Gerade, ungerade und der Rest verraten mehr als die ganze Zahl.",
    choices: { yesno: ["Ja", "Nein"], light: ["an", "aus"], parity: ["gerade", "ungerade"], days: TDAYS },
    stories: {
      tanz: (a) => [`Beim Schulfest tanzen ${a.n} Kinder Paartanz. Immer zwei tanzen zusammen.`, "Findet jedes Kind einen Partner?"],
      licht: (a) => [`Das Licht im Flur ist aus. Mein kleiner Bruder drückt ${a.n}-mal auf den Schalter.`, "Ist das Licht jetzt an oder aus?"],
      summe: (a) => [`Ich zähle zusammen: ${a.nums.join(" + ")}.`, "Ist das Ergebnis gerade oder ungerade? Es geht auch ohne Ausrechnen."],
      bis: (a) => [`Ich zähle alle Zahlen von 1 bis ${a.n} zusammen: 1 + 2 + 3 + … + ${a.n}.`, "Ist das Ergebnis gerade oder ungerade?"],
      teams: (a) => [`${a.n} Kinder wollen Fußball spielen. Sie bilden Teams mit je ${a.k} Kindern.`, "Wie viele Kinder bleiben übrig?"],
      zug: (a) => [`${a.n} Kinder fahren mit dem Zug ins Schullandheim. In ein Abteil passen ${a.k} Kinder.`, "Wie viele Abteile brauchen sie mindestens?"],
      domino: (a) => [`Ein Schachbrett mit ${a.s} mal ${a.s} Feldern. ${TCUT[a.kind]} Ein Dominostein deckt genau zwei Felder ab, die nebeneinander liegen.`, "Kann man den Rest ganz mit Dominosteinen abdecken?"],
      muenzen: (a) => [`Auf dem Tisch liegen ${a.n} Münzen, ${a.h} davon zeigen Kopf. Bei jedem Zug drehst du genau 2 Münzen um.`, "Schaffst du es, dass alle Zahl zeigen?"],
      hoch: (a) => [`Ich rechne ${a.b} · ${a.b} · ${a.b} · … mit ${a.n} Zahlen ${a.b}. Die Zahl wird riesig.`, "Welche Ziffer steht ganz am Ende?"],
      reihen: (a) => [`Die Tanzgruppe stellt sich auf. In Reihen zu ${tList(a.ms)} bleiben immer ${a.rest} übrig. Es sind mehr als ${a.rest}.`, "Wie viele Tänzer sind es mindestens?"],
      eier: (a) => [`Oma packt ihre Eier. In Packungen zu ${tList(a.ms)} bleiben immer ${a.rest} übrig. In Packungen zu ${a.d} geht es genau auf.`, "Wie viele Eier sind es mindestens?"],
      proben: (a) => [`Die Tanzgruppe probt jeden ${a.k}. Tag. Die erste Probe ist an einem ${TDAYS[a.startKey]}.`, `An welchem Wochentag ist die ${a.m}. Probe?`],
    },
    units: { tanz: "", licht: "", summe: "", bis: "", teams: "Kinder", zug: "Abteile", domino: "", muenzen: "", hoch: "", reihen: "Tänzer", eier: "Eier", proben: "" },
    rules: {
      paar: "Bei einer geraden Zahl geht es in Paaren auf. Bei einer ungeraden bleibt einer übrig.",
      rest: "Teilen mit Rest. Die übrigen sind keine volle Gruppe, brauchen aber trotzdem Platz.",
      farbe: "Färben: Jeder Dominostein deckt ein dunkles und ein helles Feld. Von beiden müssen gleich viele übrig sein.",
      zyklus: "Die letzten Ziffern kommen immer wieder, spätestens nach 4 Schritten. Nur der Platz in dieser Runde zählt.",
      reste: "Bei allen bleibt derselbe Rest: Such eine Zahl, die durch alle geht. Dann den Rest dazu.",
      woche: "Alle 7 Tage kommt derselbe Wochentag. Ganze Wochen weg, nur der Rest zählt. Werkzeug aus Lager 5.",
    },
    hints: {
      paar: "Bilde Paare. Bleibt am Ende einer übrig?",
      rest: "Teil durch die Gruppengröße. Was bleibt übrig?",
      farbe: "Mal das Brett schwarz-weiß an. Wie viele dunkle und helle Felder sind noch da?",
      zyklus: "Schreib die letzte Ziffer für die ersten Schritte auf. Was fällt auf?",
      reste: "Zieh den Rest ab. In welche Zahl gehen alle Reihen auf?",
      woche: "Wie viele Tage liegen zwischen der ersten und der gesuchten Probe?",
    },
    miss: {
      paar: "Nicht ganz. Denk an Paare: Bleibt einer übrig?",
      rest: "Nicht ganz. Teilen mit Rest: Wie viele volle Gruppen, wie viele übrig?",
      farbe: "Nicht ganz. Zähl die dunklen und hellen Felder.",
      zyklus: "Nicht ganz. Die letzten Ziffern kommen nach 4 Schritten wieder.",
      reste: "Nicht ganz. Prüf deine Zahl: Bleibt bei jeder Reihe derselbe Rest?",
      woche: "Nicht ganz. Ganze Wochen weglassen, nur der Rest zählt.",
    },
    tables: { rest: ["Kinder", "übrig"], hoch: ["mal genommen", "Endziffer"] },
    tableIntro: {
      rest: (f, a) => `Teams mit je ${a.k} Kindern. Wie viele bleiben übrig?`,
      hoch: (f, a) => `Immer wieder mal ${a.b}. Welche Ziffer steht am Ende?`,
    },
    reasons: {
      parity: "Sie hat nicht auf gerade und ungerade geachtet.",
      rest: "Sie hat die übrigen vergessen.",
      groups: "Sie hat die Gruppen gezählt statt der übrigen.",
      other: "Sie hat gezählt, wie viele noch fehlen.",
      colors: "Sie hat nur die Felder gezählt, nicht die Farben.",
      cycle: "Sie hat sich im Kreis der Endziffern verzählt.",
      times: "Sie hat nur einmal malgenommen.",
      lcm: "Sie hat einfach alle malgenommen. Es geht kleiner.",
      week: "Sie hat sich bei den Wochen verzählt.",
    },
    tools: { paar: "Paare bilden", rest: "Teilen mit Rest", farbe: "Färben", zyklus: "Kreis der Endziffern", reste: "Gemeinsames Vielfaches", woche: "Wochen weglassen (Lager 5)", probe: "Probe", tabelle: "Tabelle", liste: "Aufschreiben" },
    ways: {
      tanz: (a) => [["paar", `${a.n} Kinder sind ${a.pairs} Paare, übrig bleiben ${a.left}. Antwort: ${a.answer}.`], ["probe", "Die Kinder abwechselnd links und rechts aufstellen: Sind beide Reihen gleich lang?"]],
      licht: (a) => [["paar", `Je zwei Drücke heben sich auf: ${a.pairs} Paare. Was übrig bleibt, entscheidet: ${a.answer}.`], ["tabelle", "1-mal: an, 2-mal: aus, 3-mal: an … ungerade heißt an."]],
      summe: (a) => [["paar", `Nur die ungeraden Zahlen zählen, es sind ${a.odd}. Zwei ungerade ergeben zusammen gerade. Also: ${a.answer}.`], ["probe", "Ausrechnen geht auch und zeigt dasselbe."]],
      bis: (a) => [["paar", `Von 1 bis ${a.n} sind ${a.odd} Zahlen ungerade. Also ist die Summe ${a.answer}.`], ["probe", "Mit Erster + Letzter aus Lager 5 ausrechnen und nachsehen."]],
      teams: (a) => [["rest", `${a.n} : ${a.k} = ${a.full} Rest ${a.rest}. Also bleiben ${a.rest} übrig.`], ["liste", `In ${a.k}er-Schritten zählen, bis es nicht mehr weitergeht.`]],
      zug: (a) => [["rest", `${a.n} : ${a.k} = ${a.full} Rest ${a.rest}. Die ${a.rest} brauchen auch ein Abteil: ${a.answer}.`], ["liste", `In ${a.k}er-Schritten zählen und jedes Abteil mitzählen.`]],
      domino: (a) => [["farbe", `Danach sind ${a.dark} dunkle und ${a.light} helle Felder übrig. Jeder Stein braucht eins von jeder Farbe. Antwort: ${a.answer}.`], ["probe", "Auf Karopapier ausprobieren."]],
      muenzen: (a) => [["paar", `Die Zahl der Köpfe ändert sich immer um 0 oder 2: gerade bleibt gerade, ungerade bleibt ungerade. Jetzt sind es ${a.h}, am Ende sollen es 0 sein. Antwort: ${a.answer}.`], ["probe", "Mit ein paar echten Münzen ausprobieren."]],
      hoch: (a) => [["zyklus", `Die Endziffern im Kreis: ${a.round.join(", ")}. Schritt ${a.n} ist im Kreis Platz ${a.place}: ${a.answer}.`], ["tabelle", "Tabelle: 1-mal, 2-mal, 3-mal, 4-mal, 5-mal … die Endziffern wiederholen sich."]],
      reste: (a) => [["reste", `${a.L} geht durch ${tList(a.ms)}. Dazu der Rest ${a.rest}, dann weiter in ${a.L}er-Schritten${a.d === "0" ? "" : `, bis es durch ${a.d} geht`}: ${a.answer}.`], ["liste", "Die Zahlen mit dem richtigen Rest aufschreiben und vergleichen."]],
      woche: (a) => [["woche", `Bis zur ${a.m}. Probe sind es ${a.later} Tage. Ganze Wochen weg, es bleiben ${a.rest}. ${a.rest} Tage nach ${TDAYS[a.startKey]}: ${a.answer}.`], ["liste", "Den Kalender durchgehen und jede Probe ankreuzen."]],
    },
    machen: {
      dancer: "Kind",
      text: (n, k) => `${n} Kinder auf der Tanzfläche. Bildet Gruppen mit je ${k}.`,
      ask: (k) => `Tipp ${k} Kinder nacheinander an, dann ist eine Gruppe fertig.`,
      made: (g) => `Gruppen: ${g}`,
      left: "Keine volle Gruppe mehr möglich. Wie viele Kinder bleiben übrig?",
      done: (g, r) => `${g} Gruppen, ${r} übrig.`,
      hint: "Tipp der Reihe nach an und zähl mit.",
    },
  },
};
