// Sentences of the camp "mauer" (map berg), English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/mauer/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/en.js.
import B from "../../../boards/berg/lang/en.js";

// English texts for the new world (map, round, the idea "Teile": numbers are made of numbers).
// Number words and names of the things are in /shared/lang/en.js. a, b, c … = number words ("three").
const big = (text) => text[0].toUpperCase() + text.slice(1);
// Camp 12 (mauer): the clues of the number riddles as sentences.
const MCLUE = {
  between: (lo, hi) => `The number is between ${lo} and ${hi}.`,
  div: (d) => `It can be divided by ${d}.`,
  rest: (d, k) => `Divided by ${d}, it leaves ${k}.`,
  sum: (s) => `Its digits add up to ${s}.`,
  even: () => "It is even.",
  odd: () => "It is odd.",
  bigger: () => "Its tens digit is bigger than its ones digit.",
  smaller: () => "Its tens digit is smaller than its ones digit.",
};
const mClues = (clues) => clues.map(([k, ...v]) => MCLUE[k](...v)).join(" ");
const MRIDDLE = (a) => [["eingrenzen", `Cross out clue by clue: after all the clues, only ${a.answer} is left.`], ["liste", "Write down every number that fits the first clue. Then cross out with each clue."]];

export default {
  ...B,
  // ---------- Camp 12 on the thinking mountain: Narrowing down (welt/ideas/mauer/)
  mauer: {
    intro: {
      sehen: "Camp 12. A wall of numbers, just below the summit. Every brick carries the two below it.",
      machen: "Build it yourself, brick by brick, from the bottom up.",
      forschen: "What happens at the top when a brick at the bottom changes?",
      anwenden: "House numbers, locks, magic squares: narrow it down clue by clue.",
      pruefen: "The owl guesses fast. We narrow it down.",
    },
    bigger: "Too easy? The wall gets taller, the riddles trickier.",
    smaller: "Okay, a smaller wall. The idea stays the same.",
    grew: "Logbook: cross out clue by clue, and in the end one number is left.",
    stories: {
      mauer: (a) => [`A number wall: every brick is the sum of the two bricks below it. At the bottom are ${a.bottom.join(", ")}.`, "What is at the very top?"],
      turm: (a) => [`The children build a number tower from boxes. At the bottom are ${a.bottom.join(", ")}. Each box gets the sum of the two below it.`, "Which number is on the top box?"],
      luecke: (a) => [`A number wall with 3 bricks at the bottom. Bottom left is ${a.x}, bottom right ${a.z}, the top ${a.T}. The middle brick at the bottom is missing.`, "Which number goes in the bottom middle?"],
      runter: (a) => [`A number wall with 3 bricks at the bottom. The top is ${a.T}, the middle left is ${a.L}, the bottom right is ${a.z}.`, "Which number is at the bottom left?"],
      hausnummer: (a) => [`I am looking for Lena's house number, a two-digit number. ${mClues(a.clues)}`, "Which house number is it?"],
      schloss: (a) => [`The code of my bike lock is a three-digit number. ${mClues(a.clues)}`, "What is the code?"],
      opa: (a) => [`Grandpa only tells his age as a riddle. ${mClues(a.clues)}`, "How old is grandpa?"],
      magisch: () => ["A magic square: every row, every column and both diagonals have the same sum.", "Which number goes where the question mark is?"],
      krypto: (a) => [`A secret two-digit number AB. Swap the digits and you get BA. AB + BA = ${a.s}, and A is ${a.d} bigger than B.`, "What is the secret number?"],
      wieviele: (a) => [`A number wall with 3 bricks at the bottom. The top should be ${a.T}. Every brick is at least 1.`, "How many different walls are there?"],
    },
    units: { mauer: "", turm: "", luecke: "", runter: "", hausnummer: "", schloss: "", opa: "years", magisch: "", krypto: "", wieviele: "walls" },
    rules: {
      mauer: "Going up is plus: two bricks side by side make the one above. With 3 at the bottom: top = left + 2 · middle + right.",
      luecke: "The bottom middle counts twice at the top. Take away the corners first, then halve.",
      eingrenzen: "Narrowing down: every clue crosses out numbers until only one is left.",
      magisch: "In a 3 by 3 magic square, every sum is 3 · the middle.",
      zaehlen: "Count all walls in order: fix the middle first, then share out left and right.",
      rueck: "Going down is minus: the top minus one brick below gives the other. A tool from camps 4 and 6.",
    },
    hints: {
      mauer: "Start at the bottom: which two bricks lie under the next one?",
      luecke: "How often is the middle brick inside the top number?",
      eingrenzen: "Write down every number that fits the first clue. Then cross out with each one after it.",
      magisch: "How big is the sum of a line? The full line tells you.",
      zaehlen: "Fix the middle brick: 1, 2, 3 … How many ways are there then for left and right?",
      rueck: "The top minus the known brick below gives the other one. Go down step by step.",
    },
    miss: {
      mauer: "Not quite. Every brick is the sum of the two below it.",
      luecke: "Not quite. The middle counts twice: take away, then halve.",
      eingrenzen: "Not quite. Check your number against every clue.",
      magisch: "Not quite. Every line has the same sum as the full line.",
      zaehlen: "Not quite. Count in order, middle by middle.",
      rueck: "Not quite. From the top down: take away.",
    },
    tables: { mitte: ["bottom middle", "top"], wieviele: ["top", "walls"] },
    tableIntro: {
      mitte: (f, a) => `Bottom left ${a.x}, bottom right ${a.z}. What is at the top when the middle is 1, 2, 3?`,
      wieviele: () => "How many walls with 3 bricks at the bottom are there for each top number?",
    },
    reasons: {
      middle: "It counted the middle brick only once. It counts twice.",
      half: "It forgot to halve.",
      line: "It got the sum of a line wrong.",
      clue: "It missed a clue.",
      swap: "It swapped the tens and the ones.",
      forgot: "It forgot some walls while counting.",
      down: "It went down from the top the wrong way.",
    },
    tools: { mauer: "Plus going up", luecke: "Counts twice, halve", eingrenzen: "Narrow down", magisch: "Magic sum", zaehlen: "Count in order", rueck: "From the top down (camps 4, 6)", probe: "Check", tabelle: "Table", liste: "Write it down" },
    ways: {
      mauer: (a) => [["mauer", `Step by step up: above the bottom row are ${a.middle.join(", ")}. At the very top: ${a.answer}.`], ["luecke", "Shortcut with 3 at the bottom: left + 2 · middle + right."]],
      luecke: (a) => [["luecke", `Top ${a.T} = ${a.x} + 2 · middle + ${a.z}. ${a.T} − ${a.x} − ${a.z} = ${a.rest}, half of it: ${a.answer}.`], ["probe", `Check: bottom ${a.x}, ${a.answer}, ${a.z} gives ${a.T} at the top.`]],
      rueck: (a) => [["rueck", `From the top down: middle right ${a.T} − ${a.L} = ${a.R}. Bottom middle ${a.R} − ${a.z} = ${a.b}. Bottom left ${a.L} − ${a.b} = ${a.answer}.`], ["probe", `Check: bottom ${a.answer}, ${a.b}, ${a.z} gives ${a.T} at the top.`]],
      hausnummer: MRIDDLE,
      schloss: MRIDDLE,
      opa: MRIDDLE,
      krypto: (a) => [["eingrenzen", `AB + BA = 11 · (A + B), so A + B = ${a.sumAB}. With A − B = ${a.d}: A = ${a.A}, B = ${a.B}. The number: ${a.answer}.`], ["liste", "Write down all digit pairs with the right sum and check them."]],
      magisch: (a) => [["magisch", `Every sum is 3 · middle = 3 · ${a.c} = ${a.sum}. Take away the two known numbers of the line: ${a.answer}.`], ["probe", "Check with another line that the sum is right."]],
      zaehlen: (a) => [["zaehlen", `Top ${a.T} = left + 2 · middle + right. Middle from 1 to ${a.most}, count the left and right pairs for each. Together ${a.answer}.`], ["tabelle", "Table: top 4, 5, 6, 7, 8 gives 1, 2, 4, 6, 9 walls."]],
    },
    machen: {
      text: "Build the wall from the bottom up. Every brick is the sum of the two below it.",
      ask: (x, y) => `${x} + ${y} = ?`,
      miss: "Not quite. Add the two bricks below it.",
      good: "Right. Keep going.",
      done: (n) => `Done! The top is ${n}.`,
      hint: "Add the two glowing bricks at the bottom.",
    },
  },
};
