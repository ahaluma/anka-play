// The boards of the idea "masse": things from everyday life, the pieces to measure with (rods, weights, jugs), a
// table of units. Interface of the ported boards (engine/ui/ported.js).

import { port, el, button, shake, numpad, judge } from "../../engine/ui/ported.js";

let current = null;
function pad(box, ctx, digits, onCheck) {
  current?.remove();
  current = numpad(box, ctx.T, { digits, onCheck });
  return current;
}

const TOOL = { len: "📏", mass: "⚖️", vol: "🫗" };

/** An amount (in mm, g or ml) as it is written: "1 m 35 cm", "750 g", "1 l 500 ml". */
function amount(ctx, x, dim) {
  const n = ctx.num;
  if (dim === "len") {
    const m = Math.floor(x / 1000), cm = Math.round((x % 1000) / 10);
    return [m ? `${n(m)} m` : "", cm ? `${n(cm)} cm` : ""].filter(Boolean).join(" ");
  }
  const [bigU, smallU] = dim === "mass" ? ["kg", "g"] : ["l", "ml"];
  const k = Math.floor(x / 1000), s = x % 1000;
  return [k ? `${n(k)} ${bigU}` : "", s ? `${n(s)} ${smallU}` : ""].filter(Boolean).join(" ");
}

/** The target of "machen": mixed ("1 kg 250 g") or with a part ("1 ½ kg"). */
const targetText = (ctx, t) => (t.show.part ? `${t.show.whole ? ctx.num(t.show.whole) + " " : ""}${t.show.part} ${t.show.unit}` : amount(ctx, t.target, t.dim));

/** One side of a row of the units table: a number (or [number, part]) and its unit. */
function side(ctx, v, unit) {
  if (Array.isArray(v)) return `${ctx.num(v[0])} ${unit === "m" ? "m" : unit} ${ctx.num(v[1])} ${unit === "m" ? "cm" : unit === "kg" ? "g" : "ml"}`;
  return `${typeof v === "number" ? ctx.num(v) : v} ${unit}`;
}

// ---------- Sehen: which unit fits?

export function sehen(host, t, ctx) {
  const S = ctx.T.masse;
  const scene = el("div", "scene card size-scene");
  scene.append(el("span", "size-thing", t.icon), el("p", "size-guess", `${ctx.num(t.value)} ?`));
  let locked = false;
  const row = el("div", "name-row");
  for (const u of t.options) {
    const text = `${ctx.num(t.value)} ${u}`;
    const b = button("btn name-btn size-btn", text, text);
    b.addEventListener("click", () => {
      if (locked) return;
      if (u !== t.answer) {
        shake(b);
        b.disabled = true;
        return ctx.miss(S.sehen.miss(S.feel[u]));
      }
      locked = true;
      b.classList.add("right");
      ctx.solved(S.sehen.done(S.things[t.thing].name, text));
    });
    row.append(b);
  }
  host.append(scene, row);
  ctx.tell(S.things[t.thing].q);
  return { hint: () => S.sehen.hint };
}

// ---------- Machen: pieces together until it is exactly so much

export function machen(host, t, ctx) {
  const S = ctx.T.masse;
  const scene = el("div", "scene card size-scene");
  const goal = el("div", "stellen-goal");
  goal.append(el("b", "", targetText(ctx, t)));
  const pan = el("div", "size-pan");
  pan.dataset.tool = TOOL[t.dim];
  const sum = el("p", "size-sum");
  scene.append(goal, pan, sum);
  const placed = [];
  let locked = false;
  const total = () => placed.reduce((a, b) => a + b, 0);
  const redraw = () => {
    pan.replaceChildren(...placed.map((v, i) => {
      const c = button(`size-piece ${t.dim}`, amount(ctx, v, t.dim), amount(ctx, v, t.dim));
      c.style.setProperty("--w", Math.max(1, Math.log10(v / Math.min(...t.pieces)) + 1));
      c.addEventListener("click", () => {
        if (locked) return;
        placed.splice(i, 1);
        ctx.tap();
        redraw();
      });
      return c;
    }));
    if (sum.textContent) sum.textContent = S.machen.sum(amount(ctx, total(), t.dim) || ctx.num(0));
  };
  const shelf = el("div", "size-shelf");
  for (const v of t.pieces) {
    const b = button(`btn size-add ${t.dim}`, amount(ctx, v, t.dim), amount(ctx, v, t.dim));
    b.addEventListener("click", () => {
      if (locked || placed.length >= 20) return;
      placed.push(v);
      placed.sort((a, b) => b - a);
      ctx.tap();
      redraw();
    });
    shelf.append(b);
  }
  const check = button("btn ok check-btn", S.machen.check, "✓");
  check.addEventListener("click", () => {
    if (locked) return;
    const s = total();
    if (s !== t.target) {
      shake(check);
      return ctx.miss(s < t.target ? S.machen.less : S.machen.more);
    }
    locked = true;
    ctx.solved(S.machen.done(targetText(ctx, t), placed.map((v) => amount(ctx, v, t.dim)).join(" + ")));
  });
  host.append(scene, shelf, check);
  ctx.tell(S.machen.ask[t.dim](targetText(ctx, t)));
  return {
    hint() {
      sum.textContent = S.machen.sum(amount(ctx, total(), t.dim) || ctx.num(0));
      return t.show.part ? S.machen.hintPart[t.dim] : S.machen.hint;
    },
  };
}

