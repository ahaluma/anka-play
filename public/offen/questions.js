// The question catalogue of the open Tal. Every question is data: which position of a run it fits, which skill it
// counts for, when it fits the scene, and its answer: a fixed value or a method that gives the answer from the
// scene as it is when the question is asked. The screen (teich.js) draws a question by its `form`; the texts are
// in lang/de.js under `say`.
//
// The scene is the state of the simulated world (world.js): { rot, gruen, shore }. `p` is what the owl chose for
// this question when it planned the run: the pad, or the pad that stays visible. A question that changes the
// world names the events it sends (`events`); its answer is read from the world after them.
//
//   id        unique name
//   position  where in a run it fits (runs.js)
//   skill     the skill it counts for, or a method (scene, p) => skill
//   fits      (scene, ctx) => may it be asked now? ctx: { open(id), dran(id), easy }
//   params    (scene, rnd) => p, chosen once when the run is planned
//   answer    the right answer, or a method (scene, p) => answer
//   form      how the screen asks: number | yesno | pad | action
//   say       the sentence in lang/de.js
//   events    (scene, p) => the events it sends to the world before it is asked (a frog hops on, …). For an
//             `action` the child sends the events; these are what the owl assumes when it plans ahead.

const countSkill = (k) => (k <= 5 ? "zaehlen5" : "zaehlen10");
const partnerSkill = (n) => (n === 5 ? "fuenfer" : n === 10 ? "zehner" : null);
const both = (s) => s.rot + s.gruen;
/** A difference a child sees without counting: at least 2 (1 against 4, not 4 against 5). */
const clear = (s) => Math.abs(s.rot - s.gruen) >= 2;
const top = (k) => (k <= 5 ? 5 : 10);
const pads = ["rot", "gruen"];
const OTHER = { rot: "gruen", gruen: "rot" };

const fewOn = (s) => pads.filter((p) => s[p] >= 1 && s[p] <= 5);

export const QUESTIONS = [
  // ---- merken: the frogs on one pad put on their funny masks and are invisible. "Wie viele waren es?"
  // Only now and then (chance), and first in a run, while the child has just seen them.
  {
    id: "maske",
    position: "merken",
    skill: "merken",
    chance: 0.5,
    fits: (s) => fewOn(s).length > 0,
    params: (s, rnd) => {
      const can = fewOn(s);
      return can[Math.floor(rnd() * can.length)];
    },
    answer: (s, p) => s[p],
    choices: () => 5,
    form: "number",
    say: "masked",
  },
  // ---- zählen: how many on one pad
  {
    id: "wie-viele",
    position: "zaehlen",
    params: () => null, // the owl asks one pad or both (owl.js)
    skill: (s, p) => countSkill(s[p]),
    fits: () => true,
    answer: (s, p) => s[p],
    choices: (s, p) => top(s[p]),
    form: "number",
    say: "count",
  },
  // ---- zusammen: both pads together
  {
    id: "zusammen",
    position: "zusammen",
    skill: (s) => countSkill(both(s)),
    fits: () => true,
    answer: (s) => both(s),
    choices: (s) => top(both(s)),
    form: "number",
    say: "total",
  },
  // ---- vergleichen
  {
    id: "gleich-viele",
    position: "vergleichen",
    skill: "gleich",
    fits: () => true,
    answer: (s) => s.rot === s.gruen,
    form: "yesno",
    say: "same",
  },
  {
    id: "zeig-mehr",
    position: "vergleichen",
    skill: "mehr",
    fits: (s, c) => s.rot !== s.gruen && (clear(s) || !c.dran("mehr")),
    answer: (s) => (s.rot > s.gruen ? "rot" : "gruen"),
    form: "pad",
    say: "point",
  },
  {
    id: "zeig-weniger",
    position: "vergleichen",
    skill: "weniger",
    fits: (s, c) => s.rot !== s.gruen && (clear(s) || !c.dran("weniger")),
    answer: (s) => (s.rot < s.gruen ? "rot" : "gruen"),
    form: "pad",
    say: "point",
  },
  // ---- verändern: one more, one fewer
  {
    id: "einer-dazu",
    position: "veraendern",
    skill: "dazu",
    fits: (s, c) => !c.easy && pads.some((p) => s[p] < (c.open("zaehlen10") ? 10 : 5)),
    params: (s, rnd, c) => {
      const can = pads.filter((p) => s[p] < (c.open("zaehlen10") ? 10 : 5));
      return can[Math.floor(rnd() * can.length)];
    },
    events: (s, p) => [{ type: "dazu", pad: p }],
    answer: (s, p) => s[p], // read after the frog hopped on: the new number
    choices: (s, p) => top(s[p]),
    form: "number",
    say: "now",
  },
  {
    id: "einer-weg",
    position: "veraendern",
    skill: "weg",
    fits: (s, c) => !c.easy && pads.some((p) => s[p] > 0),
    params: (s, rnd) => {
      const can = pads.filter((p) => s[p] > 0);
      return can[Math.floor(rnd() * can.length)];
    },
    events: (s, p) => [{ type: "weg", pad: p }],
    answer: (s, p) => s[p], // read after the frog jumped off
    choices: (s, p) => top(s[p] + 1),
    form: "number",
    say: "now",
  },
  // ---- gerecht: move frogs between the pads until it is fair (an action, checked when the child taps Fertig)
  {
    id: "mach-gerecht",
    position: "gerecht",
    skill: "umverteilen",
    fits: (s, c) => !c.easy && s.rot !== s.gruen && both(s) % 2 === 0,
    // The child moves the frogs; whatever it does, afterwards the world is fair (the owl helps), so a plan
    // ahead assumes the fair world.
    events: (s) => {
      const from = s.rot > s.gruen ? "rot" : "gruen";
      const to = from === "rot" ? "gruen" : "rot";
      return Array.from({ length: Math.abs(s.rot - s.gruen) / 2 }, () => ({ type: "huepf", from, to }));
    },
    answer: (s) => s.rot === s.gruen, // after it: fair
    each: (s) => both(s) / 2,
    form: "action",
    say: "share",
  },
  // ---- verstecken: one pad's frogs dive, the friends of 5 and 10
  {
    id: "partner",
    position: "verstecken",
    skill: (s) => partnerSkill(both(s)),
    fits: (s, c) => !c.easy && partnerSkill(both(s)) !== null,
    params: (s, rnd) => (rnd() < 0.5 ? "rot" : "gruen"), // the pad that stays visible
    answer: (s, p) => s[OTHER[p]],
    choices: (s) => both(s),
    form: "number",
    say: "partner",
  },
];

export const byId = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

/** The skill a question counts for in this scene. */
export const skillOf = (q, scene, p) => (typeof q.skill === "function" ? q.skill(scene, p) : q.skill);

/** The right answer in this scene. */
export const answerOf = (q, scene, p) => (typeof q.answer === "function" ? q.answer(scene, p) : q.answer);
