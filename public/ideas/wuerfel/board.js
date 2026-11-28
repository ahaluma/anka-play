// The boards of the idea "wuerfel": wooden boxes drawn at a slant from the front (front, top and right side), the
// plan from above (a grid with numbers, back at the top), the net of six squares. Interface of the ported boards
// (engine/ui/ported.js).

import { port, el, button, shake, numpad, judge } from "../../engine/ui/ported.js";
import { total, clash, fold } from "./tasks.js";

const NS = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};

let current = null;
function pad(box, ctx, onCheck) {
  current?.remove();
  current = numpad(box, ctx.T, { digits: 2, onCheck });
  return current;
}

/**
 * A building of boxes h[row][col] (row 0 at the back), drawn with depth going up to the right. The numbers of the plan
 * sit on the tops and show with the class "show-tops". Returns the svg.
 */
function building(ctx, h, size = 40) {
  const rows = h.length;
  const cols = Math.max(...h.map((r) => r.length));
  const top = Math.max(1, ...h.flat());
  const s = size, dx = s * 0.55, dy = s * 0.42, p = 6;
  const W = cols * s + (rows - 1) * dx + dx + 2 * p;
  const H = top * s + (rows - 1) * dy + dy + 2 * p;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "box-building" });
  svg.style.maxWidth = `${W * 1.4}px`;
  const baseY = H - p;
  const poly = (pts, cls) => svgEl("polygon", { points: pts.map((q) => q.join(",")).join(" "), class: cls });
  for (let d = rows - 1; d >= 0; d--) {
    const row = h[rows - 1 - d];
    for (let c = 0; c < row.length; c++) {
      for (let z = 0; z < row[c]; z++) {
        const x = p + c * s + d * dx;
        const y = baseY - z * s - d * dy;
        const g = svgEl("g", { class: "box" });
        g.append(
          svgEl("rect", { x, y: y - s, width: s, height: s, class: "box-front" }),
          svgEl("line", { x1: x + 5, y1: y - s / 2, x2: x + s - 5, y2: y - s / 2, class: "box-slat" }),
          poly([[x, y - s], [x + s, y - s], [x + s + dx, y - s - dy], [x + dx, y - s - dy]], "box-top"),
          poly([[x + s, y], [x + s + dx, y - dy], [x + s + dx, y - s - dy], [x + s, y - s]], "box-side"),
        );
        svg.append(g);
      }
      if (row[c] > 0) {
        const x = p + c * s + d * dx + s / 2 + dx / 2;
        const y = baseY - row[c] * s - d * dy - dy / 2 + 5;
        const t = svgEl("text", { x, y, "text-anchor": "middle", class: "box-no" });
        t.textContent = ctx.num(row[c]);
        svg.append(t);
      }
    }
  }
  return svg;
}

/** The plan from above: back at the top. onTap(row, col) makes the squares buttons. Returns { box, cells }. */
function plan(ctx, h, onTap) {
  const S = ctx.T.wuerfel;
  const box = el("div", "box-plan");
  box.append(el("span", "box-side-label", S.back));
  const grid = el("div", "box-grid");
  grid.style.gridTemplateColumns = `repeat(${h[0].length}, 1fr)`;
  const cells = h.map((row, r) =>
    row.map((v, c) => {
      const cell = onTap ? button("box-cell", ctx.num(v), ctx.num(v)) : el("span", "box-cell", ctx.num(v));
      if (onTap) cell.addEventListener("click", () => onTap(r, c, cell));
      grid.append(cell);
      return cell;
    }),
  );
  box.append(grid, el("span", "box-side-label", S.front));
  return { box, cells };
}

// ---------- Sehen: how many boxes?

export function sehen(host, t, ctx) {
  const S = ctx.T.wuerfel;
  const scene = el("div", "scene card box-scene");
  scene.append(building(ctx, t.h));
  let locked = false;
  const padBox = el("div");
  const p = pad(padBox, ctx, (n) => {
    if (locked) return false;
    if (n !== t.answer) {
      p.clear();
      ctx.miss(S.sehen.miss);
      return false;
    }
    locked = true;
    p.show(n);
    p.lock(true);
    scene.classList.add("show-tops");
    ctx.solved(S.count(ctx.num(n)));
    return true;
  });
  host.append(scene, padBox);
  ctx.tell(S.sehen.ask);
  return {
    hint() {
      scene.classList.add("show-tops");
      return S.hint;
    },
  };
}

// ---------- Machen: write the plan, the building grows beside it

