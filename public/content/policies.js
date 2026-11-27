// How a child moves on an idea's ladder, as data. One engine (engine/policy.js) reads all of them.
// A map names its policy (universe.js); an idea may override single fields. See docs/DESIGN.md, section 7.
//
// Standing rules that hold in every policy and are therefore NOT fields:
//   - a perspective is mastered with 4 of 5 tasks right at the first try in one round: it gets a star,
//     at once, no waiting days;
//   - children are never asked "how was it?": weak rounds ease the difficulty by themselves;
//   - the whole question stays visible, and taps are locked while the voice reads it (at most 10 s).

const base = {
  roundSize: 5,
  good: 0.8, // share right at the first try that counts as a good round (4 of 5)
  weak: 0.4, // share at or below that counts as a weak round (2 of 5)
  star: { share: 0.8 }, // the star of a perspective in a level group
  up: { when: "starsInGroup", count: 3 }, // 3 of 5 perspectives starred in the group -> next group
  down: { when: "weakInRow", count: 2 }, // 2 weak rounds in a row -> one group down, and it stays
  easierAfter: 3, // 3 wrong in a row -> the next task is one rung easier
  hintAfter: 2, // misses before the hint shows by itself
  help: ["hint"], // the help ladder, one step per miss after hintAfter
  surprise: true, // one task from another perspective the child already played (not counted)
  placement: null, // fast moves at the start; the first-visit gate usually does this job
  learningBox: null,
  bridgeAfter: null,
  review: null, // review tasks from near stations (PROPOSED, open question 3)
};

export const POLICIES = {
  // Preschool: groups of the ladder are number ranges (5, 10) or levels (1, 2, 3).
  tal: { ...base, roundSize: 5, young: { under: 5, roundSize: 3 } },

  // School, numbers / space / time.
  fluss: { ...base, help: ["hint", "picture"] },

  // School, calculation (what was the market): sub-steps inside a range, learning box, typical mistakes.
  feld: {
    ...base,
    move: "rung", // one step up = the next rung (sub-step), not the next group
    up: { when: "goodRound" },
    help: ["hint", "picture", "way"],
    learningBox: { dueDays: [0, 1, 3, 7, 21], fastMs: 4000 },
    bridgeAfter: 3, // the same mistake kind 3 times in 2 rounds -> a short bridge round
    slots: ["cur", "cur", "cur", "review", "inverse"],
    flag: { stars: 5, fillsBelow: true }, // all five perspectives starred on a range = its flag
  },

  // Olympiad: every child starts at level 1 (or where the first-visit gate puts them).
  berg: {
    ...base,
    hintAfter: 1,
    help: ["hint", "way"],
    slots: ["cur", "cur", "cur", "cur", "backpack"], // one task from a camp already mastered
  },
};
