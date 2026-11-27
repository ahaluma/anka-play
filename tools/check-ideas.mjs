// Makes 1000 tasks per rung and perspective (and per kind of task) of every idea written as data
// (public/ideas/*/idea.js) and checks them: the idea has 1 to 5 perspectives in the fixed order and a recipe
// for each, every board and answer mode exists, the right answer is among the options, numbers stay in
// range, no task fails to draw, and every `ask` has its sentences in German.
// Run: node tools/check-ideas.mjs

import { readdirSync, existsSync } from "node:fs";
import { make, variants, taskOf } from "../public/engine/recipe.js";
import { BOARDS, ANSWERS } from "../public/content/boards.js";
import { PERSPECTIVES, checkPerspectives } from "../public/content/perspectives.js";
import { THING_IDS } from "../public/engine/things.js";
import { READY } from "../public/ideas/index.js";
import { random } from "../public/engine/random.js";

const dir = new URL("../public/ideas/", import.meta.url);
// The helpers the sentences get (engine/i18n.js), without the browser.
const H = { w: (n) => String(n), n: String, thing: () => ({ one: "eins", many: "viele" }), big: (s) => s };
const problems = [];
let made = 0;

const folders = readdirSync(dir).filter((name) => existsSync(new URL(`${name}/idea.js`, dir)));
for (const name of folders) if (!READY.includes(name)) problems.push(`${name}: has a folder but is not in ideas/index.js READY`);
for (const name of READY) if (!folders.includes(name)) problems.push(`${name}: in READY but has no ideas/${name}/idea.js`);

for (const name of folders) {
  const { IDEA } = await import(new URL(`${name}/idea.js`, dir));
  const de = (await import(new URL(`${name}/lang/de.js`, dir))).default;
  if (IDEA.id !== name) problems.push(`${name}: idea.js says id ${IDEA.id}`);
  const bad = checkPerspectives(IDEA.perspectives);
  if (bad) problems.push(`${name}: ${bad}`);
  for (const extra of Object.keys(IDEA.recipes ?? {})) {
    if (!IDEA.perspectives?.includes(extra)) problems.push(`${name}: recipe for ${extra}, which is not one of its perspectives`);
  }
  const ids = IDEA.ladder.map((r) => r.id);
  if (new Set(ids).size !== ids.length) problems.push(`${name}: two rungs with the same id`);
  for (const id of Object.values(IDEA.start?.byAge ?? {})) if (!ids.includes(id)) problems.push(`${name}: start.byAge names rung ${id}, which is not on the ladder`);

  for (const p of PERSPECTIVES.filter((x) => IDEA.perspectives?.includes(x.id))) {
    const recipe = IDEA.recipes?.[p.id];
    if (!recipe && !IDEA.tasks) { problems.push(`${name}: no recipe for ${p.id}`); continue; }
    if (!recipe) {
      // task code (docs/DESIGN.md 6.5): 1000 tasks per rung, each checked by the idea's own check()
      // its sentences: under the idea and perspective, or a shared section the idea names (IDEA.words)
      const words = IDEA.words ? de[IDEA.words] : `${name}.${p.id}`.split(".").reduce((o, k) => o?.[k], de);
      if (!words) problems.push(`${name}/${p.id}: no German sentences for ${IDEA.words ?? `${name}.${p.id}`}`);
      if (!IDEA.board) problems.push(`${name}: task code needs its own board (IDEA.board)`);
      for (const rung of IDEA.ladder) {
        const r = random(7);
        for (let i = 0; i < 1000; i++) {
          try {
            const t = taskOf(IDEA, p.id, rung.params, { r, things: THING_IDS });
            made++;
            let bad = IDEA.tasks.check?.(t.vars, { p: p.id, ...rung.params }) ?? [];
            // the Feld's inverse slot: the same numbers the other way round must be a fine task too
            if (!bad.length && IDEA.inverseIn?.includes(p.id)) {
              const u = taskOf(IDEA, p.id, { ...rung.params, inverseOf: t.vars }, { r, things: THING_IDS });
              made++;
              bad = (IDEA.tasks.check?.(u.vars, { p: p.id, ...rung.params }) ?? []).map((x) => `inverse: ${x}`);
            }
            if (bad.length) {
              problems.push(`${name}/${p.id}@${rung.id}: ${bad.join(", ")} in ${JSON.stringify(t.vars)}`);
              break;
            }
          } catch (e) {
            problems.push(`${name}/${p.id}@${rung.id}: ${e.message}`);
            break;
          }
        }
      }
      continue;
    }
    for (const rung of IDEA.ladder) {
      const kinds = variants(recipe, rung.params);
      if (!kinds.length) { problems.push(`${name}/${p.id}@${rung.id}: no kind of task fits this rung`); continue; }
      for (const kind of kinds) {
        if (!BOARDS[kind.board] && IDEA.board !== kind.board) problems.push(`${name}/${p.id}: unknown board ${kind.board}`);
        const words = kind.ask.split(".").reduce((o, k) => o?.[k], de);
        if (!words) problems.push(`${name}/${p.id}: no German sentences for ${kind.ask}`);
        const r = random(7);
        for (let i = 0; i < 1000; i++) {
          try {
            const t = make({ ...kind, weight: undefined }, rung.params, { r, things: THING_IDS });
            made++;
            if (!ANSWERS[t.answer.mode]) problems.push(`${name}/${p.id}: unknown answer mode ${t.answer.mode}`);
            const among = (opts, v) => opts.some((o) => JSON.stringify(o) === JSON.stringify(v));
            if (t.answer.options && !among(t.answer.options, t.answer.value)) {
              problems.push(`${name}/${p.id}@${rung.id}: right answer ${t.answer.value} not among ${t.answer.options}`);
              break;
            }
            if (t.answer.fixOptions && !among(t.answer.fixOptions, t.answer.fix)) {
              problems.push(`${name}/${p.id}@${rung.id}: fix ${t.answer.fix} not among ${t.answer.fixOptions}`);
              break;
            }
            const max = rung.params.max ?? Infinity;
            const nums = Object.values(t.vars).flat().filter((v) => typeof v === "number");
            if (nums.some((v) => v > max + 2 || v < -2)) {
              problems.push(`${name}/${p.id}@${rung.id}: number out of range in ${JSON.stringify(t.vars)}`);
              break;
            }
            // every sentence of the task can be made (German), with an answer given
            // (a board ported from think-lab makes its sentences itself, with number words: engine/ui/ported.js)
            if (!IDEA.ported) for (const [key, entry] of Object.entries(words ?? {})) {
              if (typeof entry === "function") entry({ ...t.vars, given: t.answer.value, seen: true, first: true, prev: 1, chosen: 2, next: 0 }, H);
            }
          } catch (e) {
            problems.push(`${name}/${p.id}@${rung.id} (${kind.ask}): ${e.message}`);
            break;
          }
        }
      }
    }
  }
}

console.log(`${made} tasks made.`);
for (const p of problems) console.log(`PROBLEM: ${p}`);
if (!problems.length) console.log("Every recipe is fine.");
process.exit(problems.length ? 1 : 0);
