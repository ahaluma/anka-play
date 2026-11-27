// Sentences of the camp "zaun" (map berg), English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/zaun/board.js) calls them with number words, as there. The words every camp shares come from
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

export default {
  ...B,
  zaun: {
    // The voice: the expedition's logbook, first person, dry and a bit cheeky.
    // Every story starts with a little hook that makes you curious; the maths stays the same.
    intro: {
      sehen: "Day 1 on the mountain. The hens want a fence. The fox thinks that is unfair.",
      machen: "Today I build it myself. What could go wrong?",
      forschen: "Think first, then build. The goat said so. Without words. Just a look.",
      anwenden: "Same trick, different job.",
      pruefen: "The owl counts faster than me. Counting right is another thing.",
    },
    bigger: "Too easy? The goat nods. From now on it gets nasty.",
    smaller: "Okay, one step back. Climbers take breaks too.",
    grew: "Logbook: fence stands. Fox offended. A flower grows on the mountain.",
    boards: (n, w, d) => (n === 1 ? "one board" : `${d} boards`),
    posts: (n, w, d) => (n === 1 ? "one post" : `${d} posts`),
    metres: (x) => `${x} m`,
    around: (x) => `all round ${x}`,
    everyLabel: (x) => `every ${x}`,
    // The same problem in different clothes. thing: what stands, gap: what is in between.
    looks: {
      zaun: {
        thing: (n, w, d) => (n === 1 ? "one post" : `${d} posts`),
        gap: (n, w, d) => (n === 1 ? "one board" : `${d} boards`),
        word: "posts",
        see: {
          line: "The posts are already up. I numbered them, because I am tidy. Mostly.",
          trees: "Numbered posts stand between two trees. The trees do not count. They just hold.",
        },
        seeAsk: "One board goes between two neighbours. How many boards do I need?",
        count: {
          line: (g) => `${g} are ready. A fence in a row. The fox is already watching.`,
          trees: (g) => `${g} are ready. The fence goes from tree to tree.`,
          ring: (g) => `${g} are ready. The fence goes all round the pond, for the chicks.`,
        },
        metres: {
          line: (len, every) => `A fence in a row, ${len} long, a post every ${every}.`,
          trees: (len, every) => `From tree to tree it is ${len}. A post every ${every}.`,
          ring: (len, every) => `All round the pond it is ${len}. A post every ${every}.`,
          sides: (len, every) => `A path, ${len} long. A fence on both sides, a post every ${every}, also at the ends.`,
        },
        back: {
          line: (t, every) => `${t} in a row, every ${every}. How long is the fence? The fox wants to know too.`,
          trees: (t, every) => `${t} stand between two trees, every ${every}.`,
          ring: (t, every) => `${t} stand all round the pond, every ${every}.`,
        },
        field: (a, b, every) => `The goats get a meadow: ${a} by ${b}. A post every ${every}, all the way round.`,
        ask: "How many posts do I need?",
      },
      baeume: {
        thing: (n, w, d) => (n === 1 ? "one tree" : `${d} trees`),
        gap: (n, w, d) => (n === 1 ? "one hammock" : `${d} hammocks`),
        word: "trees",
        see: {
          line: "My plan for the holidays: a hammock between every two trees along the street. The trees are already numbered.",
          trees: "Numbered trees stand between two houses. Hammocks also work between house and tree. Says my plan.",
        },
        seeAsk: "A hammock hangs between two neighbours. How many hammocks do I need?",
        count: {
          line: (g) => `I have ${g}. One hangs between every two trees, all in a row. The trees are still missing.`,
          trees: (g) => `I have ${g}. The row goes from house to house; the outer ones hang on the houses.`,
          ring: (g) => `I have ${g}. The trees will stand all round the playground, one hammock between every two.`,
        },
        metres: {
          line: (len, every) => `The town plants trees along a new street, ${len} long. One every ${every}, also at the start and the end.`,
          trees: (len, every) => `There are ${len} between two houses. A tree every ${every}. None at the houses.`,
          ring: (len, every) => `All round the playground it is ${len}. A tree every ${every}. Shade for everyone!`,
          sides: (len, every) => `An avenue: a street ${len} long, a tree every ${every} on both sides, also at the ends.`,
        },
        back: {
          line: (t, every) => `${t} stand in a row along my street, every ${every}. Is the street longer than a football pitch?`,
          trees: (t, every) => `${t} stand between two houses, every ${every}.`,
          ring: (t, every) => `${t} stand all round the playground, every ${every}.`,
        },
        ask: "How many trees are needed?",
      },
      kinder: {
        thing: (n, w, d) => (n === 1 ? "one child" : `${d} children`),
        gap: (n, w, d) => (n === 1 ? "one rope" : `${d} ropes`),
        word: "children",
        see: {
          line: "Sports day. We stand in a row with numbers. I am not number 1. Sadly.",
          trees: "Sports day. We stand in a row between two teachers. The teachers have no number. They have whistles.",
        },
        seeAsk: "Every two neighbours hold one rope together. How many ropes do we need?",
        count: {
          line: (g) => `On sports day ${g} are ready. Every two neighbours hold a rope, all in a row.`,
          trees: (g) => `${g} are ready. We stand between two teachers, who hold on at the outer ends.`,
          ring: (g) => `${g} are ready. We stand in a circle, every two neighbours hold a rope. Nobody lets go.`,
        },
        metres: {
          line: (len, every) => `Our row on the sports field is ${len} long. A child every ${every}, also right at the front and the back.`,
          trees: (len, every) => `There are ${len} between two teachers. A child every ${every}.`,
          ring: (len, every) => `Our circle is ${len} all the way round. A child every ${every}.`,
          sides: (len, every) => `School party! We line the path: ${len} long, a child every ${every} on both sides, also at the ends.`,
        },
        back: {
          line: (t, every) => `${t} stand in a row, every ${every}. Does the row still fit in the schoolyard?`,
          trees: (t, every) => `${t} stand between two teachers, every ${every}.`,
          ring: (t, every) => `${t} stand in a circle, every ${every}. How big is the circle?`,
        },
        ask: "How many children do we need?",
      },
      fahnen: {
        thing: (n, w, d) => (n === 1 ? "one little flag" : `${d} little flags`),
        gap: (n, w, d) => (n === 1 ? "one piece of string" : `${d} pieces of string`),
        word: "flags",
        see: {
          line: "For the party little flags hang on a string, also at both ends. Numbered, so none gets lost.",
          trees: "A string hangs between two trees. The flags hang in between, numbered. None hangs on the trees.",
        },
        seeAsk: "There is a piece of string between two neighbours. How many pieces are there?",
        count: {
          line: (g) => `My string has ${g}, all the same length. A flag between every two, and one at both ends.`,
          trees: (g) => `The string between two trees has ${g}, all the same length. No flag goes on the trees.`,
          ring: (g) => `A string goes once round the party tent. It has ${g}, all the same length.`,
        },
        metres: {
          line: (len, every) => `A string, ${len} long. A flag every ${every}, also at both ends.`,
          trees: (len, every) => `A string ${len} long hangs between two trees. A flag every ${every}, none on the trees.`,
          ring: (len, every) => `Round the party tent it is ${len}. A flag every ${every}.`,
          sides: (len, every) => `The path to the party is ${len} long. A string on both sides, a flag every ${every}, also at the ends.`,
        },
        back: {
          line: (t, every) => `${t} hang on my string, every ${every}, the first and the last right at the ends. Does the string reach next door?`,
          trees: (t, every) => `${t} hang between two trees, every ${every}.`,
          ring: (t, every) => `${t} hang round the party tent, every ${every}.`,
        },
        ask: "How many flags do I need?",
      },
      lichter: {
        thing: (n, w, d) => (n === 1 ? "one light" : `${d} lights`),
        gap: (n, w, d) => (n === 1 ? "one gap" : `${d} gaps`),
        word: "lights",
        see: {
          line: "Festival of lights! Numbered lights stand along the path. I measure every gap myself. I am thorough.",
          trees: "Festival of lights! Numbered lights stand between two street lamps. I measure every gap myself, also up to the lamps.",
        },
        seeAsk: "There is a gap between two neighbours. How many gaps do I measure?",
        count: {
          line: (g) => `The path to the festival has ${g}, all the same length. A light at the start, at the end and in between.`,
          trees: (g) => `The path has ${g}, all the same length. Street lamps already stand at the start and the end.`,
          ring: (g) => `Round the village square there are ${g}, all the same length. A light between every two.`,
        },
        metres: {
          line: (len, every) => `Festival of lights! The path is ${len} long. A light every ${every}, also at the start and the end.`,
          trees: (len, every) => `The path is ${len} long. A light every ${every}. Street lamps already stand at the start and the end.`,
          ring: (len, every) => `Round the village square it is ${len}. A light every ${every}. Hopefully it won't rain.`,
          sides: (len, every) => `The path to the festival is ${len} long. A light every ${every} on both sides, also at the ends.`,
        },
        back: {
          line: (t, every) => `${t} shine along the path, every ${every}, from the first to the last. How far can I walk in the light?`,
          trees: (t, every) => `${t} shine between two street lamps, every ${every}.`,
          ring: (t, every) => `${t} shine round the village square, every ${every}.`,
        },
        ask: "How many lights do I need?",
      },
      feld: {
        thing: (n, w, d) => (n === 1 ? "one little flag" : `${d} little flags`),
        word: "flags",
        field: (a, b, every) => `Tournament! The football pitch is ${a} by ${b}. A flag every ${every} all the way round, also in the corners.`,
        ask: "How many flags do I need?",
      },
      beet: {
        thing: (n, w, d) => (n === 1 ? "one flower" : `${d} flowers`),
        word: "flowers",
        field: (a, b, every) => `Our school garden is ${a} by ${b}. A sunflower every ${every} all the way round, also in the corners.`,
        ask: "How many sunflowers do I plant?",
      },
    },
    sehen: {
      miss: { line: "Count the gaps between neighbours, not the things.", trees: "There is a gap right at the outside, towards the end, too." },
      missPosts: "That is the number that is already there. The question is what goes in between.",
      hint: { line: "After the last one nothing more comes.", trees: "Right at the outside, towards the end, there is a gap too." },
      done: {
        line: (things, gaps) => `${things}, ${gaps}. One less.`,
        trees: (things, gaps) => `${things}, ${gaps}. Because of the ends: one more.`,
      },
    },
    machen: {
      ask: (boards) => `Build a fence with exactly ${boards}. Tap the ground.`,
      check: "Done",
      slot: "Place for a post",
      counter: "boards",
      none: "One post alone is not a fence. It is a stick.",
      hole: "My fence has a hole. The fox says thank you.",
      count: (have, want) => `That is ${have}. We ordered ${want}.`,
      done: (posts, boards) => `${posts} for ${boards}. One post more than boards. Not by chance.`,
      hint: "Every board needs a post on the left and on the right.",
      metres: "metres",
      every: {
        ends: (len, every) => `The path is ${len} m long. Every ${every} m I plant a tree, also at the start and the end.`,
        between: (len, every) => `There are ${len} m between the two trees. A post every ${every} m. The trees are already there.`,
      },
      everyHint: (every) => `Start at 0 and always go ${every} m further.`,
      endsMissing: "Something is still missing at the start and the end.",
      wrongSpot: (m) => `At ${m} m? The distance does not fit there.`,
      gapTooBig: "Somewhere a gap is too big.",
      planted: {
        ends: (count, len, every) => `${count} on ${len} m. Not ${len} divided by ${every}, but one more.`,
        between: (count, len, every) => `${count} posts. The trees at the ends helped: one less.`,
      },
    },
    forschen: {
      askLength: "How long is that in metres?",
      miss: {
        line: "Look at the ends. One stands there too.",
        trees: "Something already stands at the ends. Nothing more goes there.",
        ring: "All the way round there is no end.",
        sides: "Two sides. And each side has ends.",
        rect: "Corners are tricky. Count every corner exactly once.",
      },
      backMiss: {
        line: "There is a gap between two neighbours. How many gaps are there?",
        trees: "There is a gap between the end and the first one too.",
        ring: "All the way round: as many gaps as things.",
      },
      hint: {
        line: "One stands between every two gaps, and one at each end.",
        trees: "One stands only between two gaps. The ends are already there.",
        ring: "One stands between every two gaps. All the way round there is no end.",
        sides: "Do one side first. Then the other.",
        rect: "Walk once all the way round: gap by gap.",
      },
      got: (x) => `${x}.`,
      rule: {
        line: "In a row with ends: one more than gaps.",
        trees: "When the ends are already there: one less than gaps.",
        ring: "All the way round: as many as gaps.",
        sides: "Two rows, each with one more than gaps.",
        rect: "All the way round, no end: as many as gaps. Corners count once.",
      },
    },
    anwenden: {
      story: {
        saw: (n) => `For the campfire I need ${n} pieces of wood. Sadly I only have one long log.`,
        beads: (n) => `The goat wears a string with ${n} beads. There is a knot between two beads. Don't ask why.`,
        necklace: (n) => `A round necklace with ${n} beads, closed. There is a knot between two beads.`,
        choc: (n) => `My chocolate is one long row of ${n} squares. I share fairly. That is, with nobody.`,
        train: (n) => `A train with ${n} cars, engine included. A coupling between two cars holds it all together.`,
        pages: (from, to) => `Homework: read from page ${from} to page ${to}. Both pages count. Sadly.`,
        trip: (from, to) => `School trip! We leave on the ${ord(from)} and come back on the ${ord(to)}.`,
        bell: (a, given, b) => `The village bell strikes ${a} times in ${given} seconds.`,
        tower: (a, given, b) => `The lookout tower has platforms. From platform 1 to ${a} there are ${given} steps.`,
        sawtime: (a, given, b) => `For ${a} pieces of wood I saw for ${given} minutes.`,
        run: (a, given, b) => `Trees stand along the path, all the same distance apart. From tree 1 to tree ${a} I run ${given} seconds.`,
        floors: (a, given, b) => `The lift is broken. Of course. From floor 1 to floor ${a} I need ${given} seconds.`,
        sawback: (unit, given) => `One cut takes ${unit} minutes. I sawed for ${given} minutes and I am done.`,
        towerpart: (a, given, c, d) => `From platform 1 to ${a} there are ${given} steps. The owl wants to go from platform ${c} to ${d}.`,
      },
      ask: {
        saw: "How many times do I have to saw?",
        beads: "How many knots?",
        necklace: "How many knots?",
        choc: "How many times do I break it until every square is on its own?",
        train: "How many couplings does the train have?",
        pages: "How many pages do I have to read?",
        trip: { nights: "How many nights do we sleep at the youth hostel?", days: "On how many days are we away, counting the days we travel there and back?" },
        bell: (b) => `How long does it take when it strikes ${b} times?`,
        tower: (b) => `How many steps from platform 1 to ${b}?`,
        sawtime: (b) => `How long do I need for ${b} pieces?`,
        run: (b) => `How long do I need from tree 1 to tree ${b}?`,
        floors: (b) => `How long do I need from floor 1 to floor ${b}?`,
        sawback: "How many pieces do I have now?",
        towerpart: "How many steps is that?",
      },
      miss: {
        saw: "You only saw between two pieces.",
        beads: "A knot only sits between two beads. Not at the ends.",
        necklace: "The necklace is closed. There is a knot between the last and the first bead too.",
        choc: "You only break between two squares.",
        train: "A coupling only sits between two cars. Not at the front or the back.",
        pages: "Check it small: from page 5 to page 6 is already 2 pages.",
        trip: { nights: "You sleep between two days. On the last day we go home.", days: "The first and the last day count too." },
        bell: "Time passes between the strikes, not while striking.",
        tower: "You climb between two platforms.",
        sawtime: "The time is in the cuts, not in the pieces.",
        run: "You run between the trees. It starts at tree 1.",
        floors: "You climb between two floors. It starts on floor 1.",
        sawback: "First the cuts. And one cut more is one piece more.",
        towerpart: "How many gaps are there between the two platforms?",
      },
      hint: {
        saw: "Look where the saw has to go.",
        beads: "Look where the knots sit.",
        necklace: "Look where the knots sit. Also at the top, where the necklace closes.",
        choc: "Look where you break it.",
        train: "Look where the couplings sit.",
        pages: "Subtract. Then think: is a page missing?",
        trip: "The days are the boxes. The nights are the moons in between.",
        bell: "Count the pauses between the strikes. How long is one?",
        tower: "Count the gaps. How many steps is one?",
        sawtime: "How many cuts are at the top? How long is one?",
        run: "Count the gaps between the trees. How long does one take?",
        floors: "Count the flights of stairs between the floors. How long does one take?",
        sawback: "How many cuts fit into the time?",
        towerpart: "First: steps for one gap. Then: gaps from bottom to top.",
      },
      done: {
        saw: (k, n) => `${k} cuts, ${n} pieces. Like the fence: one less.`,
        beads: (k, n) => `${n} beads, ${k} knots. Like the fence: one less.`,
        necklace: (k, n) => `${n} beads, ${k} knots. Like round the pond: the same.`,
        choc: (k, n) => `${n} squares, ${k} breaks. One less. And all for me.`,
        train: (k, n) => `${n} cars, ${k} couplings. Like the fence: one less.`,
        pages: (from, to, ans) => `${to} − ${from} is only the gaps. The first page comes on top: ${ans}.`,
        trip: {
          nights: (from, to, ans) => `${ans} nights. The nights are the gaps between the days.`,
          days: (from, to, ans) => `${ans} days. Days are like posts: both ends count.`,
        },
      },
      timeDone: {
        bell: (gaps, ans) => `${gaps} pauses, so ${ans} seconds.`,
        tower: (gaps, ans) => `${gaps} gaps, so ${ans} steps.`,
        sawtime: (gaps, ans) => `${gaps} cuts, so ${ans} minutes.`,
        run: (gaps, ans) => `${gaps} gaps, so ${ans} seconds.`,
        floors: (gaps, ans) => `${gaps} flights of stairs, so ${ans} seconds.`,
        sawback: (cuts, ans) => `${cuts} cuts, so ${ans} pieces.`,
        towerpart: (gaps, ans) => `${gaps} gaps, so ${ans} steps.`,
      },
      unit: { bell: "seconds", tower: "steps", sawtime: "minutes", run: "seconds", floors: "seconds", sawback: "pieces", towerpart: "steps" },
      floor: (x) => `floor ${x}`,
      tree: (x) => `tree ${x}`,
      page: (x) => `p. ${x}`,
      day: (x) => `${x}`,
      perCut: (x) => `1 cut: ${x} minutes`,
      allCuts: (x) => `all cuts: ${x} minutes`,
      twice: "Twice as many does not mean twice as long. That is the owl trap.",
      rule: "Count the gaps, not the things.",
    },
    // Many ways to one answer: after each task, the tools that solve it too.
    ways: {
      tools: {
        luecken: "Count the gaps", klein: "Start small", zuordnen: "Match up", aufschneiden: "Cut it open",
        umbauen: "Turn it into a known problem", zerlegen: "Split it", tabelle: "Table", lineal: "On the ruler", teil: "Whole minus part",
      },
      line: (b, p) => [
        ["luecken", `${b} gaps. Plus one at the end: ${b} + 1 = ${p}.`],
        ["klein", `1 gap: 2 of them. 2 gaps: 3. Always one more: ${p}.`],
        ["zuordnen", `Every gap takes its left neighbour along. One is left on the far right: ${b} + 1 = ${p}.`],
      ],
      trees: (b, p) => [
        ["luecken", `${b} gaps. Things go only in between: ${b} − 1 = ${p}.`],
        ["umbauen", `Like a row with ends: ${b} + 1. The two ends are already there: ${b} + 1 − 2 = ${p}.`],
        ["klein", `2 gaps: 1. 3 gaps: 2. Always one less: ${p}.`],
      ],
      ring: (b, p) => [
        ["zuordnen", `Every gap takes its right neighbour along. None is left over: ${p}.`],
        ["aufschneiden", `Cut the circle open: a row with ${b} + 1. The first and the last are the same one: ${p}.`],
      ],
      sides: (b, one, p) => [
        ["zerlegen", `One side: ${b} + 1 = ${one}. Two sides: 2 · ${one} = ${p}.`],
        ["luecken", `All gaps: 2 · ${b}. Plus one at the end of each side: 2 · ${b} + 2 = ${p}.`],
      ],
      rect: (i, j, p) => [
        ["aufschneiden", `All the way round there is no end: as many as gaps. ${i} + ${j} + ${i} + ${j} = ${p}.`],
        ["zerlegen", `Each side like a row: 2 · (${i} + 1) + 2 · (${j} + 1). Every corner is counted twice, so minus 4: ${p}.`],
      ],
      back: {
        line: (p, g, e, L) => [
          ["luecken", `${p} in a row: ${g} gaps. ${g} · ${e} = ${L}.`],
          ["klein", `2 of them: 1 gap. 3: 2 gaps. Always one less: ${g} · ${e} = ${L}.`],
        ],
        trees: (p, g, e, L) => [
          ["luecken", `${p} between the ends: ${g} gaps. ${g} · ${e} = ${L}.`],
          ["umbauen", `Count the ends too: ${p} + 2 in a row, so ${g} gaps: ${L}.`],
        ],
        ring: (p, g, e, L) => [
          ["zuordnen", `Each one brings one gap along: ${p} · ${e} = ${L}.`],
          ["aufschneiden", `Cut open: ${p} + 1 in a row, so ${p} gaps: ${L}.`],
        ],
      },
      see: {
        line: (p, b) => [
          ["luecken", `${p} in a row: ${p} − 1 = ${b} gaps.`],
          ["zuordnen", `Every one except the last gets a gap on its right: ${b}.`],
        ],
        trees: (p, b) => [
          ["umbauen", `${p} and the two ends: ${p} + 2 in a row, so ${b} gaps.`],
          ["zuordnen", `Every one gets a gap on its left. One more on the far right to the end: ${p} + 1 = ${b}.`],
        ],
      },
      every: {
        ends: (L, e, g, c) => [
          ["luecken", `${L} ÷ ${e} = ${g} distances. Trees: ${g} + 1 = ${c}.`],
          ["lineal", `On the ruler: 0, ${e}, 2 × ${e} … up to ${L}. That is ${c} places.`],
        ],
        between: (L, e, g, c) => [
          ["luecken", `${L} ÷ ${e} = ${g} distances. Trees stand at the ends: ${g} − 1 = ${c} posts.`],
          ["lineal", `On the ruler: ${e}, 2 × ${e} … up to just before ${L}. That is ${c} places.`],
        ],
      },
      saw: (n, k) => [
        ["luecken", `${n} pieces in a row have ${k} places between them. That is where you saw.`],
        ["klein", `2 pieces: 1 cut. 3 pieces: 2 cuts. Always one less: ${k}.`],
      ],
      beads: (n, k) => [
        ["luecken", `${n} beads in a row have ${k} places between them.`],
        ["klein", `2 beads: 1 knot. 3 beads: 2 knots. Always one less: ${k}.`],
      ],
      necklace: (n, k) => [
        ["zuordnen", `Every bead brings the knot on its right: ${k}.`],
        ["aufschneiden", `Cut open: a row with ${n} − 1 knots. Plus the knot at the clasp: ${k}.`],
      ],
      choc: (n, k) => [
        ["luecken", `${n} squares in a row have ${k} grooves between them. Each groove is one break.`],
        ["klein", `2 squares: break once. 3 squares: twice. Always one less: ${k}.`],
      ],
      train: (n, k) => [
        ["luecken", `${n} cars in a row have ${k} gaps between them. A coupling sits in each.`],
        ["zuordnen", `Every car except the last has a coupling at the back: ${k}.`],
      ],
      pages: (from, to, g, ans) => [
        ["luecken", `${to} − ${from} = ${g} steps from page to page. Pages are one more: ${ans}.`],
        ["teil", `Page 1 to ${to}: ${to} pages. Take away pages 1 to ${from} − 1. That leaves ${ans}.`],
        ["klein", `Page 5 to 5: 1 page. 5 to 6: 2 pages. Always one more than the difference: ${ans}.`],
      ],
      trip: {
        nights: (from, to, ans) => [
          ["luecken", `The days are the posts, the nights the gaps: ${to} − ${from} = ${ans}.`],
          ["klein", `Leave on the 3rd, back on the 4th: 1 night. So simply the difference: ${ans}.`],
        ],
        days: (from, to, ans) => [
          ["luecken", `${to} − ${from} nights, and the days are one more: ${ans}.`],
          ["klein", `Leave on the 3rd, back on the 4th: 2 days. Always one more than the difference: ${ans}.`],
        ],
      },
      time: (a, given, g1, unit, b, g2, ans, u) => [
        ["luecken", `With ${a} there are ${g1} distances. One: ${given} ÷ ${g1} = ${unit}. For ${b}: ${g2} × ${unit} = ${ans} ${u}.`],
        ["tabelle", `1 → 0, 2 → ${unit}, 3 → 2 × ${unit}, … ${b} → ${ans} ${u}.`],
      ],
      sawback: (unit, given, cuts, ans) => [
        ["luecken", `${given} ÷ ${unit} = ${cuts} cuts. One cut more means one piece more: ${ans}.`],
        ["tabelle", `0 minutes: 1 piece. ${unit} minutes: 2 pieces. … ${given} minutes: ${ans} pieces.`],
      ],
      towerpart: (a, given, unit, c, dd, ans, toD, toC) => [
        ["luecken", `One distance: ${given} ÷ (${a} − 1) = ${unit}. From ${c} to ${dd}: ${dd} − ${c} distances, so ${ans}.`],
        ["teil", `From 1 to ${dd}: ${toD}. From 1 to ${c}: ${toC}. The rest: ${toD} − ${toC} = ${ans}.`],
      ],
    },
    pruefen: {
      ask: (said) => `The owl says at once: "${said}!" Is that right?`,
      lookAgain: "Not so fast. Work it out yourself.",
      fix: "The owl is wrong. What is right?",
      right: "The owl is right. It happens. Sometimes.",
      fixed: "Worked out right!",
      why: "And why did the owl get it wrong?",
      reasons: {
        ends: "She forgot the one at the end.",
        noEnds: "She put more at the ends. But something already stands there.",
        ring: "She thought there is an end all the way round.",
        sides: "She only did one side of the path.",
        corners: "She counted the corners twice.",
        noCorners: "She forgot the corners.",
        twice: "She thought: twice as many, so twice as long.",
        strikes: "She counted the things instead of the gaps in between.",
        oneMore: "She counted one gap too many.",
      },
      reasonMiss: "Hm. Work it out with this idea. Do you get the owl's number?",
      reasonRight: "Exactly that was the mistake. The owl pretends she knew it all along.",
    },
  },
};
