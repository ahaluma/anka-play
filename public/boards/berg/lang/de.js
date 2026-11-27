// The words every camp of the Berg shares (the owl, the rule table, the number pad, "solved, and this works too",
// the backpack, the names of the camps and their thinking tools), Deutsch. Ported from think-lab (welt/lang/de.js,
// section "berg") as they were; each camp's language file brings them along (ideas/<camp>/lang/de.js).
export default {
  // ---------- Der Denk-Berg (welt/berg/): die Karte und das erste Lager "Zaun"
  berg: {
    title: "Denk-Berg",
    // Auf dem Berg heißen die fünf Perspektiven wie die Schritte einer Mathematikerin, eines Mathematikers.
    perspectives: { sehen: "Verstehen", machen: "Ausprobieren", forschen: "Regel finden", anwenden: "Übertragen", pruefen: "Begründen" },
    mapLabel: "Der Denk-Berg: such dir ein Lager aus",
    whereTo: "Expedition Denk-Berg. Ausrüstung: Kopf. Ziel: ganz oben.",
    fogLabel: "Nebel über dem Berg",
    fog: "Oben ist Nebel. Hol dir hier alle fünf Sterne ⭐, dann lichtet er sich.",
    // Der Stern einer Perspektive: eine Runde mit 4 von 5 richtig beim ersten Versuch
    star: "Ein Stern ⭐ für diesen Weg!",
    allStars: "Alle fünf Sterne ⭐! Auf der Karte wartet etwas Neues.",
    noStar: (first, n) => `Für den Stern ⭐ brauchst du 4 von 5 beim ersten Versuch. Diesmal: ${first} von ${n}.`,
    starLabel: "Stern geholt",
    fogBuilding: "Oben ist Nebel. Da wird gerade noch gebaut. Bald geht es weiter.",
    // Das Werkzeug jedes Lagers, kurz (für das Erinnerungsbild)
    tools: {
      zaun: "Lücken zählen", haken: "Alle der Reihe nach", huetten: "Ausschließen", vorrat: "Rückwärts denken",
      ameisen: "Regel finden", waage: "Ersetzen", stall: "Annehmen und verbessern", tanz: "Paare bilden",
      fels: "Ordentlich zählen", socken: "Der schlimmste Fall", steine: "Vom Ende her", mauer: "Eingrenzen",
    },
    // Ein neues Lager erreicht: die Überraschung und das Erinnerungsbild
    keep: {
      title: "Neues Lager erreicht!",
      text: (camp) => `Der Nebel ist weg. Vor dir: ${camp}.`,
      offer: "Hier ist ein Erinnerungsbild für dich.",
      save: "Bild speichern",
      saved: "Gespeichert.",
      close: "Weiter klettern",
      alt: "Erinnerungsbild vom Denk-Berg",
      headline: (name, rank) => (name ? `${name} hat Lager ${rank} erreicht` : `Lager ${rank} erreicht`),
      summitTitle: "Gipfel erreicht!",
      summitText: "Alle zwölf Lager geschafft. Ganz oben warten jetzt die Wettbewerbsrunden.",
      summitHeadline: (name) => (name ? `${name} hat den Gipfel erreicht` : "Gipfel erreicht"),
      tools: (list) => `Gemeistert: ${list.join(", ")}`,
      solved: (n) => `${n} Aufgaben am Berg gelöst`,
      locale: "de-DE",
    },
    // Der Rucksack: eine Aufgabe aus einem früheren Lager mitten in der Runde
    pack: (name) => `Rucksack! Eine Aufgabe aus „${name}“.`,
    pad: { answer: "Deine Antwort", erase: "Löschen", check: "Prüfen" },
    solved: {
      title: "Gelöst! Und so geht es auch:",
      next: "Weiter",
    },
    // Die Eule und die Tabelle: in jedem Lager gleich (berg/camp.js)
    owl: {
      ask: (said) => `Die Eule sagt sofort: „${said}!“ Stimmt das?`,
      lookAgain: "Nicht so schnell. Zähl selbst nach.",
      fix: "Die Eule irrt. Was ist richtig?",
      right: "Die Eule hat recht. Das passiert. Manchmal.",
      fixed: "Richtig gezählt!",
      why: "Und warum hat sich die Eule verzählt?",
      reasonMiss: "Hm. Rechne mit dieser Idee nach. Kommt die Zahl der Eule heraus?",
      reasonRight: "Genau das war der Fehler. Die Eule tut so, als hätte sie es gewusst.",
    },
    table: {
      next: (x) => `Und bei ${x}?`,
      look: "Schau, wie die Zahlen von Zeile zu Zeile wachsen.",
      good: "Genau. Jetzt die echte Frage.",
      hint: "Wie wird aus einer Zeile die nächste? Vergleiche die Zahlen rechts.",
    },
    pickWay: "Wie möchtest du spielen?",
    toWorld: "Zur Stadt",
    door: "Zum Denk-Berg",
    doorNote: "Knobeln wie bei der Mathe-Olympiade",
    camps: {
      zaun: "Lager 1: Der Zaun",
      haken: "Lager 2: Alle der Reihe nach",
      huetten: "Lager 3: Wer wohnt wo?",
      vorrat: "Lager 4: Rückwärts denken",
      ameisen: "Lager 5: Die Regel finden",
      waage: "Lager 6: Die Waage",
      stall: "Lager 7: Köpfe und Beine",
      tanz: "Lager 8: Paare bilden",
      fels: "Lager 9: Formen zählen",
      socken: "Lager 10: Der schlimmste Fall",
      steine: "Lager 11: Vom Ende her",
      mauer: "Lager 12: Die Zahlenmauer",
      gipfel: "Der Gipfel",
    },
  },
};
