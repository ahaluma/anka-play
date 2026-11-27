// Sentences of the camp "ameisen" (map berg), English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/ameisen/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/en.js.
import B from "../../../boards/berg/lang/en.js";

// English texts for the new world (map, round, the idea "Teile": numbers are made of numbers).
// Number words and names of the things are in /shared/lang/en.js. a, b, c … = number words ("three").
const big = (text) => text[0].toUpperCase() + text.slice(1);
const ord = (x) => {
  const n = Number(x);
  const end = n % 100 >= 11 && n % 100 <= 13 ? "th" : { 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th";
  return `${x}${end}`;
};
// Camp 5 (ameisen): days of the week, figures from matches, the second way for the matches.
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const AFORM = { quadrate: "a row of squares", dreiecke: "a row of triangles, pointing up and down in turn", doppel: "two rows of squares, one on top of the other" };
const AOTHER = {
  quadrate: (a) => `Count another way: one match on the left, then 3 new ones for each square. 1 + 3 × ${a.n} = ${a.answer}.`,
  dreiecke: (a) => `Count another way: one match to start, then 2 new ones for each triangle. 1 + 2 × ${a.n} = ${a.answer}.`,
  doppel: (a) => `Count another way: 2 matches on the left, then 5 new ones for each column. 2 + 5 × ${a.n} = ${a.answer}.`,
};

export default {
  ...B,
  // ---------- Camp 5 on the thinking mountain: Find the rule (welt/ideas/ameisen/)
  ameisen: {
    intro: {
      sehen: "Camp 5. An ant road as far as you can see. Nobody counts every ant. You find the rule.",
      machen: "Lay it yourself first. Then you notice what repeats.",
      forschen: "Start small: figure 1, 2, 3. The rule hides in the table.",
      anwenden: "A new story. The same question: what is the rule?",
      pruefen: "The owl does not count to 100. It guesses. Let's see if it is right.",
    },
    bigger: "Too easy? The ants now walk all the way to the top.",
    smaller: "Okay, shorter rows. The rule stays the same.",
    grew: "Logbook: if you know the rule, you don't have to write everything down.",
    figure: (n) => `Figure ${n}`,
    choices: { days: DAYS },
    stories: {
      folge: (a) => [`The stones of the ant road have numbers on them: ${a.shown.join(", ")}, …`, `Which number is on stone ${a.n}?`],
      sparen: (a) => [`In week 1 there are ${a.first} euros in my piggy bank. Every week I put in ${a.k} more.`, `How many euros are in it in week ${a.n}?`],
      kino: (a) => [`At the cinema, row 1 has ${a.first} seats. Every row behind it has ${a.k} seats more.`, `How many seats does row ${a.n} have?`],
      baum: (a) => [`My bamboo is ${a.first} cm tall on day 1. It grows ${a.k} cm every day.`, `How tall is it on day ${a.n}?`],
      wechsel: (a) => [`A frog hops up the number ladder, short and long jumps in turn. It lands on ${a.shown.join(", ")}, …`, `Which number does it land on the ${ord(a.n)} time?`],
      formen: (a) => ["A string of beads, the same piece again and again.", `Which bead is number ${a.n}?`],
      formenzahl: (a) => ["A string of beads, the same piece again and again.", `How many ${a.which} are among the first ${a.n} beads?`],
      hoelzer: (a) => [`I lay figures with matches: ${AFORM[a.shape]}. Here are figures 1, 2 and 3, each one a bit longer.`, `How many matches does figure ${a.n} need?`],
      zaunreihe: (a) => [`A fence made of boards: ${a.n} square sections in a row. Neighbours share the board between them.`, "How many boards does the fence need?"],
      wochentag: (a) => [`Today is ${DAYS[a.todayKey]}. In ${a.later} days we go to the sea.`, "Which day of the week is that?"],
      kalender: (a) => [`The 1st of the month is a ${DAYS[a.firstKey]}. My birthday is on the ${ord(a.day)}.`, "Which day of the week is that?"],
      wuerfeltreppe: (a) => [`I build stairs from cubes: step 1 is 1 cube high, step 2 is 2 high, and so on up to step ${a.n}.`, "How many cubes do I need in all?"],
      stadion: (a) => [`A grandstand: the bottom row has ${a.first} seats, every row above it ${a.k} more. There are ${a.rows} rows.`, "How many seats does the grandstand have?"],
      ziffernband: (a) => ["I write all the numbers one after another on a long strip: 123456789101112131415…", `Which digit is at place ${a.p}?`],
      fliesen: (a) => [`A square yard: ${a.n} tiles long and ${a.n} tiles wide.`, "How many tiles is that?"],
      punkte: (a) => [`Dot pictures: figure 1 has 2 dots, figure 2 has 6, figure 3 has 12. Each is a rectangle, one side one dot longer than the other.`, `How many dots does figure ${a.n} have?`],
      randfliesen: (a) => [`A square yard with ${a.n} by ${a.n} tiles. Only the edge gets red tiles.`, "How many red tiles is that?"],
    },
    units: { folge: "", sparen: "euros", kino: "seats", baum: "cm", wechsel: "", formen: "", formenzahl: "", hoelzer: "matches", zaunreihe: "boards", wochentag: "", kalender: "", wuerfeltreppe: "cubes", stadion: "seats", ziffernband: "", fliesen: "tiles", punkte: "dots", randfliesen: "tiles" },
    rules: {
      plusk: "From place 1 to place n there are n − 1 jumps. So: start + (n − 1) × jump.",
      wechsel: "Two jumps in turn: a pair together is one big jump. Count the pairs, then the rest.",
      muster: "A piece repeats: divide by the length of the piece. The remainder says where in the piece you are.",
      streich: "Figure 1, then the same number more each time. Shared sides count only once.",
      woche: "Every 7 days the same day comes back. Take away whole weeks, only the rest counts.",
      gauss: "First + last, second + second-to-last: always the same. Pairs times that sum.",
      stellen: "Count in blocks: 9 numbers with one digit, 90 with two, 900 with three.",
      quadrat: "A square of n by n, a rectangle of n by (n + 1). Multiply instead of counting.",
      zaun: "Like the fence in camp 1: shared boards and corners count only once.",
    },
    hints: {
      plusk: "How much is added each time? And how many jumps are there up to that place?",
      wechsel: "Always take two jumps together. How far does the frog get with one pair?",
      muster: "How long is the piece that repeats? Divide by that length.",
      streich: "How many matches are added from one figure to the next? The table helps.",
      woche: "After 7 days it is the same day again. How many days are left after the whole weeks?",
      gauss: "Put the smallest and the biggest number together. Then the second smallest and the second biggest.",
      stellen: "1 to 9 are 9 places. From 10 on, every number has 2 digits. Up to 99 that is 189 places.",
      quadrat: "Is it a square or a rectangle? How long are the sides?",
      zaun: "Draw a small example. Which boards or corners belong to two?",
    },
    miss: {
      plusk: "Not quite. Count the jumps: one fewer than the places.",
      wechsel: "Not quite. Count the pairs, then see if one jump is left.",
      muster: "Not quite. Divide by the length of the piece and look at the remainder.",
      streich: "Not quite. Shared matches count only once.",
      woche: "Not quite. Leave out whole weeks, only the rest counts.",
      gauss: "Not quite. Make pairs: first + last.",
      stellen: "Not quite. First take away the places of the smaller numbers.",
      quadrat: "Not quite. Side times side.",
      zaun: "Not quite. Corners and shared boards count only once.",
    },
    tables: { folge: ["stone", "number"], quadrate: ["figure", "matches"], dreiecke: ["figure", "matches"], doppel: ["figure", "matches"], fliesen: ["side", "tiles"], punkte: ["figure", "dots"], wuerfeltreppe: ["steps", "cubes"] },
    tableIntro: {
      folge: () => "A row grows by the same amount each time. This is how it starts:",
      quadrate: () => "Figures from matches: a row of squares. This is how many matches the first three have:",
      dreiecke: () => "Figures from matches: a row of triangles. This is how many matches the first three have:",
      doppel: () => "Figures from matches: two rows of squares. This is how many matches the first three have:",
      fliesen: () => "Square yards of tiles, each one a bit bigger:",
      punkte: () => "Dot pictures, each a rectangle with one side one dot longer:",
      wuerfeltreppe: () => "Stairs from cubes: this is how many cubes the first three need.",
    },
    reasons: {
      start: "It mixed up places and jumps: up to place n there are only n − 1 jumps.",
      times: "It just multiplied and counted shared matches twice.",
      next: "It only worked out the next place, not the one asked for.",
      week: "It did not take away the whole weeks. Only the rest counts.",
      pairs: "It made the pairs wrong.",
      digits: "It miscounted the places: from 10 on, every number has two digits.",
      corners: "It counted the corners twice, or forgot them.",
      rest: "It forgot the remainder at the end.",
    },
    tools: { plusk: "Count the jumps", wechsel: "Make pairs", muster: "Divide with remainder", streich: "Figure by figure", woche: "Leave out weeks", gauss: "First + last", stellen: "Count in blocks", quadrat: "Side times side", zaun: "Count the gaps (camp 1)", tabelle: "Table", liste: "Write it down" },
    ways: {
      plusk: (a) => [["plusk", `Up to place ${a.n} there are ${a.jumps} jumps of ${a.k}: ${a.first} + ${a.jumps} × ${a.k} = ${a.answer}.`], ["tabelle", "A table with place and number: the number always grows by the same amount."], ["liste", "Writing everything down works too, but takes long. Good for checking the first places."]],
      wechsel: (a) => [["wechsel", `A pair of jumps is ${a.sum} long. Up to the ${ord(a.n)} time there are ${a.pairs} pairs, then maybe one short jump: ${a.answer}.`], ["liste", "Write down the landing places until you reach the one asked for."]],
      formen: (a) => [["muster", `The piece is ${a.len} beads long. ${a.n} ÷ ${a.len}: the remainder gives the place in the piece, place ${a.rest}.`], ["liste", "Write the piece again and again and count along."]],
      formenzahl: (a) => [["muster", `${a.n} beads are ${a.full} whole pieces with ${a.per} ${a.which} each, plus the rest. ${a.answer} in all.`], ["liste", `Count piece by piece and add up the ${a.which}.`]],
      hoelzer: (a) => [["streich", `Figure 1 has ${a.first}, each next one ${a.step} more. ${a.first} + ${a.jumps} × ${a.step} = ${a.answer}.`], ["tabelle", AOTHER[a.shape](a)]],
      zaunreihe: (a) => [["zaun", `Like the fence: ${a.n} sections have ${a.n} + 1 upright boards, plus ${a.n} at the top and ${a.n} at the bottom. ${a.answer} in all.`], ["streich", AOTHER.quadrate(a)]],
      woche: (a) => [["woche", `Take away whole weeks, ${a.rest} days are left. ${a.rest} days on is ${a.answer}.`], ["liste", "Count on along the calendar in jumps of 7."]],
      wuerfeltreppe: (a) => [["gauss", `1 + ${a.n}, 2 + …, always ${a.pair}. Two staircases make a rectangle: ${a.n} × ${a.pair} ÷ 2 = ${a.answer}.`], ["tabelle", "Table: 1, 3, 6, 10, … each time one more is added than before."]],
      stadion: (a) => [["gauss", `Bottom + top row: ${a.first} + ${a.last} = ${a.pair}. ${a.rows} rows are half of ${a.rows} pairs: ${a.rows} × ${a.pair} ÷ 2 = ${a.answer}.`], ["liste", "Writing all rows down and adding them works too, but it is long."]],
      stellen: (a) => [["stellen", `Blocks first: 9 places for 1 to 9, then 2 places for each number. That finds the number, and in it the digit: ${a.answer}.`], ["liste", "To check, write a piece down: …9 10 11 12… and count the places."]],
      fliesen: (a) => [["quadrat", `${a.n} rows of ${a.n} tiles: ${a.n} × ${a.n} = ${a.answer}.`], ["tabelle", "Table: 1, 4, 9, 16 … the square numbers."]],
      punkte: (a) => [["quadrat", `Figure ${a.n} is a rectangle: ${a.n} × ${a.m} = ${a.answer}.`], ["tabelle", "Table: 2, 6, 12, 20 … it grows by 4, 6, 8 …"]],
      randfliesen: (a) => [["zaun", `Each side has ${a.n} tiles, but the corners belong to two sides. 4 × ${a.side} = ${a.answer}.`], ["quadrat", `All ${a.n} × ${a.n} tiles, without the inner square with ${a.n} − 2 tiles on each side: ${a.answer}.`]],
    },
    machen: {
      wrongShape: "That one does not fit here. Which piece repeats?",
      shapesDone: "The row goes on, without a mistake.",
      shapesAsk: "How does the row go on? Tap the next beads.",
      shapesHint: "Find the piece that keeps coming back. Then start it again.",
      laid: "matches laid",
      build: (n) => `Lay figure ${n}: tap every match.`,
      built: (n) => `Done: ${n} matches.`,
      count: (n) => `And figure ${n}? How many matches does it need?`,
      buildHint: "Tap the grey lines, one after another.",
    },
  },
};
