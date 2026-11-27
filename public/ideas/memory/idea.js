// Idea "memory" (station baumstumpf, map tal): number memory, a pure game. Cards with a number (4) and cards
// with that many things (4 apples): find the pairs. First all cards lie open, so the child only matches;
// later they lie face down, a real memory game. Ported from think-lab's games/zahlen-memory (its levels are
// the ladder here). A game has the one perspective "spielen", no stars to earn, and is open and mastered
// from the start; its level still follows the child (a round without a mistake moves on).

const level = (id, age, pairs, max, open, min = 1) => ({ id, group: id, age, params: { pairs, from: min, to: max, open } });

export const IDEA = {
  id: "memory",
  board: "memory",
  ladder: [
    level("offen-3", 3, 3, 3, true),
    level("offen-5", 4, 3, 5, true),
    level("verdeckt-3", 4, 3, 3, false),
    level("verdeckt-5", 5, 4, 5, false),
    level("verdeckt-6", 5, 4, 6, false),
    level("verdeckt-7", 6, 5, 7, false),
    level("verdeckt-8", 6, 5, 8, false),
    level("offen-10", 6, 6, 10, true),
    level("verdeckt-10", 7, 6, 10, false),
    level("verdeckt-12", 7, 6, 12, false, 5),
    level("verdeckt-15", 8, 6, 15, false, 8),
    level("verdeckt-20", 8, 6, 20, false, 11),
  ],
  start: { byAge: { 3: "offen-3", 4: "offen-5", 5: "verdeckt-5", 6: "verdeckt-7", 7: "verdeckt-10", 8: "verdeckt-15" } },
  perspectives: ["spielen"],
  roundTasks: { spielen: 3 }, // three boards are a game (think-lab: three stars)

  recipes: {
    spielen: {
      board: "memory",
      vars: {
        numbers: ["sample", ["range", "$from", "$to"], "$pairs"],
        things: ["sample", "$things", "$pairs"],
        order: ["shuffled", ["range", 0, ["-", ["*", 2, "$pairs"], 1]]], // where each card lies
      },
      answer: { mode: "own", value: null, options: null },
      ask: "memory.spielen",
      key: ["numbers"],
    },
  },
};
