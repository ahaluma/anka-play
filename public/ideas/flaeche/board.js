// The boards of the idea "flaeche": a garden on squared ground. Paving slabs are green squares, the fence is a row
// of brown pieces round the bed, one piece per side of a slab, with small gaps so they can be counted.
// Interface of the ported boards (engine/ui/ported.js).

import { port, el, button, shake, numpad, judge } from "../../engine/ui/ported.js";
import { fence, isRect, edgeCells } from "./tasks.js";

let current = null;
function pad(box, ctx, digits, onCheck) {
  current?.remove();
  current = numpad(box, ctx.T, { digits, onCheck });
  return current;
}

const NS = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};
const key = (c) => `${c[0]},${c[1]}`;

/** A garden of w × h squares with the bed `cells`. onTap(x, y) makes the squares tappable. */
function garden(w, h, cells, { showFence = true, onTap = null, size = 40 } = {}) {
  const pad = 8;
  const svg = svgEl("svg", { viewBox: `0 0 ${w * size + 2 * pad} ${h * size + 2 * pad}`, class: "garden" });
  const ground = svgEl("g");
  const bed = svgEl("g");
  const fenceG = svgEl("g");
  svg.append(ground, bed, fenceG);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const r = svgEl("rect", { x: pad + x * size, y: pad + y * size, width: size, height: size, class: "g-cell" });
      if (onTap) {
        r.classList.add("tap");
        r.addEventListener("click", () => onTap(x, y));
      }
      ground.append(r);
    }
  const draw = (list, withFence = showFence) => {
    bed.replaceChildren();
    fenceG.replaceChildren();
    const set = new Set(list.map(key));
    for (const [x, y] of list) {
      const r = svgEl("rect", { x: pad + x * size + 2, y: pad + y * size + 2, width: size - 4, height: size - 4, rx: 4, class: "g-slab" });
      if (onTap) r.addEventListener("click", () => onTap(x, y));
      bed.append(r);
    }
    if (!withFence) return;
    const g = 5; // the gap at each end of a piece of fence
    for (const [x, y] of list) {
      const X = pad + x * size, Y = pad + y * size;
      if (!set.has(key([x, y - 1]))) fenceG.append(svgEl("line", { x1: X + g, y1: Y, x2: X + size - g, y2: Y, class: "g-fence" }));
      if (!set.has(key([x, y + 1]))) fenceG.append(svgEl("line", { x1: X + g, y1: Y + size, x2: X + size - g, y2: Y + size, class: "g-fence" }));
      if (!set.has(key([x - 1, y]))) fenceG.append(svgEl("line", { x1: X, y1: Y + g, x2: X, y2: Y + size - g, class: "g-fence" }));
      if (!set.has(key([x + 1, y]))) fenceG.append(svgEl("line", { x1: X + size, y1: Y + g, x2: X + size, y2: Y + size - g, class: "g-fence" }));
    }
  };
  draw(cells);
  return { svg, draw };
}

/** A rectangle len × wid, with its squares (grid) or only its measures. */
function rectangle(ctx, t, S) {
  const size = t.grid ? 34 : 30;
  const pad = 34;
  const W = t.len * size, H = t.wid * size;
  const svg = svgEl("svg", { viewBox: `0 0 ${W + 2 * pad} ${H + 2 * pad}`, class: "garden" });
  svg.append(svgEl("rect", { x: pad, y: pad, width: W, height: H, class: "g-slab" + (t.grid ? "" : " plain") }));
  if (t.grid) {
    for (let x = 1; x < t.len; x++) svg.append(svgEl("line", { x1: pad + x * size, y1: pad, x2: pad + x * size, y2: pad + H, class: "g-line" }));
    for (let y = 1; y < t.wid; y++) svg.append(svgEl("line", { x1: pad, y1: pad + y * size, x2: pad + W, y2: pad + y * size, class: "g-line" }));
  }
  svg.append(svgEl("rect", { x: pad, y: pad, width: W, height: H, fill: "none", class: "g-fence" }));
  const label = (x, y, text) => {
    const tx = svgEl("text", { x, y, "text-anchor": "middle", class: "g-label" });
    tx.textContent = text;
    svg.append(tx);
  };
  label(pad + W / 2, pad - 10, S.measure(ctx.num(t.len), t.grid));
  label(pad + W + 20, pad + H / 2 + 6, S.measure(ctx.num(t.wid), t.grid));
  return svg;
}

