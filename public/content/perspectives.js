// The five perspectives. The ids, icons and order are the same on every map and in every saved record;
// only the names can change per map (`perspectiveNames` in universe.js, texts in lang/<language>.js under
// perspectives.<names>.<id>). See docs/DESIGN.md, section 5.

export const PERSPECTIVES = [
  { id: "sehen", icon: "👁️", card: "vergleichen" }, // standard: see        · berg: understand
  { id: "machen", icon: "✋", card: "ausprobieren" }, // standard: make       · berg: try out
  { id: "forschen", icon: "🔍", card: "vorhersagen" }, // standard: explore    · berg: find the rule
  { id: "anwenden", icon: "🔑", card: "rueckwaerts" }, // standard: use        · berg: transfer
  { id: "pruefen", icon: "✅", card: "nachpruefen" }, // standard: check      · berg: explain why
];

/** Thinking cards: the move a child used. A round gives one. */
export const CARDS = {
  vergleichen: "⚖️",
  ausprobieren: "🧪",
  vorhersagen: "🔮",
  rueckwaerts: "↩️",
  nachpruefen: "🧐",
  teilen: "🤝",
  wiederholen: "🔁",
  luecken: "🪵",
};
