// Sentences of the camp "vorrat" (map berg), English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/vorrat/board.js) calls them with number words, as there. The words every camp shares come from
// boards/berg/lang/en.js.
import B from "../../../boards/berg/lang/en.js";

// Camp 4 (vorrat): one step of a story, the number machine in short, parts.
const VSTEP = {
  plus: (k) => `Then I get ${k} more.`,
  minus: (k) => `Then I give away ${k}.`,
  double: () => "Then everything doubles.",
  half: () => "Then I give away half.",
  triple: () => "Then everything triples.",
  third: () => "Then only a third is left.",
  halfminus: (k) => `Then I give away half and ${k} more.`,
  part: (k) => `Then ${{ 3: "a third", 4: "a quarter", 5: "a fifth" }[k]} is gone.`,
};
const vSteps = (ops) => ops.map((o) => VSTEP[o.type](o.k)).join(" ");
const VSHORT = {
  plus: (k) => `+ ${k}`, minus: (k) => `− ${k}`, double: () => "× 2", half: () => "÷ 2", triple: () => "× 3", third: () => "÷ 3",
  halfminus: (k) => `÷ 2, then − ${k}`, part: (k, rest) => `÷ ${k}, then × ${rest}`,
};
const VPART = { 2: "half", 4: "a quarter", 8: "an eighth", 16: "a sixteenth" };

