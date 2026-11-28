// The universe of AnkaPlay: every map, every station and every connection, as plain data.
// This file is the design in a form the engine can read. engine/graph.js answers questions about it,
// tools/check-graph.mjs checks it. See docs/DESIGN.md, sections 3 to 6.
//
// Words:
//   map      one simple natural scene with a few memorable landmarks (a big tree, a stream, a bridge)
//   station  one place on a map with its own background. It serves one or more ideas (`ideas`), each in 1 to 5
//            perspectives. With several ideas the station first shows a choice of ideas, then their perspectives.
//            An idea lives at one station only, so a child's progress in it has one home.
//   edge     a directed connection between two stations:
//              "path"     inside one map
//              "portal"   from a station on one map to a station on another map
//              "relation" only says how related two ideas are (nearness); nobody walks it
//            Home is added by the engine: every map has an always-open way Home, nothing can block it.
//   requires the condition of an edge (null = always open)
//   open     the condition of a station's door ("always" or a condition)
//   nearness 0 to 1, how closely the two ideas are related. Related stations sit near each other on a map.
//            Nearness also guides the child's journey (`guide` of a map): see engine/graph.js, next() and glimpse().
//   game     a station that is a pure game (one perspective, "spielen"): always open, mastered from the start,
//            no stars to earn. It never blocks anything that depends on it.
//   pos      (portals) where the way to the other map is drawn on this map: the stepping stones, the bridge
//   gate     questions a portal asks on the child's FIRST visit to its target. It always lets the child
//            pass; the answers only choose the rung the child starts on.
//
// There is no fixed number of maps: add as many as the content needs (an entry in MAPS, its stations, a portal,
// a Home door). Nothing in the engine or the checkers names a map.
//
// Positions are in a 1000 × 600 picture of the map. A station listed in `shows` is always drawn and can be
// tapped from the map. Any other station appears once the child has been there, or once an open path from a
// drawn station leads to it ("the fog lifts when the way opens").

/** Audience bands. Preschool concept learning and school calculation are never mixed (no review tasks,
 *  no suggestions across bands). */
export const BANDS = {
  vorschule: { ages: [3, 6], answers: "choose" },
  schule: { ages: [6, 10], answers: "type-from-20" },
  olympiade: { ages: [9, 12], answers: "type" },
};

export const HOME = "home";

export const MAPS = [
  {
    id: "tal",
    guide: "tour", // how nearness guides the journey here: tour | hint | glimpse
    band: "vorschule",
    policy: "tal",
    perspectiveNames: "standard",
    reward: "flowers", // every round finished at a station grows a flower there on the map (as think-lab's nature world)
    entry: "wiese",
    landmarks: [
      { id: "bach", pos: { x: 120, y: 470 } }, // the stream along the bottom
      { id: "grosser-baum", pos: { x: 330, y: 230 } },
      { id: "teich", pos: { x: 470, y: 420 } },
      { id: "huegel", pos: { x: 760, y: 220 } },
      { id: "wolke", pos: { x: 330, y: 50 } },
    ],
    shows: ["wiese", "bau", "obstbaum", "wald", "huegel", "himmel", "baumstumpf"],
  },
  {
    id: "fluss",
    guide: "hint", // how nearness guides the journey here: tour | hint | glimpse
    band: "schule",
    policy: "fluss",
    perspectiveNames: "standard",
    entry: "steg",
    landmarks: [
      { id: "fluss", pos: { x: 500, y: 330 } },
      { id: "bruecke", pos: { x: 230, y: 330 } },
      { id: "weide", pos: { x: 520, y: 130 } },
      { id: "kiesbank", pos: { x: 760, y: 450 } },
      { id: "grosser-fels", pos: { x: 830, y: 150 } },
    ],
    shows: ["steg", "blumenfeld", "kiesbank", "sonnenfels"],
  },
  {
    id: "feld",
    guide: "hint", // how nearness guides the journey here: tour | hint | glimpse
    band: "schule",
    policy: "feld",
    perspectiveNames: "standard",
    entry: "apfelbaum",
    landmarks: [
      { id: "feldweg", pos: { x: 500, y: 560 } },
      { id: "obstgarten", pos: { x: 220, y: 200 } },
      { id: "huehnerhof", pos: { x: 760, y: 200 } },
      { id: "lichtung", pos: { x: 500, y: 320 } },
    ],
    shows: ["apfelbaum", "beeren", "huehner", "nussbaum", "lichtung", "hofstand", "scheune"],
  },
  {
    id: "berg",
    guide: "glimpse", // how nearness guides the journey here: tour | hint | glimpse
    band: "olympiade",
    policy: "berg",
    perspectiveNames: "berg", // understand, try out, find the rule, transfer, explain why
    askFeel: true, // the only map that asks "how was it?" after a round (decided: it stays on the mountain)
    look: "paper", // stations and rounds on squared notebook paper, as think-lab's Denk-Berg: a logbook, not a picture book
    keepsake: true, // a camp that comes out of the fog is a surprise, with a picture to save (boards/berg/keepsake.js)
    entry: "zaun",
    landmarks: [
      { id: "fuss", pos: { x: 500, y: 570 } },
      { id: "wasserfall", pos: { x: 180, y: 300 } },
      { id: "gipfel", pos: { x: 500, y: 40 } },
    ],
    shows: ["zaun"],
  },
];

