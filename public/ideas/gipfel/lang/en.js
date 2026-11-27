// Sentences of the camp "gipfel" (map berg), English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/gipfel/board.js) calls them with number words, as there. The words every camp shares come from
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
// The summit (gipfel): parts for the water lily.
const GPART = { 2: "half", 4: "a quarter", 8: "an eighth", 3: "a third", 9: "a ninth", 27: "a twenty-seventh" };

export default {
  ...B,
  // ---------- The summit of the thinking mountain: competition rounds (welt/berg/gipfel/, welt/ideas/gipfel/)
  gipfel: {
    stories: {
      zaunstall: (a) => [`A fence has ${a.P} posts in a row. The gaps are 2 m or 3 m long, and the whole fence is ${a.L} m long.`, "How many gaps are 3 m long?"],
      seerose: (a) => [`A water lily doubles its size every day. After ${a.D} days the pond is fully covered.`, `After how many days was ${GPART[a.part]} of the pond covered?`],
      algen: (a) => [`Algae in a fish tank triple their size every day. After ${a.D} days the glass is completely green.`, `After how many days was ${GPART[a.part]} of the glass green?`],
      gerade: (a) => [`You have the digit cards ${a.digits.join(", ")}. You make three-digit numbers with them, each card at most once.`, "How many of these numbers are even?"],
      ungerade: (a) => [`You have the digit cards ${a.digits.join(", ")}. You make three-digit numbers with them, each card at most once.`, "How many of these numbers are odd?"],
      laternen: (a) => [`A path is ${a.L} m long. There is a post every ${a.g} m, also at the start and at the end. A lantern hangs on the first post, and then on every ${ord(a.k)} post.`, "How many lanterns hang along the path?"],
      mauerwaage: (a) => [`A number wall with 3 bricks at the bottom. Bottom left and bottom right have the same number, the bottom middle brick is ${a.m} times as big. The top is ${a.T}.`, "Which number is at the bottom left?"],
    },
    units: { zaunstall: "gaps", seerose: "days", algen: "days", gerade: "numbers", ungerade: "numbers", laternen: "lanterns", mauerwaage: "" },
    rules: {
      stall: "Two tools together: posts and gaps first, then assume and improve.",
      rueck: "Two tools together: find the rule, then think backwards.",
      haken: "Two tools together: count in order, and only the last digit decides even or odd.",
      zaun: "Two tools together: posts and gaps, then the rule of the lanterns.",
      waage: "Two tools together: swap in, and in the wall the middle counts twice.",
    },
    hints: {
      stall: "How many gaps do the posts have? And what if every gap were 2 m?",
      rueck: "Go backwards from the full day. What was it one day before?",
      haken: "Start with the last place: which digits fit there?",
      zaun: "How many posts are there? Then: post 1, and then every which one?",
      waage: "Swap the middle brick for corner bricks. How many corners are inside the top?",
    },
    miss: {
      stall: "Not quite. Assume all are 2 m first, then improve.",
      rueck: "Not quite. Each day back there is less, not more.",
      haken: "Not quite. The last digit first, then the front, then the middle.",
      zaun: "Not quite. Don't forget the lantern on the first post.",
      waage: "Not quite. The middle counts twice at the top.",
    },
    tools: { zaun: "Posts and gaps (camp 1)", stall: "Assume and improve (camp 7)", rueck: "Think backwards (camp 4)", regel: "Find the rule (camp 5)", haken: "Count in order (camp 2)", paar: "Even and odd (camp 8)", waage: "Swap in (camp 6)", mauer: "Number wall (camp 12)", probe: "Check" },
    ways: {
      zaunstall: (a) => [["zaun", `${a.P} posts have ${a.gaps} gaps.`], ["stall", `If all were 2 m, the fence would be ${a.small} m. ${a.extra} m are missing, and each 3 m gap adds 1 m: ${a.answer} gaps.`]],
      seerose: (a) => [["regel", "The rule: double every day."], ["rueck", `Backwards: day ${a.D} full, each day before it half. ${a.k} days back: day ${a.answer}.`]],
      algen: (a) => [["regel", "The rule: three times as much every day."], ["rueck", `Backwards: day ${a.D} full, each day before it a third. ${a.k} days back: day ${a.answer}.`]],
      gerade: (a) => [["paar", "Only the last digit decides if a number is even."], ["haken", `${a.ends} digits fit at the end, then 3 are left for the front and 2 for the middle: ${a.ends} · 3 · 2 = ${a.answer}.`]],
      ungerade: (a) => [["paar", "Only the last digit decides if a number is odd."], ["haken", `${a.ends} digits fit at the end, then 3 are left for the front and 2 for the middle: ${a.ends} · 3 · 2 = ${a.answer}.`]],
      laternen: (a) => [["zaun", `${a.L} : ${a.g} = ${a.gaps} gaps, so ${a.P} posts.`], ["regel", `Lanterns on post 1, then every ${a.k} posts: ${a.gaps} : ${a.k}, rounded down, plus the first one: ${a.answer}.`]],
      mauerwaage: (a) => [["waage", `Swap in: the middle is ${a.m} corners and counts twice at the top. So the top holds ${a.parts} corners. ${a.T} : ${a.parts} = ${a.answer}.`], ["mauer", `Check: bottom ${a.answer}, ${a.mid}, ${a.answer} gives ${a.T} at the top.`]],
    },
    round: {
      title: "The summit",
      intro: "The summit. Five tasks from the whole mountain, and one that needs two tools. No clock, no points.",
      pick: "Which tool do you start with?",
      goodPick: (name) => `${name}. Good choice.`,
      tryPick: (name) => `${name}. Give it a try. At the end you will see what fits.`,
      camp: (name) => `From “${name}”.`,
      family: "New: here you need two tools.",
      done: "Round done.",
      logTitle: "Logbook",
      log: (day, first, n) => `Summit, day ${day}: ${first} of ${n} right the first time. ${Number(first) === Number(n) ? "The owl is amazed." : "The owl gave up. I didn't."}`,
      again: "One more round",
      back: "To the mountain",
      closed: "The summit opens when every camp is done.",
    },
  },
};
