// Sentences of the idea "zahl", German. One key per recipe `ask`; every var of the task comes in as `v`.
// Sentences are small functions because each language has its own grammar.
export default {
  zahl: {
    sehen: () => "Wie viele sind es?",
    machen: (v) => `Pflücke ${v.n}.`,
    forschen: (v) => (v.back ? "Der Frosch hüpft zurück. Welcher Stein fehlt?" : "Welcher Stein fehlt?"),
    anwenden: () => "Wo sind mehr?",
    pruefen: (v) => `Die Eule sagt: Es sind ${v.claim}. Stimmt das?`,
  },
};
