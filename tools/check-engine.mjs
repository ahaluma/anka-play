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
import * as box from "../public/engine/box.js";
import { taskOf } from "../public/engine/recipe.js";
import { allowed } from "../public/ideas/platz/idea.js";
import { READY } from "../public/ideas/index.js";
import { report } from "../public/engine/report.js";
import * as backup from "../public/engine/backup.js";

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
  check(L.level(rec, zahl, 6) === "5", "a 6-year-old starts zahl at 5 too: a concept starts small");
  check(L.level(rec, zahl, null) === "5", "a guest starts zahl at 5");
  check(L.level(rec, defs.memory, 8) === "verdeckt-15", "the memory game starts by age");
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

// ---------- A concept starts at its smallest numbers, whatever the age; only plain calculation starts by age
{
  const rec = L.blank();
  check(L.level(rec, zahl, 6) === "5" && L.level(rec, defs.reihe, 10) === "20" && L.level(rec, defs.zaun, 12) === "1", "a concept starts small for every age");
  check(READY.every((id) => !defs[id].start?.byAge || ["plus", "minus", "mal", "geteilt", "memory"].includes(id)), "only calculation and the memory game start by age");
}

// ---------- Down: 2 weak rounds in a row -> one group down, and it stays down despite the age
// (with a start by age, as calculation has it; zahl here only for its two groups)
{
  const zahl = { ...defs.zahl, start: { byAge: { 3: "5", 6: "10" } } };
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
  check(roundSize(tal, 4) === 3 && roundSize(tal, 6) === 3 && roundSize(tal, 7) === 5 && roundSize(tal, null) === 5, "rounds have 3 tasks up to 6 (as think-lab), else 5");
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
  const def = defs.plus;
  const [a, b, c] = gate.questions("apfelbaum", def).map((q) => q.rung);
  check(gate.start(def, [{ rung: a, first: true }, { rung: b, first: true }, { rung: c, first: false }]) === b, "start at the highest rung answered right");
  check(gate.start(def, [{ rung: a, first: false }]) === def.ladder[0].id, "with none right, start on the first rung");
  const rec = L.blank();
  check(gate.due(rec, "apfelbaum", def), "the questions are due on the first visit");
  gate.save(rec, def, [{ rung: b, first: true }]);
  check(!gate.due(rec, "apfelbaum", def) && rec.ideas.plus.level === b, "asked once; the answers set the level");
}

// ---------- The journey: next() leads to a near, open, unmastered station that has something to play
{
  const f = L.facts(L.blank(), { age: 4, defs });
  const n = next("wiese", f);
  check(n === null || f.ready(n), "the owl only leads to stations that can be played");
}

