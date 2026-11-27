// Sentences of the camp "waage" (map berg), Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/waage/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/de.js.
import B from "../../../boards/berg/lang/de.js";

// Deutsche Texte für die neue Welt (Karte, Runde, die Idee "Teile").
// Zahlwörter und Namen der Dinge stehen in /shared/lang/de.js. a, b, c … = Zahlwörter ("drei").
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"
// Lager 6 (waage): die Dinge auf der Waage, eins und viele, mit Artikel.
const WN = {
  kuerbis: ["Kürbis", "Kürbisse", "der Kürbis", "ein Kürbis"], apfel: ["Apfel", "Äpfel", "der Apfel", "ein Apfel"],
  melone: ["Melone", "Melonen", "die Melone", "eine Melone"], ananas: ["Ananas", "Ananas", "die Ananas", "eine Ananas"],
  orange: ["Orange", "Orangen", "die Orange", "eine Orange"], birne: ["Birne", "Birnen", "die Birne", "eine Birne"],
  kiste: ["Kiste", "Kisten", "die Kiste", "eine Kiste"], buch: ["Buch", "Bücher", "das Buch", "ein Buch"],
  beutel: ["Beutel", "Beutel", "der Beutel", "ein Beutel"], murmel: ["Murmel", "Murmeln", "die Murmel", "eine Murmel"],
  paket: ["Paket", "Pakete", "das Paket", "ein Paket"], hund: ["Hund", "Hunde", "der Hund", "ein Hund"],
  katze: ["Katze", "Katzen", "die Katze", "eine Katze"], hase: ["Hase", "Hasen", "der Hase", "ein Hase"],
};
const wn = (n, id) => `${n} ${n === "1" ? WN[id][0] : WN[id][1]}`;
const wList = (ws) => ws.map((w) => `${w} kg`).join(" und ");
const scales = (a, b) => `Auf der ersten Waage liegen links ${wn(a[0], a[1])}, rechts ${wn(a[2], a[3])}. Auf der zweiten links ${wn(b[0], b[1])}, rechts ${wn(b[2], b[3])}. Beide sind im Gleichgewicht.`;

