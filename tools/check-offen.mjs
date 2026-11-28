// Checks the owl of the open Tal (public/offen/): a simulated child plays many events at the pond, in the
// simulated world (world.js), with the question catalogue (questions.js) and the GameRun of the pond (runs.js).
//   - every question in the catalogue has an answer, a position in a run, and a text;
//   - a child who answers well reaches "sicher" in every skill of the pond, one after the other;
//   - "Wie viele?" comes after almost every event at first and gets rarer once counting is sicher, but never stops;
//   - the stands follow the rule: 20 answers, then 18 of the last 20;
//   - while "mehr" or "weniger" is practised, the owl asks to point only at a clear difference (at least 2);
//   - every place links to exactly two others, both ways (places.js);
//   - the apple tree and the burrow: their worlds refuse impossible events, and a child who did the pond well
//     becomes sicher in sharing, the rest, and splitting there.
//
//   node tools/check-offen.mjs           prints a short report, exits 1 when a check fails

import * as S from "../public/offen/skills.js";
import * as Owl from "../public/offen/owl.js";
import * as World from "../public/offen/world.js";
import { RUNS } from "../public/offen/runs.js";
import { QUESTIONS, byId, skillOf, answerOf } from "../public/offen/questions.js";
import { PLACES, placeById } from "../public/offen/places.js";
import * as A from "../public/offen/apfel.js";
import * as H from "../public/offen/hasen.js";

const RUN = RUNS.teich;

let failed = 0;
const check = (ok, text) => {
  if (!ok) {
    failed++;
    console.error("FAIL " + text);
  }
};

