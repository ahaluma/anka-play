// Board "memory" (number memory at the tree stump): number cards and picture cards, find the pairs.
// Ported from think-lab's games/zahlen-memory/game.js. One task is one board; when all pairs are found, the
// board is solved. Open cards: a wrong pair is a mistake (the frame counts it, and helps after two).
// Face down: a wrong pair is part of the game, the cards are only read out and turn back.
//
// Task (recipe in idea.js): numbers, things (one per number), order (where each card lies), open.
// Texts: ask, card (v.kind, v.n, v.thing), match (v.n), miss, right, hint.

import { el, button, shake, wait } from "../../engine/ui/parts.js";

export function draw(host, t, ctx) {
  const { numbers, things, order, open } = t.vars;
  const cards = numbers.flatMap((n, i) => [{ n, kind: "number" }, { n, kind: "things", thing: things[i] }]);
  const grid = el("div", "mem-grid" + (numbers.length > 4 ? " many" : ""));
  let picked = null;
  let found = 0;
  let locked = false;

  const turn = (c, up) => c.el.classList.toggle("down", !up);
  const say = (c) => ctx.tell("card", { kind: c.kind, n: c.n, thing: c.thing });

  for (const at of order) {
    const c = cards[at];
    const b = button("btn mem-card " + c.kind, ctx.word(c.n));
    const front = el("span", "front");
    if (c.kind === "number") front.append(el("span", "big", ctx.num(c.n)));
    else {
      const pics = el("span", "mem-pics " + (c.n <= 3 ? "few" : c.n <= 6 ? "some" : c.n <= 10 ? "lots" : "heaps"));
      for (let i = 0; i < c.n; i++) pics.append(el("i", "", ctx.icon(c.thing)));
      front.append(pics);
    }
    const back = el("span", "back", "?");
    back.setAttribute("aria-hidden", "true");
    b.append(front, back);
    c.el = b;
    if (!open) turn(c, false);
    b.addEventListener("click", () => tap(c));
    grid.append(b);
  }
  host.append(grid);

  async function tap(c) {
    if (locked || c.el.classList.contains("found") || c === picked) return;
    // Open cards: two cards of the same kind just move the choice.
    if (!picked || (open && picked.kind === c.kind)) {
      picked?.el.classList.remove("picked");
      picked = c;
      turn(c, true);
      c.el.classList.add("picked");
      ctx.tap();
      say(c);
      return;
    }
    const first = picked;
    picked = null;
    turn(c, true);
    first.el.classList.remove("picked");
    if (first.n === c.n && first.kind !== c.kind) {
      for (const x of [first, c]) x.el.classList.add("found", "bounce");
      found++;
      if (found < numbers.length) {
        ctx.tap();
        ctx.tell("match", { n: c.n });
        return;
      }
      locked = true;
      ctx.solved({ n: c.n });
      return;
    }
    // Not a pair. With open cards that is a mistake; face down it is part of the game.
    locked = true;
    for (const x of [first, c]) shake(x.el);
    if (open) await ctx.miss({ given: c.n });
    else await say(c);
    await wait(open ? 300 : 1400); // face down: time to look at both cards
    if (!grid.isConnected) return;
    if (!open) for (const x of [first, c]) turn(x, false);
    locked = false;
  }

  return { ready: ctx.ask("ask"), ownAnswer: true };
}
