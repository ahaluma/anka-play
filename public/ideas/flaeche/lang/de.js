// Sentences of the idea "flaeche" (area and perimeter), Deutsch. Slabs (Platten) are the squares, fence pieces
// (Zaunstücke) the sides. The board calls them with numbers already in the digits of the language.

export default {
  flaeche: {
    intro: {
      sehen: "Wie viele Platten? Wie viel Zaun?",
      machen: "Leg ein Beet.",
      forschen: "Zwei Beete: Welches ist größer?",
      anwenden: "Rechtecke: Länge mal Breite.",
      pruefen: "Die Eule hat gezählt. Stimmt das?",
    },
    measure: (n, grid) => (grid ? `${n} Platten` : `${n} m`),
    mixFence: "Das ist der Zaun. Gefragt sind die Platten innen.",
    mixArea: "Das sind die Platten. Gefragt ist der Zaun rundherum.",
    cellsNotFence: "Du hast die Platten am Rand gezählt. Zähl die Zaunstücke: An einer Ecke sind es zwei.",
    sehen: {
      ask: { area: "Wie viele Platten hat das Beet?", fence: "Wie viele Zaunstücke gehen rund um das Beet?" },
      miss: { area: "Zähl die grünen Platten. Tipp in Gedanken jede einmal an.", fence: "Zähl die braunen Zaunstücke ringsum. Fang an einer Ecke an." },
      hint: { area: "Zähl Reihe für Reihe.", fence: "Geh einmal ringsum. An einer Ecke sind es zwei Stücke." },
      done: { area: (n) => `Das Beet hat ${n} Platten.`, fence: (n) => `Der Zaun hat ${n} Stücke.` },
    },
    machen: {
      ask: (a) => `Leg ein Beet mit ${a} Platten. Tipp auf die Felder.`,
      askBoth: (a, f) => `Leg ein Beet mit ${a} Platten und ${f} Zaunstücken.`,
      askRect: (a) => `Leg ein Rechteck mit ${a} Platten.`,
      check: "Fertig",
      fewer: "Es fehlen noch Platten.",
      more: "Das sind zu viele Platten. Tipp eine an, dann geht sie weg.",
      notRect: "Das ist kein Rechteck. Alle Reihen müssen gleich lang sein, ohne Lücke.",
      fenceMore: "Die Platten stimmen, aber der Zaun ist zu lang. Leg die Platten enger zusammen.",
      fenceLess: "Die Platten stimmen, aber der Zaun ist zu kurz. Zieh das Beet mehr auseinander.",
      counts: (a, f) => `Platten: ${a} · Zaun: ${f}`,
      hint: "Zähl beim Legen mit.",
      hintBoth: "Eng zusammen braucht wenig Zaun, lang und dünn braucht viel Zaun.",
      hintRect: "Ein Rechteck hat gleich lange Reihen: zum Beispiel 3 Reihen mit je 4 Platten.",
      done: (a) => `Dein Beet hat ${a} Platten.`,
      doneBoth: (a, f) => `${a} Platten und ${f} Zaunstücke.`,
    },
    forschen: {
      bed: (n) => `Beet ${n}`,
      same: "Gleich",
      slabs: (n) => `${n} Platten`,
      fence: (n) => `${n} Zaunstücke`,
      ask: { area: "Welches Beet ist größer? Oder sind sie gleich groß?", fence: "Beide Beete haben gleich viele Platten. Welches braucht mehr Zaun?" },
      miss: { area: "Die Zahlen stehen jetzt da. Vergleich sie.", fence: "Die Zahlen stehen jetzt da. Vergleich sie." },
      hint: { area: "Größer heißt: mehr Platten. Die Form ist egal.", fence: "Lang und dünn hat mehr Rand als eng zusammen." },
      done: {
        area: { one: "Ja. Mehr Platten heißt mehr Fläche.", same: "Ja. Gleich viele Platten: gleich groß, auch wenn die Form anders ist." },
        fence: { one: "Ja. Gleich viele Platten, aber ein anderer Zaun.", same: "Ja. Hier ist der Zaun gleich lang." },
      },
    },
    anwenden: {
      ask: {
        area: (grid) => (grid ? "Wie viele Platten hat das Rechteck?" : "Wie viele Platten von 1 m mal 1 m passen hinein?"),
        fence: (grid) => (grid ? "Wie viele Zaunstücke gehen ringsum?" : "Wie viele Meter Zaun braucht man ringsum?"),
      },
      miss: { area: "So viele Reihen, in jeder so viele: Rechne mal.", fence: "Der Zaun geht an allen vier Seiten entlang." },
      half: "Das sind nur zwei Seiten. Der Zaun geht an allen vier Seiten entlang.",
      hint: { area: "Länge mal Breite.", fence: "Länge plus Breite plus Länge plus Breite." },
      done: {
        area: (l, w, n) => `${l} mal ${w} sind ${n}.`,
        fence: (l, w, n) => `${l} + ${w} + ${l} + ${w} = ${n}.`,
      },
    },
    why: {
      fence: "Sie hat den Zaun gezählt statt der Platten.",
      area: "Sie hat die Platten gezählt statt des Zauns.",
      cells: "Sie hat die Platten am Rand gezählt. An einer Ecke sind es aber zwei Zaunstücke.",
      twice: "Sie hat eine Platte doppelt gezählt.",
      missed: "Sie hat etwas vergessen.",
    },
    pruefen: {
      said: { area: (n) => `${n} Platten`, fence: (n) => `${n} Zaunstücke` },
      ask: (said) => `Die Eule sagt: ${said}. Stimmt das?`,
      look: { area: "Zähl die Platten selbst.", fence: "Zähl die Zaunstücke selbst." },
      fix: (why) => `Gut aufgepasst! ${why} Wie viele sind es?`,
    },
  },
};
