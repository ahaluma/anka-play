// Sentences of the camp "tanz" (map berg), English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/tanz/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/en.js.
import B from "../../../boards/berg/lang/en.js";

// Camp 8 (tanz): lists with "and", the cut chessboard, days of the week.
const tList = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);
const TCUT = { opposite: "Two opposite corners are sawn off.", row: "The two corners of the top row are sawn off.", neighbour: "A corner and the square next to it are sawn off.", one: "One corner is sawn off." };
const TDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default {
  ...B,
  // ---------- Camp 8 on the thinking mountain: Make pairs (welt/ideas/tanz/)
  tanz: {
    intro: {
      sehen: "Camp 8. A dance floor on the alpine meadow. Who finds a partner, who is left over?",
      machen: "Make the groups yourself. What is left over gives the rule away.",
      forschen: "Small numbers first. Then you see what repeats.",
      anwenden: "Light switches, coins, chessboards: pairs everywhere.",
      pruefen: "The owl works everything out. Sometimes a look at even and odd is enough.",
    },
    bigger: "Too easy? Now the whole village is dancing.",
    smaller: "Okay, fewer dancers. The pairs stay.",
    grew: "Logbook: even, odd and the rest tell you more than the whole number.",
    choices: { yesno: ["Yes", "No"], light: ["on", "off"], parity: ["even", "odd"], days: TDAYS },
    stories: {
      tanz: (a) => [`At the school party ${a.n} children dance in pairs.`, "Does every child find a partner?"],
      licht: (a) => [`The hall light is off. My little brother presses the switch ${a.n} times.`, "Is the light on or off now?"],
      summe: (a) => [`I add up: ${a.nums.join(" + ")}.`, "Is the result even or odd? You can do it without adding!"],
      bis: (a) => [`I add up all the numbers from 1 to ${a.n}: 1 + 2 + 3 + … + ${a.n}.`, "Is the result even or odd?"],
      teams: (a) => [`${a.n} children want to play football. They make teams of ${a.k}.`, "How many children are left over?"],
      zug: (a) => [`${a.n} children take the train to school camp. ${a.k} children fit into one compartment.`, "How many compartments do they need at least?"],
      domino: (a) => [`A chessboard with ${a.s} by ${a.s} squares. ${TCUT[a.kind]} A domino covers exactly two neighbouring squares.`, "Can dominoes cover all the rest?"],
      muenzen: (a) => [`There are ${a.n} coins on the table, ${a.h} of them show heads. Each move, you turn over exactly 2 coins.`, "Can you make all of them show tails?"],
      hoch: (a) => [`I multiply ${a.b} by itself again and again, ${a.n} times ${a.b}: ${a.b} × ${a.b} × ${a.b} × … The number gets huge.`, "Which digit is at the very end?"],
      reihen: (a) => [`The dance group lines up. In rows of ${tList(a.ms)}, there are always ${a.rest} left over. There are more than ${a.rest}.`, "How many dancers are there at least?"],
      eier: (a) => [`Grandma packs her eggs. In boxes of ${tList(a.ms)}, there are always ${a.rest} left over. In boxes of ${a.d}, it comes out exactly.`, "How many eggs are there at least?"],
      proben: (a) => [`The dance group practises every ${a.k} days. The first practice is on a ${TDAYS[a.startKey]}.`, `On which day of the week is practice number ${a.m}?`],
    },
    units: { tanz: "", licht: "", summe: "", bis: "", teams: "children", zug: "compartments", domino: "", muenzen: "", hoch: "", reihen: "dancers", eier: "eggs", proben: "" },
    rules: {
      paar: "Pairs: even comes out, odd leaves one over. Every press, every turn switches between even and odd.",
      rest: "Groups: divide with remainder. The rest is no full group, but still needs a place.",
      farbe: "Colour it: each domino covers one dark and one light square. There must be as many of each left.",
      zyklus: "Last digits come round again, the same every 4 steps. Only the place in the round counts.",
      reste: "The same rest for all: a number they all go into, then add the rest.",
      woche: "Every 7 days the same weekday comes back. Take away whole weeks, only the rest counts. A tool from camp 5.",
    },
    hints: {
      paar: "Make pairs. Is one left over at the end?",
      rest: "Divide by the group size. What is left over?",
      farbe: "Colour the board black and white. How many dark and light squares are still there?",
      zyklus: "Write down the last digits of the first steps: 1, 2, 3, 4, 5 times. What do you notice?",
      reste: "Take away the rest. Which number do all the rows go into?",
      woche: "How many days are there between the first practice and the one you want?",
    },
    miss: {
      paar: "Not quite. Think of pairs: is one left over?",
      rest: "Not quite. Divide with remainder: how many full groups, how many left?",
      farbe: "Not quite. Count the dark and the light squares.",
      zyklus: "Not quite. The last digits come round in fours.",
      reste: "Not quite. Check your number: is the rest the same for every row?",
      woche: "Not quite. Leave out whole weeks, only the rest counts.",
    },
    tables: { rest: ["children", "left over"], hoch: ["times", "last digit"] },
    tableIntro: {
      rest: (f, a) => `Teams of ${a.k} children. How many are left over?`,
      hoch: (f, a) => `Times ${a.b} again and again. Which digit is at the end?`,
    },
    reasons: {
      parity: "It did not look at even and odd.",
      rest: "It forgot the ones left over.",
      groups: "It counted the groups instead of the ones left over.",
      other: "It counted how many are still missing.",
      colors: "It only counted the squares, not the colours.",
      cycle: "It miscounted in the round of last digits.",
      times: "It only multiplied once.",
      lcm: "It just multiplied them all. There is a smaller one.",
      week: "It miscounted the weeks.",
    },
    tools: { paar: "Make pairs", rest: "Divide with remainder", farbe: "Colour it", zyklus: "Round of last digits", reste: "Common multiple", woche: "Leave out weeks (camp 5)", probe: "Check", tabelle: "Table", liste: "Write it down" },
    ways: {
      tanz: (a) => [["paar", `${a.n} children make ${a.pairs} pairs, ${a.left} left over. Answer: ${a.answer}.`], ["probe", "Line the children up left and right in turn: are both lines the same length?"]],
      licht: (a) => [["paar", `Every two presses cancel out: ${a.pairs} pairs. What is left decides: ${a.answer}.`], ["tabelle", "1 time: on, 2 times: off, 3 times: on … odd means on."]],
      summe: (a) => [["paar", `Only the odd numbers count, there are ${a.odd}. Two odd ones add up to even. So: ${a.answer}.`], ["probe", "Adding it up works too and shows the same."]],
      bis: (a) => [["paar", `From 1 to ${a.n}, ${a.odd} numbers are odd. So the sum is ${a.answer}.`], ["probe", "Work it out with first + last from camp 5 and look."]],
      teams: (a) => [["rest", `${a.n} ÷ ${a.k} = ${a.full} remainder ${a.rest}. So ${a.rest} are left over.`], ["liste", `Count in steps of ${a.k} until you can't go on.`]],
      zug: (a) => [["rest", `${a.n} ÷ ${a.k} = ${a.full} remainder ${a.rest}. Those ${a.rest} need a compartment too: ${a.answer}.`], ["liste", `Count in steps of ${a.k} and count each compartment.`]],
      domino: (a) => [["farbe", `Afterwards there are ${a.dark} dark and ${a.light} light squares. Each domino needs one of each colour. Answer: ${a.answer}.`], ["probe", "Try it on squared paper."]],
      muenzen: (a) => [["paar", `The number of heads always changes by 0 or 2: even stays even, odd stays odd. Now there are ${a.h}, at the end there should be 0. Answer: ${a.answer}.`], ["probe", "Try it with a few real coins."]],
      hoch: (a) => [["zyklus", `The last digits go round: ${a.round.join(", ")}. Step ${a.n} is place ${a.place} in the round: ${a.answer}.`], ["tabelle", "Table: 1, 2, 3, 4, 5 times … the last digits repeat."]],
      reste: (a) => [["reste", `${a.L} can be divided by ${tList(a.ms)}. Add the rest ${a.rest}, then go on in steps of ${a.L}${a.d === "0" ? "" : ` until it can be divided by ${a.d}`}: ${a.answer}.`], ["liste", "Write down the numbers with the right rest and compare."]],
      woche: (a) => [["woche", `Up to practice ${a.m} there are ${a.later} days. Take away whole weeks, ${a.rest} are left. ${a.rest} days after ${TDAYS[a.startKey]}: ${a.answer}.`], ["liste", "Go through the calendar and tick each practice."]],
    },
    machen: {
      dancer: "Child",
      text: (n, k) => `${n} children on the dance floor. Make groups of ${k}.`,
      ask: (k) => `Tap ${k} children one after another, and a group is done.`,
      made: (g) => `Groups: ${g}`,
      left: "No full group is possible any more. How many children are left over?",
      done: (g, r) => `${g} groups, ${r} left over.`,
      hint: "Tap them in order and count along.",
    },
  },
};
