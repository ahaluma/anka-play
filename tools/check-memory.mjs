// Checks the memory world (public/memory/deck.js): every level of every table deals a board where each card
// has exactly one partner, sums are right, and the level rule moves up and down within the ladder.
//
//   node tools/check-memory.mjs      exits 1 when a check fails

import * as D from "../public/memory/deck.js";
import { MEMORY_PLACES, placeById } from "../public/offen/places.js";

let failed = 0;
const check = (ok, text) => {
  if (!ok) {
    failed++;
    console.error("FAIL " + text);
  }
};
const calc = ({ a, op, b }) => ({ "+": a + b, "-": a - b, "*": a * b, ":": a / b })[op];

for (const table of D.TABLES) {
  D.LADDERS[table].forEach((lv, level) => {
    for (let i = 0; i < 300; i++) {
      const { cards, pairs } = D.deal(table, level);
      check(pairs === lv.pairs && cards.length === 2 * pairs, `${table} ${level}: ${cards.length} cards for ${lv.pairs} pairs`);
      for (const c of cards) check(cards.filter((x) => D.isPair(c, x)).length === 1, `${table} ${level}: a card with no single partner`);
      if (table === "rechnen")
        for (const c of cards.filter((c) => c.kind === "aufgabe")) {
          const r = cards.find((x) => x.kind === "ergebnis" && D.isPair(c, x)).value;
          check(calc(c.value) === r && Number.isInteger(r) && r >= 0, `rechnen ${level}: ${JSON.stringify(c.value)} = ${r}`);
          check(r <= lv.to && c.value.a <= Math.max(lv.to, 100), `rechnen ${level}: too big: ${JSON.stringify(c.value)}`);
          if (lv.ops.every((o) => o === "+" || o === "-")) check(c.value.a <= lv.to && c.value.b <= lv.to, `rechnen ${level}: numbers over ${lv.to}`);
        }
      if (table === "zahlen") for (const c of cards) check(c.value >= lv.from && c.value <= lv.to, `zahlen ${level}: ${c.value} out of range`);
    }
  });
  const top = D.LADDERS[table].length - 1;
  check(D.nextLevel(table, top, 4, 0) === top && D.nextLevel(table, 0, 4, 20) === 0, `${table}: the level stays inside the ladder`);
  check(D.nextLevel(table, 1, 4, 2) === 2 && D.nextLevel(table, 1, 4, 13) === 0 && D.nextLevel(table, 1, 4, 8) === 1, `${table}: up with few misses, down with many`);
  for (const a of [undefined, 3, 5, 8, 12]) check(D.LADDERS[table][D.startLevel(table, a)], `${table}: no start level for age ${a}`);
}
for (const p of MEMORY_PLACES) {
  check(p.links.length === 2 && !p.links.includes(p.id), `${p.id} must link to two other tables`);
  for (const l of p.links) check(placeById[l]?.links.includes(p.id) && l.startsWith("memory-"), `${p.id} -> ${l}: no way back or another world`);
}

if (failed) process.exit(1);
console.log(`ok: ${D.TABLES.map((t) => `${t} ${D.LADDERS[t].length} levels`).join(", ")}`);
