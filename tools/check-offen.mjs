// Checks the owl of the open Tal (public/offen/): a simulated child plays many events at the pond.
//   - a child who answers well reaches "sicher" in every skill of the pond, one after the other;
//   - "Wie viele?" comes after almost every event at first and gets rarer once counting is sicher, but never stops;
//   - the stands follow the rule: 20 answers, then 18 of the last 20;
//   - while "mehr" or "weniger" is practised, the owl asks to point only at a clear difference (at least 2).
//
//   node tools/check-offen.mjs           prints a short report, exits 1 when a check fails

import * as S from "../public/offen/skills.js";
import * as Owl from "../public/offen/owl.js";

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
    const plan = Owl.placement(rec, rnd, now);
    const n = plan.n;
    let red, green;
    if (plan.kind === "share" || plan.kind === "rest") {
      const id = "verteilen";
      if (plan.kind === "rest") check(S.isSure(rec, "verteilen", now), "one left over before sharing was sicher");
      check(S.isOpen(rec, id, now), `${id} before it was open`);
      if (plan.kind === "share") check(n % 2 === 0 && (sharedOnce || n <= 4), `sharing ${n} frogs too early`);
      if (plan.kind === "rest") check(n % 2 === 1, "a rest with an even number");
      S.answer(rec, id, rnd() < skill, now);
      if (plan.kind === "share") sharedOnce = (rec.skills.verteilen.right + rec.skills.verteilen.wrong) >= 10;
      red = green = Math.floor(n / 2);
    } else {
      if (plan.kind === "make") S.answer(rec, "legen", rnd() < skill, now);
      const a = Math.floor(rnd() * (n + 1)); // the child spreads the frogs somehow
      red = a;
      green = n - a;
    }
    const firstShare = plan.kind === "share" && sharedAt === undefined ? (sharedAt = e + 1) : 0;
    const steps = Owl.steps(rec, red, green, rnd, now);
    check(steps.length > 0, "an event without a question");
    check(steps.length <= Owl.MAX_STEPS, `an event with ${steps.length} questions`);
    lengths.push(steps.length);
    const block = (blocks[Math.floor(e / 20)] ??= { events: 0, withCount: 0, questions: 0 });
    block.events++;
    if (steps.some((s) => s.kind === "count")) block.withCount++;
    for (const st of steps) {
      if (st.kind === "share" && (red === green || (red + green) % 2)) continue;
      if (st.kind === "partner" && !Owl.partnerSkill(red + green)) continue;
      if (st.kind === "plus" && (st.pad === "rot" ? red : green) >= 10) continue;
      if (st.kind === "minus" && !(st.pad === "rot" ? red : green)) continue;
      if ((st.kind === "more" || st.kind === "less") && red === green) continue;
      const id = Owl.skillOf(st, red, green);
      check(S.isOpen(rec, id, now), `asked ${id} before it was open`);
      if ((id === "mehr" || id === "weniger") && !S.isSure(rec, id, now)) check(Math.abs(red - green) >= 2, `${id} asked at ${red} against ${green} while practised`);
      S.answer(rec, id, rnd() < skill, now);
      block.questions++;
      if (st.kind === "share") red = green = (red + green) / 2;
      if (st.kind === "plus") st.pad === "rot" ? red++ : green++;
      if (st.kind === "minus") st.pad === "rot" ? red-- : green--;
    }
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

const good = play(600, 0.95);
console.log("A child with 95 % right, 600 events at the pond:");
console.log("  sicher after event: " + S.SKILLS.map(({ id }) => `${id} ${good.sureAt[id] ?? "–"}`).join(", "));
console.log("  events with \"Wie viele?\" per block of 20: " + good.blocks.map((b) => b.withCount).join(" "));
console.log("  first \"Verteil gerecht\" at event " + good.sharedAt);
const short = good.lengths.filter((n) => n < Owl.MIN_STEPS).length;
console.log(`  questions per event: ${Math.min(...good.lengths)} to ${Math.max(...good.lengths)}, fewer than ${Owl.MIN_STEPS} in ${short} of ${good.lengths.length}`);
check(short < good.lengths.length / 20, "too many short events");
for (const { id } of S.SKILLS) check(good.sureAt[id] !== undefined, `${id} never became sicher`);
const firstPlay = play(5, 0.95, 3);
const first = firstPlay.blocks[0].withCount / firstPlay.blocks[0].events;
const late = good.blocks.slice(-5).reduce((n, b) => n + b.withCount, 0) / good.blocks.slice(-5).reduce((n, b) => n + b.events, 0);
check(first >= 0.9, `"Wie viele?" at first after ${Math.round(first * 100)} % of events, wanted almost all`);
check(late < 0.5 && late > 0, `"Wie viele?" late after ${Math.round(late * 100)} % of events, wanted rarer but not never`);

const weak = play(200, 0.6, 7);
console.log("A child with 60 % right, 200 events: " + S.report(weak.rec).map((r) => `${r.id} ${r.stand}`).join(", "));
const lucky = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((seed) => S.isSure(play(100, 0.6, seed).rec, "zaehlen5")).length;
check(lucky <= 1, `a child with 60 % right is sicher in counting in ${lucky} of 10 plays`);

if (failed) process.exit(1);
console.log("ok");