export function machen(host, t, ctx) {
  const S = ctx.T.wuerfel;
  const scene = el("div", "scene card box-scene");
  scene.append(building(ctx, t.h));
  const mine = t.h.map((row) => row.map(() => 1));
  const work = el("div", "box-work");
  const own = el("div", "box-own");
  const drawOwn = () => own.replaceChildren(el("span", "box-caption", S.machen.built), building(ctx, mine, 26));
  let locked = false;
  const { box, cells } = plan(ctx, mine, (r, c, cell) => {
    if (locked) return;
    mine[r][c] = (mine[r][c] % t.max) + 1;
    cell.textContent = ctx.num(mine[r][c]);
    cell.classList.remove("wrong");
    ctx.tap();
    drawOwn();
  });
  const planBox = el("div", "box-own");
  planBox.append(el("span", "box-caption", S.machen.plan), box);
  drawOwn();
  work.append(planBox, own);
  const done = button("btn ok check-btn", S.machen.check, "✓");
  done.addEventListener("click", () => {
    if (locked) return;
    const same = (g) => g.every((row, r) => row.every((v, c) => v === mine[r][c]));
    if (!same(t.h)) {
      shake(done);
      t.h.forEach((row, r) => row.forEach((v, c) => cells[r][c].classList.toggle("wrong", v !== mine[r][c])));
      const mirror = t.h.map((row) => [...row].reverse());
      const flip = [...t.h].reverse();
      return ctx.miss(same(mirror) ? S.machen.mirror : t.h.length > 1 && same(flip) ? S.machen.flip : S.machen.miss);
    }
    locked = true;
    cells.flat().forEach((cell) => cell.classList.add("right"));
    ctx.solved(`${S.machen.done} ${S.count(ctx.num(total(t.h)))}`);
  });
  host.append(scene, work, done);
  ctx.tell(S.machen.ask);
  return { hint: () => S.machen.hint };
}

// ---------- Forschen: does the net fold into a cube?

const PAIR = ["#ffc83a", "#7cc6f2", "#8ad48a"];

export function forschen(host, t, ctx) {
  const S = ctx.T.wuerfel;
  const scene = el("div", "scene card box-scene");
  const s = 46, p = 4;
  const w = Math.max(...t.cells.map((c) => c[0])) + 1;
  const hh = Math.max(...t.cells.map((c) => c[1])) + 1;
  const svg = svgEl("svg", { viewBox: `0 0 ${w * s + 2 * p} ${hh * s + 2 * p}`, class: "box-net" });
  svg.style.maxWidth = `${(w * s + 2 * p) * 1.3}px`;
  const squares = t.cells.map(([x, y]) => {
    const q = svgEl("rect", { x: p + x * s, y: p + y * s, width: s, height: s, class: "net-square" });
    svg.append(q);
    return q;
  });
  scene.append(svg);
  const showClash = () => clash(t.cells).forEach((bad, i) => bad && squares[i].classList.add("clash"));
  let locked = false;
  const box = judge(ctx.T, (yes, b) => {
    if (locked) return;
    if (yes !== t.answer) {
      shake(b);
      if (!t.answer) showClash();
      return ctx.miss(t.answer ? S.forschen.missNo : S.forschen.missYes);
    }
    locked = true;
    if (t.answer) {
      fold(t.cells).forEach((f, i) => (squares[i].style.fill = PAIR[Math.floor(f / 2)]));
      return ctx.solved(S.forschen.doneYes);
    }
    showClash();
    ctx.solved(S.forschen.doneNo);
  });
  host.append(scene, box);
  ctx.tell(S.forschen.ask);
  return { hint: () => S.forschen.hint };
}

// ---------- Anwenden: which plan belongs to the building?

export function anwenden(host, t, ctx) {
  const S = ctx.T.wuerfel;
  const scene = el("div", "scene card box-scene");
  scene.append(building(ctx, t.h));
  let locked = false;
  const row = el("div", "box-options");
  t.options.forEach((g, i) => {
    const b = button("btn box-option", `${i + 1}`);
    b.replaceChildren(plan(ctx, g).box);
    b.addEventListener("click", () => {
      if (locked) return;
      if (i !== t.answer) {
        shake(b);
        b.disabled = true;
        return ctx.miss(S.anwenden.miss);
      }
      locked = true;
      b.classList.add("right");
      scene.classList.add("show-tops");
      ctx.solved(S.anwenden.done);
    });
    row.append(b);
  });
  host.append(scene, row);
  ctx.tell(S.anwenden.ask);
  return { hint: () => S.anwenden.hint };
}

// ---------- Prüfen: the owl counts boxes

export function pruefen(host, t, ctx) {
  const S = ctx.T.wuerfel;
  let locked = false;
  const scene = el("div", "scene card owl-scene box-scene");
  const talk = el("div", "talk");
  const bubble = el("div", "bubble", S.pruefen.said(ctx.num(t.said)));
  talk.append(el("span", "owl", "🦉"), bubble);
  scene.append(talk, building(ctx, t.h));
  const padBox = el("div");
  const box = judge(ctx.T, (yes, b) => {
    if (locked) return;
    if (yes !== t.right) {
      shake(b);
      return ctx.miss(S.pruefen.look);
    }
    if (yes) {
      locked = true;
      scene.classList.add("show-tops");
      return ctx.solved(S.count(ctx.num(t.answer)));
    }
    box.hidden = true;
    bubble.classList.add("wrong");
    ctx.tap();
    ctx.tell(S.pruefen.fix(S.why[t.why]), undefined, true);
    const p = pad(padBox, ctx, (n) => {
      if (locked) return false;
      if (n !== t.answer) {
        p.clear();
        ctx.miss(S.pruefen.fixMiss);
        return false;
      }
      locked = true;
      p.show(n);
      p.lock(true);
      bubble.textContent = S.pruefen.said(ctx.num(n));
      scene.classList.add("show-tops");
      ctx.solved(S.count(ctx.num(n)));
      return true;
    });
  });
  host.append(scene, box, padBox);
  ctx.tell(S.pruefen.ask(ctx.num(t.said)));
  return {
    hint() {
      scene.classList.add("show-tops");
      return S.pruefen.hint;
    },
  };
}

export const draw = port({ sehen, machen, forschen, anwenden, pruefen });
