// The boards of the idea "runden": a stretch of the number line (the planks of the footbridge) with the frog at
// a number and the middle marked; digit buttons; the owl. Interface of the ported boards (engine/ui/ported.js).

import { port, el, button, shake, judge } from "../../engine/ui/ported.js";
import { myOwl } from "../../engine/ui/owl.js";

const NS = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};
const SIGN = { plus: "+", minus: "−", mal: "·" };

/**
 * A stretch of the number line from `from` to `to`: small ticks every unit/10, long ticks with their number at every
 * unit, the middles marked. The frog sits at n. Returns { svg, x(value), frogTo(value), mark(value) }.
 */
function line(ctx, { from, to, unit, n, mids = true }) {
  const W = 340, L = 20, R = 320, Y = 70;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} 120`, class: "round-line" });
  const x = (v) => L + ((v - from) / (to - from)) * (R - L);
  svg.append(svgEl("rect", { x: L - 8, y: Y - 6, width: R - L + 16, height: 12, rx: 4, fill: "#c08a52", stroke: "#1b2140", "stroke-width": 2 }));
  const small = unit / 10;
  for (let v = from; v <= to + 1e-9; v += small) {
    const long = Math.abs(v / unit - Math.round(v / unit)) < 1e-9;
    const mid = !long && Math.abs((v - unit / 2) / unit - Math.round((v - unit / 2) / unit)) < 1e-9;
    svg.append(svgEl("line", { x1: x(v), y1: Y - (long ? 18 : mid && mids ? 13 : 7), x2: x(v), y2: Y + (long ? 18 : mid && mids ? 13 : 7), stroke: mid && mids ? "#e8488a" : "#1b2140", "stroke-width": long ? 4 : mid && mids ? 3 : 1.5 }));
    if (long) {
      const t = svgEl("text", { x: x(v), y: Y + 42, "text-anchor": "middle", class: "round-no" });
      t.textContent = ctx.num(Math.round(v));
      svg.append(t);
    } else if (mid && mids) {
      const t = svgEl("text", { x: x(v), y: Y + 34, "text-anchor": "middle", class: "round-mid" });
      t.textContent = ctx.num(Math.round(v));
      svg.append(t);
    }
  }
  const frog = svgEl("g", { class: "round-frog" });
  const body = svgEl("text", { x: 0, y: 0, "text-anchor": "middle", "font-size": 30 });
  body.textContent = "🐸";
  const tag = svgEl("text", { x: 0, y: -30, "text-anchor": "middle", class: "round-tag" });
  tag.textContent = ctx.num(n);
  frog.append(body, tag);
  const frogTo = (v) => frog.setAttribute("transform", `translate(${x(v)} ${Y - 14})`);
  frogTo(n);
  svg.append(frog);
  return {
    svg,
    x,
    frogTo(v) {
      frog.classList.add("hop");
      frogTo(v);
    },
    show(v) {
      tag.textContent = ctx.num(v);
    },
  };
}

// ---------- Sehen: which round neighbour is nearer?

export function sehen(host, t, ctx) {
  const S = ctx.T.runden;
  const scene = el("div", "scene card round-scene");
  const l = line(ctx, { from: t.lo, to: t.hi, unit: t.unit, n: t.n });
  scene.append(l.svg);
  let locked = false;
  const row = el("div", "name-row");
  for (const v of [t.lo, t.hi]) {
    const b = button("btn name-btn round-btn", ctx.num(v), ctx.num(v));
    b.addEventListener("click", () => {
      if (locked) return;
      if (v !== t.answer) {
        shake(b);
        b.disabled = true;
        return ctx.miss(t.n - t.lo === t.unit / 2 ? S.middle : S.sehen.miss);
      }
      locked = true;
      b.classList.add("right");
      l.frogTo(v);
      ctx.solved(t.n - t.lo === t.unit / 2 ? S.middleDone(ctx.num(t.n), ctx.num(v)) : S.done(ctx.num(t.n), ctx.num(v)));
    });
    row.append(b);
  }
  host.append(scene, row);
  ctx.tell(S.sehen.ask(ctx.num(t.n), S.unit[t.unit]));
  return { hint: () => S.hint };
}

// ---------- Machen: tap the round number the frog hops to

export function machen(host, t, ctx) {
  const S = ctx.T.runden;
  const scene = el("div", "scene card round-scene");
  const l = line(ctx, { from: t.from, to: t.to, unit: t.unit, n: t.n, mids: false });
  scene.append(l.svg);
  let locked = false;
  const taps = el("div", "round-taps");
  for (let v = t.from; v <= t.to; v += t.unit) {
    const b = button("round-spot", ctx.num(v));
    b.style.left = `${(l.x(v) / 340) * 100}%`;
    b.addEventListener("click", () => {
      if (locked) return;
      if (v !== t.answer) {
        shake(b);
        return ctx.miss(Math.abs(v - t.n) >= t.unit ? S.machen.far : t.n % t.unit === t.unit / 2 ? S.middle : S.machen.miss);
      }
      locked = true;
      b.classList.add("right");
      l.frogTo(v);
      ctx.solved(S.done(ctx.num(t.n), ctx.num(v)));
    });
    taps.append(b);
  }
  scene.append(taps);
  host.append(scene);
  ctx.tell(S.machen.ask(ctx.num(t.n), S.unit[t.unit]));
  return {
    hint() {
      scene.classList.add("show-mids");
      return S.hint;
    },
  };
}

// ---------- Forschen: which digits fit?

export function forschen(host, t, ctx) {
  const S = ctx.T.runden;
  const shown = `${ctx.num(t.head)}☐${t.tail === null ? "" : ctx.num(t.tail)}`;
  const scene = el("div", "scene card round-scene");
  scene.append(el("p", "round-big", `${shown} → ${ctx.num(t.target)}`));
  const picked = new Set();
  const digits = el("div", "round-digits");
  for (let d = 0; d <= 9; d++) {
    const b = button("btn round-digit", ctx.num(d), ctx.num(d));
    b.addEventListener("click", () => {
      if (locked) return;
      if (picked.has(d)) picked.delete(d);
      else picked.add(d);
      b.classList.toggle("on", picked.has(d));
      ctx.tap();
    });
    digits.append(b);
  }
  scene.append(digits);
  let locked = false;
  const done = button("btn ok check-btn", S.forschen.check, "✓");
  done.addEventListener("click", () => {
    if (locked) return;
    const want = new Set(t.answer);
    const same = want.size === picked.size && [...want].every((d) => picked.has(d));
    if (!same) {
      shake(done);
      const missing = [...want].some((d) => !picked.has(d));
      return ctx.miss(missing ? S.forschen.missing : S.forschen.tooMany);
    }
    locked = true;
    ctx.solved(t.target % (t.unit * 10) === 0 || t.answer[0] === 0 ? S.forschen.doneDown(t.answer.map(ctx.num).join(", ")) : S.forschen.doneUp(t.answer.map(ctx.num).join(", ")));
  });
  host.append(scene, done);
  ctx.tell(S.forschen.ask(shown, ctx.num(t.target)));
  return { hint: () => S.forschen.hint(ctx.num(t.unit === 10 ? t.head * 10 + 5 : t.head * 100 + 50)) };
}

// ---------- Anwenden: about how much?

export function anwenden(host, t, ctx) {
  const S = ctx.T.runden;
  const scene = el("div", "scene card round-scene");
  scene.append(el("p", "round-big", `${ctx.num(t.a)} ${SIGN[t.op]} ${ctx.num(t.b)} ≈ ?`));
  const hintBox = el("p", "round-way");
  scene.append(hintBox);
  let locked = false;
  const row = el("div", "name-row");
  for (const v of t.options) {
    const b = button("btn name-btn round-btn", ctx.num(v), ctx.num(v));
    b.addEventListener("click", () => {
      if (locked) return;
      if (v !== t.answer) {
        shake(b);
        b.disabled = true;
        return ctx.miss(S.anwenden.miss);
      }
      locked = true;
      b.classList.add("right");
      ctx.solved(S.anwenden.done(way(ctx, t), ctx.num(t.answer)));
    });
    row.append(b);
  }
  host.append(scene, row);
  ctx.tell(S.anwenden.ask(`${ctx.num(t.a)} ${SIGN[t.op]} ${ctx.num(t.b)}`));
  return {
    hint() {
      hintBox.textContent = way(ctx, t);
      return S.anwenden.hint;
    },
  };
}

const roundTo = (n, unit) => Math.floor((n + unit / 2) / unit) * unit;
const way = (ctx, t) => (t.op === "mal" ? `${ctx.num(t.a)} ${SIGN.mal} ${ctx.num(roundTo(t.b, t.unit))}` : `${ctx.num(roundTo(t.a, t.unit))} ${SIGN[t.op]} ${ctx.num(roundTo(t.b, t.unit))}`);

// ---------- Prüfen: the owl rounds, or the owl calculated

export function pruefen(host, t, ctx) {
  const S = ctx.T.runden;
  let locked = false;
  const scene = el("div", "scene card owl-scene round-scene");
  const talk = el("div", "talk");
  const said = t.kind === "round" ? `${ctx.num(t.n)} → ${ctx.num(t.said)}` : `${ctx.num(t.a)} ${SIGN[t.op]} ${ctx.num(t.b)} = ${ctx.num(t.said)}`;
  const bubble = el("div", "bubble", said);
  talk.append(myOwl(), bubble);
  scene.append(talk);
  let l = null;
  if (t.kind === "round") {
    l = line(ctx, { from: t.lo, to: t.hi, unit: t.unit, n: t.n });
    scene.append(l.svg);
  }
  const fixRow = el("div", "name-row");
  fixRow.hidden = true;
  const box = judge(ctx.T, (yes, b) => {
    if (locked) return;
    if (yes !== t.right) {
      shake(b);
      return ctx.miss(t.kind === "round" ? S.pruefen.lookRound : S.pruefen.lookCheck);
    }
    if (yes || t.kind === "check") {
      locked = true;
      if (t.kind === "check") return ctx.solved(yes ? S.pruefen.checkRight(way(ctx, { ...t, unit: t.op === "mal" ? 10 : 100 }), ctx.num(t.said)) : S.pruefen.checkWrong(way(ctx, { ...t, unit: t.op === "mal" ? 10 : 100 }), ctx.num(t.exact)));
      return ctx.solved(S.done(ctx.num(t.n), ctx.num(t.answer)));
    }
    box.hidden = true;
    fixRow.hidden = false;
    bubble.classList.add("wrong");
    ctx.tap();
    ctx.tell(S.pruefen.fix(S.why[t.why]), undefined, true);
  });
  if (t.kind === "round") {
    for (const v of [...new Set([t.lo, t.hi, t.said])].sort((a, b) => a - b)) {
      const b = button("btn name-btn round-btn", ctx.num(v), ctx.num(v));
      b.addEventListener("click", () => {
        if (locked) return;
        if (v !== t.answer) return void (shake(b), (b.disabled = true), ctx.miss(S.sehen.miss));
        locked = true;
        b.classList.add("right");
        l.frogTo(v);
        bubble.textContent = `${ctx.num(t.n)} → ${ctx.num(v)}`;
        ctx.solved(S.done(ctx.num(t.n), ctx.num(v)));
      });
      fixRow.append(b);
    }
  }
  host.append(scene, box, fixRow);
  ctx.tell(t.kind === "round" ? S.pruefen.askRound(ctx.num(t.n), S.unit[t.unit], ctx.num(t.said)) : S.pruefen.askCheck(said));
  return { hint: () => (t.kind === "round" ? S.hint : S.pruefen.hintCheck) };
}

export const draw = port({ sehen, machen, forschen, anwenden, pruefen });
