// What every camp of the Berg has in common (ideas/<camp>/idea.js spreads it). Four levels, the same for every
// child of 9 to 12: the mountain is climbed from below, so every child starts at level 1 (the first camp's
// first-visit questions may start a child higher, content/universe.js). The five perspectives under the
// mountain's own names (understand, try out, find the rule, transfer, explain why: lang perspectives.berg).
//
// Mastered (what opens the camps above, content/universe.js): all five perspectives starred at level 1 or
// higher, as in think-lab, where a camp with its five stars opened the next ones. The levels above are for
// going deeper, they never hold a child back on the way up.

export const CAMP = {
  ported: true, // sentences as in think-lab: the board calls them with number words (engine/ui/ported.js)
  levels: true, // the groups are levels (1 to 4), not number ranges
  ladder: [
    { id: "1", group: "1", age: 9, params: { range: 1 } },
    { id: "2", group: "2", age: 9, params: { range: 2 } },
    { id: "3", group: "3", age: 9, params: { range: 3 } },
    { id: "4", group: "4", age: 9, params: { range: 4 } },
  ],
  start: { at: "1" },
  mastery: "1",
  perspectives: ["sehen", "machen", "forschen", "anwenden", "pruefen"],
};
