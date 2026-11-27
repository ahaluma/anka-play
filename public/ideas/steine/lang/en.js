// Sentences of the camp "steine" (map berg), English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/steine/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/en.js.
import B from "../../../boards/berg/lang/en.js";

// English texts for the new world (map, round, the idea "Teile": numbers are made of numbers).
// Number words and names of the things are in /shared/lang/en.js. a, b, c … = number words ("three").
const big = (text) => text[0].toUpperCase() + text.slice(1);

export default {
  ...B,
  // ---------- Camp 11 on the thinking mountain: From the end (welt/ideas/steine/)
  steine: {
    intro: {
      sehen: "Camp 11. A heap of stones, and the owl wants to play. Whoever wins thinks from the end.",
      machen: "Play against the owl. It plays well. Find the trick.",
      forschen: "Which heaps are traps? Start very small.",
      anwenden: "Biscuits, counting games, chocolate: the same ending everywhere.",
      pruefen: "The owl likes to take a lot at once. That is not always clever.",
    },
    bigger: "Too easy? The heaps get bigger, the owl smarter.",
    smaller: "Okay, smaller heaps. The trick stays.",
    grew: "Logbook: if you think from the end, you know at the start who wins.",
    choices: { who: ["Me, I start", "The owl"] },
    stories: {
      steine: (a) => [`There are ${a.n} stones in front of you. You and the owl take turns taking 1 to ${a.k} stones. Whoever takes the last one wins. You start.`, "How many stones must you take now to be sure to win?"],
      hoelzer: (a) => [`${a.n} matches lie on the table. In turn you take 1 to ${a.k}. Whoever takes the last one wins. You go first.`, "How many must you take to be sure to win?"],
      kekse: (a) => [`There are ${a.n} biscuits on the plate. You and your brother take turns taking 1 to ${a.k}. Whoever gets the last one can skip the washing up. You start.`, "How many biscuits do you take first to be sure to win?"],
      chili: (a) => [`There are ${a.n} sweets in the bowl. The last one is a chilli sweet! In turn you take 1 to ${a.k}. Whoever has to take the last one loses. You start.`, "How many do you take first so the owl gets the chilli sweet?"],
      zaehlen: (a) => [`A counting game: you start at 0. In turn, each adds 1 to ${a.k} and says the new number. Whoever says ${a.T} wins. You start.`, "Which number must you say first to be sure to win?"],
      zwei: (a) => [`Two heaps of stones: ${a.x} and ${a.y}. On your turn you take as many as you like, but from one heap only. Whoever takes the last one wins. You start.`, "How many stones do you take first to be sure to win?"],
      schokolade: (a) => [`A bar of chocolate with ${a.m} by ${a.n} pieces. With each break you snap one piece in two along a line.`, "How many breaks do you need until all are single pieces?"],
      schokower: (a) => [`A bar of chocolate with ${a.m} by ${a.n} pieces. You and the owl take turns snapping one piece in two. Whoever makes the last break wins. You start.`, "Who wins?"],
      fallen: (a) => [`Now there are ${a.n} stones. You take 1 to ${a.k}, whoever takes the last one wins. You start.`, "How many do you take so the owl sits in a trap?"],
    },
    units: { steine: "", hoelzer: "", kekse: "", chili: "", zaehlen: "", zwei: "", schokolade: "breaks", schokower: "", fallen: "" },
    rules: {
      falle: "From the end: whoever must move with k + 1 stones loses. So also with twice that, three times … Always leave the owl such a heap.",
      letzter: "When the last one loses: leave the owl exactly 1, or 1 more than a trap number.",
      zaehlen: "From the end: whoever says the goal wins. So whoever says k + 1 before it wins too, and so on all the way down.",
      gleich: "Two heaps: make them equal. Then always copy what the owl does, on the other heap.",
      brueche: "Each break turns one piece into two. From 1 piece to m · n pieces takes m · n − 1 breaks, whatever you do.",
      paar: "The number of breaks is fixed. If it is odd, the first player makes the last one. A tool from camp 8.",
    },
    hints: {
      falle: "With how many stones are you lost if it is your turn? Start with very few.",
      letzter: "Whoever faces just 1 stone loses. Which numbers are traps too?",
      zaehlen: "Whoever can say the goal wins. Which number before it is safe?",
      gleich: "What happens if both heaps are the same and it is the owl's turn?",
      brueche: "Don't count the lines. Count how many more pieces each break makes.",
      paar: "How many breaks are there in all? Even or odd?",
    },
    miss: {
      falle: "Not quite. Leave the owl a trap number: a multiple of k + 1.",
      letzter: "Not quite. This time the owl must face exactly 1 at the end.",
      zaehlen: "Not quite. Count back from the goal in steps of k + 1.",
      gleich: "Not quite. Make both heaps the same size.",
      brueche: "Not quite. Each break makes exactly one more piece.",
      paar: "Not quite. Count the breaks and see if the number is even.",
    },
    tables: { fallen: ["trap number", "stones"] },
    tableIntro: { fallen: (f, a) => `You take 1 to ${a.k}. With which heaps does the player to move lose? Those are traps:` },
    reasons: {
      greedy: "It just took as many as possible.",
      kplus: "It counted in steps of k instead of k + 1.",
      last: "It forgot that here the last one loses.",
      equal: "It did not make the heaps the same size.",
      breaks: "It counted pieces or lines instead of breaks.",
      parity: "It did not check whether the number of breaks is even.",
    },
    tools: { falle: "Traps from the end", letzter: "The last one loses", zaehlen: "Goal numbers backwards", gleich: "Make equal, copy", brueche: "One break, one more piece", paar: "Even or odd (camp 8)", tabelle: "Table", probe: "Check", bild: "Play it" },
    ways: {
      falle: (a) => [["falle", `Traps are ${a.k1}, twice that, three times … The next one below ${a.n} is ${a.trap}. So take ${a.n} − ${a.trap} = ${a.answer}.`], ["tabelle", `Table: with 1 to ${a.k} stones you win at once, with ${a.k1} you lose. After that it repeats.`], ["probe", `Check: if the owl then takes x, you take ${a.k1} − x. That keeps it in the trap.`]],
      letzter: (a) => [["letzter", `The owl should face 1 stone, or 1 + ${a.k1}, 1 + 2 × ${a.k1} … The next one below ${a.n} is ${a.trap}. So take ${a.answer}.`], ["probe", "Play it through with a few stones."]],
      zaehlen: (a) => [["zaehlen", `Back from the goal ${a.T} in steps of ${a.k1}: …, ${a.next}, ${a.answer}. Say ${a.answer}, then always up to the next one.`], ["tabelle", "Write down the winning numbers from the top down."]],
      gleich: (a) => [["gleich", `Make the heaps equal: take ${a.big} − ${a.small} = ${a.answer} from the big one. Then copy everything the owl does.`], ["probe", "Try it with two small heaps: 1 and 1, 2 and 2 …"]],
      brueche: (a) => [["brueche", `Each break makes one more piece. From 1 to ${a.pieces} pieces: ${a.pieces} − 1 = ${a.answer} breaks.`], ["bild", "Really break a small paper bar and count."]],
      paar: (a) => [["paar", `There are always ${a.pieces} − 1 = ${a.breaks} breaks, whatever you do. I make breaks 1, 3, 5 … Answer: ${a.answer}.`], ["brueche", "One break, one more piece: the number of breaks is fixed beforehand."]],
    },
    machen: {
      take: (n) => `Take ${n}`,
      rules: (a) => `${a.n} stones. You and the owl take turns taking 1 to ${a.k}. Whoever takes the last one wins. You start.`,
      ask: "How many do you take?",
      start: (n) => `${n} stones left.`,
      moves: (j, o, n) => `You take ${j}, the owl ${o}. ${n} left.`,
      youWin: "You took the last one! You win.",
      owlWins: "The owl took the last one. Once more from the start!",
      won: (a) => `The trick: always leave the owl a multiple of ${a.k1}.`,
      hint: (a) => `Leave the owl ${a.k1} stones, or twice that, or three times …`,
    },
  },
};
