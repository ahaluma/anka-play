// The boards of the idea "plan": the garden from above on squares, letters along the top (A, B, C …), numbers
// down the side (1, 2, 3 …), things drawn in their squares; arrows for the way of the duck.
// Interface of the ported boards (engine/ui/ported.js).

import { port, el, button, shake, numpad, judge, wait } from "../../engine/ui/ported.js";
import { DIRS, walk } from "./tasks.js";

let current = null;
function pad(box, ctx, digits, onCheck) {
  current?.remove();
  current = numpad(box, ctx.T, { digits, onCheck });
  return current;
}

const ICON = { duck: "🦆", tree: "🌳", house: "🏠", flower: "🌷", bench: "🪑", well: "⛲", nest: "🪺", stone: "🪨" };
const ARROW = { up: "↑", down: "↓", left: "←", right: "→" };
const LETTERS = "ABCDEF";
const same = (a, b) => a[0] === b[0] && a[1] === b[1];

/** The name of a square: B3. */
const nameOf = (ctx, c) => `${LETTERS[c[0]]}${ctx.num(c[1] + 1)}`;

/** The plan: n × n squares with their names round the edge. Returns { node, put(id, at), cellAt(c), onTap }. */
function plan(ctx, n, { onTap = null } = {}) {
  const node = el("div", "plan-grid");
  node.style.setProperty("--n", n);
  node.append(el("span", "plan-corner"));
  for (let c = 0; c < n; c++) node.append(el("span", "plan-head", LETTERS[c]));
  const cells = [];
  for (let r = 0; r < n; r++) {
    node.append(el("span", "plan-head", ctx.num(r + 1)));
    for (let c = 0; c < n; c++) {
      const b = el(onTap ? "button" : "span", "plan-cell");
      if (onTap) {
        b.type = "button";
        b.setAttribute("aria-label", nameOf(ctx, [c, r]));
        b.addEventListener("click", () => onTap([c, r], b));
      }
      cells.push(b);
      node.append(b);
    }
  }
  const cellAt = (c) => cells[c[1] * n + c[0]];
  return {
    node,
    cellAt,
    put(id, at) {
      const s = el("span", `plan-thing ${id}`, ICON[id]);
      cellAt(at).append(s);
      return s;
    },
  };
}

/** Move the duck square by square along a way; stops at a stone or the edge. Returns where it stopped. */
async function run(ctx, p, n, start, way, stones, duckNode) {
  let at = start;
  for (const d of way) {
    const next = [at[0] + DIRS[d][0], at[1] + DIRS[d][1]];
    const w = walk(n, at, [d], stones);
    if (!w.ok) {
      duckNode.classList.add("shake");
      await wait(400);
      return { at, ok: false };
    }
    at = next;
    p.cellAt(at).append(duckNode);
    ctx.tap();
    await wait(330);
  }
  return { at, ok: true };
}

// ---------- Sehen: where is it?

export function sehen(host, t, ctx) {
  const S = ctx.T.plan;
  const p = plan(ctx, t.n);
  for (const x of t.things) p.put(x.id, x.at);
  const scene = el("div", "scene card plan-scene");
  scene.append(p.node);
  let locked = false;
  const row = el("div", "name-row");
  for (const o of t.options) {
    const b = button("btn name-btn plan-btn", nameOf(ctx, o), nameOf(ctx, o));
    b.addEventListener("click", () => {
      if (locked) return;
      if (!same(o, t.answer)) {
        shake(b);
        b.disabled = true;
        return ctx.miss(o[0] === t.answer[1] && o[1] === t.answer[0] ? S.swap : S.sehen.miss);
      }
      locked = true;
      b.classList.add("right");
      ctx.solved(S.sehen.done(S.things[t.ask], nameOf(ctx, o)));
    });
    row.append(b);
  }
  host.append(scene, row);
  ctx.tell(S.sehen.ask(S.things[t.ask]));
  return {
    hint() {
      p.cellAt(t.answer).classList.add("glow");
      return S.hint;
    },
  };
}

// ---------- Machen: build the way

export function machen(host, t, ctx) {
  const S = ctx.T.plan;
  const p = plan(ctx, t.n);
  for (const s of t.stones) p.put("stone", s);
  p.put("nest", t.nest);
  const duck = p.put("duck", t.duck);
  const scene = el("div", "scene card plan-scene");
  scene.append(p.node);
  const way = [];
  const list = el("div", "plan-way");
  const redraw = () => list.replaceChildren(...(way.length ? way.map((d) => el("span", "plan-step", ARROW[d])) : [el("span", "plan-empty", S.machen.empty)]));
  redraw();
  let locked = false;
  let busy = false;
  const keys = el("div", "plan-keys");
  for (const d of ["left", "up", "down", "right"]) {
    const b = button("btn plan-key", S.dirs[d], ARROW[d]);
    b.addEventListener("click", () => {
      if (locked || busy || way.length >= 12) return;
      way.push(d);
      ctx.tap();
      redraw();
    });
    keys.append(b);
  }
  const back = button("btn plan-key", ctx.T.labels?.erase ?? "⌫", "⌫");
  back.addEventListener("click", () => {
    if (locked || busy) return;
    way.pop();
    redraw();
  });
  keys.append(back);
  const go = button("btn ok check-btn", S.machen.go, "▶");
  go.addEventListener("click", async () => {
    if (locked || busy || !way.length) return;
    busy = true;
    const res = await run(ctx, p, t.n, t.duck, way, t.stones, duck);
    busy = false;
    if (res.ok && same(res.at, t.nest)) {
      locked = true;
      return ctx.solved(way.length === t.steps ? S.machen.doneShort(ctx.num(way.length)) : S.machen.done(ctx.num(way.length), ctx.num(t.steps)));
    }
    ctx.miss(res.ok ? S.machen.notThere : S.machen.bump);
    duck.classList.remove("shake");
    p.cellAt(t.duck).append(duck);
  });
  host.append(scene, list, keys, go);
  ctx.tell(t.stones.length ? S.machen.askStones : S.machen.ask);
  return {
    hint() {
      p.cellAt(t.nest).classList.add("glow");
      return S.machen.hint;
    },
  };
}

