// Sentences of the camp "mauer" (map berg), Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/mauer/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/de.js.
import B from "../../../boards/berg/lang/de.js";

// Lager 12 (mauer): die Hinweise der Zahlenrätsel als Sätze.
const MCLUE = {
  between: (lo, hi) => `Die Zahl liegt zwischen ${lo} und ${hi}.`,
  div: (d) => `Sie ist durch ${d} teilbar.`,
  rest: (d, k) => `Teilt man sie durch ${d}, bleibt ${k} übrig.`,
  sum: (s) => `Ihre Quersumme ist ${s}.`,
  even: () => "Sie ist gerade.",
  odd: () => "Sie ist ungerade.",
  bigger: () => "Ihre Zehnerziffer ist größer als ihre Einerziffer.",
  smaller: () => "Ihre Zehnerziffer ist kleiner als ihre Einerziffer.",
};
const mClues = (clues) => clues.map(([k, ...v]) => MCLUE[k](...v)).join(" ");
const MRIDDLE = (a) => [["eingrenzen", `Hinweis für Hinweis streichen: Nach allen Hinweisen bleibt nur ${a.answer}.`], ["liste", "Alle Zahlen aufschreiben, die zum ersten Hinweis passen. Dann mit jedem Hinweis streichen."]];

export default {
  ...B,
  // ---------- Lager 12 am Denk-Berg: Eingrenzen (welt/ideas/mauer/)
  mauer: {
    intro: {
      sehen: "Lager 12. Eine Mauer aus Zahlen, kurz vor dem Gipfel. Jeder Stein trägt die zwei darunter.",
      machen: "Bau selbst, Stein für Stein, von unten nach oben.",
      forschen: "Was passiert oben, wenn sich unten ein Stein ändert?",
      anwenden: "Hausnummern, Schlösser, magische Quadrate: Hinweis für Hinweis eingrenzen.",
      pruefen: "Die Eule rät schnell. Wir grenzen ein.",
    },
    bigger: "Zu leicht? Die Mauer wird höher, die Rätsel kniffliger.",
    smaller: "Okay, eine kleinere Mauer. Das Prinzip bleibt.",
    grew: "Logbuch: Wer Hinweis für Hinweis streicht, findet am Ende die eine Zahl.",
    stories: {
      mauer: (a) => [`Eine Zahlenmauer: Jeder Stein ist die Summe der zwei Steine darunter. Unten stehen ${a.bottom.join(", ")}.`, "Was steht ganz oben?"],
      turm: (a) => [`Die Kinder bauen einen Zahlenturm aus Kartons. Unten stehen ${a.bottom.join(", ")}. Auf jeden Karton kommt die Summe der zwei darunter.`, "Welche Zahl steht auf dem obersten Karton?"],
      luecke: (a) => [`Eine Zahlenmauer mit 3 Steinen unten. Unten links steht ${a.x}, unten rechts ${a.z}, ganz oben ${a.T}. Der mittlere Stein unten fehlt.`, "Welche Zahl gehört unten in die Mitte?"],
      runter: (a) => [`Eine Zahlenmauer mit 3 Steinen unten. Oben steht ${a.T}, in der Mitte links ${a.L}, unten rechts ${a.z}.`, "Welche Zahl steht unten links?"],
      hausnummer: (a) => [`Ich suche Lenas Hausnummer, eine zweistellige Zahl. ${mClues(a.clues)}`, "Welche Hausnummer ist es?"],
      schloss: (a) => [`Der Code meines Fahrradschlosses ist eine dreistellige Zahl. ${mClues(a.clues)}`, "Wie lautet der Code?"],
      opa: (a) => [`Opa verrät sein Alter nur als Rätsel. ${mClues(a.clues)}`, "Wie alt ist Opa?"],
      magisch: () => ["Ein magisches Quadrat: In jeder Reihe, jeder Spalte und in beiden Diagonalen ist die Summe gleich.", "Welche Zahl gehört an die Stelle mit dem Fragezeichen?"],
      krypto: (a) => [`Eine zweistellige Geheimzahl AB. Vertauscht man die Ziffern, entsteht BA. AB + BA = ${a.s}, und A ist um ${a.d} größer als B.`, "Wie heißt die Geheimzahl?"],
      wieviele: (a) => [`Eine Zahlenmauer mit 3 Steinen unten. Oben soll ${a.T} stehen. Jeder Stein ist mindestens 1.`, "Wie viele verschiedene Mauern gibt es?"],
    },
    units: { mauer: "", turm: "", luecke: "", runter: "", hausnummer: "", schloss: "", opa: "Jahre", magisch: "", krypto: "", wieviele: "Mauern" },
    rules: {
      mauer: "Hoch geht es mit Plus: zwei Steine nebeneinander ergeben den darüber. Bei 3 Steinen unten: oben = links + 2 · Mitte + rechts.",
      luecke: "Die Mitte unten zählt oben doppelt. Erst die Ecken abziehen, dann halbieren.",
      eingrenzen: "Eingrenzen: Jeder Hinweis streicht Zahlen weg, bis nur eine übrig bleibt.",
      magisch: "Im magischen Quadrat mit 3 mal 3 ist jede Summe 3 · die Mitte.",
      zaehlen: "Alle Mauern ordentlich zählen: erst die Mitte festlegen, dann links und rechts verteilen.",
      rueck: "Von oben nach unten rechnet man mit Minus: oben minus ein Stein darunter gibt den anderen. Werkzeug aus Lager 4 und 6.",
    },
    hints: {
      mauer: "Fang unten an: Welche zwei Steine liegen unter dem nächsten?",
      luecke: "Wie oft steckt der mittlere Stein in der Zahl ganz oben?",
      eingrenzen: "Schreib alle Zahlen auf, die zum ersten Hinweis passen. Streich dann mit jedem weiteren.",
      magisch: "Wie groß ist die Summe einer Reihe? Die volle Reihe verrät es.",
      zaehlen: "Leg den mittleren Stein fest: 1, 2, 3 … Wie viele Möglichkeiten gibt es dann für links und rechts?",
      rueck: "Oben minus der bekannte Stein darunter gibt den anderen. So geht es Stück für Stück nach unten.",
    },
    miss: {
      mauer: "Nicht ganz. Jeder Stein ist die Summe der zwei darunter.",
      luecke: "Nicht ganz. Die Mitte zählt doppelt: abziehen, dann halbieren.",
      eingrenzen: "Nicht ganz. Prüf deine Zahl mit jedem Hinweis.",
      magisch: "Nicht ganz. Jede Reihe hat dieselbe Summe wie die volle Reihe.",
      zaehlen: "Nicht ganz. Zähl ordentlich, Mitte für Mitte.",
      rueck: "Nicht ganz. Von oben nach unten: abziehen.",
    },
    tables: { mitte: ["Mitte unten", "oben"], wieviele: ["oben", "Mauern"] },
    tableIntro: {
      mitte: (f, a) => `Unten links ${a.x}, unten rechts ${a.z}. Was steht oben, wenn die Mitte 1, 2, 3 ist?`,
      wieviele: () => "Wie viele Mauern mit 3 Steinen unten gibt es für jede Zahl oben?",
    },
    reasons: {
      middle: "Sie hat den mittleren Stein nur einmal gezählt. Er zählt doppelt.",
      half: "Sie hat vergessen zu halbieren.",
      line: "Sie hat sich bei der Summe einer Reihe verrechnet.",
      clue: "Sie hat einen Hinweis übersehen.",
      swap: "Sie hat Zehner und Einer vertauscht.",
      forgot: "Sie hat beim Aufzählen Mauern vergessen.",
      down: "Sie ist von oben falsch nach unten gegangen.",
    },
    tools: { mauer: "Plus nach oben", luecke: "Doppelt zählt, halbieren", eingrenzen: "Eingrenzen", magisch: "Magische Summe", zaehlen: "Ordentlich zählen", rueck: "Von oben runter (Lager 4, 6)", probe: "Probe", tabelle: "Tabelle", liste: "Aufschreiben" },
    ways: {
      mauer: (a) => [["mauer", `Schritt für Schritt hoch: Über der untersten Reihe stehen ${a.middle.join(", ")}. Ganz oben: ${a.answer}.`], ["luecke", "Abkürzung bei 3 Steinen unten: links + 2 · Mitte + rechts."]],
      luecke: (a) => [["luecke", `Oben ${a.T} = ${a.x} + 2 · Mitte + ${a.z}. ${a.T} − ${a.x} − ${a.z} = ${a.rest}, die Hälfte: ${a.answer}.`], ["probe", `Probe: unten ${a.x}, ${a.answer}, ${a.z} ergibt oben ${a.T}.`]],
      rueck: (a) => [["rueck", `Von oben runter: Mitte rechts ${a.T} − ${a.L} = ${a.R}. Unten Mitte ${a.R} − ${a.z} = ${a.b}. Unten links ${a.L} − ${a.b} = ${a.answer}.`], ["probe", `Probe: unten ${a.answer}, ${a.b}, ${a.z} ergibt oben ${a.T}.`]],
      hausnummer: MRIDDLE,
      schloss: MRIDDLE,
      opa: MRIDDLE,
      krypto: (a) => [["eingrenzen", `AB + BA = 11 · (A + B), also A + B = ${a.sumAB}. Mit A − B = ${a.d}: A = ${a.A}, B = ${a.B}. Die Zahl: ${a.answer}.`], ["liste", "Alle Ziffernpaare mit der richtigen Summe aufschreiben und prüfen."]],
      magisch: (a) => [["magisch", `Jede Summe ist 3 · Mitte = 3 · ${a.c} = ${a.sum}. Davon die zwei bekannten Zahlen der Reihe weg: ${a.answer}.`], ["probe", "Prüf mit einer anderen Reihe, ob die Summe stimmt."]],
      zaehlen: (a) => [["zaehlen", `Oben ${a.T} = links + 2 · Mitte + rechts. Mitte von 1 bis ${a.most}, für jede die Paare links und rechts zählen. Zusammen ${a.answer}.`], ["tabelle", "Tabelle: oben 4, 5, 6, 7, 8 gibt 1, 2, 4, 6, 9 Mauern."]],
    },
    machen: {
      text: "Bau die Mauer von unten nach oben. Jeder Stein ist die Summe der zwei darunter.",
      ask: (x, y) => `${x} + ${y} = ?`,
      miss: "Nicht ganz. Zähl die zwei Steine darunter zusammen.",
      good: "Genau. Weiter.",
      done: (n) => `Fertig! Oben steht ${n}.`,
      hint: "Zähl die zwei leuchtenden Steine unten zusammen.",
    },
  },
};
