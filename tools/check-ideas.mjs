// Makes 1000 tasks per rung and perspective of every idea written as data (public/ideas/*/idea.js) and
// checks them: the idea has 1 to 5 perspectives in the fixed order and a recipe for each, the right answer is among the options, numbers stay in range, no task fails to draw.
// Run: node tools/check-ideas.mjs

import { readdirSync, existsSync } from "node:fs";
import { make } from "../public/engine/recipe.js";
import { BOARDS, ANSWERS } from "../public/content/boards.js";
import { PERSPECTIVES, checkPerspectives } from "../public/content/perspectives.js";

const dir = new URL("../public/ideas/", import.meta.url);
const problems = [];
let made = 0;

for (const name of readdirSync(dir)) {
  const file = new URL(`${name}/idea.js`, dir);
  if (!existsSync(file)) continue;
  const { IDEA } = await import(file);
  const bad = checkPerspectives(IDEA.perspectives);
  if (bad) problems.push(`${name}: ${bad}`);
  for (const extra of Object.keys(IDEA.recipes ?? {})) {
    if (!IDEA.perspectives?.includes(extra)) problems.push(`${name}: recipe for ${extra}, which is not one of its perspectives`);
  }
  for (const p of PERSPECTIVES.filter((x) => IDEA.perspectives?.includes(x.id))) {
    const recipe = IDEA.recipes?.[p.id];
    if (!recipe) { problems.push(`${name}: no recipe for ${p.id}`); continue; }
    if (!BOARDS[recipe.board]) problems.push(`${name}/${p.id}: unknown board ${recipe.board}`);
    for (const rung of IDEA.ladder) {
      for (let i = 0; i < 1000; i++) {
        try {
          const t = make(recipe, rung.params);
          made++;
          if (!ANSWERS[t.answer.mode]) problems.push(`${name}/${p.id}: unknown answer mode ${t.answer.mode}`);
          if (t.answer.options && !t.answer.options.some((o) => o === t.answer.value)) {
            problems.push(`${name}/${p.id}@${rung.id}: right answer ${t.answer.value} not among ${t.answer.options}`);
            break;
          }
          const nums = Object.values(t.vars).filter((v) => typeof v === "number");
          if (nums.some((v) => v > rung.params.max + 2 || v < -1)) {
            problems.push(`${name}/${p.id}@${rung.id}: number out of range in ${JSON.stringify(t.vars)}`);
            break;
          }
        } catch (e) {
          problems.push(`${name}/${p.id}@${rung.id}: ${e.message}`);
          break;
        }
      }
    }
  }
}

console.log(`${made} tasks made.`);
for (const p of problems) console.log(`PROBLEM: ${p}`);
if (!problems.length) console.log("Every recipe is fine.");
process.exit(problems.length ? 1 : 0);
