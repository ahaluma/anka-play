// The memory world (#/memory-zahlen, #/memory-formen, #/memory-rechnen): three tables, each a memory game
// (deck.js), linked in a ring by portals like the places of the Tal. A pure game: no stars, nothing read
// aloud; a turned card, a pair and a miss each make a short sound. The level of each table follows the child:
// a board with few misses moves one level up, many misses one down (deck.js nextLevel).

import { state, age } from "../engine/app.js";
import { store } from "../engine/store.js";
import { shared as T, textsIn, num } from "../engine/i18n.js";
import { href } from "../engine/router.js";
import { el, button, shake, wait } from "../engine/ui/parts.js";
import { topbar } from "../engine/ui/topbar.js";
import { sound, celebrate } from "../engine/ui/sound.js";
import { mountFigures, figure } from "../offen/figures.js";
import { portals } from "../offen/portals.js";
import * as D from "./deck.js";

// The shapes in a 40 × 40 box.
const SHAPE = {
  kreis: '<circle cx="20" cy="20" r="15"/>',
  quadrat: '<rect x="6" y="6" width="28" height="28" rx="2"/>',
  dreieck: '<path d="M20 4L36 33H4Z"/>',
  rechteck: '<rect x="3" y="11" width="34" height="18" rx="2"/>',
  stern: '<path d="M20 3l4.9 10.4 11.4 1.4-8.4 7.8 2.2 11.3L20 28.3 9.9 33.9l2.2-11.3-8.4-7.8 11.4-1.4z"/>',
  herz: '<path d="M20 35C8 26 3 19 3 12.5 3 7 7 3.5 11.8 3.5c3.6 0 6.3 2 8.2 5 1.9-3 4.6-5 8.2-5C33 3.5 37 7 37 12.5 37 19 32 26 20 35Z"/>',
  sechseck: '<path d="M11 5h18l9 15-9 15H11L2 20Z"/>',
  raute: '<path d="M20 2l15 18-15 18L5 20Z"/>',
};
const OP = { "+": "+", "-": "−", "*": "·", ":": ":" };

export async function render(root, route) {
  const X = await textsIn(new URL("./lang/", import.meta.url));
  const table = route.table;
  const key = `memory:${state.kid?.id ?? "guest"}`;
  const levels = store.get(key, null) ?? {};
  if (!Number.isInteger(levels[table])) levels[table] = D.startLevel(table, age());
  mountFigures();

  root.append(topbar({ back: { href: href.home(), label: T.labels.home, kid: true }, middle: el("h1", "title", X.tables[table]) }));
  const caption = el("p", "caption");
  const grid = el("div", "mem-grid");
  const below = el("div", "offen-below");
  root.append(caption, grid, below, portals(`memory-${table}`, X.places, X.portals));

  const face = (c) => {
    const f = el("span", `front f-${c.kind}`);
    if (c.kind === "zahl" || c.kind === "ergebnis") f.append(el("span", "big", num(c.value)));
    else if (c.kind === "punkte") {
      const d = el("span", "mem-dots" + (c.value > 5 ? " two" : "") + (c.value > 10 ? " big" : ""));
      for (let i = 0; i < c.value; i++) d.append(el("i"));
      f.append(d);
    } else if (c.kind === "aufgabe") {
      const { a, op, b } = c.value;
      f.append(el("span", "sum", `${num(a)} ${OP[op]} ${num(b)}`));
    } else {
      const { shape, color, turn, size } = c.value;
      f.innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="${color}" transform="rotate(${turn} 20 20) translate(${20 - 20 * size} ${20 - 20 * size}) scale(${size})">${SHAPE[shape]}</g></svg>`;
    }
    return f;
  };

  async function board() {
    const deal = D.deal(table, levels[table]);
    const { cards, open, pairs } = deal;
    grid.replaceChildren();
    grid.classList.toggle("many", cards.length > 8);
    grid.classList.toggle("wide", table === "rechnen");
    caption.textContent = open ? X.open : X.down;
    let picked = null;
    let found = 0;
    let misses = 0;
    let locked = false;
    const turn = (c, up) => c.el.classList.toggle("down", !up);
    let solved;
    const done = new Promise((r) => (solved = r));

    async function tap(c) {
      if (locked || c.el.classList.contains("found") || c === picked) return;
      if (!picked) {
        picked = c;
        turn(c, true);
        c.el.classList.add("picked");
        sound.tap();
        return;
      }
      const first = picked;
      picked = null;
      turn(c, true);
      first.el.classList.remove("picked");
      if (D.isPair(first, c)) {
        for (const x of [first, c]) x.el.classList.add("found", "pop");
        found++;
        sound.right();
        if (found === pairs) solved();
        return;
      }
      misses++;
      locked = true;
      for (const x of [first, c]) shake(x.el);
      sound.tap();
      await wait(open ? 400 : 1300); // face down: time to look at both cards
      if (!grid.isConnected) return;
      if (!open) for (const x of [first, c]) turn(x, false);
      locked = false;
    }

    for (const c of cards) {
      const b = button("mem-card", X.card);
      const back = el("span", "back");
      back.append(figure("star"));
      b.append(face(c), back);
      c.el = b;
      if (!open) turn(c, false);
      b.addEventListener("click", () => tap(c));
      grid.append(b);
    }

    await done;
    celebrate(40);
    caption.textContent = X.solved;
    levels[table] = D.nextLevel(table, levels[table], pairs, misses);
    store.set(key, levels);
    await wait(900);
    const next = button("btn go offen-next", X.next);
    next.append(figure("next", "btn-sign"));
    below.replaceChildren(next);
    await new Promise((r) => next.addEventListener("click", r));
    below.replaceChildren();
    return board();
  }

  board().catch(() => {});
}
