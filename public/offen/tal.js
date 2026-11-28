// What the owl plans at the seven newer places of the open Tal (Wiese, Waldrand, Himmel, Nester, Pfütze, Hügel,
// Bach). Pure, no screen: each place's screen (wiese.js, waldrand.js, …) draws the plan, tools/check-offen.mjs
// plays it in Node.
//
// Every place follows the same beat as the pond: something happens, the child acts freely (nothing to get wrong:
// lay the stepping stones, let the row grow, call the birds …), then a sequence of MIN_Q to MAX_Q questions. Only
// the questions count, each for one skill. Which skill a question practises is drawn by the skills' stands
// (skills.js HOW_OFTEN): what is practised comes often, what is sicher rarely, never not at all.

import { isOpen, often } from "./skills.js";

export const MIN_Q = 3;
export const MAX_Q = 5;

const between = (rnd, lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
const pick = (rnd, list) => list[Math.floor(rnd() * list.length)];
export function shuffled(rnd, list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const length = (rnd) => MIN_Q + (rnd() < 0.4 ? 1 : 0) + (rnd() < 0.2 ? 1 : 0);
const wasSure = (rec, id) => !!rec.skills[id]?.wasSure;

/** One of the open skills, weighted by how often each should come now. null when none is open. */
export function draw(rec, ids, rnd, now) {
  const open = ids.filter((id) => isOpen(rec, id, now));
  if (!open.length) return null;
  const weights = open.map((id) => often(rec, id, now) + 0.02);
  let r = rnd() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < open.length; i++) if ((r -= weights.at(i)) < 0) return open.at(i);
  return open.at(-1);
}

/** The skills of each place, in the order the parents' table shows them. */
export const SKILLS_AT = {
  wiese: ["zaehlen5", "zaehlen10", "reihe10", "zaehlen20"],
  waldrand: ["muster2", "muster3"],
  himmel: ["erster", "vorher"],
  nester: ["sortieren", "regel"],
  pfuetze: ["vergleichen", "bildmerken"],
  huegel: ["lage1", "lage2"],
  bach: ["formen", "formen2", "laenger", "schwerer", "ordnen3"],
};

// ---- Wiese: the number line and counting beyond ten -------------------------------------------------------
// The child lays a path of number stones (any tap lays the next one). Then a butterfly sits on a stone and hides
// its number: "Welche Zahl kommt nach sechs?" Or butterflies land on the meadow: "Wie viele Schmetterlinge?",
// from 11 to 20 once counting to 10 was sicher.
//   returns { top, steps: [{ ask: "nach" | "vor", at, answer, skill } | { ask: "falter", n, skill }] }
export function wiese(rec, rnd = Math.random, now = Date.now()) {
  const top = wasSure(rec, "zaehlen10") ? 10 : 5;
  const steps = [];
  const want = length(rnd);
  while (steps.length < want) {
    const count = isOpen(rec, "zaehlen10", now) && rnd() < 0.5 ? "zaehlen10" : "zaehlen5";
    const skill = draw(rec, ["reihe10", "zaehlen20", count], rnd, now) ?? "zaehlen5";
    if (skill === "reihe10") {
      const back = wasSure(rec, "reihe10") ? rnd() < 0.5 : rnd() < 0.25;
      const at = back ? between(rnd, 2, top) : between(rnd, 1, top - 1);
      steps.push({ ask: back ? "vor" : "nach", at, answer: back ? at - 1 : at + 1, skill });
    } else if (skill === "zaehlen20") steps.push({ ask: "falter", n: between(rnd, 11, 20), skill });
    else steps.push({ ask: "falter", n: skill === "zaehlen10" ? between(rnd, 6, 10) : between(rnd, 1, 5), skill });
  }
  return { top, steps };
}

// ---- Waldrand: patterns ---------------------------------------------------------------------------------
// A row of mushrooms, leaves, berries and cones grows by itself as the child taps (pale buds show how many still
// come). "Was wächst als Nächstes?" two or three times, the row growing with each answer. With three things,
// sometimes a new row with one mistake: "Wo stimmt die Reihe nicht?"
//   returns { unit, shown, steps: [{ ask: "next", skill } | { ask: "fehler", row, wrong, skill }] }
export const THINGS = ["pilz", "blatt", "beere", "zapfen"];
const UNITS2 = [[0, 1], [0, 0, 1], [0, 1, 1]];
const UNITS3 = [[0, 1, 2], [0, 0, 1, 2], [0, 1, 1, 2], [0, 1, 2, 2]];
export function waldrand(rec, rnd = Math.random, now = Date.now()) {
  const skill = draw(rec, ["muster2", "muster3"], rnd, now) ?? "muster2";
  const kinds = shuffled(rnd, THINGS);
  const unit = pick(rnd, skill === "muster3" ? UNITS3 : UNITS2).map((k) => kinds.at(k));
  const shown = unit.length * 2;
  const steps = [];
  const want = length(rnd);
  const fehler = skill === "muster3" && rnd() < 0.5;
  while (steps.length < want - (fehler ? 1 : 0)) steps.push({ ask: "next", skill });
  if (fehler) {
    const row = [...unit, ...unit, ...unit];
    const wrong = between(rnd, unit.length, row.length - 1);
    row[wrong] = pick(rnd, THINGS.filter((t) => t !== row.at(wrong)));
    steps.push({ ask: "fehler", row, wrong, skill });
  }
  return { unit, shown, steps };
}
/** What grows at position i of a row made of `unit`. */
export const nth = (unit, i) => unit.at(i % unit.length);

// ---- Himmel: first and then -----------------------------------------------------------------------------
// Birds sit on a branch; the child taps them and each flies up into the sky, in the order tapped. "Wer fliegt als
// Erster?" Then, once that is sicher, a little story in the sky: "Was war vorher?" "Was kommt danach?"
//   returns { birds, steps: [{ ask: "rang", rank, skill } | { ask: "geschichte", story, at, dir, skill }] }
export const STORIES = { regen: ["wolke", "regen", "regenbogen"], ei: ["ei", "riss", "kueken"], blume: ["samen", "keim", "bluete"] };
export function himmel(rec, rnd = Math.random, now = Date.now()) {
  const birds = wasSure(rec, "erster") ? 4 : 3;
  const steps = [];
  const want = length(rnd);
  const used = new Set();
  while (steps.length < want) {
    const skill = draw(rec, ["erster", "vorher"], rnd, now) ?? "erster";
    if (skill === "vorher") {
      const story = pick(rnd, Object.keys(STORIES));
      const dir = rnd() < 0.5 ? "vorher" : "danach";
      steps.push({ ask: "geschichte", story, dir, at: dir === "vorher" ? between(rnd, 1, 2) : between(rnd, 0, 1), skill });
    } else {
      // first, second, … last: each place once per event, while there are places left
      const free = [...Array(birds).keys()].filter((r) => !used.has(r));
      if (!free.length) {
        steps.push({ ask: "rang", rank: between(rnd, 0, birds - 1), skill });
        continue;
      }
      const rank = !used.has(0) && rnd() < 0.5 ? 0 : pick(rnd, free);
      used.add(rank);
      steps.push({ ask: "rang", rank, skill });
    }
  }
  return { birds, steps };
}

// ---- Nester: sorting ------------------------------------------------------------------------------------
// The child taps the sky and birds land on the branch. Each nest has a sign (a blue egg, a big or a small one):
// "In welches Nest gehört der Vogel?" Once that is sicher: four birds, one does not fit: "Welcher Vogel passt
// hier nicht?"
//   returns { by, nests, birds: [{ farbe, gross }], steps: [{ ask: "nest", bird, skill } | { ask: "anders", four, odd, skill }] }
export const FARBEN = ["blau", "gelb", "rot"];
export function nester(rec, rnd = Math.random, now = Date.now()) {
  const by = rnd() < 0.65 ? "farbe" : "groesse";
  const nests = by === "farbe" ? shuffled(rnd, FARBEN).slice(0, wasSure(rec, "sortieren") ? 3 : 2) : ["gross", "klein"];
  const want = length(rnd);
  const steps = [];
  const birds = [];
  const anders = isOpen(rec, "regel", now) && rnd() < often(rec, "regel", now) ? (rnd() < 0.5 ? 2 : 1) : 0;
  for (let i = 0; i < want - anders; i++) {
    const nest = between(rnd, 0, nests.length - 1);
    const bird = by === "farbe" ? { farbe: nests.at(nest), gross: rnd() < 0.5 } : { farbe: pick(rnd, FARBEN), gross: nests.at(nest) === "gross" };
    birds.push(bird);
    steps.push({ ask: "nest", bird: i, nest, skill: "sortieren" });
  }
  for (let i = 0; i < anders; i++) {
    const kind = rnd() < 0.6 ? "farbe" : "groesse";
    const [a, b] = shuffled(rnd, FARBEN);
    const big = rnd() < 0.5;
    const odd = between(rnd, 0, 3);
    const four = [0, 1, 2, 3].map((k) => (kind === "farbe" ? { farbe: k === odd ? b : a, gross: big } : { farbe: a, gross: k === odd ? !big : big }));
    steps.push({ ask: "anders", four, odd, skill: "regel" });
  }
  return { by, nests, birds, steps };
}

// ---- Pfütze: look closely, remember a picture -----------------------------------------------------------
// Things stand at the edge and their mirror image is in the puddle. The child taps the water and it ripples.
// A leaf drifts onto the water and the wind blows it away: "Wo lag das Blatt?" (six places, later nine). The
// water wobbles and one thing in the mirror changes: "Was ist im Spiegelbild anders?"
//   returns { things, spots, leaf, steps: [{ ask: "blatt", skill } | { ask: "spiegel", at, change, skill }] }
export const RAND = ["blume", "stein", "schnecke", "pilz", "gras"];
export const SPOTS = 6;
export function pfuetze(rec, rnd = Math.random, now = Date.now()) {
  const things = shuffled(rnd, RAND).slice(0, wasSure(rec, "vergleichen") ? 5 : 4);
  const merken = isOpen(rec, "bildmerken", now) && rnd() < Math.max(often(rec, "bildmerken", now), 0.3);
  const spots = wasSure(rec, "bildmerken") ? 9 : SPOTS;
  const leaf = between(rnd, 0, spots - 1);
  const steps = merken ? [{ ask: "blatt", skill: "bildmerken" }] : [];
  const want = length(rnd);
  while (steps.length < want) steps.push({ ask: "spiegel", at: between(rnd, 0, things.length - 1), change: rnd() < 0.5 ? "farbe" : "ding", skill: "vergleichen" });
  return { things, spots, leaf, steps };
}

// ---- Hügel: where is it? --------------------------------------------------------------------------------
// A bench and a stone on the hill. The child taps places and the animals sit there, one per tap. "Wer sitzt auf
// der Bank?" "Setz den Hasen unter die Bank!" Between the questions an animal may hop somewhere else (seen).
//   returns { animals, steps: [{ ask: "wer" | "setz", where, skill }] }
export const LAGE1 = ["auf", "unter", "neben"];
export const LAGE2 = ["vor", "hinter", "zwischen"];
export const TIERE = ["hase", "frosch", "maus", "vogel"];
export function huegel(rec, rnd = Math.random, now = Date.now()) {
  const animals = shuffled(rnd, TIERE).slice(0, 3);
  const steps = [];
  const want = length(rnd);
  let last = null;
  while (steps.length < want) {
    const skill = draw(rec, ["lage1", "lage2"], rnd, now) ?? "lage1";
    const where = pick(rnd, (skill === "lage1" ? LAGE1 : LAGE2).filter((w) => w !== last));
    last = where;
    steps.push({ ask: rnd() < 0.5 ? "wer" : "setz", where, skill });
  }
  return { animals, steps };
}

// ---- Bach: shapes and sizes -----------------------------------------------------------------------------
// The child taps the water and the stream washes stones ashore. "Zeig mir das Dreieck!" Later shapes turned, big
// and small: "Wo ist noch ein Dreieck?" Sticks and a pumpkin come with the water: "Welcher Stock ist länger?"
// "Was ist schwerer?" "Leg sie vom kurzen zum langen!"
//   returns { stones, steps: [{ ask, skill, … }]
export const FORMEN = ["kreis", "dreieck", "quadrat", "rechteck"];
export function bach(rec, rnd = Math.random, now = Date.now()) {
  const stones = shuffled(rnd, FORMEN).slice(0, wasSure(rec, "formen") ? 4 : 3);
  const steps = [];
  const want = length(rnd);
  while (steps.length < want) {
    const skill = draw(rec, ["formen", "formen2", "laenger", "schwerer", "ordnen3"], rnd, now) ?? "formen";
    if (skill === "formen") steps.push({ ask: "form", form: pick(rnd, stones), skill });
    else if (skill === "formen2") {
      const form = pick(rnd, FORMEN);
      const others = shuffled(rnd, FORMEN.filter((f) => f !== form)).slice(0, 2);
      steps.push({ ask: "noch", form, choices: shuffled(rnd, [form, ...others]), skill });
    } else if (skill === "laenger") steps.push({ ask: "stock", more: rnd() < 0.6, a: between(rnd, 3, 9), skill });
    else if (skill === "schwerer") steps.push({ ask: rnd() < 0.5 ? "waage" : "turm", more: rnd() < 0.6, skill });
    else steps.push({ ask: "ordnen", skill });
  }
  // A stick question: the two lengths differ by at least two steps of nine.
  for (const st of steps) if (st.ask === "stock") st.b = st.a <= 5 ? st.a + between(rnd, 2, 4) : st.a - between(rnd, 2, 3);
  return { stones, steps };
}
