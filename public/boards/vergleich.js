// Board "vergleich": two sets side by side. See content/boards.js.
//
//   show.left / show.right   { things, n }
//   show.ask                 "more" | "fewer": the child taps the side with more (fewer), or "=" when both are
//                            the same. The answer is "left", "right" or "same".
//   show.make                "weg" | "dazu": make both sides the same. "weg": tap things on the fuller side,
//                            they go home. "dazu": tap the house of the other side, one comes out. Then ✓.
//                            The answer is the number on the side the child changes.
//
// Texts of the task: ask, hint, right, miss; labels left, right, same, house, done (lang/<language>.js).

import { el, button, group } from "../engine/ui/parts.js";

export function draw(host, t, ctx) {
  return t.show.make ? make(host, t, ctx) : compare(host, t, ctx);
}

function compare(host, t, ctx) {
  const { left, right } = t.show;
  const scene = el("div", "scene card cmp-scene");
  let locked = false;
  const sides = [
    ["left", left],
    ["right", right],
  ].map(([id, set]) => {
    const side = button("side", ctx.label(id));
    side.append(group(set.n, ctx.icon(set.things)));
    side.count = set.n;
    side.addEventListener("click", () => give(id, side));
    return side;
  });
  const same = button("btn same-btn", ctx.label("same"), "=");
  same.append(el("span", "", ctx.label("same")));
  same.addEventListener("click", () => give("same", same));

  async function give(id, node) {
    if (locked) return;
    locked = true;
    const ok = await ctx.give(id, node);
    if (ok) {
      node.classList.add("right");
      counts();
    }
    locked = ok;
  }
  function counts() {
    for (const side of sides) if (!side.querySelector(".count")) side.append(el("b", "count pop", ctx.num(side.count)));
  }
  scene.append(...sides);
  host.append(scene, same);
  ctx.ask("ask");
  return { ownAnswer: true, hint: counts };
}

function make(host, t, ctx) {
  const counts = [t.show.left.n, t.show.right.n];
  const icons = [ctx.icon(t.show.left.things), ctx.icon(t.show.right.things)];
  const big = counts[0] > counts[1] ? 0 : 1;
  const weg = t.show.make === "weg";
  const active = weg ? big : 1 - big; // the side the child changes
  const waiting = Math.abs(counts[0] - counts[1]) + 2; // "dazu": more wait in the house than are needed
  let moved = 0;
  let locked = false;
  let helped = false;

  const scene = el("div", "scene card cmp-scene equal-scene");
  const sides = [0, 1].map((i) => {
    const side = el("div", "side equal-side");
    side.setAttribute("aria-label", ctx.label(i === 0 ? "left" : "right"));
    return side;
  });
  const house = button("btn house-btn", ctx.label("house"), "🏠");
  const inHouse = el("b", "house-count");
  house.append(inHouse);
  const check = button("btn ok check-btn", ctx.label("done"), "✓");
  const now = () => counts[active] + (weg ? -moved : moved);

  function redraw() {
    sides.forEach((side, i) => {
      const n = i === active ? now() : counts[i];
      const g = group(n, icons[i]);
      [...g.children].forEach((pic, j) => {
        if (helped && i === big && j >= Math.min(...counts)) pic.classList.add("unpaired");
        if (i !== active) return;
        pic.classList.add("tappable");
        pic.addEventListener("click", () => {
          if (locked) return;
          if (weg) moved++;
          else if (j >= counts[i]) moved--;
          else return;
          ctx.tap();
          redraw();
        });
      });
      side.replaceChildren(g);
    });
    inHouse.textContent = ctx.num(weg ? moved : waiting - moved);
    house.disabled = weg ? moved === 0 : moved >= waiting;
  }
  house.addEventListener("click", () => {
    if (locked) return;
    moved = weg ? Math.max(0, moved - 1) : Math.min(waiting, moved + 1);
    ctx.tap();
    redraw();
  });
  check.addEventListener("click", async () => {
    if (locked) return;
    locked = true;
    locked = await ctx.give(now(), check, { moved });
  });
  const row = el("div", "house-row" + (active === 0 ? "" : " right"));
  row.append(house);
  scene.append(...sides);
  host.append(scene, row, check);
  redraw();
  ctx.ask("ask");
  return {
    ownAnswer: true,
    hint() {
      helped = true;
      redraw();
    },
  };
}
