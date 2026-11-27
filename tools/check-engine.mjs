// Plays children through the engine without a browser and checks the rules of docs/DESIGN.md, section 7:
// stars, moving up and down, mastering, rounds and their slots, first-visit questions, the guided journey.
// Run: node tools/check-engine.mjs

import * as L from "../public/engine/learner.js";
import { afterRound, policyFor, roundSize } from "../public/engine/policy.js";
import { plan, Round } from "../public/engine/round.js";
import * as gate from "../public/engine/gate.js";
import { next, isMastered } from "../public/engine/graph.js";
import { POLICIES } from "../public/content/policies.js";
import { random } from "../public/engine/random.js";
import { READY } from "../public/ideas/index.js";

const problems = [];
const expect = (ok, what) => ok || problems.push(what);
let checks = 0;
const check = (ok, what) => (checks++, expect(ok, what));

const defs = {};
for (const id of READY) defs[id] = (await import(`../public/ideas/${id}/idea.js`)).IDEA;
const zahl = defs.zahl;
const tal = policyFor("tal", zahl);

/** Plays one round of a perspective with `right` of `size` tasks right at the first try. */
function play(rec, def, p, right, { age = 4, size = 5 } = {}) {
  const rung = L.level(rec, def, age);
  for (let i = 0; i < size; i++) L.task(rec, def.id, p, rung, i < right);
  const res = afterRound(rec, def, policyFor("tal", def), { p, rung, first: right, tasks: size, age });
  L.roundDone(rec, def.id, null);
  return res;
}

// ---------- Starting rung by age
{
  const rec = L.blank();
  check(L.level(rec, zahl, 3) === "5", "a 3-year-old starts zahl at 5");
  check(L.level(rec, zahl, 6) === "10", "a 6-year-old starts zahl at 10");
  check(L.level(rec, zahl, null) === "5", "a guest starts zahl at 5");
}

// ---------- A star: 4 of 5 at the first try, at once; 3 of 5 is no star
{
  const rec = L.blank();
  check(!play(rec, zahl, "sehen", 3).star, "3 of 5 gives no star");
  check(play(rec, zahl, "sehen", 4).newStar, "4 of 5 gives a star at once");
  check(L.starred(rec, zahl, "sehen", "5"), "the star is in group 5");
  check(!play(rec, zahl, "sehen", 5).newStar, "a second good round gives no new star");
}

// ---------- Up: 3 of 5 perspectives starred in a group -> the next group
{
  const rec = L.blank();
  play(rec, zahl, "sehen", 5);
  check(play(rec, zahl, "machen", 5).moved === 0, "2 of 5 stars do not move up");
  const r = play(rec, zahl, "forschen", 5);
  check(r.moved === 1 && r.level === "10", "3 of 5 stars move up to 10");
  check(L.level(rec, zahl, 4) === "10", "the level stays 10");
  check(!L.ideaMastered(rec, zahl), "zahl is not mastered with stars at 5 only");
  for (const p of zahl.perspectives) play(rec, zahl, p, 5);
  check(L.ideaMastered(rec, zahl), "zahl is mastered with all five stars at 10");
  const f = L.facts(rec, { age: 4, defs });
  check(f.mastered("wiese"), "the wiese station is mastered");
}

// ---------- Down: 2 weak rounds in a row -> one group down, and it stays down despite the age
{
  const rec = L.blank();
  check(L.level(rec, zahl, 6) === "10", "a 6-year-old plays at 10");
  play(rec, zahl, "sehen", 2, { age: 6 });
  check(L.level(rec, zahl, 6) === "10", "one weak round does not move down");
  const r = play(rec, zahl, "sehen", 1, { age: 6 });
  check(r.moved === -1 && L.level(rec, zahl, 6) === "5", "two weak rounds move down to 5");
  check(L.level(rec, zahl, 7) === "5", "after moving down, the age no longer moves the child up");
  play(rec, zahl, "sehen", 3, { age: 6 });
  play(rec, zahl, "sehen", 2, { age: 6 });
  check(L.level(rec, zahl, 6) === "5", "a weak round after a fair one starts counting again");
}

// ---------- Rounds: size by age, the surprise only after another perspective was played, easier after 3 misses
{
  const rec = L.blank();
  const r = random(1);
  check(roundSize(tal, 4) === 3 && roundSize(tal, 5) === 5 && roundSize(tal, null) === 5, "rounds have 3 tasks under 5, else 5");
  let slots = plan({ def: zahl, p: "sehen", rung: "5", pol: tal, size: 5, played: () => false, r });
  check(slots.length === 5 && slots.every((s) => s.kind === "cur"), "a first round has no surprise");
  slots = plan({ def: zahl, p: "sehen", rung: "5", pol: tal, size: 5, played: (p) => p === "machen", r });
  check(slots.length === 6 && slots[5].kind === "surprise" && slots[5].p === "machen" && !slots[5].counted, "the surprise comes last, from a played perspective, not counted");
  slots = plan({ def: zahl, p: "sehen", rung: "10", pol: tal, size: 5, played: () => false, review: { idea: "zahl", p: "machen", rung: "5" }, r });
  check(slots.filter((s) => s.kind === "review").length === 1 && slots[0].kind === "cur", "one review task, never first");
  const round = new Round(plan({ def: zahl, p: "sehen", rung: "10", pol: tal, size: 5, r }), tal, "5");
  check(round.miss().help === -1 && round.miss().help === 0, "the hint comes after the second miss");
  round.miss();
  round.solve();
  check(round.slot.kind === "easier" && round.slot.rung === "5" && !round.slot.counted, "3 misses in a row bring one easier task");
  while (!round.done) round.solve();
  check(round.result.tasks === 5 && round.result.first === 4, "the easier task is not counted");
}

// ---------- A pure game is open and mastered from the start
{
  const f = L.facts(L.blank(), { age: 3, defs });
  check(isMastered("baumstumpf", f), "number memory is mastered from the start");
}

// ---------- First-visit questions: the highest rung right at the first try is the start
{
  const def = { id: "reihe", perspectives: ["sehen"], ladder: [{ id: "20", group: "20" }, { id: "100", group: "100" }, { id: "1000", group: "1000" }] };
  check(gate.questions("steg", def).map((q) => q.rung).join() === "20,100,1000", "the bridge asks at 20, 100 and 1000");
  check(gate.start(def, [{ rung: "20", first: true }, { rung: "100", first: true }, { rung: "1000", first: false }]) === "100", "start at the highest rung answered right");
  check(gate.start(def, [{ rung: "20", first: false }]) === "20", "with none right, start on the first rung");
  const rec = L.blank();
  check(gate.due(rec, "steg", def), "the questions are due on the first visit");
  gate.save(rec, def, [{ rung: "100", first: true }]);
  check(!gate.due(rec, "steg", def) && rec.ideas.reihe.level === "100", "asked once; the answers set the level");
}

// ---------- The journey: next() leads to a near, open, unmastered station that has something to play
{
  const f = L.facts(L.blank(), { age: 4, defs });
  const n = next("wiese", f);
  check(n === null || f.ready(n), "the owl only leads to stations that can be played");
}

console.log(`${checks} checks.`);
for (const p of problems) console.log(`PROBLEM: ${p}`);
if (!problems.length) console.log("The engine keeps the rules.");
process.exit(problems.length ? 1 : 0);