/** The stations. `ideas` names the folders ideas/<idea>/ with their ladders, recipes and texts; `icon` is the
 *  station's sign on the map. The ids of think-lab's ideas are kept, so their content can be ported one to one. */
export const STATIONS = [
  // Tal (preschool, 3 to 6): concepts with things and pictures, numbers up to 10, no signs.
  { id: "wiese", map: "tal", ideas: ["zahl"], icon: "🌼", landmark: "bach", pos: { x: 200, y: 430 } }, // a number says how many; more, fewer, the same
  { id: "bau", map: "tal", ideas: ["teile"], icon: "🐇", landmark: "grosser-baum", pos: { x: 320, y: 320 } }, // numbers are made of numbers
  { id: "baumstumpf", map: "tal", ideas: ["memory"], icon: "🪵", game: true, landmark: "bach", pos: { x: 90, y: 330 } }, // number memory: a pure game
  { id: "teich", map: "tal", ideas: ["zehn"], icon: "🦆", landmark: "teich", pos: { x: 460, y: 400 } }, // friends of five and ten
  { id: "obstbaum", map: "tal", ideas: ["gruppen"], icon: "🍎", pos: { x: 160, y: 230 } }, // groups of the same size, sharing fairly
  { id: "wald", map: "tal", ideas: ["muster"], icon: "🌲", pos: { x: 90, y: 90 } }, // a row goes on
  { id: "himmel", map: "tal", ideas: ["folge"], icon: "☁️", landmark: "wolke", pos: { x: 260, y: 70 } }, // first and then
  { id: "nester", map: "tal", ideas: ["sortieren"], icon: "🪺", pos: { x: 430, y: 100 } }, // what belongs together
  { id: "pfuetze", map: "tal", ideas: ["schauen"], icon: "💧", pos: { x: 580, y: 160 } }, // look closely
  { id: "huegel", map: "tal", ideas: ["lage"], icon: "⛰️", landmark: "huegel", pos: { x: 760, y: 260 } }, // where is it?
  { id: "kiesel", map: "tal", ideas: ["form"], icon: "🪨", pos: { x: 870, y: 400 } }, // circle, triangle, square
  { id: "ufer", map: "tal", ideas: ["groesse"], icon: "📏", pos: { x: 590, y: 470 } }, // longer, higher, heavier

  // Fluss (school, 6 to 10): numbers, space and time. What was the station, the flower shop, the workshop
  // and the weather station of the town, now in a river scene.
  { id: "steg", map: "fluss", ideas: ["reihe", "runden"], icon: "🌉", landmark: "bruecke", pos: { x: 230, y: 380 } }, // the long footbridge is the number line; rounding: which round neighbour is nearer
  { id: "blumenfeld", map: "fluss", ideas: ["stellen"], icon: "💐", pos: { x: 330, y: 160 } }, // tens and ones: bunches and baskets
  { id: "kiesbank", map: "fluss", ideas: ["formen"], icon: "🔷", landmark: "kiesbank", pos: { x: 760, y: 430 } }, // shapes, solids, mirror in the water, ruler
  { id: "muehle", map: "fluss", ideas: ["masse"], icon: "🌾", landmark: "fluss", pos: { x: 600, y: 300 } }, // sizes and units at the water mill
  { id: "sonnenfels", map: "fluss", ideas: ["zeit"], icon: "☀️", landmark: "grosser-fels", pos: { x: 820, y: 180 } }, // clock, calendar, charts, chance

  // Feld (school, 6 to 10): calculation, what was the market. Natural scene: the edge of a field.
  { id: "apfelbaum", map: "feld", ideas: ["plus"], icon: "🍏", landmark: "obstgarten", pos: { x: 200, y: 260 } },
  { id: "beeren", map: "feld", ideas: ["minus"], icon: "🫐", landmark: "obstgarten", pos: { x: 330, y: 150 } },
  { id: "huehner", map: "feld", ideas: ["mal"], icon: "🐔", landmark: "huehnerhof", pos: { x: 700, y: 170 } }, // eggs in rows
  { id: "nussbaum", map: "feld", ideas: ["geteilt"], icon: "🌰", pos: { x: 820, y: 300 } }, // sharing nuts
  { id: "lichtung", map: "feld", ideas: ["platz"], icon: "🏕️", landmark: "lichtung", pos: { x: 500, y: 330 },
    open: { all: [{ flag: { station: "apfelbaum", group: "10" } }, { flag: { station: "beeren", group: "10" } }] } },
  { id: "hofstand", map: "feld", ideas: ["geld"], icon: "🧺", landmark: "feldweg", pos: { x: 500, y: 520 } }, // money at a farm stand
  // written calculation in the barn: from 8, or once plus and minus up to 100 have their flags (two-digit numbers
  // are the smallest case of the method)
  { id: "scheune", map: "feld", ideas: ["schriftlich"], icon: "🏚️", landmark: "feldweg", pos: { x: 800, y: 470 },
    open: { any: [{ age: 8 }, { all: [{ flag: { station: "apfelbaum", group: "100" } }, { flag: { station: "beeren", group: "100" } }] }] } },

  // Berg (Mathe-Olympiade, 9 to 12): twelve camps in four heights and the summit, in think-lab's order (camp 1 to 12).
  { id: "zaun", map: "berg", ideas: ["zaun"], icon: "🪵", pos: { x: 500, y: 520 } },
  { id: "haken", map: "berg", ideas: ["haken"], icon: "✔️", pos: { x: 330, y: 470 } },
  { id: "huetten", map: "berg", ideas: ["huetten"], icon: "🛖", pos: { x: 250, y: 380 } },
  { id: "vorrat", map: "berg", ideas: ["vorrat"], icon: "🎒", pos: { x: 380, y: 330 } },
  { id: "ameisen", map: "berg", ideas: ["ameisen"], icon: "🐜", pos: { x: 680, y: 450 } },
  { id: "waage", map: "berg", ideas: ["waage"], icon: "⚖️", pos: { x: 470, y: 260 } },
  { id: "stall", map: "berg", ideas: ["stall"], icon: "🐄", pos: { x: 360, y: 190 } },
  { id: "tanz", map: "berg", ideas: ["tanz"], icon: "💃", pos: { x: 690, y: 330 } },
  { id: "fels", map: "berg", ideas: ["fels"], icon: "🪨", landmark: "wasserfall", pos: { x: 170, y: 270 } },
  { id: "socken", map: "berg", ideas: ["socken"], icon: "🧦", pos: { x: 610, y: 190 } },
  { id: "steine", map: "berg", ideas: ["steine"], icon: "🗿", pos: { x: 740, y: 200 } },
  { id: "mauer", map: "berg", ideas: ["mauer"], icon: "🧱", pos: { x: 470, y: 140 } },
  { id: "gipfel", map: "berg", ideas: ["gipfel"], icon: "🏔️", landmark: "gipfel", pos: { x: 500, y: 60 } },
];