// ---------- The Feld (docs/DESIGN.md 7.2, 7.3): sub-steps, stars on "gemischt", learning box, bridges
{
  const plus = defs.plus;
  const feld = policyFor("feld", plus);
  const round = (rec, p, right, size = 5) => {
    const rung = L.level(rec, plus, 6);
    for (let i = 0; i < size; i++) L.task(rec, "plus", p, rung, i < right);
    const res = afterRound(rec, plus, feld, { p, rung, first: right, tasks: size, age: 6 });
    L.roundDone(rec, "plus", null);
    return res;
  };
  const rec = L.blank();
  check(L.level(rec, plus, 6) === "10/bilder", "plus starts at 10, with pictures");
  let r = round(rec, "sehen", 5);
  check(r.moved === 1 && r.level === "10/luecke" && !r.star, "a good round moves one sub-step up, without a star");
  round(rec, "sehen", 4);
  check(L.level(rec, plus, 6) === "10/gemischt", "the next good round reaches gemischt");
  r = round(rec, "sehen", 4);
  check(r.newStar && r.moved === 0 && r.level === "10/gemischt", "on gemischt a good round gives the star; 1 of 5 stars stays at 10");
  round(rec, "machen", 5);
  r = round(rec, "forschen", 5);
  check(r.moved === 1 && r.level === "20/verdoppeln", "with 3 of 5 stars at 10 the child goes on to 20");
  check(!L.facts(rec, { age: 6, defs }).flag("apfelbaum", "10"), "3 stars are no flag yet");
  round(rec, "sehen", 1);
  r = round(rec, "sehen", 2);
  check(r.moved === -1 && L.level(rec, plus, 6) === "10/gemischt", "two weak rounds go one sub-step down");

  // the slots: three of the rung, one from the range below (counted), in "use" one the other way round
  const slots = plan({ def: plus, p: "anwenden", rung: "20/uebergang", pol: feld, size: 5, below: L.belowTop(plus, "20/uebergang"), r: random(1) });
  check(slots.map((s) => s.kind).join() === "cur,cur,cur,review,inverse" && slots[3].rung === "10/gemischt" && slots.every((s) => s.counted), "a Feld round: 3 cur, the range below, the inverse; all counted");
  const s2 = plan({ def: plus, p: "sehen", rung: "10/luecke", pol: feld, size: 5, below: null, r: random(1) });
  check(s2.every((s) => s.kind === "cur") && s2.length === 5, "no range below and not in use: five of the rung, no surprise");
  const t = taskOf(plus, "anwenden", { ...L.rung(plus, "20/uebergang").params }, { r: random(3) });
  const u = taskOf(plus, "anwenden", { ...L.rung(plus, "20/uebergang").params, inverseOf: t.vars }, { r: random(3) });
  check(t.vars.gap !== "c" || (u.vars.op === "minus" && u.vars.a === t.vars.c && u.vars.c === t.vars.a), "the inverse task turns the task before round");

  // bridges: the same kind of mistake 3 times in the last two rounds
  const b = L.blank();
  for (let i = 0; i < 3; i++) L.mistake(b, "plus", "zehner");
  check(L.oftenWrong(b, "plus", 3) === "zehner" && L.bridgeRung(plus, "20/gemischt", "zehner") === "20/uebergang", "forgetting the ten 3 times brings the bridge over the ten");
  const bs = plan({ def: plus, p: "sehen", rung: "20/gemischt", pol: feld, size: 5, below: "10/gemischt", bridge: "20/uebergang", r: random(1) });
  check(bs.slice(0, 3).every((s) => s.kind === "bridge" && s.rung === "20/uebergang") && bs[3].kind === "review", "the bridge takes the first three tasks");
  b.ideas.plus.rounds += 3;
  check(L.oftenWrong(b, "plus", 3) === null, "after two more rounds the old mistakes no longer count");

  // the learning box
  const lb = feld.learningBox;
  const x = L.blank();
  box.record(x, "plus:8,5", { first: true, ms: 9000, fact: true }, lb);
  box.record(x, "plus:8,5", { first: true, ms: 9000, fact: true }, lb);
  box.record(x, "plus:8,5", { first: true, ms: 9000, fact: true }, lb);
  check(x.box["plus:8,5"].box === 3, "from box 3 on a fact must be fast to move up");
  box.record(x, "plus:8,5", { first: true, ms: 2000, fact: true }, lb);
  check(x.box["plus:8,5"].box === 4, "fast and right moves it to box 4");
  box.record(x, "plus:8,5", { first: false }, lb);
  check(x.box["plus:8,5"].box === 2, "a wrong answer drops it two boxes");
  box.record(x, "plus:3,4", { first: false }, lb);
  check(box.score(x, "plus:3,4", lb) > box.score(x, "plus:9,9", lb) && box.score(x, "plus:9,9", lb) > box.score(x, "plus:8,5", lb) - 9, "a card that went wrong comes before a new one");

  // the clearing: opens with the flags of plus and minus at 10, its stories use the finished operations
  const c = L.blank();
  const f0 = L.facts(c, { age: 6, defs });
  check(JSON.stringify(allowed(f0)) === JSON.stringify({ plus: 10, minus: 10 }), "before any flag the stories use plus and minus up to 10");
  for (const id of ["plus", "minus"]) for (const p of defs[id].perspectives) c.ideas[id] = c.ideas[id] ?? L.slot(c, id), (L.slot(c, id).cells[L.cellKey(p, "20/gemischt")] = { n: 5, first: 5, recent: [], star: "2026-11-27" });
  const f1 = L.facts(c, { age: 6, defs });
  check(f1.flag("apfelbaum", "10") && f1.flag("beeren", "10"), "five stars at 20 also set the flag at 10");
  check(allowed(f1).plus === 20 && allowed(f1).minus === 20 && !allowed(f1).mal, "the stories use plus and minus up to 20, no times yet");
}

