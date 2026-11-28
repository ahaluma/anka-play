// The perspectives. The ids, icons and order are the same on every map and in every saved record;
// only the names can change per map (`perspectiveNames` in universe.js, texts in lang/<language>.js under
// perspectives.<names>.<id>). See docs/DESIGN.md, section 7.
//
// A station has 1 to 5 perspectives: its idea lists the ones it has (`perspectives` in ideas/<id>/idea.js),
// in this order, unless the idea needs another one: the Teich starts with Machen, the hands before the picture.
// The list's order is the order the station shows them and the owl leads through them. A concept idea usually has all five; a station that is only a game (number memory)
// has the one perspective "spielen". Stars, flags, "mastered" and moving up count the station's OWN
// perspectives, never a fixed five. A pure game ("spielen") has no stars to earn: its station is always
// open and counts as mastered from the start (`game: true` in universe.js).

export const PERSPECTIVES = [
  { id: "sehen", icon: "👁️", card: "vergleichen" }, // standard: see        · berg: understand
  { id: "machen", icon: "✋", card: "ausprobieren" }, // standard: make       · berg: try out
  { id: "forschen", icon: "🔍", card: "vorhersagen" }, // standard: explore    · berg: find the rule
  { id: "anwenden", icon: "🔑", card: "rueckwaerts" }, // standard: use        · berg: transfer
  { id: "pruefen", icon: "✅", card: "nachpruefen" }, // standard: check      · berg: explain why
  { id: "spielen", icon: "🎲", card: "ausprobieren", alone: true }, // a game: play (never mixed with the five)
];

/** The rules for an idea's list of perspectives. tools/check-ideas.mjs checks every idea against them. */
export function checkPerspectives(list) {
  const ids = PERSPECTIVES.map((p) => p.id);
  if (!Array.isArray(list) || list.length < 1 || list.length > 5) return "an idea has 1 to 5 perspectives";
  if (list.some((p) => !ids.includes(p))) return `unknown perspective in ${list}`;
  if (list.includes("spielen") && list.length > 1) return '"spielen" stands alone';
  if (new Set(list).size !== list.length) return `a perspective comes twice in ${list}`;
  return null;
}

/** How many starred perspectives move a child up a group: 3 of 5, 3 of 4, 2 of 3, 2 of 2, 1 of 1. */
export const starsToMoveUp = (count) => Math.ceil(count * 0.6);

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