// Small helpers so the edge list below stays readable.
const both = (a, b, nearness, extra = {}) => [
  { from: a, to: b, kind: "path", nearness, requires: null, ...extra },
  { from: b, to: a, kind: "path", nearness, requires: null },
];
const up = (a, b, nearness, requires) => [
  { from: a, to: b, kind: "path", nearness, requires },
  { from: b, to: a, kind: "path", nearness, requires: null }, // going back down is always allowed
];
const rel = (a, b, nearness) => [{ from: a, to: b, kind: "relation", nearness }];
const mastered = (...ids) => ({ mastered: ids });

/** The third way into the Berg: the school basics mastered. */
export const BERG_BASICS = mastered("steg", "blumenfeld", "apfelbaum", "beeren");

export const EDGES = [
  // ---- Tal: hubs and the stations behind them -------------------------------------------------
  ...both("wiese", "bau", 0.8),
  ...both("bau", "teich", 0.9),
  ...both("wiese", "obstbaum", 0.6),
  ...both("wiese", "baumstumpf", 0.7), // number memory: how many, matched to the digit
  ...both("obstbaum", "wald", 0.4),
  ...both("wald", "himmel", 0.7), // a row goes on / first and then: both are about order
  ...both("himmel", "nester", 0.5),
  ...both("nester", "pfuetze", 0.6),
  ...both("pfuetze", "huegel", 0.4),
  ...both("huegel", "kiesel", 0.6),
  ...both("huegel", "ufer", 0.6),
  ...both("kiesel", "ufer", 0.6),
  ...both("teich", "ufer", 0.3),
  ...rel("wiese", "ufer", 0.5), // comparing amounts / comparing sizes

  // ---- Fluss ----------------------------------------------------------------------------------
  ...both("steg", "blumenfeld", 0.8),
  ...both("blumenfeld", "sonnenfels", 0.3),
  ...both("steg", "kiesbank", 0.4), // the ruler is a number line
  ...both("kiesbank", "sonnenfels", 0.3),
  ...both("kiesbank", "muehle", 0.6), // the ruler / units of length
  ...both("blumenfeld", "muehle", 0.4), // ten of one make one of the next / 100 cm make 1 m

  // ---- Feld -----------------------------------------------------------------------------------
  ...both("apfelbaum", "beeren", 0.9),
  ...both("beeren", "huehner", 0.5), // the path along the orchard: the hen yard is reachable before the clearing opens
  ...both("apfelbaum", "hofstand", 0.5), // the field path: paying is adding
  ...both("beeren", "lichtung", 0.6),
  ...both("apfelbaum", "lichtung", 0.6),
  ...both("huehner", "nussbaum", 0.9),
  ...both("huehner", "lichtung", 0.6),
  ...both("lichtung", "hofstand", 0.6),
  ...both("nussbaum", "lichtung", 0.6),
  ...both("nussbaum", "scheune", 0.6), // written divided and times, next to the nut tree
  ...both("hofstand", "scheune", 0.5), // the field path goes on to the barn

  // ---- Berg: the needs of think-lab's camps become up-paths -------------------------------------
  ...up("zaun", "haken", 0.5, mastered("zaun")),
  ...up("zaun", "ameisen", 0.6, mastered("zaun")),
  ...up("haken", "huetten", 0.5, mastered("haken")),
  ...up("haken", "fels", 0.5, mastered("haken")),
  ...up("huetten", "vorrat", 0.5, mastered("huetten")),
  ...up("ameisen", "tanz", 0.6, mastered("ameisen")),
  ...up("vorrat", "waage", 0.7, mastered("vorrat")),
  ...up("huetten", "stall", 0.4, mastered("huetten", "waage")),
  ...up("waage", "stall", 0.7, mastered("huetten", "waage")),
  ...up("huetten", "socken", 0.3, mastered("huetten", "tanz")),
  ...up("tanz", "socken", 0.5, mastered("huetten", "tanz")),
  ...up("vorrat", "steine", 0.5, mastered("vorrat", "tanz")),
  ...up("tanz", "steine", 0.5, mastered("vorrat", "tanz")),
  ...up("waage", "mauer", 0.8, mastered("vorrat", "waage")),
  ...up("vorrat", "mauer", 0.6, mastered("vorrat", "waage")),
  ...up("mauer", "gipfel", 0.5, mastered("zaun", "haken", "huetten", "vorrat", "ameisen", "waage", "stall", "tanz", "fels", "socken", "steine", "mauer")),

  // ---- Portals between maps -------------------------------------------------------------------
  // Tal -> Fluss: across the stream. School age, or the core number stations of the Tal mastered.
  {
    from: "wiese", to: "steg", kind: "portal", nearness: 0.7, icon: "stepping-stones", pos: { x: 300, y: 545 },
    requires: { any: [{ age: 6 }, mastered("wiese", "teich")] },
  },
  { from: "steg", to: "wiese", kind: "portal", nearness: 0.7, icon: "stepping-stones", pos: { x: 90, y: 300 }, requires: null },

  // Fluss <-> Feld: the bridge and the field path. The same band, always open both ways.
  {
    from: "steg", to: "apfelbaum", kind: "portal", nearness: 0.6, icon: "bridge", pos: { x: 120, y: 540 }, requires: null,
    gate: { perspective: "anwenden", levels: ["10/luecke", "20/uebergang", "100/zehner"] }, // 3 + 6, 8 + 5, 23 + 40
  },
  { from: "apfelbaum", to: "steg", kind: "portal", nearness: 0.6, icon: "bridge", pos: { x: 80, y: 420 }, requires: null },

  // Fluss -> Berg: the path up from the big rock. Three ways (decided): from 9, by the parents' switch, or by
  // playing through the school basics before it (number line, place value, plus, minus: about grade 3).
  {
    from: "sonnenfels", to: "zaun", kind: "portal", nearness: 0.3, icon: "mountain-path", pos: { x: 940, y: 70 },
    requires: { any: [{ age: 9 }, { parent: "berg" }, BERG_BASICS] },
  },
  { from: "zaun", to: "sonnenfels", kind: "portal", nearness: 0.3, icon: "mountain-path", pos: { x: 880, y: 560 }, requires: null },

  // ---- Relations across maps: related ideas, never walked --------------------------------------
  // Only between stations of the same band are they used for suggestions and review tasks.
  ...rel("wiese", "steg", 0.7), // how many / where on the line (crosses bands: shown to parents only)
  ...rel("teich", "apfelbaum", 0.7), // friends of ten / plus across ten (crosses bands)
  ...rel("obstbaum", "nussbaum", 0.8), // sharing fairly / dividing (crosses bands)
  ...rel("kiesel", "kiesbank", 0.7), // shapes / shapes and solids (crosses bands)
  ...rel("ufer", "muehle", 0.6), // heavier, longer / grams and metres (crosses bands)
  ...rel("muehle", "hofstand", 0.4), // units / euros and cents
  ...rel("himmel", "sonnenfels", 0.6), // first and then / the clock and the calendar (crosses bands)
  ...rel("blumenfeld", "apfelbaum", 0.7), // tens and ones / adding with tens
  ...rel("blumenfeld", "hofstand", 0.6), // bundling / notes and coins
  ...rel("blumenfeld", "scheune", 0.6), // trading a bunch for ten flowers / trading a ten in written minus
  ...rel("steg", "beeren", 0.6), // the number line / minus as distance
  ...rel("sonnenfels", "lichtung", 0.4), // reading charts / stories with numbers
  ...rel("ameisen", "huehner", 0.4), // rows and rules / times tables (crosses bands)
  ...rel("zaun", "steg", 0.4),
];

/** Home: who plays, then the maps. The engine adds one always-open edge Home <-> every map's entry,
 *  and a Home button on every screen of every map. Which maps Home shows follows the portals:
 *  a map is listed once one of its stations is reachable (engine/graph.js, reachable()). Home itself
 *  opens the map of the child's band directly: */
export const HOME_DOORS = [
  { map: "tal", requires: null },
  { map: "fluss", requires: { any: [{ age: 6 }, { reached: "fluss" }] } },
  { map: "feld", requires: { any: [{ age: 6 }, { reached: "feld" }] } },
  { map: "berg", requires: { any: [{ age: 9 }, { parent: "berg" }, BERG_BASICS, { reached: "berg" }] } },
];