export default {
  ...B,
  // ---------- Lager 6 am Denk-Berg: Ersetzen (welt/ideas/waage/)
  waage: {
    intro: {
      sehen: "Lager 6. Ein Markt mitten am Berg, mit einer alten Waage. Was gleich schwer ist, darf tauschen.",
      machen: "Leg selbst auf. Die Waage sagt dir sofort, ob es stimmt.",
      forschen: "Erst eins, dann zwei, dann drei. Wie viele kleine sind das jedes Mal?",
      anwenden: "Neue Waage, neuer Trick. Dasselbe Werkzeug: ersetzen.",
      pruefen: "Die Eule wiegt mit den Augen. Das geht oft schief.",
    },
    bigger: "Zu leicht? Die Marktfrau holt die schweren Sachen raus.",
    smaller: "Okay, weniger auf der Waage. Der Trick bleibt.",
    grew: "Logbuch: Was gleich schwer ist, kann sich vertreten.",
    kg: (n) => `${n} kg`,
    stories: {
      tausch: (a) => [`Auf der Marktwaage: 1 ${WN[a.big][0]} wiegt so viel wie ${wn(a.k, a.small)}. Jetzt liegen links ${wn(a.nb, a.big)} und ${wn(a.ns, a.small)}.`, `Wie viele ${WN[a.small][1]} müssen rechts liegen, damit die Waage gerade ist?`],
      zwei: (a) => [scales(["1", a.big, a.k, a.mid], ["1", a.mid, a.m, a.small]), `Wie viele ${WN[a.small][1]} wiegen so viel wie ${wn(a.n, a.big)}?`],
      korb: (a) => [`Im Korb liegen ${wn(a.c, a.thing)}, alle gleich schwer. Mit dem Korb zusammen wiegen sie ${a.w} kg. Der leere Korb wiegt ${a.b} kg.`, `Wie schwer ist ${WN[a.thing][3]}?`],
      taschen: (a) => [`Annas und Bens Schultaschen wiegen zusammen ${a.s} kg. Annas Tasche ist ${a.d} kg schwerer als Bens.`, "Wie schwer ist Annas Tasche?"],
      hunde: (a) => [`Die Hunde Bello und Fips wiegen zusammen ${a.s} kg. Bello ist ${a.d} kg schwerer als Fips.`, "Wie schwer ist Bello?"],
      kisten: (a) => [`Zwei Kisten im Lager wiegen zusammen ${a.s} kg. Die rote ist ${a.d} kg schwerer als die blaue.`, "Wie schwer ist die rote Kiste?"],
      drei: (a) => [`Beim Tierarzt: Hund und Katze wiegen zusammen ${a.xy} kg, Katze und Hase ${a.yz} kg, Hund und Hase ${a.xz} kg.`, "Wie schwer sind alle drei zusammen?"],
      dreieins: (a) => [`Beim Tierarzt: Hund und Katze wiegen zusammen ${a.xy} kg, Katze und Hase ${a.yz} kg, Hund und Hase ${a.xz} kg.`, "Wie schwer ist die Katze?"],
      kette: (a) => [scales([a.p, a.big, a.q, a.mid], [a.u, a.mid, a.v, a.small]), `Wie viele ${WN[a.small][1]} wiegen so viel wie ${wn(a.n, a.big)}?`],
      gewichte: (a) => [`Ich habe drei Gewichte: 1 kg, 3 kg und 9 kg. Links liegt das Paket${a.left.length ? ` und ${wList(a.left)}` : ""}, rechts ${wList(a.right)}. Die Waage ist im Gleichgewicht.`, "Wie schwer ist das Paket?"],
      kiste: (a) => [`Eine Kiste voller gleicher Bücher wiegt ${a.full} kg. Ich nehme die Hälfte der Bücher heraus. Jetzt wiegt sie ${a.half} kg.`, "Wie schwer ist die leere Kiste?"],
      picknick: (a) => [`Unser Picknickkorb wiegt mit allem Essen ${a.full} kg. Nach dem Picknick ist die Hälfte gegessen, und er wiegt nur noch ${a.half} kg.`, "Wie schwer ist der leere Korb?"],
    },
    units: { tausch: "", zwei: "", korb: "kg", taschen: "kg", hunde: "kg", kisten: "kg", drei: "kg", dreieins: "kg", kette: "", gewichte: "kg", kiste: "kg", picknick: "kg" },
    rules: {
      ersetzen: "Was gleich schwer ist, darf tauschen: jedes große Ding gegen so viele kleine, wie es wiegt.",
      zwei: "Zwei Waagen: zweimal tauschen, bis nur noch eine Sorte übrig ist.",
      abziehen: "Was auf beiden Seiten gleich ist, darf weg: erst den Korb weg, dann teilen.",
      summe: "Summe und Unterschied: den Unterschied dazu, dann sind es zwei Schwere. Halbieren.",
      drei: "Alle Paare zusammen: Darin ist jedes Ding zweimal. Halbieren.",
      kette: "Such eine Zahl, die ohne Rest tauscht. Dann in diesen Schritten weiter.",
      gewichte: "Ein Gewicht neben dem Paket zählt minus, eins auf der anderen Seite plus.",
      rueck: "Was weg ist, war die Hälfte. Doppelt so viel ist alles, der Rest ist der leere Behälter. Werkzeug aus Lager 4.",
    },
    hints: {
      ersetzen: "Tausch jedes große Ding gegen die kleinen. Wie viele sind das? Dann die kleinen dazu.",
      zwei: "Tausch erst mit der ersten Waage, dann mit der zweiten.",
      abziehen: "Nimm den Korb weg. Wie viel wiegen die Dinge allein?",
      summe: "Wenn der Leichte so schwer wäre wie der Schwere: Wie viel wäre es zusammen?",
      drei: "Zähl alle drei Waagen zusammen. Wie oft ist jedes Tier darin?",
      kette: "Bei wie vielen von der ersten Sorte geht das Tauschen glatt auf? Mach eine Tabelle.",
      gewichte: "Rechts plus, links neben dem Paket minus.",
      rueck: "Wie viel wiegt die Hälfte, die weg ist? Dann weißt du, was alles wiegt.",
    },
    miss: {
      ersetzen: "Nicht ganz. Jedes große Ding sind mehrere kleine. Vergiss die kleinen nicht, die schon da liegen.",
      zwei: "Nicht ganz. Zweimal tauschen.",
      abziehen: "Nicht ganz. Erst den Korb abziehen, dann teilen.",
      summe: "Nicht ganz. Unterschied dazu, dann halbieren.",
      drei: "Nicht ganz. In allen Waagen zusammen ist jedes Tier zweimal.",
      kette: "Nicht ganz. Geh in Schritten, die ohne Rest tauschen.",
      gewichte: "Nicht ganz. Gewichte neben dem Paket zählen minus.",
      rueck: "Nicht ganz. Die Hälfte, die weg ist, mal 2 ist alles. Der Rest ist der Behälter.",
    },
    tables: {
      tausch: (a) => [WN[a.big][1], WN[a.small][1]],
      zwei: (a) => [WN[a.big][1], WN[a.small][1]],
      kette: (a) => [WN[a.big][1], WN[a.small][1]],
    },
    tableIntro: {
      tausch: (f, a) => `1 ${WN[a.big][0]} wiegt so viel wie ${wn(a.k, a.small)}. Und mehr ${WN[a.big][1]}?`,
      zwei: (f, a) => `1 ${WN[a.big][0]} wiegt so viel wie ${wn(a.k, a.mid)}, 1 ${WN[a.mid][0]} so viel wie ${wn(a.m, a.small)}.`,
      kette: (f, a) => `${wn(a.p, a.big)} gegen ${wn(a.q, a.mid)}, ${wn(a.u, a.mid)} gegen ${wn(a.v, a.small)}. Bei diesen Zahlen geht es glatt auf:`,
    },
    reasons: {
      rest: "Sie hat die kleinen Dinge vergessen, die schon auf der Waage lagen.",
      all: "Sie hat auch die kleinen Dinge noch einmal getauscht.",
      add: "Sie hat zusammengezählt statt getauscht.",
      once: "Sie hat nur einmal getauscht, nicht zweimal.",
      basket: "Sie hat den Korb nicht abgezogen.",
      other: "Sie hat den Leichteren ausgerechnet, nicht den Schwereren.",
      half: "Sie hat einfach halbiert und den Unterschied vergessen.",
      twice: "Sie hat vergessen, dass jedes Tier zweimal gewogen wurde.",
      side: "Sie hat das Gewicht neben dem Paket nicht abgezogen.",
      books: "Sie hat nur die Hälfte genommen, die weg ist.",
    },
    tools: { ersetzen: "Tauschen", zwei: "Zweimal tauschen", abziehen: "Gleiches wegnehmen", summe: "Summe und Unterschied", drei: "Alles zusammen, halbieren", kette: "Glatte Schritte", gewichte: "Plus und minus", rueck: "Rückwärts (Lager 4)", probe: "Probe", bild: "Streifen malen", tabelle: "Tabelle" },
    ways: {
      tausch: (a) => [["ersetzen", `Tauschen: ${wn(a.nb, a.big)} sind ${a.nb} · ${a.k} = ${a.swapped} ${WN[a.small][1]}, dazu die ${a.ns}: ${a.answer}.`], ["bild", `Mal jedes große Ding als Päckchen aus ${a.k} ${WN[a.small][1]}. Dann alle zählen.`], ["probe", `Probe: ${a.swapped} + ${a.ns} = ${a.answer}. Beide Seiten gleich.`]],
      zwei: (a) => [["zwei", `${wn(a.n, a.big)} sind ${a.n} · ${a.k} = ${a.nk} ${WN[a.mid][1]}, und das sind ${a.nk} · ${a.m} = ${a.answer} ${WN[a.small][1]}.`], ["tabelle", `Erst ausrechnen: 1 ${WN[a.big][0]} = ${a.per} ${WN[a.small][1]}. Dann mal ${a.n}.`]],
      korb: (a) => [["abziehen", `Erst den Korb weg: ${a.w} − ${a.b} = ${a.rest} kg. ${a.rest} : ${a.c} = ${a.answer} kg.`], ["probe", `Probe: ${a.c} · ${a.answer} + ${a.b} = ${a.w}.`]],
      summe: (a) => [["summe", `Unterschied dazu: ${a.s} + ${a.d} = ${a.twice}. Das sind zwei Schwere: ${a.twice} : 2 = ${a.answer}.`], ["bild", "Zwei Streifen malen, einer um den Unterschied länger. Den kurzen verlängern, dann sind beide gleich."], ["probe", `Probe: ${a.answer} + ${a.light} = ${a.s}, und der Unterschied ist ${a.d}.`]],
      drei: (a) => [["drei", `Alle Waagen zusammen: ${a.xy} + ${a.yz} + ${a.xz} = ${a.sum}. Jedes Tier ist zweimal dabei: ${a.sum} : 2 = ${a.all}.`], ["probe", `Probe: Hund + Katze + Hase = ${a.all}, und ${a.all} − ${a.yz} ist der Hund allein.`]],
      dreieins: (a) => [["drei", `Alle zusammen: (${a.xy} + ${a.yz} + ${a.xz}) : 2 = ${a.all}. Ohne die Katze wiegen Hund und Hase ${a.without}: ${a.all} − ${a.without} = ${a.answer}.`], ["ersetzen", `Anders: Hund und Katze minus Hund und Hase ist Katze minus Hase. Mit Katze und Hase zusammen: Summe und Unterschied.`]],
      kette: (a) => [["kette", `${wn(a.step, a.big)} sind genau ${wn(a.stepC, a.small)}. ${a.n} sind ${a.times}-mal so viele: ${a.times} · ${a.stepC} = ${a.answer}.`], ["tabelle", "Eine Tabelle mit glatten Schritten: jede Zeile gleich viel mehr."]],
      gewichte: (a) => [["gewichte", `Rechts ${a.r} kg. Neben dem Paket ${a.l} kg. Das Paket: ${a.r} − ${a.l} = ${a.answer} kg.`], ["probe", `Probe: ${a.answer} + ${a.l} = ${a.r}. Gleich schwer.`]],
      rueck: (a) => [["rueck", `Die Hälfte wiegt ${a.full} − ${a.half} = ${a.gone} kg. Alles also ${a.things} kg. Leer: ${a.full} − ${a.things} = ${a.answer} kg.`], ["probe", `Probe: ${a.answer} + ${a.things} = ${a.full}, und ${a.answer} + ${a.gone} = ${a.half}.`]],
    },
    machen: {
      leftDown: "Links ist es schwerer.",
      rightDown: "Rechts ist es schwerer.",
      level: "Gleich schwer!",
      add: "Eins dazulegen",
      take: "Eins wegnehmen",
      fillText: (a) => `1 ${WN[a.big][0]} wiegt so viel wie ${wn(a.k, a.small)}. Links liegen ${wn(a.nb, a.big)} und ${wn(a.ns, a.small)}.`,
      fillAsk: (a) => `Leg ${WN[a.small][1]} nach rechts, bis die Waage gerade ist.`,
      fillHint: (a) => `Tausch in Gedanken jedes große Ding gegen ${a.k} ${WN[a.small][1]}. Dazu die ${a.ns}, die schon links liegen.`,
      filled: (a) => `Gerade! ${wn(a.answer, a.small)}.`,
      kgLong: (n) => `${n} Kilogramm`,
      where: { off: "weg", right: "rechts", left: "links" },
      weightsText: (a) => `${WN[a.thing][2][0].toUpperCase()}${WN[a.thing][2].slice(1)} wiegt ${a.n} kg. Du hast drei Gewichte: 1, 3 und 9 kg.`,
      weightsAsk: "Tipp die Gewichte an: nach rechts, nach links oder weg. Bis die Waage gerade ist.",
      weightsHint: "Ein Gewicht links neben dem Ding zählt minus. 9 rechts und 1 links sind zusammen 8.",
      weighed: (a) => `Gerade! ${a.n} kg mit nur drei Gewichten.`,
    },
  },
};
