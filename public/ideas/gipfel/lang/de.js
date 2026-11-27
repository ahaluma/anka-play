// Sentences of the camp "gipfel" (map berg), Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/gipfel/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/de.js.
import B from "../../../boards/berg/lang/de.js";

// Der Gipfel (gipfel): Bruchteile für die Seerose.
const GPART = { 2: "die Hälfte", 4: "ein Viertel", 8: "ein Achtel", 3: "ein Drittel", 9: "ein Neuntel", 27: "ein Siebenundzwanzigstel" };

export default {
  ...B,
  // ---------- Der Gipfel am Denk-Berg: Wettbewerbsrunden (welt/berg/gipfel/, welt/ideas/gipfel/)
  gipfel: {
    stories: {
      zaunstall: (a) => [`Ein Zaun hat ${a.P} Pfähle in einer Reihe. Die Abstände sind 2 m oder 3 m lang, zusammen ist der Zaun ${a.L} m lang.`, "Wie viele Abstände sind 3 m lang?"],
      seerose: (a) => [`Eine Seerose verdoppelt jeden Tag ihre Fläche. Nach ${a.D} Tagen ist der Teich ganz bedeckt.`, `Nach wie vielen Tagen war ${GPART[a.part]} des Teichs bedeckt?`],
      algen: (a) => [`Algen in einem Aquarium verdreifachen jeden Tag ihre Fläche. Nach ${a.D} Tagen ist die Scheibe ganz grün.`, `Nach wie vielen Tagen war ${GPART[a.part]} der Scheibe grün?`],
      gerade: (a) => [`Du hast die Ziffernkarten ${a.digits.join(", ")}. Damit legst du dreistellige Zahlen, jede Karte höchstens einmal.`, "Wie viele dieser Zahlen sind gerade?"],
      ungerade: (a) => [`Du hast die Ziffernkarten ${a.digits.join(", ")}. Damit legst du dreistellige Zahlen, jede Karte höchstens einmal.`, "Wie viele dieser Zahlen sind ungerade?"],
      laternen: (a) => [`Ein Weg ist ${a.L} m lang. Alle ${a.g} m steht ein Pfahl, auch am Anfang und am Ende. Am ersten Pfahl hängt eine Laterne, danach an jedem ${a.k}. Pfahl.`, "Wie viele Laternen hängen am Weg?"],
      mauerwaage: (a) => [`Eine Zahlenmauer mit 3 Steinen unten. Unten links und unten rechts steht dieselbe Zahl, der Stein unten in der Mitte ist ${a.m}-mal so groß. Ganz oben steht ${a.T}.`, "Welche Zahl steht unten links?"],
    },
    units: { zaunstall: "Abstände", seerose: "Tage", algen: "Tage", gerade: "Zahlen", ungerade: "Zahlen", laternen: "Laternen", mauerwaage: "" },
    rules: {
      stall: "Zwei Werkzeuge zusammen: erst Pfähle und Lücken, dann annehmen und verbessern.",
      rueck: "Zwei Werkzeuge zusammen: die Regel finden, dann rückwärts denken.",
      haken: "Zwei Werkzeuge zusammen: ordentlich zählen, und gerade oder ungerade entscheidet die letzte Ziffer.",
      zaun: "Zwei Werkzeuge zusammen: Pfähle und Lücken, dann die Regel der Laternen.",
      waage: "Zwei Werkzeuge zusammen: ersetzen, und in der Mauer zählt die Mitte doppelt.",
    },
    hints: {
      stall: "Wie viele Abstände haben die Pfähle? Und wenn alle 2 m wären?",
      rueck: "Geh vom vollen Tag rückwärts. Was war einen Tag vorher?",
      haken: "Fang mit der letzten Stelle an: Welche Ziffern passen dort?",
      zaun: "Wie viele Pfähle sind es? Dann: Pfahl 1, dann jeder wievielte?",
      waage: "Ersetze den mittleren Stein durch lauter Ecksteine. Wie viele Ecken sind oben drin?",
    },
    miss: {
      stall: "Nicht ganz. Erst alle 2 m annehmen, dann verbessern.",
      rueck: "Nicht ganz. Jeden Tag zurück wird es weniger, nicht mehr.",
      haken: "Nicht ganz. Erst die letzte Ziffer, dann vorne, dann die Mitte.",
      zaun: "Nicht ganz. Vergiss die Laterne am ersten Pfahl nicht.",
      waage: "Nicht ganz. Die Mitte zählt oben doppelt.",
    },
    tools: { zaun: "Pfähle und Lücken (Lager 1)", stall: "Annehmen und verbessern (Lager 7)", rueck: "Rückwärts denken (Lager 4)", regel: "Die Regel finden (Lager 5)", haken: "Ordentlich zählen (Lager 2)", paar: "Gerade und ungerade (Lager 8)", waage: "Ersetzen (Lager 6)", mauer: "Zahlenmauer (Lager 12)", probe: "Probe" },
    ways: {
      zaunstall: (a) => [["zaun", `${a.P} Pfähle haben ${a.gaps} Abstände.`], ["stall", `Wären alle 2 m, wäre der Zaun ${a.small} m lang. Es fehlen ${a.extra} m, jeder 3-m-Abstand bringt 1 m mehr: ${a.answer} Abstände.`]],
      seerose: (a) => [["regel", "Die Regel: jeden Tag das Doppelte."], ["rueck", `Rückwärts: Tag ${a.D} voll, jeden Tag davor die Hälfte. ${a.k} Tage zurück: Tag ${a.answer}.`]],
      algen: (a) => [["regel", "Die Regel: jeden Tag das Dreifache."], ["rueck", `Rückwärts: Tag ${a.D} voll, jeden Tag davor ein Drittel. ${a.k} Tage zurück: Tag ${a.answer}.`]],
      gerade: (a) => [["paar", "Ob eine Zahl gerade ist, entscheidet nur die letzte Ziffer."], ["haken", `Hinten ${a.ends} passende Ziffern, vorne dann noch 3, in der Mitte noch 2: ${a.ends} · 3 · 2 = ${a.answer}.`]],
      ungerade: (a) => [["paar", "Ob eine Zahl ungerade ist, entscheidet nur die letzte Ziffer."], ["haken", `Hinten ${a.ends} passende Ziffern, vorne dann noch 3, in der Mitte noch 2: ${a.ends} · 3 · 2 = ${a.answer}.`]],
      laternen: (a) => [["zaun", `${a.L} : ${a.g} = ${a.gaps} Abstände, also ${a.P} Pfähle.`], ["regel", `Laternen an Pfahl 1, dann alle ${a.k} Pfähle: ${a.gaps} : ${a.k}, abgerundet, und die erste dazu: ${a.answer}.`]],
      mauerwaage: (a) => [["waage", `Ersetzen: Die Mitte ist ${a.m} Ecken und zählt oben doppelt. Oben stecken ${a.parts} Ecken drin. ${a.T} : ${a.parts} = ${a.answer}.`], ["mauer", `Probe: unten ${a.answer}, ${a.mid}, ${a.answer} ergibt oben ${a.T}.`]],
    },
    round: {
      title: "Der Gipfel",
      intro: "Der Gipfel. Fünf Aufgaben aus dem ganzen Berg, dazu eine, die zwei Werkzeuge braucht. Keine Uhr, keine Punkte.",
      pick: "Mit welchem Werkzeug fängst du an?",
      goodPick: (name) => `${name}. Gute Wahl.`,
      tryPick: (name) => `${name}. Probier es. Am Ende siehst du, was alles passt.`,
      camp: (name) => `Aus „${name}“.`,
      family: "Neu: Hier brauchst du zwei Werkzeuge.",
      done: "Runde geschafft.",
      logTitle: "Logbuch",
      log: (day, first, n) => `Gipfel, Tag ${day}: ${first} von ${n} beim ersten Versuch. ${Number(first) === Number(n) ? "Die Eule staunt." : "Die Eule hat aufgegeben. Ich nicht."}`,
      again: "Noch eine Runde",
      back: "Zum Berg",
      closed: "Der Gipfel öffnet sich, wenn alle Lager geschafft sind.",
    },
  },
};
