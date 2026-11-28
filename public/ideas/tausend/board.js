// The boards of the idea "tausend": the place-value table with counters (as in school), one column per place, the
// biggest place on the left. Ten counters in a column become one in the next column. Interface of the ported boards
// (engine/ui/ported.js).

import { port, el, button, shake, wait, numpad, judge } from "../../engine/ui/ported.js";
import { digitsOf, fromDigits } from "./tasks.js";

const NAMES = ["HT", "ZT", "T", "H", "Z", "E"]; // the German school names; other languages bring their own

let current = null;
function pad(box, ctx, places, onCheck) {
  current?.remove();
  current = numpad(box, ctx.T, { digits: places === 6 ? 7 : 5, onCheck });
  return current;
}

/** A number with a small gap between groups of three: 45 300. */
export const big = (ctx, n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace(/\d+/g, (d) => ctx.num(d));

/**
 * The table: one column per place, `counts` counters in each (biggest place first). Returns { box, set(counts),
 * cols, foot } where foot holds an element under each column (for buttons).
 */
function table(ctx, places, counts) {
  const S = ctx.T.tausend;
  const names = (S.places ?? NAMES).slice(6 - places);
  const box = el("div", `pt-table pt-${places}`);
  const cols = names.map((name) => {
    const col = el("div", "pt-col");
    const head = el("span", "pt-head", name);
    const body = el("div", "pt-body");
    col.append(head, body);
    box.append(col);
    return { col, body };
  });
  const set = (c) =>
    c.forEach((n, i) => {
      cols[i].body.replaceChildren(...Array.from({ length: n }, () => el("span", "pt-chip")));
      cols[i].col.classList.toggle("empty", n === 0);
    });
  set(counts);
  return { box, set, cols };
}

// ---------- Sehen: which number?

export function sehen(host, t, ctx) {
  const S = ctx.T.tausend;
  const scene = el("div", "scene card pt-scene");
  const tb = table(ctx, t.places, digitsOf(t.n, t.places));
  const row = el("div", "pt-digits");
  scene.append(tb.box, row);
  let locked = false;
  const padBox = el("div");
  const p = pad(padBox, ctx, t.places, (n) => {
    if (locked) return false;
    if (n !== t.n) {
      p.clear();
      const missed = fromDigits(digitsOf(t.n, t.places).filter((x) => x > 0));
      ctx.miss(n === missed ? S.zeroMiss : S.sehen.miss);
      return false;
    }
    locked = true;
    p.show(n);
    p.lock(true);
    ctx.solved(S.sehen.done(big(ctx, n)));
    return true;
  });
  host.append(scene, padBox);
  ctx.tell(S.sehen.ask);
  return {
    hint() {
      // under each column its digit
      row.replaceChildren(...digitsOf(t.n, t.places).map((d) => el("span", "pt-digit", ctx.num(d))));
      return S.hint;
    },
  };
}

// ---------- Machen: lay the number; ten counters become one in the next column

export function machen(host, t, ctx) {
  const S = ctx.T.tausend;
  const scene = el("div", "scene card pt-scene");
  scene.append(el("p", "pt-big", big(ctx, t.n)));
  const counts = new Array(t.places).fill(0);
  const tb = table(ctx, t.places, counts);
  const foot = el("div", `pt-foot pt-${t.places}`);
  let locked = false;
  let busy = false;
  for (let i = 0; i < t.places; i++) {
    const cell = el("div", "pt-btns");
    const plus = button("btn pt-btn", S.machen.more, "+");
    const minus = button("btn pt-btn", S.machen.less, "−");
    plus.addEventListener("click", async () => {
      if (locked || busy) return;
      counts[i]++;
      ctx.tap();
      tb.set(counts);
      if (counts[i] === 10) {
        if (i === 0) {
          counts[i] = 9;
          tb.set(counts);
          return ctx.miss(S.machen.full);
        }
        busy = true;
        tb.cols[i].col.classList.add("bundle");
        await wait(650);
        tb.cols[i].col.classList.remove("bundle");
        counts[i] = 0;
        counts[i - 1]++;
        tb.set(counts);
        busy = false;
        ctx.tell(S.machen.ten, undefined, true);
      }
    });
    minus.addEventListener("click", () => {
      if (locked || busy || counts[i] === 0) return;
      counts[i]--;
      ctx.tap();
      tb.set(counts);
    });
    cell.append(plus, minus);
    foot.append(cell);
  }
  scene.append(tb.box, foot);
  const done = button("btn ok check-btn", S.machen.check, "✓");
  done.addEventListener("click", () => {
    if (locked || busy) return;
    const want = digitsOf(t.n, t.places);
    if (want.some((d, i) => d !== counts[i])) {
      shake(done);
      const i = want.findIndex((d, k) => d !== counts[k]);
      return ctx.miss(S.machen.miss(tb.cols[i].col.querySelector(".pt-head").textContent));
    }
    locked = true;
    ctx.solved(S.machen.done(big(ctx, t.n)));
  });
  host.append(scene, done);
  ctx.tell(S.machen.ask(big(ctx, t.n)));
  return { hint: () => S.machen.hint };
}

// ---------- Forschen: one counter more or less: which number comes out?

export function forschen(host, t, ctx) {
  const S = ctx.T.tausend;
  const scene = el("div", "scene card pt-scene");
  const counts = digitsOf(t.n, t.places);
  const tb = table(ctx, t.places, counts);
  const col = t.places - 1 - t.place;
  tb.cols[col].col.classList.add("on");
  const name = tb.cols[col].col.querySelector(".pt-head").textContent;
  scene.append(el("p", "pt-big", big(ctx, t.n)), tb.box);
  let locked = false;
  const row = el("div", "name-row");
  for (const v of t.options) {
    const b = button("btn name-btn pt-option", big(ctx, v), big(ctx, v));
    b.addEventListener("click", async () => {
      if (locked) return;
      if (v !== t.answer) {
        shake(b);
        b.disabled = true;
        const across = (t.dir === 1 && counts[col] === 9) || (t.dir === -1 && counts[col] === 0);
        return ctx.miss(across ? S.forschen.across : S.forschen.miss(name));
      }
      locked = true;
      b.classList.add("right");
      tb.set(digitsOf(t.answer, t.places));
      ctx.solved(S.forschen.done(big(ctx, t.n), big(ctx, t.answer)));
    });
    row.append(b);
  }
  host.append(scene, row);
  ctx.tell(t.dir === 1 ? S.forschen.more(name) : S.forschen.less(name));
  return { hint: () => S.forschen.hint };
}

// ---------- Anwenden: just numbers

export function anwenden(host, t, ctx) {
  const S = ctx.T.tausend;
  const scene = el("div", "scene card pt-scene");
  let locked = false;
  if (t.kind === "bigger") {
    const row = el("div", "name-row");
    for (const v of [t.a, t.b]) {
      const b = button("btn name-btn pt-option", big(ctx, v), big(ctx, v));
      b.addEventListener("click", () => {
        if (locked) return;
        if (v !== t.answer) {
          shake(b);
          b.disabled = true;
          return ctx.miss(S.anwenden.biggerMiss);
        }
        locked = true;
        b.classList.add("right");
        ctx.solved(S.anwenden.biggerDone(big(ctx, t.answer)));
      });
      row.append(b);
    }
    scene.append(row);
    host.append(scene);
    ctx.tell(S.anwenden.bigger);
    return { hint: () => S.anwenden.biggerHint };
  }
  const ask = t.kind === "after" ? S.anwenden.after(big(ctx, t.n)) : t.kind === "before" ? S.anwenden.before(big(ctx, t.n)) : S.anwenden.plus(big(ctx, t.n), big(ctx, t.step));
  scene.append(el("p", "pt-big", t.kind === "after" ? `${big(ctx, t.n)} + ${ctx.num(1)}` : t.kind === "before" ? `${big(ctx, t.n)} − ${ctx.num(1)}` : `${big(ctx, t.n)} + ${big(ctx, t.step)}`));
  const padBox = el("div");
  const p = pad(padBox, ctx, t.places, (n) => {
    if (locked) return false;
    if (n !== t.answer) {
      p.clear();
      ctx.miss(S.anwenden.miss);
      return false;
    }
    locked = true;
    p.show(n);
    p.lock(true);
    ctx.solved(S.anwenden.done(big(ctx, n)));
    return true;
  });
  host.append(scene, padBox);
  ctx.tell(ask);
  return { hint: () => S.anwenden.hint };
}

// ---------- Prüfen: the owl reads the table

export function pruefen(host, t, ctx) {
  const S = ctx.T.tausend;
  let locked = false;
  const scene = el("div", "scene card owl-scene pt-scene");
  const talk = el("div", "talk");
  const bubble = el("div", "bubble", big(ctx, t.said));
  talk.append(el("span", "owl", "🦉"), bubble);
  const tb = table(ctx, t.places, digitsOf(t.n, t.places));
  scene.append(talk, tb.box);
  const padBox = el("div");
  const box = judge(ctx.T, (yes, b) => {
    if (locked) return;
    if (yes !== t.right) {
      shake(b);
      return ctx.miss(S.pruefen.look);
    }
    if (yes) {
      locked = true;
      return ctx.solved(S.sehen.done(big(ctx, t.n)));
    }
    box.hidden = true;
    bubble.classList.add("wrong");
    ctx.tap();
    ctx.tell(S.pruefen.fix(S.why[t.why]), undefined, true);
    const p = pad(padBox, ctx, t.places, (n) => {
      if (locked) return false;
      if (n !== t.n) {
        p.clear();
        ctx.miss(S.pruefen.fixMiss);
        return false;
      }
      locked = true;
      p.show(n);
      p.lock(true);
      bubble.textContent = big(ctx, n);
      ctx.solved(S.sehen.done(big(ctx, n)));
      return true;
    });
  });
  host.append(scene, box, padBox);
  ctx.tell(S.pruefen.ask(big(ctx, t.said)));
  return { hint: () => S.pruefen.hint };
}

export const draw = port({ sehen, machen, forschen, anwenden, pruefen });
