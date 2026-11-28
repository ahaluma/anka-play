// The GameRuns of the open Tal. A run is one sequence of questions at a place: an ordered list of positions,
// and for each position the questions of the catalogue (questions.js) that fit there. The owl (owl.js) picks a
// question per position, or skips the position; a run does not have to fill every position.
//
//   start      how the frogs come onto the pads (owl.js placement): free, a given number, shared fairly
//   positions  in order; `most` = how many questions of this position at most in one run
//   min, max   questions per run (start not counted): long sequences, but not overdone

export const RUNS = {
  teich: {
    place: "teich",
    start: ["frei", "legen", "verteilen"],
    positions: [
      { id: "merken", questions: ["maske"], most: 1 },
      { id: "zaehlen", questions: ["wie-viele"], most: 2 },
      { id: "zusammen", questions: ["zusammen"], most: 1 },
      { id: "vergleichen", questions: ["gleich-viele", "zeig-mehr", "zeig-weniger"], most: 3 },
      { id: "veraendern", questions: ["einer-dazu", "einer-weg"], most: 1 },
      { id: "gerecht", questions: ["mach-gerecht"], most: 1 },
      { id: "verstecken", questions: ["partner"], most: 1 },
    ],
    min: 3,
    max: 6,
  },
};
