// Checks the owl of the open Tal (public/offen/): a simulated child plays many events at the pond.
//   - a child who answers well reaches "sicher" in every skill of the pond, one after the other;
//   - "Wie viele?" comes after almost every event at first and gets rarer once counting is sicher, but never stops;
//   - the stands follow the rule: 20 answers, then 18 of the last 20.
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
  for (let e = 0; e < events; e++) {
    const n = Owl.frogs(rec, rnd, now);
    const a = Math.floor(rnd() * (n + 1)); // the child spreads the frogs somehow
    let red = a;
    let green = n - a;
    const steps = Owl.steps(rec, red, green, rnd, now);
    check(steps.length > 0, "an event without a question");
    const block = (blocks[Math.floor(e / 20)] ??= { events: 0, withCount: 0, questions: 0 });
    block.events++;
    if (steps.some((s) => s.kind === "count")) block.withCount++;
    for (const st of steps) {
      if (st.kind === "share" && red === green) continue;
      const id = Owl.skillOf(st, red, green);
      check(S.isOpen(rec, id, now), `asked ${id} before it was open`);
      S.answer(rec, id, rnd() < skill, now);
      block.questions++;
      if (st.kind === "share") red = green = n / 2;
    }
    for (const { id } of S.SKILLS) if (S.isSure(rec, id, now) && sureAt[id] === undefined) sureAt[id] = e + 1;
  }
  return { rec, blocks, sureAt };
}

// The stand rule.
{
  const rec = S.valid(null);
  for (let i = 0; i < 19; i++) S.answer(rec, "zaehlen5", true);
  check(S.stand(rec, "zaehlen5") === "uebt", "19 right answers are not yet sicher");
  S.answer(rec, "zaehlen5", true);
  check(S.stand(rec, "zaehlen5") === "sicher", "20 of 20 is sicher");
  check(S.stand(rec, "vergleich5") === "neu", "the next skill opens when the one before is sicher");
  check(S.stand(rec, "zaehlen10") === "zu", "the skill after that stays closed");
  for (let i = 0; i < 6; i++) S.answer(rec, "zaehlen5", false);
  check(S.stand(rec, "zaehlen5") === "wackelt", "6 wrong of the last 20 after sicher: wackelt");
  check(S.isOpen(rec, "vergleich5"), "a skill that wackelt keeps the next one open");
  check(rec.stars === 20, "one star for every right answer");
}

const good = play(400, 0.95);
console.log("A child with 95 % right, 400 events at the pond:");
console.log("  sicher after event: " + S.SKILLS.map(({ id }) => `${id} ${good.sureAt[id] ?? "–"}`).join(", "));
console.log("  events with \"Wie viele?\" per block of 20: " + good.blocks.map((b) => b.withCount).join(" "));
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