export default {
  ...B,
  // ---------- Camp 4 of the Thinking Mountain: Think backwards (welt/ideas/vorrat/)
  vorrat: {
    intro: {
      sehen: "Camp 4. A cave full of supplies. And nobody knows any more how much was in it at the start.",
      machen: "I rewind. Like a film, only with numbers.",
      forschen: "A number machine. One number goes in, another comes out. I want to know what went in.",
      anwenden: "New story, same direction: backwards.",
      pruefen: "The owl counts forwards. That is usually the problem.",
    },
    bigger: "Too easy? The goat nods. From now on it gets nasty.",
    smaller: "Okay, one step back. Fits this camp.",
    grew: "Logbook: Everything rewound. The start is found.",
    stories: {
      murmeln: (a) => [`I have a bag of marbles. ${vSteps(a.ops)} Now I have ${a.end} marbles.`, "How many marbles did I have at the start?"],
      karten: (a) => [`Swap day at break time, with my trading cards. ${vSteps(a.ops)} In the end I have ${a.end} cards.`, "How many cards did I have before break?"],
      geld: (a) => [`My piggy bank, for one week. ${vSteps(a.ops)} Now there are ${a.end} pounds in it.`, "How many pounds were in it at the start?"],
      kekse: (a) => [`Grandma baked biscuits, and the tin is with me. ${vSteps(a.ops)} Now there are ${a.end} biscuits left.`, "How many biscuits were in the tin at the start?"],
      vorrat: (a) => [`I am a squirrel, and my winter store is in the cave. ${vSteps(a.ops)} In spring ${a.end} nuts are left.`, "How many nuts were in the cave in autumn?"],
      aufzug: (a) => [`I get into the lift in a tower block. ${a.ops.map((o) => (o.type === "plus" ? `It goes up ${o.k} floors.` : `It goes down ${o.k} floors.`)).join(" ")} Now it stops ${a.end === "0" ? "on the ground floor" : `on floor ${a.end}`}.`, "On which floor did I get in?"],
      teilen: (a) => [`I share my marbles. ${a.ops.map((o, i) => `${["Anna", "Ben", "Clara"][i]} gets half ${i ? "of the rest" : "of my marbles"} and ${o.k} more.`).join(" ")} I have ${a.end} left.`, "How many marbles did I have at the start?"],
      teich: (a) => [`The water lilies on the pond double every day. On day ${a.d} the pond is completely covered.`, `On which day was ${VPART[a.frac]} of the pond covered?`],
      schimmel: (a) => [`The mould on my forgotten sandwich doubles every day. On day ${a.d} the whole sandwich is green.`, `On which day was ${VPART[a.frac]} of it green?`],
      geruecht: (a) => [`A rumour at school: every day twice as many people know it. On day ${a.d} the whole school knows.`, `On which day did ${VPART[a.frac]} of the school know?`],
      treppe: (a) => [`In our building every staircase between two floors has ${a.per} steps. I climbed ${a.steps} steps and now I am on floor ${a.f}.`, "On which floor did I start?"],
      maschine: (a) => [`The number machine does: ${a.ops.map((o) => VSHORT[o.type](o.k, o.rest)).join(", then ")}. Out comes ${a.end}.`, "Which number was put in?"],
    },
    units: { murmeln: "marbles", karten: "cards", geld: "pounds", kekse: "biscuits", vorrat: "nuts", aufzug: "", teilen: "marbles", teich: "", schimmel: "", geruecht: "", treppe: "", maschine: "" },
    short: VSHORT,
    undo: {
      plus: (k) => `− ${k}`, minus: (k) => `+ ${k}`, double: () => "÷ 2", half: () => "× 2", triple: () => "÷ 3", third: () => "× 3",
      halfminus: (k) => `+ ${k}, then × 2`, part: (k, rest) => `÷ ${rest}, then × ${k}`,
    },
    rules: {
      rueck: "From the end: undo every step, the last one first. + becomes −, × becomes ÷.",
      halb: "“Half and k more” backwards: first put the k back, then double.",
      teich: "If it doubles every day, one day before it was half as much.",
      zaun: "Count staircases like gaps: from floor 2 to floor 5 there are 3 staircases. A tool from camp 1.",
    },
    hints: {
      rueck: "Start at the end. What was there just before the last step?",
      halb: "Backwards: what was there before the last ones were given away? Put them back, then double.",
      teich: "The day before it was half as much. And the day before that?",
      zaun: "How many staircases are these steps? And how many floors is that?",
    },
    miss: {
      rueck: "Not quite. Undo every step, the last one first.",
      halb: "Not quite. First put back what was given away, then double.",
      teich: "Not quite. Every day back: half as much.",
      zaun: "Not quite. Divide the steps by the steps per staircase.",
    },
    tables: { maschine: ["out", "in"] },
    tableIntro: { maschine: (f, a) => `The number machine does: ${a.ops.map((o) => VSHORT[o.type](o.k, o.rest)).join(", then ")}. What went in?` },
    reasons: {
      forward: "She calculated forwards instead of backwards.",
      order: "She undid the steps in the wrong order.",
      sign: "She did not swap + and −.",
      plusone: "She forgot the “and … more”.",
      half: "She halved the days instead of going back one day.",
      floors: "She counted floors instead of staircases.",
    },
    tools: { rueck: "Work backwards", halb: "Put back, then double", teich: "One day back: half as much", zaun: "Count the gaps (camp 1)", probe: "Check forwards", bild: "Draw a bar", tabelle: "Table" },
    ways: {
      rueck: (a) => [["rueck", `From ${a.end} undo every step, the last one first. At the start there is ${a.answer}.`], ["probe", `Check: start with ${a.answer} and calculate forwards. Out comes ${a.end}.`]],
      halb: (a) => [["halb", `Backwards: put back what was given away, then double. Step by step to ${a.answer}.`], ["bild", "Draw a bar: half and one more piece. Then you see how long the bar was before."], ["probe", `Check: start with ${a.answer} and share forwards. ${a.end} are left.`]],
      teich: (a) => [["teich", `Full on day ${a.d}, half full one day before, and so on back: day ${a.answer}.`], ["probe", "Don't halve the days! Half the days would be far too early."]],
      zaun: (a) => [["zaun", `${a.steps} ÷ ${a.per} = ${a.flights} staircases. ${a.flights} staircases below floor ${a.f} is floor ${a.answer}.`], ["probe", `Check: from floor ${a.answer} to floor ${a.f} there are ${a.flights} staircases of ${a.per} steps.`]],
    },
    machen: {
      ask: (k) => `What was there before step ${k}?`,
      miss: (u) => `Not quite. Undo the step: ${u}.`,
      good: "Exactly. Further back.",
      done: (s) => `At the start there were ${s}.`,
      hint: "Start on the right. Under every step it says how to undo it.",
    },
  },
};
