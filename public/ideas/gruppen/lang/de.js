// Sätze/sentences of the idea "gruppen", Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/gruppen/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"

export default {
  gruppen: {
    intro: {
      sehen: "In jedem Nest liegen gleich viele Eier.",
      machen: "Teil gerecht! Jedes Tier bekommt gleich viele.",
      forschen: "Erst denken: Bekommt jedes Tier gleich viele?",
      anwenden: "Kirschen für die Vögel. Für wie viele reicht es?",
      pruefen: "Die Eule hat geteilt. Ist das gerecht?",
    },
    bigger: "Das kannst du gut! Bald gibt es mehr zu teilen.",
    smaller: "Bald gibt es weniger zu teilen.",
    sehen: {
      all: "In jedem Nest liegen gleich viele Eier.",
      sit: "Die Henne setzt sich auf ein Nest.",
      ask: "Wie viele Eier liegen unter der Henne?",
      miss: "Schau in ein anderes Nest. Überall liegen gleich viele.",
      done: (k) => `In jedem Nest liegen ${k}.`,
      hint: "Zähl die Eier in einem anderen Nest.",
    },
    machen: {
      ask: "Teil alles auf! Jedes Tier bekommt gleich viele.",
      miss: "Noch nicht gerecht. Ein Tier hat mehr.",
      done: (k) => `Gerecht! Jedes Tier hat ${k}.`,
      hint: "Gib jedem Tier eins. Dann wieder jedem eins.",
      animal: "Tier",
      pile: "Haufen",
      check: "Fertig",
    },
    forschen: {
      ask: "Erst denken: Bekommt jedes Tier gleich viele?",
      yes: "Ja, das geht",
      no: "Nein, etwas bleibt übrig",
      watch: "Schau, wir teilen aus.",
      fair: (k) => `Es geht auf. Jedes Tier bekommt ${k}.`,
      unfair: (n, rest) => (n === 1 ? "Eins bleibt übrig." : `${big(rest)} bleiben übrig.`),
      hint: "Gib in Gedanken jedem Tier eins. Dann wieder jedem eins.",
    },
    anwenden: {
      story: (total, k) => [`Hier sind ${total} Kirschen.`, `Jeder Vogel bekommt ${k}.`, "Für wie viele Vögel reicht es?"],
      miss: "Schau: So viele bekommt ein Vogel.",
      done: (g, k) => `Es reicht für ${g} Vögel. Jeder hat ${k}.`,
      hint: "Schau: Immer so viele gehören zusammen. Zähl die Gruppen.",
    },
    pruefen: {
      ask: "Die Eule hat geteilt. Hat jedes Tier gleich viele?",
      lookAgain: "Zähl bei jedem Tier nach!",
      fix: "Gut aufgepasst! Wer hat zu viele? Tipp darauf.",
      fixMiss: "Dieses Tier hat nicht zu viele. Such weiter!",
      right: (k) => `Ja! Jedes Tier hat ${k}.`,
      fixed: (k) => `Jetzt ist es gerecht: Jedes Tier hat ${k}.`,
      hint: "Schau auf die Zahlen. Wer hat mehr?",
    },
  },
};
