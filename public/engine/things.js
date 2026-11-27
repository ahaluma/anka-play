// The animals and things that number tasks count and compare, shared by every idea, so they look the same
// everywhere. Their names (one / many) are in lang/<language>.js under "things". A recipe draws one with
// ["thing"] or names a list of ids; a board shows the icon. A value that is not an id is drawn as it is
// (an idea may count its own emoji, like the flowers of the meadow).

export const THINGS = {
  apple: "🍎", fish: "🐟", ship: "🚢", ladybird: "🐞", flower: "🌼", duck: "🦆", star: "⭐", balloon: "🎈",
  snail: "🐌", strawberry: "🍓", elephant: "🐘", rhino: "🦏", unicorn: "🦄", giraffe: "🦒", lion: "🦁",
  dinosaur: "🦕", turtle: "🐢", penguin: "🐧", octopus: "🐙", butterfly: "🦋", frog: "🐸", owl: "🦉",
  crab: "🦀", car: "🚗", banana: "🍌", carrot: "🥕", kangaroo: "🦘", whale: "🐳", crocodile: "🐊", ant: "🐜",
  rabbit: "🐰", fox: "🦊", shark: "🦈", panda: "🐼", bee: "🐝", nut: "🌰",
};

export const THING_IDS = Object.keys(THINGS);

/** The icon of a thing id, or the value itself (an emoji). */
export const icon = (x) => THINGS[x] ?? x;