// A seeded chance source, so the report is the same every time.
function seeded(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** Play `events` events; the child answers right with chance `skill`. Returns what happened per block of 20 events. */
function play(events, skill, seed = 1) {
  const rnd = seeded(seed);
  const rec = S.valid(null);
  const now = Date.now();
  const blocks = [];
  const sureAt = {};
  let sharedOnce = false;
  const lengths = [];
  let sharedAt;
  for (let e = 0; e < events; e++) {
    const world = World.create();
    const plan = Owl.placement(rec, rnd, now);
    const n = plan.n;
    world.send({ type: "kommen", n });
    const hop = (to) => world.send({ type: "huepf", from: "shore", to });
    if (plan.kind === "share" || plan.kind === "rest") {
      const id = "verteilen";
      if (plan.kind === "rest") check(S.isSure(rec, "verteilen", now), "one left over before sharing was sicher");
      check(S.isOpen(rec, id, now), `${id} before it was open`);
      if (plan.kind === "share") check(n % 2 === 0 && (sharedOnce || n <= 4), `sharing ${n} frogs too early`);
      if (plan.kind === "rest") check(n % 2 === 1, "a rest with an even number");
      S.answer(rec, id, rnd() < skill, now);
      if (plan.kind === "share") sharedOnce = (rec.skills.verteilen.right + rec.skills.verteilen.wrong) >= 10;
      for (let i = 0; i < Math.floor(n / 2); i++) hop("rot"), hop("gruen");
    } else {
      if (plan.kind === "make") S.answer(rec, "legen", rnd() < skill, now);
      const a = Math.floor(rnd() * (n + 1)); // the child spreads the frogs somehow
      for (let i = 0; i < n; i++) hop(i < a ? "rot" : "gruen");
    }
    check(world.state.shore === (plan.kind === "rest" ? 1 : 0), "frogs left on the shore");
    const firstShare = plan.kind === "share" && sharedAt === undefined ? (sharedAt = e + 1) : 0;
    const steps = Owl.plan(RUN, rec, world.state, rnd, now);
    check(steps.length > 0, "an event without a question");
    check(steps.length <= RUN.max, `an event with ${steps.length} questions`);
    let pos = -1;
    for (const { q } of steps) {
      const i = RUN.positions.findIndex((p) => p.questions.includes(q.id));
      check(i >= pos, `${q.id} asked out of the order of the run`);
      pos = i;
    }
    lengths.push(steps.length);
    const block = (blocks[Math.floor(e / 20)] ??= { events: 0, withCount: 0, questions: 0 });
    block.events++;
    if (steps.some((s) => s.q.id === "wie-viele")) block.withCount++;
    for (const { q, p } of steps) {
      const ctx = { open: (id) => S.isOpen(rec, id, now), dran: () => false, easy: rec.wrongRow >= 3 };
      if (!q.fits(world.state, { ...ctx, dran: (id) => ["neu", "uebt", "wackelt"].includes(S.stand(rec, id, now)) })) continue; // the screen checks again
      const red = world.state.rot;
      const green = world.state.gruen;
      if (q.form !== "action") for (const ev of q.events?.(world.state, p) ?? []) check(world.send(ev), `${q.id}: the world refused ${ev.type}`);
      const id = skillOf(q, world.state, p);
      check(S.isOpen(rec, id, now), `asked ${id} before it was open`);
      if ((id === "mehr" || id === "weniger") && !S.isSure(rec, id, now)) check(Math.abs(red - green) >= 2, `${id} asked at ${red} against ${green} while practised`);
      const truth = answerOf(q, world.state, p);
      if (q.id === "zusammen") check(truth === world.total, "Wie viele zusammen? answers the total");
      S.answer(rec, id, rnd() < skill, now);
      block.questions++;
      if (q.form === "action") for (const ev of q.events(world.state, p)) world.send(ev); // the child (with the owl's help) makes it fair
      if (q.id === "mach-gerecht") check(answerOf(q, world.state, p), "after Mach es gerecht the pads are fair");
    }
    world.send({ type: "platsch" });
    for (const { id } of S.SKILLS) if (S.isSure(rec, id, now) && sureAt[id] === undefined) sureAt[id] = e + 1;
  }
  return { rec, blocks, sureAt, sharedAt, lengths };
}

// The stand rule.
{
  const rec = S.valid(null);
  for (let i = 0; i < 19; i++) S.answer(rec, "zaehlen5", true);
  check(S.stand(rec, "zaehlen5") === "uebt", "19 right answers are not yet sicher");
  S.answer(rec, "zaehlen5", true);
  check(S.stand(rec, "zaehlen5") === "sicher", "20 of 20 is sicher");
  check(S.stand(rec, "zaehlen10") === "neu", "the next skill opens when the one before is sicher");
  check(S.stand(rec, "mehr") === "neu" && S.stand(rec, "gleich") === "neu", "comparing is open from the start, beside counting");
  check(S.stand(rec, "weniger") === "zu", "weniger waits until mehr is sicher");
  check(S.stand(rec, "fuenfer") === "zu", "five friends wait for counting and sharing");
  for (let i = 0; i < 6; i++) S.answer(rec, "zaehlen5", false);
  check(S.stand(rec, "zaehlen5") === "wackelt", "6 wrong of the last 20 after sicher: wackelt");
  check(S.isOpen(rec, "zaehlen10"), "a skill that wackelt keeps the next one open");
  check(rec.stars === 20, "one star for every right answer");
}

// The catalogue: every question has a position of a run, an answer, a form and a text.
{
  const { default: T } = await import("../public/offen/lang/de.js");
  const places = new Set(Object.values(RUNS).flatMap((r) => r.positions.flatMap((p) => p.questions)));
  for (const q of QUESTIONS) {
    check(places.has(q.id), `${q.id} fits no position of a run`);
    check(RUN.positions.some((p) => p.id === q.position && p.questions.includes(q.id)), `${q.id}: position ${q.position} does not list it`);
    check(q.answer !== undefined, `${q.id} has no answer`);
    check(["number", "yesno", "pad", "action"].includes(q.form), `${q.id}: unknown form ${q.form}`);
    check(T[q.say] !== undefined, `${q.id}: no text ${q.say}`);
  }
  for (const r of Object.values(RUNS)) for (const p of r.positions) for (const id of p.questions) check(byId[id], `run ${r.place}: unknown question ${id}`);
}

// The world: events change the state, impossible ones are refused.
{
  const w = World.create();
  check(w.send({ type: "kommen", n: 3 }) && w.state.shore === 3, "three frogs come");
  check(w.send({ type: "huepf", from: "shore", to: "rot" }) && w.state.rot === 1 && w.state.shore === 2, "a frog hops onto the red pad");
  check(!w.send({ type: "huepf", from: "gruen", to: "rot" }), "no frog on the green pad to hop");
  check(!w.send({ type: "weg", pad: "gruen" }), "no frog on the green pad to jump off");
  check(w.send({ type: "dazu", pad: "gruen" }) && w.total === 2, "one more comes");
  const f = w.fork();
  f.send({ type: "platsch" });
  check(w.total === 2 && f.total === 0, "a fork plays ahead without changing the world");
  check(w.history.length === 3, "the world remembers what happened");
}

const good = play(600, 0.95);
console.log("A child with 95 % right, 600 events at the pond:");
console.log("  sicher after event: " + S.skillsAt("teich").map(({ id }) => `${id} ${good.sureAt[id] ?? "–"}`).join(", "));
console.log("  events with \"Wie viele?\" per block of 20: " + good.blocks.map((b) => b.withCount).join(" "));
console.log("  first \"Verteil gerecht\" at event " + good.sharedAt);
const short = good.lengths.filter((n) => n < RUN.min).length;
console.log(`  questions per event: ${Math.min(...good.lengths)} to ${Math.max(...good.lengths)}, fewer than ${RUN.min} in ${short} of ${good.lengths.length}`);
check(short < good.lengths.length / 20, "too many short events");
for (const { id } of S.skillsAt("teich")) check(good.sureAt[id] !== undefined, `${id} never became sicher`);
const firstPlay = play(5, 0.95, 3);
const first = firstPlay.blocks[0].withCount / firstPlay.blocks[0].events;
const late = good.blocks.slice(-5).reduce((n, b) => n + b.withCount, 0) / good.blocks.slice(-5).reduce((n, b) => n + b.events, 0);
check(first >= 0.9, `"Wie viele?" at first after ${Math.round(first * 100)} % of events, wanted almost all`);
check(late < 0.5 && late > 0, `"Wie viele?" late after ${Math.round(late * 100)} % of events, wanted rarer but not never`);

const weak = play(200, 0.6, 7);
console.log("A child with 60 % right, 200 events: " + S.report(weak.rec).filter((r) => S.skillsAt("teich").some((k) => k.id === r.id)).map((r) => `${r.id} ${r.stand}`).join(", "));
const lucky = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((seed) => S.isSure(play(100, 0.6, seed).rec, "zaehlen5")).length;
check(lucky <= 1, `a child with 60 % right is sicher in counting in ${lucky} of 10 plays`);

// The places: each links to exactly two others, both ways, and every place can be reached.
{
  for (const p of PLACES) {
    check(p.links.length === 2 && new Set(p.links).size === 2 && !p.links.includes(p.id), `${p.id} must link to two other places`);
    for (const l of p.links) check(placeById[l]?.links.includes(p.id), `${p.id} -> ${l} has no way back`);
  }
  const seen = new Set(["teich"]);
  const todo = ["teich"];
  while (todo.length) for (const l of placeById[todo.pop()].links) if (!seen.has(l)) seen.add(l), todo.push(l);
  check(seen.size === PLACES.length, "a place that cannot be reached from the pond");
  const { default: T } = await import("../public/offen/lang/de.js");
  for (const p of PLACES) check(T.places[p.id], `no name for ${p.id}`);
  for (const k of S.SKILLS) check(T.parents.skills[k.id], `no parents' name for ${k.id}`);
}

// The apple tree and the burrow, played by a child who is sicher at the pond.
{
  const rnd = seeded(11);
  const now = Date.now();
  const rec = good.rec;
  rec.wrongRow = 0;
  const w = A.create();
  check(w.send({ type: "wachsen", n: 3 }) && w.send({ type: "pflueck" }) && w.state.basket === 1, "an apple is picked");
  check(!w.send({ type: "gib", to: 0 }), "no hare to give to");
  check(w.send({ type: "hasen", n: 2 }) && w.send({ type: "gib", to: 1 }) && !w.send({ type: "gib", to: 0 }), "only apples in the basket can be given");
  const h = H.create();
  check(h.send({ type: "wohnen", n: 4 }) && h.send({ type: "raus" }) && !h.send({ type: "wohnen", n: 0 }), "hares live and come out");
  check(!H.create().send({ type: "raus" }), "nobody inside to come out");
  let shares = 0;
  let rests = 0;
  let firsts = 0;
  for (let e = 0; e < 300; e++) {
    const p = A.plan(rec, rnd, now);
    if (p.askFirst) firsts++;
    check(p.pick >= 1 && p.pick < p.n + 1 && p.n <= 10, `apple tree: ${p.n} apples, pick ${p.pick}`);
    if (p.share) {
      shares++;
      check(p.pick === p.share.hares * p.share.each + p.share.rest && p.share.rest < p.share.hares, "apple tree: the picked apples do not share as planned");
      check(S.isOpen(rec, "teilen", now), "sharing apples before it was open");
      S.answer(rec, "teilen", rnd() < 0.95, now);
      if (p.share.rest) {
        rests++;
        check(S.isOpen(rec, "rest", now), "a rest before it was open");
        S.answer(rec, "rest", rnd() < 0.95, now);
      }
    }
    const b = H.plan(rec, rnd, now);
    check(b.out >= 1 && b.out < b.n && (b.askOut || b.askIn || b.change), "burrow: an event without a question");
    if (b.askIn) S.answer(rec, H.splitSkill(b.n), rnd() < 0.95, now);
  }
  console.log(`Apple tree and burrow, 300 events after the pond: ${shares} with sharing, ${rests} with a rest; ` + ["teilen", "rest", "zerlegen5", "zerlegen10"].map((id) => `${id} ${S.stand(rec, id, now)}`).join(", "));
  check(firsts > 50 && firsts < 160, `"Wie viele Äpfel hängen auf dem Baum?" in ${firsts} of 300 rounds for a sure counter, wanted about every third`);
  check(A.plan(S.valid(null), rnd, now).askFirst, "a new child is always asked how many apples hang on the tree");
  for (const id of ["teilen", "rest", "zerlegen5", "zerlegen10"]) check(rec.skills[id]?.wasSure, `${id} never became sicher at its place`);
}

if (failed) process.exit(1);
console.log("ok");
