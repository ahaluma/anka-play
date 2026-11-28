// Sentences of the idea "wuerfel" (buildings of boxes, plans, nets), Deutsch. The board calls them with numbers
// already in the digits of the language.

export default {
  wuerfel: {
    intro: {
      sehen: "Wie viele Kisten sind es?",
      machen: "Schreib den Bauplan.",
      forschen: "Wird das ein Würfel?",
      anwenden: "Welcher Bauplan passt?",
      pruefen: "Die Eule zählt Kisten. Stimmt das?",
    },
    back: "hinten",
    front: "vorne",
    count: (n) => `Es sind ${n} Kisten.`,
    hint: "Zähl Turm für Turm. Unter jeder oberen Kiste stehen die anderen, auch wenn man sie nicht sieht.",
    sehen: {
      ask: "Wie viele Kisten sind es?",
      miss: "Zähl Turm für Turm, von unten nach oben.",
    },
    machen: {
      ask: "Schreib den Bauplan: Tipp in jedes Feld, bis die Zahl stimmt. Jede Zahl sagt, wie viele Kisten übereinander stehen.",
      check: "Fertig",
      mirror: "Links und rechts sind vertauscht. Links im Plan ist links am Gebäude.",
      flip: "Vorne und hinten sind vertauscht. Oben im Plan ist hinten.",
      miss: "Ein Turm stimmt noch nicht. Vergleiche Turm für Turm.",
      done: "Der Bauplan stimmt.",
      hint: "Oben im Plan ist hinten, unten ist vorne. Zähl bei jedem Turm, wie hoch er ist.",
      plan: "Dein Plan",
      built: "Dein Gebäude",
    },
    forschen: {
      ask: "Kann man diese sechs Quadrate zu einem Würfel falten?",
      missYes: "Falte in Gedanken. Die roten Quadrate landen auf derselben Seite.",
      missNo: "Doch! Leg ein Quadrat als Boden und klapp die anderen hoch.",
      doneYes: "Das ist ein Würfelnetz. Gleiche Farben liegen am Würfel gegenüber.",
      doneNo: "Das wird kein Würfel. Die roten Quadrate landen auf derselben Seite.",
      hint: "Ein Würfel hat sechs Seiten. Klapp in Gedanken alle Quadrate um das mittlere hoch: Liegen zwei aufeinander?",
    },
    anwenden: {
      ask: "Welcher Bauplan passt zu dem Gebäude?",
      miss: "Vergleiche Turm für Turm. Oben im Plan ist hinten, links ist links.",
      done: "Dieser Plan passt.",
      hint: "Such zuerst den höchsten Turm. Wo steht er im Plan?",
    },
    why: {
      tops: "Sie hat nur die oberen Kisten gezählt.",
      seen: "Sie hat nur gezählt, was sie sieht. Die Kisten dahinter und darunter fehlen.",
      twice: "Sie hat eine Kiste doppelt gezählt.",
    },
    pruefen: {
      ask: (said) => `Die Eule sagt: Es sind ${said} Kisten. Stimmt das?`,
      said: (said) => `${said} Kisten`,
      look: "Zähl selbst, Turm für Turm.",
      fix: (why) => `Gut aufgepasst! ${why} Wie viele sind es wirklich?`,
      fixMiss: "Zähl Turm für Turm. Auch die Kisten, die man nicht sieht.",
      hint: "Die Eule vergisst gern die Kisten, die man nicht sieht.",
    },
  },
};
