// Sentences of "number memory", English. v = the values, h = helpers (h.w(3) = "three", h.thing(id).many = "apples").
export default {
  memory: {
    intro: { spielen: "Number memory! Find what belongs together." },
    spielen: {
      ask: "Find the number and the picture that belong together!",
      card: (v, h) => (v.kind === "number" ? h.w(v.n) : v.n === 1 ? h.thing(v.thing).one : `${h.w(v.n)} ${h.thing(v.thing).many}`),
      match: (v, h) => `They match! ${h.big(h.w(v.n))}.`,
      miss: "That's not a pair.",
      right: "You found all the pairs!",
      hint: "Tap a number. Then look for the card with that many pictures.",
    },
  },
};
