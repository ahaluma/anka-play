// The reusable boards: every task is drawn by one of these, configured by the task's data.
// An idea does not write drawing code; it names a board and fills its fields (in a recipe, see
// ideas/zahl/idea.js). See docs/DESIGN.md, section 6, for the reasoning and for where this stops.
//
// Each board takes:   show  what is on the board (data, below)
//                     answer one of ANSWERS
// and every board can carry the same extras: hide (cover part of the board after a moment), owl (the owl
// claims something and the child checks it), story (picture steps shown one after the other).

/** How a child answers. The band decides the default (universe.js BANDS): up to 10 choose, from 20 type. */
export const ANSWERS = {
  choose: { takes: "one of options" }, // 3 buttons: numbers (with dots up to 10), words or pictures
  type: { takes: "a number" }, // the number pad
  tapThings: { takes: "a set of thing ids" }, // tap things on the board (all triangles, every corner)
  build: { takes: "a count or a list" }, // add / remove / move things until it is right
  order: { takes: "a list" }, // put pictures in order
  place: { takes: "a position" }, // tap the place on a line, a grid or a table
  yesNo: { takes: "true or false" }, // checking the owl
};

/** The boards. `show` lists the fields a recipe fills; everything else is drawing. */
export const BOARDS = {
  menge: { show: ["things", "n", "layout: rows5 | tenframe | scatter | groups", "groups?", "flash?"] }, // a set of things
  vergleich: { show: ["left: menge", "right: menge", "ask: more | fewer | same | difference"] }, // two sets side by side
  teile: { show: ["whole", "parts: [n, …]", "hidden: index?", "container: burrow | leaf | box"] }, // a whole and its parts
  reihe: { show: ["from", "to", "step", "marks", "missing?", "pointer?", "look: stones | bridge | ruler"] }, // number line / track
  stellen: { show: ["hundreds", "tens", "ones", "look: flowers | sticks | notes"] }, // place value as bundles
  rechnung: { show: ["a", "op", "b", "c", "gap: a | b | c", "picture?: menge"] }, // a sum with a gap, with or without picture
  folge: { show: ["items: [thing]", "missing?", "unit?"] }, // a row of pictures: patterns and stories
  koerbe: { show: ["things", "baskets: [rule | null]"] }, // sorting
  bild: { show: ["scene", "objects: [{thing, at, relation}]"] }, // a small scene: where is it? spot the difference
  formen: { show: ["shapes: [{kind, turn, size, at}]", "solid?", "mirror?", "ruler?"] }, // SVG shapes and solids
  uhr: { show: ["h", "m", "hands?: set | read"] }, // the clock
  geld: { show: ["pieces: [euro]", "price?", "wallet?"] }, // coins and notes
  waage: { show: ["left: [thing]", "right: [thing]", "tilt?"] }, // balance
  tabelle: { show: ["rows", "cols", "cells", "chart?: pictures | bars"] }, // tables and charts
  raster: { show: ["w", "h", "cells", "path?"] }, // a grid: ways, boards, colouring
  text: { show: ["lines", "picture?"] }, // a word problem with one picture (mountain, market square)
};

/** Shared mistake kinds, so the parents' page can say "often swaps digits" across stations.
 *  An idea may add its own kinds in its idea.js. */
export const MISTAKES = {
  oneOff: { says: "eins daneben" },
  swappedDigits: { says: "Ziffern vertauscht" },
  forgotTen: { says: "Zehner vergessen" },
  wrongOp: { says: "falsche Rechenart" },
  smallerFromBigger: { says: "kleinere von größerer" },
  countedPieces: { says: "Stücke statt Wert gezählt" },
  postsVsGaps: { says: "Pfähle statt Lücken" },
};
