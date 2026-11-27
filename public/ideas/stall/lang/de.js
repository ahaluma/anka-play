// Sentences of the camp "stall" (map berg), Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/stall/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/de.js.
import B from "../../../boards/berg/lang/de.js";

// Lager 7 (stall): die kleine und die große Sorte, und was man zählt.
const SSMALL = { stall: "Hühner", fahrrad: "Fahrräder", tische: "Vierertische", boote: "Zweierboote", spinnen: "Käfer", muenzen: "2-Euro-Stücke", gewicht: "Hühner" };
const SBIG = { stall: "Ziegen", fahrrad: "Dreiräder", tische: "Sechsertische", boote: "Viererboote", spinnen: "Spinnen", muenzen: "5-Euro-Stücke", gewicht: "Ziegen" };
const SWHAT = { stall: "Beine", fahrrad: "Räder", tische: "Stühle", boote: "Plätze", spinnen: "Beine", muenzen: "Euro", gewicht: "kg", quiz: "Punkte", drei: "Beine" };

export default {
  ...B,
  // ---------- Lager 7 am Denk-Berg: Annehmen und verbessern (welt/ideas/stall/)
  stall: {
    intro: {
      sehen: "Lager 7. Ein Stall voller Tiere, und alle laufen durcheinander. Zählen geht nicht. Annehmen geht.",
      machen: "Erst sind alle gleich. Dann tauschst du, bis es passt.",
      forschen: "Null getauscht, einer getauscht, zwei getauscht. Was passiert jedes Mal?",
      anwenden: "Andere Dinge, derselbe Trick: erst annehmen, dann verbessern.",
      pruefen: "Die Eule schätzt. Wir prüfen.",
    },
    bigger: "Zu leicht? Jetzt wird der Stall richtig voll.",
    smaller: "Okay, weniger Tiere. Der Trick bleibt.",
    grew: "Logbuch: Wer klug annimmt, muss nicht raten.",
    what: SWHAT,
    stories: {
      stall: (a) => [`Im Stall sind Hühner und Ziegen. Zusammen haben sie ${a.n} Köpfe und ${a.total} Beine.`, "Wie viele Ziegen sind es?"],
      fahrrad: (a) => [`Im Schulhof stehen Fahrräder und Dreiräder, zusammen ${a.n} Stück mit ${a.total} Rädern.`, "Wie viele Dreiräder sind es?"],
      tische: (a) => [`Im Restaurant gibt es ${a.n} Tische, manche mit 4 Stühlen, manche mit 6. Zusammen sind es ${a.total} Stühle.`, "Wie viele Tische haben 6 Stühle?"],
      boote: (a) => [`Am See liegen ${a.n} Boote, Zweier und Vierer. Alle sind voll besetzt: ${a.total} Kinder sind auf dem Wasser.`, "Wie viele Viererboote sind es?"],
      spinnen: (a) => [`In der Forscherbox sind Käfer mit 6 Beinen und Spinnen mit 8 Beinen, zusammen ${a.n} Tiere mit ${a.total} Beinen.`, "Wie viele Spinnen sind es?"],
      muenzen: (a) => [`In meiner Spardose sind ${a.n} Münzen, nur 2-Euro- und 5-Euro-Stücke. Zusammen sind es ${a.total} Euro.`, "Wie viele 5-Euro-Stücke sind es?"],
      quiz: (a) => [`Beim Quiz gibt es ${a.n} Fragen. Richtig gibt 5 Punkte, falsch kostet 2 Punkte. Ich habe alle beantwortet und ${a.total} Punkte.`, "Wie viele Fragen hatte ich richtig?"],
      drei: (a) => [`Im Hof laufen Hühner, Enten und Ziegen herum: ${a.n} Köpfe und ${a.total} Beine. ${a.d} davon sind Enten.`, "Wie viele Hühner sind es?"],
      gewicht: (a) => [`Im Stall stehen ${a.n} Tiere: Hühner mit je 2 kg und Ziegen mit je ${a.vb} kg. Zusammen wiegen sie ${a.total} kg.`, "Wie viele Ziegen sind es?"],
    },
    units: { stall: "Ziegen", fahrrad: "Dreiräder", tische: "Tische", boote: "Boote", spinnen: "Spinnen", muenzen: "Stück", quiz: "richtig", drei: "Hühner", gewicht: "Ziegen" },
    rules: {
      annehmen: "Annehmen: alle sind von der kleinen Sorte. Was fehlt, geteilt durch den Unterschied, ergibt die große Sorte.",
      drei: "Hühner und Enten haben gleich viele Beine: erst wie eine Sorte zählen, dann die Enten abziehen.",
      quiz: "Annehmen: alles richtig. Jede falsche Antwort kostet 5 + 2 = 7 Punkte.",
      waage: "Dasselbe mit Gewichten: alle leicht annehmen, der Rest geteilt durch den Unterschied. Werkzeug aus Lager 6.",
    },
    hints: {
      annehmen: "Stell dir vor, alle sind von der kleinen Sorte. Wie viel fehlt dann noch? Wie viel bringt ein Tausch?",
      drei: "Hühner und Enten haben beide 2 Beine. Zähl sie erst zusammen.",
      quiz: "Wie viele Punkte wären es, wenn alles richtig wäre? Wie viel kostet eine falsche Antwort wirklich?",
      waage: "Stell dir vor, alle sind Hühner. Wie viele kg fehlen? Wie viel schwerer ist eine Ziege?",
    },
    miss: {
      annehmen: "Nicht ganz. Erst alle klein annehmen, dann den Rest durch den Unterschied teilen.",
      drei: "Nicht ganz. Erst die Ziegen finden, dann die Enten von den Vögeln abziehen.",
      quiz: "Nicht ganz. Eine falsche Antwort kostet 7 Punkte gegenüber einer richtigen.",
      waage: "Nicht ganz. Erst alle leicht annehmen, dann den Rest durch den Unterschied teilen.",
    },
    tables: { tausch: (a) => [SBIG[a.kind], SWHAT[a.kind]] },
    tableIntro: { tausch: (f, a) => `Stell dir vor, alle ${a.n} sind ${SSMALL[a.kind]}. Dann tauschst du eins nach dem anderen:` },
    reasons: {
      other: "Sie hat die andere Sorte gezählt.",
      divide: "Sie hat vergessen, durch den Unterschied zu teilen.",
      base: "Sie hat einfach geteilt, als wären alle von der großen Sorte.",
      minus: "Sie hat vergessen, dass eine falsche Antwort Punkte kostet.",
      ducks: "Sie hat die Enten mitgezählt.",
      half: "Sie hat einfach die Hälfte genommen.",
    },
    tools: { annehmen: "Annehmen und verbessern", drei: "Gleiches zusammenfassen", quiz: "Alles richtig annehmen", waage: "Mit Gewicht (Lager 6)", tabelle: "Tabelle", probe: "Probe", bild: "Zeichnen" },
    ways: {
      annehmen: (a) => [["annehmen", `Alle ${a.n} als ${SSMALL[a.kind]}: ${a.n} · ${a.vs} = ${a.base}. Es fehlen ${a.total} − ${a.base} = ${a.extra}. Jeder Tausch bringt ${a.diff}: ${a.extra} : ${a.diff} = ${a.answer}.`], ["bild", `${a.n} Kreise malen, jedem ${a.vs} ${SWHAT[a.kind]} geben. Die übrigen ${a.extra} in ${a.diff}er-Päckchen verteilen.`], ["probe", `Probe: ${a.answer} · ${a.vb} + ${a.small} · ${a.vs} = ${a.total}.`]],
      waage: (a) => [["waage", `Alle ${a.n} als Hühner: ${a.base} kg. Es fehlen ${a.extra} kg. Eine Ziege ist ${a.diff} kg schwerer: ${a.extra} : ${a.diff} = ${a.answer}.`], ["probe", `Probe: ${a.answer} · ${a.vb} + ${a.small} · 2 = ${a.total}.`]],
      drei: (a) => [["drei", `Alle mit 2 Beinen annehmen: ${a.base}. Es fehlen ${a.extra}, das sind ${a.goats} Ziegen. Vögel: ${a.birds}, ohne die ${a.d} Enten: ${a.answer} Hühner.`], ["probe", `Probe: ${a.goats} Ziegen, ${a.d} Enten, ${a.answer} Hühner sind ${a.n} Köpfe und ${a.total} Beine.`]],
      quiz: (a) => [["quiz", `Alles richtig wären ${a.all} Punkte. Es fehlen ${a.lost}. Jede falsche kostet 7: ${a.lost} : 7 = ${a.wrong} falsch, also ${a.answer} richtig.`], ["tabelle", "Tabelle: 0 falsch, 1 falsch, 2 falsch … jedes Mal 7 Punkte weniger."], ["probe", `Probe: ${a.answer} · 5 − ${a.wrong} · 2 = ${a.total}.`]],
    },
    machen: {
      swap: "Tauschen",
      ask: "Tipp an, um zu tauschen, bis die Zahl genau passt.",
      now: (cur, goal, what) => `${what}: ${cur} von ${goal}`,
      done: (n) => `Genau! ${n} getauscht.`,
      hint: (a) => `Jeder Tausch bringt ${a.diff} mehr. Am Anfang fehlen ${a.extra}.`,
    },
  },
};