// ---------- Sehen: how many slabs, how long the fence?

export function sehen(host, t, ctx) {
  const S = ctx.T.flaeche;
  const scene = el("div", "scene card garden-scene");
  scene.append(garden(t.w, t.h, t.cells, { showFence: t.ask === "fence" || t.level > 1 }).svg);
  let locked = false;
  const padBox = el("div");
  const p = pad(padBox, ctx, 2, (n) => {
    if (locked) return false;
    if (n !== t.answer) {
      p.clear();
      ctx.miss(t.ask === "area" && n === fence(t.cells) ? S.mixFence : t.ask === "fence" && n === t.cells.length ? S.mixArea : t.ask === "fence" && n === edgeCells(t.cells) ? S.cellsNotFence : S.sehen.miss[t.ask]);
      return false;
    }
    locked = true;
    p.show(n);
    p.lock(true);
    ctx.solved(S.sehen.done[t.ask](ctx.num(n)));
    return true;
  });
  host.append(scene, padBox);
  ctx.tell(S.sehen.ask[t.ask]);
  return { hint: () => S.sehen.hint[t.ask] };
}

// ---------- Machen: lay a bed

export function machen(host, t, ctx) {
  const S = ctx.T.flaeche;
  let cells = [];
  let locked = false;
  const counts = el("p", "garden-counts");
  const g = garden(t.w, t.h, cells, {
    showFence: t.fence !== undefined || t.rect,
    onTap(x, y) {
      if (locked) return;
      const k = key([x, y]);
      cells = cells.some((c) => key(c) === k) ? cells.filter((c) => key(c) !== k) : [...cells, [x, y]];
      ctx.tap();
      g.draw(cells);
      if (counts.textContent) showCounts();
    },
  });
  const showCounts = () => (counts.textContent = S.machen.counts(ctx.num(cells.length), ctx.num(fence(cells))));
  const scene = el("div", "scene card garden-scene");
  scene.append(g.svg, counts);
  const check = button("btn ok check-btn", S.machen.check, "✓");
  check.addEventListener("click", () => {
    if (locked) return;
    if (cells.length !== t.area) return void (shake(check), ctx.miss(cells.length < t.area ? S.machen.fewer : S.machen.more));
    if (t.rect && !isRect(cells)) return void (shake(check), ctx.miss(S.machen.notRect));
    if (t.fence !== undefined && fence(cells) !== t.fence) return void (shake(check), ctx.miss(fence(cells) > t.fence ? S.machen.fenceMore : S.machen.fenceLess));
    locked = true;
    ctx.solved(t.fence !== undefined ? S.machen.doneBoth(ctx.num(t.area), ctx.num(t.fence)) : S.machen.done(ctx.num(t.area)));
  });
  host.append(scene, check);
  ctx.tell(t.rect ? S.machen.askRect(ctx.num(t.area)) : t.fence !== undefined ? S.machen.askBoth(ctx.num(t.area), ctx.num(t.fence)) : S.machen.ask(ctx.num(t.area)));
  return {
    hint() {
      showCounts();
      return t.fence !== undefined ? S.machen.hintBoth : t.rect ? S.machen.hintRect : S.machen.hint;
    },
  };
}

// ---------- Forschen: two beds