// ---------- Only calculation asks first-visit questions: a concept (the Fluss, the Berg) starts small
{
  check(!gate.questions("steg", defs.reihe).length && !gate.questions("zaun", defs.zaun).length, "the stepping stones and the mountain path ask nothing");
  check(gate.questions("apfelbaum", defs.plus).map((q) => q.rung).join() === "10/luecke,20/uebergang,100/zehner", "the bridge to the field asks plus at 10, 20, 100");
}

// ---------- The Berg: the gate of the mountain path, mastered with five stars at any level, the backpack
{
  const zaun = defs.zaun;
  const berg = policyFor("berg", zaun);
  const rec = L.blank();
  for (const p of zaun.perspectives) L.slot(rec, "zaun").cells[L.cellKey(p, "2")] = { n: 5, first: 5, recent: [], star: "2026-11-27" };
  const f = L.facts(rec, { age: 9, defs });
  check(f.mastered("zaun") && !f.mastered("haken"), "five stars at level 2 master the fence (as in think-lab: any level)");
  check(next("zaun", f) === "ameisen" || next("zaun", f) === "haken", "the journey goes on to a camp the fence opens");
  const pack = { idea: "zaun", p: "anwenden", rung: "2", station: "zaun" };
  const slots = plan({ def: defs.haken, p: "sehen", rung: "1", pol: berg, size: 5, backpack: [pack], r: random(1) });
  check(slots.slice(0, 5).map((s) => s.kind).join() === "cur,cur,cur,cur,backpack" && slots[4].idea === "zaun" && slots[4].counted, "a Berg round: four of the camp and one from the backpack, counted");
  const none = plan({ def: defs.haken, p: "sehen", rung: "1", pol: berg, size: 5, r: random(1) });
  check(none.slice(0, 5).every((s) => s.kind === "cur"), "with an empty backpack the fifth task is the camp's own");
  check(berg.askFeel && !policyFor("fluss", defs.reihe).askFeel, "only the Berg asks how it was");
  const g = policyFor("berg", defs.gipfel);
  check(g.slots.filter((k) => k === "backpack").length === 4 && !g.surprise, "the summit: four camp tasks and one of its own");
}

// ---------- The parents' report: the same shape on every map; a pure game is never an achievement
{
  const rec = L.blank();
  for (let i = 0; i < 2; i++) play(rec, zahl, "sehen", 5, { age: 4 });
  L.slot(rec, "memory").rounds = 3;
  const f = L.facts(rec, { age: 4, defs });
  const R = report(rec, { defs, age: 4, facts: f });
  const tal = R.maps.find((m) => m.id === "tal");
  const wiese = tal.stations.find((s) => s.id === "wiese");
  const stump = tal.stations.find((s) => s.id === "baumstumpf");
  check(R.maps.map((m) => m.id).join() === "tal,fluss,feld,berg", "the report has every map");
  check(wiese.played && wiese.ideas[0].perspectives.length === zahl.perspectives.length, "a station lists its own perspectives");
  check(wiese.ideas[0].perspectives.find((p) => p.id === "sehen").star, "the star of a played perspective shows");
  check(stump.game && !stump.mastered && stump.ideas[0].perspectives.every((p) => !p.star), "number memory is a game: no stars, not 'mastered'");
  check(tal.learn === tal.stations.length - 1, "games are left out of what can be mastered on a map");
  check(wiese.leadsTo.includes("steg"), "counting leads on to the number line (shown to parents)");
  check(R.days.length === 14 && R.days.at(-1).right === 10, "the last 14 days end today with today's answers");
  const shown = R.maps.find((m) => m.id === "berg").stations.find((s) => s.id === "zaun");
  check(!shown.open, "for a 4-year-old the Berg is not open");
  rec.parent.berg = true;
  const f2 = L.facts(rec, { age: 4, defs });
  check(report(rec, { defs, age: 4, facts: f2 }).maps.find((m) => m.id === "berg").stations.find((s) => s.id === "zaun").open, "the parents' switch opens the Berg");
}