// ---------- Forschen: where does the duck end up?

export function forschen(host, t, ctx) {
  const S = ctx.T.plan;
  let locked = false;
  let busy = false;
  const p = plan(ctx, t.n, {
    async onTap(c, b) {
      if (locked || busy) return;
      busy = true;
      b.classList.add("picked");
      await run(ctx, p, t.n, t.duck, t.way, t.stones, duck);
      busy = false;
      if (!same(c, t.answer)) {
        shake(b);
        b.classList.remove("picked");
        p.cellAt(t.duck).append(duck);
        return ctx.miss(S.forschen.miss);
      }
      locked = true;
      ctx.solved(S.forschen.done(nameOf(ctx, t.answer)));
    },
  });
  for (const s of t.stones) p.put("stone", s);
  const duck = p.put("duck", t.duck);
  const scene = el("div", "scene card plan-scene");
  scene.append(p.node);
  const list = el("div", "plan-way");
  list.append(...t.way.map((d) => el("span", "plan-step", ARROW[d])));
  host.append(list, scene);
  ctx.tell(S.forschen.ask);
  return { hint: () => S.forschen.hint };
}

// ---------- Anwenden: the scale

export function anwenden(host, t, ctx) {
  const S = ctx.T.plan;
  const p = plan(ctx, t.n);
  p.put(t.a.id, t.a.at);
  p.put(t.b.id, t.b.at);
  const scene = el("div", "scene card plan-scene");
  if (t.unit === "m") scene.append(el("p", "plan-scale", S.anwenden.scale(ctx.num(t.scale))));
  scene.append(p.node);
  let locked = false;
  const padBox = el("div");
  const p2 = pad(padBox, ctx, 3, (n) => {
    if (locked) return false;
    if (n !== t.answer) {
      p2.clear();
      ctx.miss(t.ask === "metres" && n === t.squares && t.unit === "m" ? S.anwenden.missScale : S.anwenden.miss);
      return false;
    }
    locked = true;
    p2.show(n);
    p2.lock(true);
    ctx.solved(t.unit !== "m" ? S.anwenden.doneSteps(ctx.num(n)) : t.ask === "squares" ? S.anwenden.doneSquares(ctx.num(t.answer * t.scale), ctx.num(n)) : S.anwenden.done(ctx.num(t.squares), ctx.num(t.scale), ctx.num(n)));
    return true;
  });
  host.append(scene, padBox);
  const A = S.things[t.a.id], B = S.things[t.b.id];
  ctx.tell(t.unit !== "m" ? S.anwenden.askSteps(A, B) : t.ask === "squares" ? S.anwenden.askSquares(A, B, ctx.num(t.squares * t.scale)) : S.anwenden.ask(A, B));
  return { hint: () => (t.unit !== "m" ? S.anwenden.hintSteps : S.anwenden.hint(ctx.num(t.scale))) };
}

// ---------- Prüfen: the owl names the square

export function pruefen(host, t, ctx) {
  const S = ctx.T.plan;
  const p = plan(ctx, t.n);
  for (const x of t.things) p.put(x.id, x.at);
  const scene = el("div", "scene card owl-scene plan-scene");
  const talk = el("div", "talk");
  const bubble = el("div", "bubble", `${ICON[t.ask]} ${nameOf(ctx, t.said)}`);
  talk.append(el("span", "owl", "🦉"), bubble);
  scene.append(talk, p.node);
  let locked = false;
  const fix = el("div", "name-row");
  fix.hidden = true;
  for (const o of t.options) {
    const b = button("btn name-btn plan-btn", nameOf(ctx, o), nameOf(ctx, o));
    b.addEventListener("click", () => {
      if (locked) return;
      if (!same(o, t.answer)) return void (shake(b), (b.disabled = true), ctx.miss(S.sehen.miss));
      locked = true;
      b.classList.add("right");
      bubble.textContent = `${ICON[t.ask]} ${nameOf(ctx, o)}`;
      ctx.solved(S.sehen.done(S.things[t.ask], nameOf(ctx, o)));
    });
    fix.append(b);
  }
  const box = judge(ctx.T, (yes, b) => {
    if (locked) return;
    if (yes !== t.right) {
      shake(b);
      return ctx.miss(S.pruefen.look);
    }
    if (yes) {
      locked = true;
      return ctx.solved(S.sehen.done(S.things[t.ask], nameOf(ctx, t.answer)));
    }
    box.hidden = true;
    fix.hidden = false;
    bubble.classList.add("wrong");
    ctx.tap();
    ctx.tell(S.pruefen.fix(t.why === "swap" ? S.swap : S.pruefen.near), undefined, true);
  });
  host.append(scene, box, fix);
  ctx.tell(S.pruefen.ask(S.things[t.ask], nameOf(ctx, t.said)));
  return { hint: () => S.hint };
}

export const draw = port({ sehen, machen, forschen, anwenden, pruefen });