export function forschen(host, t, ctx) {
  const S = ctx.T.flaeche;
  const scene = el("div", "scene card garden-scene two");
  const show = t.ask === "fence";
  const sides = [t.a, t.b].map((cells, i) => {
    const box = el("div", "garden-half");
    box.append(el("b", "", S.forschen.bed(ctx.num(i + 1))), garden(t.w, t.h, cells, { showFence: show, size: 30 }).svg);
    const n = el("p", "garden-counts");
    box.append(n);
    scene.append(box);
    return { cells, n };
  });
  let locked = false;
  const row = el("div", "name-row");
  for (const o of ["a", "b", "same"]) {
    const label = o === "same" ? S.forschen.same : S.forschen.bed(ctx.num(o === "a" ? 1 : 2));
    const b = button("btn name-btn", label, label);
    b.addEventListener("click", () => {
      if (locked) return;
      sides.forEach((s) => (s.n.textContent = t.ask === "area" ? S.forschen.slabs(ctx.num(s.cells.length)) : S.forschen.fence(ctx.num(fence(s.cells)))));
      if (o !== t.answer) {
        shake(b);
        b.disabled = true;
        return ctx.miss(S.forschen.miss[t.ask]);
      }
      locked = true;
      b.classList.add("right");
      ctx.solved(S.forschen.done[t.ask][o === "same" ? "same" : "one"]);
    });
    row.append(b);
  }
  host.append(scene, row);
  ctx.tell(S.forschen.ask[t.ask]);
  return { hint: () => S.forschen.hint[t.ask] };
}

// ---------- Anwenden: a rectangle and its measures

export function anwenden(host, t, ctx) {
  const S = ctx.T.flaeche;
  const scene = el("div", "scene card garden-scene");
  scene.append(rectangle(ctx, t, S));
  let locked = false;
  const padBox = el("div");
  const p = pad(padBox, ctx, 2, (n) => {
    if (locked) return false;
    if (n !== t.answer) {
      p.clear();
      ctx.miss(t.ask === "area" && n === 2 * (t.len + t.wid) ? S.mixFence : t.ask === "fence" && n === t.len * t.wid ? S.mixArea : t.ask === "fence" && n === t.len + t.wid ? S.anwenden.half : S.anwenden.miss[t.ask]);
      return false;
    }
    locked = true;
    p.show(n);
    p.lock(true);
    ctx.solved(S.anwenden.done[t.ask](ctx.num(t.len), ctx.num(t.wid), ctx.num(n), t.grid));
    return true;
  });
  host.append(scene, padBox);
  ctx.tell(S.anwenden.ask[t.ask](t.grid));
  return { hint: () => S.anwenden.hint[t.ask] };
}

// ---------- Prüfen: the owl counted

export function pruefen(host, t, ctx) {
  const S = ctx.T.flaeche;
  const scene = el("div", "scene card owl-scene garden-scene");
  const talk = el("div", "talk");
  const bubble = el("div", "bubble", S.pruefen.said[t.ask](ctx.num(t.said)));
  talk.append(el("span", "owl", "🦉"), bubble);
  scene.append(talk, garden(t.w, t.h, t.cells, { showFence: true }).svg);
  let locked = false;
  const padBox = el("div");
  padBox.hidden = true;
  const box = judge(ctx.T, (yes, b) => {
    if (locked) return;
    if (yes !== t.right) {
      shake(b);
      return ctx.miss(S.pruefen.look[t.ask]);
    }
    if (yes) {
      locked = true;
      return ctx.solved(S.sehen.done[t.ask](ctx.num(t.answer)));
    }
    box.hidden = true;
    padBox.hidden = false;
    bubble.classList.add("wrong");
    ctx.tap();
    ctx.tell(S.pruefen.fix(S.why[t.why]), undefined, true);
    const p = pad(padBox, ctx, 2, (n) => {
      if (locked) return false;
      if (n !== t.answer) {
        p.clear();
        ctx.miss(S.sehen.miss[t.ask]);
        return false;
      }
      locked = true;
      p.show(n);
      p.lock(true);
      bubble.textContent = S.pruefen.said[t.ask](ctx.num(n));
      ctx.solved(S.sehen.done[t.ask](ctx.num(n)));
      return true;
    });
  });
  host.append(scene, box, padBox);
  ctx.tell(S.pruefen.ask(S.pruefen.said[t.ask](ctx.num(t.said))));
  return { hint: () => S.sehen.hint[t.ask] };
}

export const draw = port({ sehen, machen, forschen, anwenden, pruefen });