// ---------- Forschen: the table of units

function table(ctx, t, asked) {
  const box = el("div", "size-table");
  for (const [v, from, to] of t.rows) {
    const toUnit = t.kind === "part" ? (from === "m" ? "cm" : from === "kg" ? "g" : "ml") : t.ask[2];
    box.append(el("p", "", `${side(ctx, v, from)} = ${ctx.num(to)} ${toUnit}`));
  }
  const last = el("p", "ask", `${side(ctx, t.ask[0], t.ask[1])} = ${asked} ${t.ask[2]}`);
  box.append(last);
  return { box, last };
}

export function forschen(host, t, ctx) {
  const S = ctx.T.masse;
  const scene = el("div", "scene card size-scene");
  const tb = table(ctx, t, "?");
  scene.append(tb.box);
  let locked = false;
  const padBox = el("div");
  const p = pad(padBox, ctx, 5, (n) => {
    if (locked) return false;
    if (n !== t.answer) {
      p.clear();
      ctx.miss(S.forschen.miss);
      return false;
    }
    locked = true;
    p.show(n);
    p.lock(true);
    tb.last.textContent = `${side(ctx, t.ask[0], t.ask[1])} = ${ctx.num(n)} ${t.ask[2]}`;
    tb.last.classList.add("right");
    ctx.solved(S.forschen.done);
    return true;
  });
  host.append(scene, padBox);
  ctx.tell(S.forschen.ask);
  return { hint: () => S.forschen.hint[t.kind] };
}

// ---------- Anwenden: how much about? A short story.

export function anwenden(host, t, ctx) {
  const S = ctx.T.masse;
  let locked = false;
  if (t.kind === "story") {
    const st = S.stories[t.story];
    const scene = el("div", "scene card size-scene");
    scene.append(el("span", "size-thing", st.icon));
    const padBox = el("div");
    const p = pad(padBox, ctx, 4, (n) => {
      if (locked) return false;
      if (n !== t.answer) {
        p.clear();
        ctx.miss(st.miss);
        return false;
      }
      locked = true;
      p.show(n);
      p.lock(true);
      ctx.solved(st.done(ctx.num(n)));
      return true;
    });
    host.append(scene, el("p", "size-unit", S.anwenden.inUnit(t.unit)), padBox);
    ctx.tell(st.ask(...t.numbers.map(ctx.num)));
    return { hint: () => st.hint };
  }
  const scene = el("div", "scene card size-scene");
  scene.append(el("span", "size-thing", t.icon));
  const row = el("div", "name-row");
  for (const v of t.options) {
    const text = `${ctx.num(v)} ${t.unit}`;
    const b = button("btn name-btn size-btn", text, text);
    b.addEventListener("click", () => {
      if (locked) return;
      if (v !== t.answer) {
        shake(b);
        b.disabled = true;
        return ctx.miss(v > t.answer ? S.anwenden.tooBig : S.anwenden.tooSmall);
      }
      locked = true;
      b.classList.add("right");
      ctx.solved(S.sehen.done(S.things[t.thing].name, text));
    });
    row.append(b);
  }
  host.append(scene, row);
  ctx.tell(S.things[t.thing].q);
  return { hint: () => S.anwenden.hint[t.unit] };
}

// ---------- Prüfen: the owl converts

export function pruefen(host, t, ctx) {
  const S = ctx.T.masse;
  const left = side(ctx, t.ask[0], t.ask[1]);
  const scene = el("div", "scene card owl-scene size-scene");
  const talk = el("div", "talk");
  const bubble = el("div", "bubble", `${left} = ${ctx.num(t.said)} ${t.ask[2]}`);
  talk.append(el("span", "owl", "🦉"), bubble);
  const rule = el("p", "size-rule");
  scene.append(talk, rule);
  let locked = false;
  const padBox = el("div");
  padBox.hidden = true;
  const box = judge(ctx.T, (yes, b) => {
    if (locked) return;
    if (yes !== t.right) {
      shake(b);
      return ctx.miss(S.pruefen.look);
    }
    if (yes) {
      locked = true;
      return ctx.solved(S.pruefen.right(`${left} = ${ctx.num(t.answer)} ${t.ask[2]}`));
    }
    box.hidden = true;
    padBox.hidden = false;
    bubble.classList.add("wrong");
    ctx.tap();
    ctx.tell(S.pruefen.fix(S.why[t.why], left, t.ask[2]), undefined, true);
    const p = pad(padBox, ctx, 5, (n) => {
      if (locked) return false;
      if (n !== t.answer) {
        p.clear();
        ctx.miss(S.forschen.miss);
        return false;
      }
      locked = true;
      p.show(n);
      p.lock(true);
      bubble.textContent = `${left} = ${ctx.num(n)} ${t.ask[2]}`;
      ctx.solved(S.pruefen.fixed);
      return true;
    });
  });
  host.append(scene, box, padBox);
  ctx.tell(S.pruefen.ask(`${left} = ${ctx.num(t.said)} ${t.ask[2]}`));
  return {
    hint() {
      rule.textContent = S.rules[`${t.ask[1]}-${t.ask[2]}`] ?? "";
      return S.pruefen.hint;
    },
  };
}

export const draw = port({ sehen, machen, forschen, anwenden, pruefen });
