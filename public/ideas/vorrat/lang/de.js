// Sentences of the camp "vorrat" (map berg), Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/vorrat/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/de.js.
import B from "../../../boards/berg/lang/de.js";

// Lager 4 (vorrat): ein Schritt der Geschichte, kurz für die Zahlenmaschine, Bruchteile.
const VSTEP = {
  plus: (k) => `Dann kommen ${k} dazu.`,
  minus: (k) => `Dann gebe ich ${k} ab.`,
  double: () => "Dann verdoppelt sich alles.",
  half: () => "Dann gebe ich die Hälfte ab.",
  triple: () => "Dann verdreifacht sich alles.",
  third: () => "Dann bleibt nur ein Drittel übrig.",
  halfminus: (k) => `Dann gebe ich die Hälfte ab und noch ${k}.`,
  part: (k) => `Dann ist ${{ 3: "ein Drittel", 4: "ein Viertel", 5: "ein Fünftel" }[k]} weg.`,
};
const vSteps = (ops) => ops.map((o) => VSTEP[o.type](o.k)).join(" ");
const VSHORT = {
  plus: (k) => `+ ${k}`, minus: (k) => `− ${k}`, double: () => "· 2", half: () => ": 2", triple: () => "· 3", third: () => ": 3",
  halfminus: (k) => `: 2, dann − ${k}`, part: (k, rest) => `: ${k}, dann · ${rest}`,
};
const VPART = { 2: "die Hälfte", 4: "ein Viertel", 8: "ein Achtel", 16: "ein Sechzehntel" };