// ---------- The backup: AnkaPlay's own file back again; think-lab's file is not taken
{
  const data = { "anka:profiles": JSON.stringify({ v: 1, kids: [] }), "anka:learner:k1": JSON.stringify(L.blank("k1")) };
  const file = JSON.parse(JSON.stringify(backup.pack(data, "2026-11-27")));
  check(backup.unpack(file).data?.["anka:learner:k1"] === data["anka:learner:k1"], "a backup file loads back as it was saved");
  check(backup.unpack({ app: "AnkaPlay", v: 1, saved: "2026-11-26", data: { "thinklab:profiles": "{}" } }).error === "thinklab", "a think-lab backup is recognised and not taken");
  check(backup.unpack({ ...file, data: { ...file.data, "other:key": "1" } }).error === "bad", "a file with foreign keys does not fit");
  check(backup.unpack({ ...file, data: { "anka:x": "{not json" } }).error === "bad", "a file with broken entries does not fit");
  check(backup.unpack(null).error === "bad" && backup.unpack({ ...file, data: {} }).error === "bad", "an empty file does not fit");
  const mem = new Map([["anka:lang", '"ne"'], ["anka:old", "1"], ["other", "x"]]);
  const storage = { get length() { return mem.size; }, key: (i) => [...mem.keys()][i], getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v), removeItem: (k) => mem.delete(k) };
  backup.write(data, storage);
  check(!mem.has("anka:old") && mem.get("other") === "x" && mem.get("anka:lang") === '"ne"' && mem.has("anka:learner:k1"), "loading replaces AnkaPlay's entries, keeps the language and leaves others alone");
}

// ---------- The info page for parents (/info/): every station is explained, with the ways it really has
{
  const { STATIONS, MAPS } = await import("../public/content/universe.js");
  const info = (await import("../public/info/lang/de.js")).default;
  for (const s of STATIONS) {
    const t = info.stations[s.id];
    check(t?.idea && t?.learns, `the info page explains station ${s.id}`);
    if (!t) continue;
    const has = s.ideas.flatMap((i) => defs[i]?.perspectives ?? []);
    const ways = Object.keys(t.ways ?? info.maps[`${s.map}Ways`] ?? {});
    check(ways.every((w) => has.includes(w)), `the info page names only the ways station ${s.id} has`);
    if (t.ways) check(has.every((w) => ways.includes(w)), `the info page names every way of station ${s.id}`);
  }
  for (const m of MAPS) check(info.maps[m.id] && info.ageOf[m.id], `the info page describes map ${m.id}`);
  // every idea with more than one level says what its levels are (a pure game and the top have none to tell)
  for (const s of STATIONS) {
    const t = info.stations[s.id];
    for (const [i, id] of s.ideas.entries()) {
      const part = i === 0 ? t : t?.second;
      const levels = new Set((defs[id]?.ladder ?? []).map((r) => r.group)).size;
      if (levels > 1) check(part?.steps, `the info page names the levels of ${id} at station ${s.id}`);
    }
  }
  // English and Nepali say the same things as German: the same stations, ways, levels, second ideas, maps
  const shape = (x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, shape(x[k])])) : Array.isArray(x) ? x.length : typeof x);
  for (const code of ["en", "ne"]) {
    const other = (await import(`../public/info/lang/${code}.js`)).default;
    for (const key of ["stations", "maps", "ways", "ageOf", "labels", "basics"]) {
      check(JSON.stringify(shape(other[key])) === JSON.stringify(shape(info[key])), `the info page in ${code} has the same ${key} as in German`);
    }
    check(other.why?.items?.length === info.why.items.length, `the info page in ${code} gives every reason why`);
    check(!other.note, `the info page in ${code} is written in ${code}, without a note that it is not`);
  }
}

// ---------- The parents' page: the same texts in every language
{
  const de = (await import("../public/eltern/lang/de.js")).default;
  for (const code of ["en", "ne"]) {
    const other = (await import(`../public/eltern/lang/${code}.js`)).default;
    const keys = (x) => JSON.stringify(Object.keys(x).sort());
    check(keys(other) === keys(de) && keys(other.mapNotes) === keys(de.mapNotes) && keys(other.mistakes) === keys(de.mistakes) && other.how.length === de.how.length, `the parents' page in ${code} has every text the German one has`);
  }
}

console.log(`${checks} checks.`);
for (const p of problems) console.log(`PROBLEM: ${p}`);
if (!problems.length) console.log("The engine keeps the rules.");
process.exit(problems.length ? 1 : 0);
