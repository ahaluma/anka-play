// Sentences of the camp "fels" (map berg), English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/fels/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/en.js.
import B from "../../../boards/berg/lang/en.js";

// English texts for the new world (map, round, the idea "Teile": numbers are made of numbers).
// Number words and names of the things are in /shared/lang/en.js. a, b, c … = number words ("three").
const big = (text) => text[0].toUpperCase() + text.slice(1);
// Camp 9 (fels): how many sides of a small cube are painted.
const FK = { 0: "no painted side at all", 1: "exactly 1 painted side", 2: "exactly 2 painted sides", 3: "exactly 3 painted sides" };
const FFAN = (a) => (a.h === "1" ? "" : ` and ${a.h === "2" ? "one line" : `${Number(a.h) - 1} lines`} across`);
const FQUAD = (a) => [["ordnung", `By size: ${a.bySize.join(" + ")} = ${a.answer}.`], ["bild", "Cut a square out of paper and slide it over the grid."]];

export default {
  ...B,
  // ---------- Camp 9 on the thinking mountain: Count in order, turn it in your head (welt/ideas/fels/)
  fels: {
    intro: {
      sehen: "Camp 9. A rock full of old signs. To count them, you need order.",
      machen: "Search yourself. But in order, or one goes missing.",
      forschen: "Small figures first. Then you see how it grows.",
      anwenden: "Clocks, cubes, paper: turn everything in your head.",
      pruefen: "The owl only counts what it sees at once. It forgets the big hidden ones.",
    },
    bigger: "Too easy? The signs higher up are more tangled.",
    smaller: "Okay, simpler signs. Order stays.",
    grew: "Logbook: if you count in order, you miss none.",
    stories: {
      faecher: (a) => [`A big triangle is carved into the rock, with lines from the top down${FFAN(a)}.`, "How many triangles do you see, big and small?"],
      zelt: (a) => [`A tent from the front: poles from the top down to the ground${FFAN(a)}.`, "How many triangles are in it, big and small?"],
      segel: (a) => [`A sail with seams from the top down${FFAN(a)}.`, "How many triangles do you find, big and small?"],
      fliesen: (a) => [`A piece of tiled floor, ${a.w} tiles wide and ${a.h} high.`, "How many squares do you see, big and small?"],
      fenster: (a) => [`A window with ${a.w} by ${a.h} panes.`, "How many squares do you see, big and small?"],
      schokolade: (a) => [`A bar of chocolate, ${a.w} pieces wide and ${a.h} high.`, "How many squares can you break off in one piece, big and small?"],
      uhr: () => ["You see the hall clock in the mirror. It has no numbers, only a dot at the 12. The minute hand points up.", "What time is it really?"],
      netz: (a) => ["You fold a cube from this net.", `Which number is then opposite the ${a.x}?`],
      papier: (a) => [`I fold a sheet of paper in half ${a.folds} times. Then I punch ${a.holes === "1" ? "one hole" : `${a.holes} holes`} into it, not at the edge.`, "How many holes does the sheet have when I unfold it?"],
      wuerfel: (a) => [`A big wooden cube is painted red all over. Then it is sawn into ${a.n} by ${a.n} by ${a.n} small cubes.`, `How many small cubes have ${FK[a.kKey]}?`],
      rechtecke: (a) => [`A grid with ${a.w} by ${a.h} boxes.`, "How many rectangles are in it? Squares count too."],
      faechergross: (a) => [`A huge triangle on the rock: ${a.rays} lines run from the top down, at the bottom there are ${a.m} small triangles side by side.`, "How many triangles are there in all?"],
      quadratgross: (a) => [`A chessboard with ${a.n} by ${a.n} squares.`, "How many squares are in it, big and small?"],
    },
    units: { faecher: "triangles", zelt: "triangles", segel: "triangles", fliesen: "squares", fenster: "squares", schokolade: "squares", uhr: "o'clock", netz: "", papier: "holes", wuerfel: "cubes", rechtecke: "rectangles", faechergross: "triangles", quadratgross: "squares" },
    rules: {
      ordnung: "Count in order: by size, or by the two lines that make a shape. None twice, none forgotten.",
      spiegel: "A mirror swaps left and right. For the clock: 12 minus the hour in the mirror.",
      netz: "Fold in your head: in a row of three squares, the first and the third are opposite.",
      falten: "Each fold doubles the layers. One hole becomes 2, 4, 8 when you unfold.",
      wuerfel: "Corners have 3 painted sides, edges 2, faces 1, the inside none.",
      haken: "A rectangle is two lines down and two across. Count all pairs, multiply. A tool from camp 2.",
    },
    hints: {
      ordnung: "Count the smallest first, then the next bigger ones. Or: which two lines make a triangle?",
      spiegel: "Imagine the clock from behind. Where does the hand point then?",
      netz: "Find a straight row of three squares. What is skipped in the middle is opposite.",
      falten: "How many layers of paper lie on top of each other after folding?",
      wuerfel: "Where are the small cubes: at a corner, on an edge, on a face, inside?",
      haken: "Choose two lines going down and two going across. How many pairs are there?",
    },
    miss: {
      ordnung: "Not quite. Don't forget the big ones made of several small ones.",
      spiegel: "Not quite. In a mirror, left and right are swapped.",
      netz: "Not quite. Neighbours in the net are never opposite.",
      falten: "Not quite. Each fold doubles.",
      wuerfel: "Not quite. Think of corners, edges, faces and the inside.",
      haken: "Not quite. Count the pairs of lines in both directions and multiply.",
    },
    tables: { faecher: ["at the bottom", "triangles"], quadrate: ["side", "squares"], kanten: ["cubes per side", "with 2 colours"] },
    tableIntro: {
      faecher: () => "Triangles with lines from the top: 1, 2, 3 small ones side by side at the bottom. How many triangles in all?",
      quadrate: () => "Squares in grids: 1 by 1, 2 by 2, 3 by 3. How many squares, big and small?",
      kanten: () => "Painted cubes, sawn up: how many small ones have exactly 2 painted sides?",
    },
    reasons: {
      small: "It only counted the small ones.",
      size: "It only added one more size, not all of them.",
      mirror: "It forgot that the mirror swaps left and right.",
      next: "It took a neighbour. Neighbours are never opposite.",
      fold: "It added instead of doubling.",
      corners: "It mixed up corners, edges and faces.",
      lines: "It only counted lines in one direction.",
      double: "It counted some twice.",
    },
    tools: { ordnung: "Count in order", spiegel: "Mirror it", netz: "Fold in your head", falten: "Double", wuerfel: "Corners, edges, faces", haken: "All pairs (camp 2)", tabelle: "Table", probe: "Check", bild: "Build it" },
    ways: {
      ordnung: (a) => [["ordnung", `Each triangle has two lines from the top. ${a.rays} lines make ${a.one} pairs${a.h === "1" ? "" : `, and each line across closes them: times ${a.h}`}. ${a.answer} in all.`], ["tabelle", `By size: ${a.small} small ones, then those made of 2, of 3 … up to the big one.`]],
      fliesen: FQUAD,
      fenster: FQUAD,
      schokolade: FQUAD,
      uhr: (a) => [["spiegel", `In the mirror, left and right are swapped: 12 − ${a.shown} = ${a.answer} o'clock.`], ["bild", "Hold a sheet with the clock up to the light and look at it from behind."]],
      netz: (a) => [["netz", `Fold in your head: in a straight row of three squares, the outer ones are opposite. Opposite the ${a.x}: ${a.answer}.`], ["bild", "Copy the net, cut it out and fold it."]],
      papier: (a) => [["falten", `Folding ${a.folds} times gives ${a.layers} layers. ${a.holes} × ${a.layers} = ${a.answer} holes.`], ["bild", "Try it with a real sheet and a pencil."]],
      wuerfel: (a) => [["wuerfel", `Corners: 8 with 3 colours. Edges: 12 × ${a.inner} with 2. Faces: 6 × ${a.inner} × ${a.inner} with 1. Inside: ${a.inner} × ${a.inner} × ${a.inner} with none. Wanted: ${a.answer}.`], ["tabelle", "A table with small cubes: 2, 3, 4 per side. How does it grow?"]],
      rechtecke: (a) => [["haken", `Lines down: ${a.down}, that is ${a.pairsDown} pairs. Lines across: ${a.across}, that is ${a.pairsAcross} pairs. ${a.pairsDown} × ${a.pairsAcross} = ${a.answer}.`], ["ordnung", "Counting by size works too: 1 by 1, 1 by 2, … but it takes long."]],
      faechergross: (a) => [["ordnung", `Two lines from the top make a triangle. ${a.rays} lines make ${a.answer} pairs.`], ["tabelle", "Table: 1, 3, 6, 10 … one more is added each time."]],
      quadratgross: (a) => [["ordnung", `By size: ${a.n} × ${a.n} small ones, then the 2s, 3s … up to the big one. ${a.answer} in all.`], ["tabelle", "Table: 1, 5, 14, 30 … square numbers are added."]],
    },
    machen: {
      ask: "Tap two letters at the bottom. That is a triangle. Find them all!",
      found: (n) => `Found: ${n}`,
      again: "You already have that one. Go in order: first all with A, then all with B …",
      done: (n) => `All ${n} found!`,
      hint: "In order: AB, AC, AD … then BC, BD … That way none is missing.",
    },
  },
};