export default {
  ...B,
  // ---------- Lager 4 am Denk-Berg: Rückwärts denken (welt/ideas/vorrat/)
  vorrat: {
    intro: {
      sehen: "Lager 4. Eine Höhle voller Vorräte. Und keiner weiß mehr, wie viel am Anfang drin war.",
      machen: "Ich spule zurück. Wie ein Film, nur mit Zahlen.",
      forschen: "Eine Zahlenmaschine. Rein kommt eine Zahl, raus kommt eine andere. Ich will wissen, was reinging.",
      anwenden: "Neue Geschichte, gleiche Richtung: rückwärts.",
      pruefen: "Die Eule rechnet vorwärts. Das ist meistens das Problem.",
    },
    bigger: "Zu leicht? Die Ziege nickt. Ab jetzt wird es fies.",
    smaller: "Okay, einen Schritt zurück. Passt ja zum Lager.",
    grew: "Logbuch: Alles zurückgespult. Der Anfang ist gefunden.",
    stories: {
      murmeln: (a) => [`Ich habe einen Beutel Murmeln. ${vSteps(a.ops)} Jetzt habe ich ${a.end} Murmeln.`, "Wie viele Murmeln hatte ich am Anfang?"],
      karten: (a) => [`Tauschtag in der Pause, mit meinen Sammelkarten. ${vSteps(a.ops)} Am Ende habe ich ${a.end} Karten.`, "Wie viele Karten hatte ich vor der Pause?"],
      geld: (a) => [`Mein Sparschwein, eine Woche lang. ${vSteps(a.ops)} Jetzt sind ${a.end} Euro drin.`, "Wie viele Euro waren am Anfang drin?"],
      kekse: (a) => [`Oma hat Kekse gebacken, die Dose steht bei mir. ${vSteps(a.ops)} Jetzt sind noch ${a.end} Kekse drin.`, "Wie viele Kekse waren am Anfang drin?"],
      vorrat: (a) => [`Ich bin ein Eichhörnchen, mein Wintervorrat liegt in der Höhle. ${vSteps(a.ops)} Im Frühling sind noch ${a.end} Nüsse übrig.`, "Wie viele Nüsse waren im Herbst in der Höhle?"],
      aufzug: (a) => [`Ich steige im Hochhaus in den Aufzug. ${a.ops.map((o) => (o.type === "plus" ? `Er fährt ${o.k} Stockwerke hoch.` : `Er fährt ${o.k} Stockwerke runter.`)).join(" ")} Jetzt hält er ${a.end === "0" ? "im Erdgeschoss" : `im ${a.end}. Stock`}.`, "In welchem Stock bin ich eingestiegen?"],
      teilen: (a) => [`Ich teile meine Murmeln. ${a.ops.map((o, i) => `${["Anna", "Ben", "Clara"][i]} bekommt die Hälfte ${i ? "vom Rest" : "meiner Murmeln"} und noch ${o.k}.`).join(" ")} Mir bleiben ${a.end}.`, "Wie viele Murmeln hatte ich am Anfang?"],
      teich: (a) => [`Die Seerosen auf dem Teich verdoppeln sich jeden Tag. Am Tag ${a.d} ist der Teich ganz bedeckt.`, `An welchem Tag war ${VPART[a.frac]} des Teiches bedeckt?`],
      schimmel: (a) => [`Der Schimmel auf meinem vergessenen Pausenbrot verdoppelt sich jeden Tag. Am Tag ${a.d} ist das ganze Brot grün.`, `An welchem Tag war ${VPART[a.frac]} grün?`],
      geruecht: (a) => [`Ein Gerücht in der Schule: jeden Tag wissen es doppelt so viele. Am Tag ${a.d} weiß es die ganze Schule.`, `An welchem Tag wusste es ${VPART[a.frac]} der Schule?`],
      treppe: (a) => [`In unserem Haus hat jede Treppe zwischen zwei Stockwerken ${a.per} Stufen. Ich bin ${a.steps} Stufen hochgestiegen und stehe jetzt im ${a.f}. Stock.`, "In welchem Stock bin ich losgegangen?"],
      maschine: (a) => [`Die Zahlenmaschine rechnet: ${a.ops.map((o) => VSHORT[o.type](o.k, o.rest)).join(", dann ")}. Heraus kommt ${a.end}.`, "Welche Zahl wurde hineingesteckt?"],
    },
    units: { murmeln: "Murmeln", karten: "Karten", geld: "Euro", kekse: "Kekse", vorrat: "Nüsse", aufzug: "", teilen: "Murmeln", teich: "", schimmel: "", geruecht: "", treppe: "", maschine: "" },
    short: VSHORT,
    undo: {
      plus: (k) => `− ${k}`, minus: (k) => `+ ${k}`, double: () => ": 2", half: () => "· 2", triple: () => ": 3", third: () => "· 3",
      halfminus: (k) => `+ ${k}, dann · 2`, part: (k, rest) => `: ${rest}, dann · ${k}`,
    },
    rules: {
      rueck: "Vom Ende her: jeden Schritt umkehren, den letzten zuerst. Aus + wird −, aus · wird :.",
      halb: "„Die Hälfte und noch k“ rückwärts: erst die k zurücklegen, dann verdoppeln.",
      teich: "Verdoppelt es sich jeden Tag, war es einen Tag vorher halb so viel.",
      zaun: "Treppen zählen wie Lücken: von Stock 2 bis Stock 5 sind es 3 Treppen. Werkzeug aus Lager 1.",
    },
    hints: {
      rueck: "Fang beim Ende an. Was war direkt vor dem letzten Schritt?",
      halb: "Rückwärts: Was war da, bevor die letzten weggegeben wurden? Leg sie zurück, dann verdopple.",
      teich: "Am Tag vorher war es halb so viel. Und am Tag davor?",
      zaun: "Wie viele Treppen sind die Stufen? Und wie viele Stockwerke ist das?",
    },
    miss: {
      rueck: "Nicht ganz. Mach jeden Schritt rückgängig, den letzten zuerst.",
      halb: "Nicht ganz. Erst die weggegebenen zurücklegen, dann verdoppeln.",
      teich: "Nicht ganz. Jeden Tag zurück: halb so viel.",
      zaun: "Nicht ganz. Teil die Stufen durch die Stufen pro Treppe.",
    },
    tables: { maschine: ["heraus", "hinein"] },
    tableIntro: { maschine: (f, a) => `Die Zahlenmaschine rechnet: ${a.ops.map((o) => VSHORT[o.type](o.k, o.rest)).join(", dann ")}. Was ging hinein?` },
    reasons: {
      forward: "Sie hat vorwärts gerechnet statt rückwärts.",
      order: "Sie hat die Schritte in der falschen Reihenfolge umgekehrt.",
      sign: "Sie hat + und − nicht getauscht.",
      plusone: "Sie hat das „und noch …“ vergessen.",
      half: "Sie hat die Tage halbiert statt einen Tag zurückzugehen.",
      floors: "Sie hat Stockwerke statt Treppen gezählt.",
    },
    tools: { rueck: "Rückwärts rechnen", halb: "Erst zurücklegen, dann verdoppeln", teich: "Ein Tag zurück: halb so viel", zaun: "Lücken zählen (Lager 1)", probe: "Probe vorwärts", bild: "Streifen malen", tabelle: "Tabelle" },
    ways: {
      rueck: (a) => [["rueck", `Von ${a.end} aus jeden Schritt umkehren, den letzten zuerst. Am Anfang steht ${a.answer}.`], ["probe", `Probe: mit ${a.answer} anfangen und vorwärts rechnen. Es kommt ${a.end} heraus.`]],
      halb: (a) => [["halb", `Rückwärts: die abgegebenen zurücklegen, dann verdoppeln. Schritt für Schritt bis ${a.answer}.`], ["bild", "Einen Streifen malen: die Hälfte und noch ein Stück. Dann sieht man, wie groß der Streifen vorher war."], ["probe", `Probe: mit ${a.answer} anfangen und vorwärts teilen. Es bleiben ${a.end}.`]],
      teich: (a) => [["teich", `Am Tag ${a.d} voll, einen Tag vorher halb voll, und so weiter zurück: Tag ${a.answer}.`], ["probe", "Nicht die Tage halbieren! Die Hälfte der Tage wäre viel zu früh."]],
      zaun: (a) => [["zaun", `${a.steps} : ${a.per} = ${a.flights} Treppen. ${a.flights} Treppen tiefer als Stock ${a.f} ist Stock ${a.answer}.`], ["probe", `Probe: von Stock ${a.answer} bis Stock ${a.f} sind es ${a.flights} Treppen mit je ${a.per} Stufen.`]],
    },
    machen: {
      ask: (k) => `Was war vor Schritt ${k}?`,
      miss: (u) => `Nicht ganz. Mach den Schritt rückgängig: ${u}.`,
      good: "Genau. Weiter zurück.",
      done: (s) => `Am Anfang waren es ${s}.`,
      hint: "Fang rechts an. Unter jedem Schritt steht, wie man ihn rückgängig macht.",
    },
  },
};
