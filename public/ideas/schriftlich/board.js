// The boards of the idea "schriftlich": the written sum on squared paper, ones under ones, the places named above
// (E, Z, H, T), the carry small above the next column. One board per perspective, in the interface of the ported
// boards (engine/ui/ported.js): they make their sentences themselves from lang/<language>.js.

import { port, el, button, shake, numpad, judge } from "../../engine/ui/ported.js";
import { digitsOf, mistakes, resultOf } from "./tasks.js";

let current = null;
function pad(box, ctx, digits, onCheck) {
  current?.remove();
  current = numpad(box, ctx.T, { digits, onCheck });
  return current;
}

const SIGN = { plus: "+", minus: "−", mal: "·", geteilt: ":" };
const len = (n) => String(n).length;

/**
 * The written sum. Columns from the right (0 = ones). Rows: the names of the places, the carries, the first
 * number, the sign and the second number, the line, the result. Divided is written as a row of its own:
 * the number divided, ": b", and the result under it place by place (the rest of a place moves on, small,
 * in front of the next digit).
 * Returns { node, cell(row, col), mark(col), set(row, col, text, cls) }.
 */
function sheet(ctx, t, { width, shiftB = 0, result = null } = {}) {
  const S = ctx.T.schriftlich;
  const div = t.op === "geteilt";
  const w = width ?? Math.max(len(t.a), len(t.b) + shiftB, len(t.result));
  const node = el("div", `sheet sheet-${t.op}`);
  node.style.setProperty("--cols", w + (div ? 2 : 1));
  const rows = {};
  const row = (name, cls = "") => {
    const r = el("div", `sheet-row ${name} ${cls}`);
    const lead = el("span", "sheet-cell lead");
    r.append(lead);
    rows[name] = { r, lead, cells: [] };
    for (let i = w - 1; i >= 0; i--) {
      const c = el("span", "sheet-cell");
      c.dataset.col = i;
      rows[name].cells[i] = c;
      r.append(c);
    }
    if (div) {
      const tail = el("span", "sheet-cell tail");
      rows[name].tail = tail;
      r.append(tail);
    }
    node.append(r);
    return rows[name];
  };
  const names = row("names");
  names.cells.forEach((c, i) => (c.textContent = S.places[i] ?? ""));
  row("carry");
  const A = row("a");
  digitsOf(t.a).forEach((d, i) => (A.cells[i].textContent = ctx.num(d)));
  if (div) {
    A.tail.textContent = `: ${ctx.num(t.b)}`;
    row("res", "line");
  } else {
    const B = row("b");
    B.lead.textContent = SIGN[t.op];
    if (t.op === "mal") {
      // times one digit: the digit stands at the end of the first row, as in school (234 · 3)
      node.removeChild(B.r);
      A.lead.textContent = "";
      const extra = el("span", "sheet-cell times");
      extra.textContent = `· ${ctx.num(t.b)}`;
      A.r.append(extra);
      node.style.setProperty("--cols", w + 2);
      Object.values(rows).forEach((x) => x !== A && x.r.append(el("span", "sheet-cell")));
    } else digitsOf(t.b).forEach((d, i) => B.cells[i + shiftB] && (B.cells[i + shiftB].textContent = ctx.num(d)));
    const R = row("res", "line");
    if (t.op === "mal") R.r.append(el("span", "sheet-cell"));
  }
  if (result !== null) digitsOf(result).forEach((d, i) => rows.res.cells[i] && (rows.res.cells[i].textContent = ctx.num(d)));
  return {
    node,
    width: w,
    cell: (name, col) => rows[name]?.cells[col] ?? null,
    mark(col) {
      node.querySelectorAll(".sheet-cell.on").forEach((c) => c.classList.remove("on"));
      if (col === null) return;
      for (const name of ["names", "carry", "a", "b", "res"]) rows[name]?.cells[col]?.classList.add("on");
    },
    set(name, col, text, cls = "") {
      const c = rows[name]?.cells[col];
      if (!c) return;
      c.textContent = text;
      if (cls) c.classList.add(...cls.split(" "));
    },
  };
}

/** The sentence of the hint for one column: what is added (taken, multiplied, divided) there. */
function columnSum(ctx, t, col, { cin = 0, top = null, rest = 0 } = {}) {
  const S = ctx.T.schriftlich;
  const A = digitsOf(t.a), B = digitsOf(t.b);
  const n = ctx.num;
  if (t.op === "plus") return S.sumPlus(n(A[col] ?? 0), n(B[col] ?? 0), cin ? n(cin) : null, n((A[col] ?? 0) + (B[col] ?? 0) + cin));
  if (t.op === "mal") return S.sumMal(n(A[col]), n(t.b), cin ? n(cin) : null, n(A[col] * t.b + cin));
  if (t.op === "minus") return S.sumMinus(n(top ?? A[col]), n(B[col] ?? 0), n((top ?? A[col]) - (B[col] ?? 0)));
  const cur = rest * 10 + A[col];
  return S.sumGeteilt(rest ? n(rest) : null, n(A[col]), n(cur), n(t.b), n(Math.floor(cur / t.b)));
}

/** What a typed whole result says about the mistake behind it (the same list the owl uses). */
function missFor(ctx, t, given) {
  const S = ctx.T.schriftlich;
  const m = mistakes(t).find(([x]) => x === given);
  return m ? S.mistake[m[1]] : S.miss;
}

// ---------- Sehen: one step of the method, or ones under ones

export function sehen(host, t, ctx) {
  const S = ctx.T.schriftlich;
  let locked = false;
  if (t.kind === "align") {
    const row = el("div", "sheet-choice");
    t.layouts.forEach((shift, i) => {
      // shift 0: ones under ones; otherwise the second number stands `shift` places too far left
      const s = sheet(ctx, { ...t, result: t.a }, { width: Math.max(len(t.a), len(t.b) + shift), shiftB: shift });
      const b = button("btn sheet-pick", S.sehen.pick(i + 1));
      b.append(s.node);
      b.addEventListener("click", () => {
        if (locked) return;
        if (i !== t.answer) {
          shake(b);
          b.disabled = true;
          return ctx.miss(S.sehen.alignMiss);
        }
        locked = true;
        b.classList.add("right");
        ctx.solved(S.sehen.alignDone);
      });
      row.append(b);
    });
    host.append(row);
    ctx.tell(S.sehen.alignAsk(ctx.num(t.a), SIGN[t.op], ctx.num(t.b)));
    return { hint: () => S.sehen.alignHint };
  }

  // one column: the columns before it are done
  const s = sheet(ctx, t);
  const done = fill(ctx, t, s, t.col);
  s.mark(t.col);
  const scene = el("div", "scene card sheet-scene");
  scene.append(s.node);
  const v = t.v;
  const words = {
    split: S.sehen.split(ctx.num(v % 10), ctx.num(Math.floor(v / 10))),
    swap: S.sehen.split(ctx.num(Math.floor(v / 10)), ctx.num(v % 10)),
    all: S.sehen.all(ctx.num(v)),
    trade: S.sehen.trade(ctx.num(t.x + 10), ctx.num(t.y)),
    turn: S.sehen.turn(ctx.num(t.y), ctx.num(t.x)),
    zero: S.sehen.zero,
    next: S.sehen.next(ctx.num(t.left)),
    drop: S.sehen.drop,
    down: S.sehen.down(ctx.num(t.left)),
  };
  const row = el("div", "name-row sheet-options");
  for (const o of t.options) {
    const b = button("btn name-btn", words[o], words[o]);
    b.addEventListener("click", () => {
      if (locked) return;
      if (o !== t.answer) {
        shake(b);
        b.disabled = true;
        return ctx.miss(S.sehen.stepMiss[t.op]);
      }
      locked = true;
      b.classList.add("right");
      ctx.solved(S.sehen.stepDone[t.op]);
    });
    row.append(b);
  }
  host.append(scene, row);
  const n = ctx.num;
  const place = S.placeNames[t.col];
  const ask =
    t.op === "plus" ? S.sehen.askPlus(place, n(t.x), n(t.y), t.cin ? n(t.cin) : null, n(v))
    : t.op === "mal" ? S.sehen.askMal(place, n(t.x), n(t.y), t.cin ? n(t.cin) : null, n(v))
    : t.op === "minus" ? S.sehen.askMinus(place, n(t.x), n(t.y))
    : S.sehen.askGeteilt(place, n(t.x), n(t.y), n(v), n(t.left));
  ctx.tell(ask);
  void done;
  return { hint: () => S.sehen.stepHint[t.op] };
}

/** Fill the columns before `upTo` (plus, minus, times from the right; divided from the left), as if calculated. */
function fill(ctx, t, s, upTo) {
  const A = digitsOf(t.a), B = digitsOf(t.b);
  if (t.op === "plus" || t.op === "mal") {
    let c = 0;
    for (let i = 0; i < upTo; i++) {
      const v = t.op === "plus" ? (A[i] ?? 0) + (B[i] ?? 0) + c : A[i] * t.b + c;
      s.set("res", i, ctx.num(v % 10));
      c = Math.floor(v / 10);
      if (c) s.set("carry", i + 1, ctx.num(c), "carried");
    }
  } else if (t.op === "minus") {
    let borrow = 0;
    for (let i = 0; i < upTo; i++) {
      let top = A[i] - borrow;
      if (borrow) s.set("carry", i, ctx.num(top), "traded");
      if (top < (B[i] ?? 0)) {
        top += 10;
        s.set("carry", i, ctx.num(top), "traded");
        borrow = 1;
      } else borrow = 0;
      s.cell("a", i).classList.toggle("struck", s.cell("carry", i).textContent !== "");
      s.set("res", i, ctx.num(top - (B[i] ?? 0)));
    }
    if (borrow) {
      s.set("carry", upTo, ctx.num(A[upTo] - 1), "traded");
      s.cell("a", upTo).classList.add("struck");
    }
  } else {
    let rest = 0;
    for (let i = A.length - 1; i > upTo; i--) {
      const cur = rest * 10 + A[i];
      const q = Math.floor(cur / t.b);
      rest = cur - q * t.b;
      s.set("res", i, q || i < A.length - 1 ? ctx.num(q) : "");
    }
    if (rest) s.set("carry", upTo, ctx.num(rest), "carried rest");
  }
}

// ---------- Machen: column by column

export function machen(host, t, ctx) {
  const S = ctx.T.schriftlich;
  const s = sheet(ctx, t);
  const scene = el("div", "scene card sheet-scene");
  scene.append(s.node);
  const say = el("p", "sheet-say");
  const padBox = el("div");
  const tools = el("div", "sheet-tools");
  const A = digitsOf(t.a), B = digitsOf(t.b);
  const top = [...A]; // minus: the digits as they are after trading
  const cols = t.op === "geteilt" ? A.map((_, i) => A.length - 1 - i) : A.map((_, i) => i).concat(t.op === "plus" && B.length > A.length ? [A.length] : []);
  let k = 0;
  let carry = 0;
  let rest = 0;
  let started = false; // divided: a digit other than 0 was written
  let locked = false;
  let p;

  const col = () => cols[k];
  const want = () => {
    const i = col();
    if (t.op === "plus") return (A[i] ?? 0) + (B[i] ?? 0) + carry;
    if (t.op === "mal") return A[i] * t.b + carry;
    if (t.op === "minus") return top[i] - (B[i] ?? 0);
    return Math.floor((rest * 10 + A[i]) / t.b);
  };
  const needTrade = () => t.op === "minus" && top[col()] < (B[col()] ?? 0);

  const trade = button("btn sun trade-btn", S.machen.trade, `🔁 ${S.machen.trade}`);
  trade.hidden = t.op !== "minus";
  trade.addEventListener("click", () => {
    if (locked) return;
    const i = col();
    if (!needTrade()) {
      shake(trade);
      return ctx.miss(S.machen.noTrade);
    }
    // take one from the nearest place on the left that has one; a zero between becomes 9 (10, minus the one passed on)
    let j = i + 1;
    while (top[j] === 0) j++;
    top[j] -= 1;
    s.set("carry", j, ctx.num(top[j]), "traded");
    s.cell("a", j).classList.add("struck");
    for (let m = j - 1; m > i; m--) {
      top[m] = 9;
      s.set("carry", m, ctx.num(9), "traded");
      s.cell("a", m).classList.add("struck");
    }
    top[i] += 10;
    s.set("carry", i, ctx.num(top[i]), "traded");
    s.cell("a", i).classList.add("struck");
    ctx.tap();
    ctx.tell(S.machen.traded(S.placeNames[j], ctx.num(top[i])), undefined, true);
  });

  const next = () => {
    if (k >= cols.length) return finish();
    s.mark(col());
    say.textContent = S.machen.column(S.placeNames[col()]);
    ctx.tell(t.op === "geteilt" ? S.machen.askDiv(S.placeNames[col()], ctx.num(t.b)) : S.machen.ask(S.placeNames[col()]), undefined, k > 0);
    p = pad(padBox, ctx, 2, check);
  };

  const finish = () => {
    if (t.op === "plus" || t.op === "mal") {
      if (carry) digitsOf(carry).forEach((d, m) => s.set("res", A.length + m + (t.op === "plus" && B.length > A.length ? 1 : 0), ctx.num(d), "pop"));
    }
    if (t.op === "minus") {
      // leading zeros are not written
      for (let i = A.length - 1; i > 0 && s.cell("res", i).textContent === ctx.num(0); i--) s.set("res", i, "");
    }
    s.mark(null);
    locked = true;
    p?.lock(true);
    trade.hidden = true;
    say.textContent = "";
    const r = t.op === "geteilt" && t.rest ? S.machen.doneRest(ctx.num(t.a), ctx.num(t.b), ctx.num(t.result), ctx.num(t.rest)) : S.machen.done(ctx.num(t.a), SIGN[t.op], ctx.num(t.b), ctx.num(t.result));
    if (t.op === "geteilt" && t.rest) say.textContent = S.restWord(ctx.num(t.rest));
    ctx.solved(r);
  };

  function check(n) {
    if (locked) return false;
    const i = col();
    if (needTrade()) {
      p.clear();
      ctx.miss(S.machen.mustTrade(ctx.num(top[i]), ctx.num(B[i] ?? 0)));
      return false;
    }
    const v = want();
    if (n !== v) {
      p.clear();
      if (t.op === "plus" && carry && n === v - carry) ctx.miss(S.machen.forgotCarry);
      else if (t.op === "mal" && carry && n === A[i] * t.b) ctx.miss(S.machen.forgotCarry);
      else if (t.op === "mal" && carry && n === (A[i] + carry) * t.b) ctx.miss(S.machen.carryFirst);
      else if (t.op === "geteilt" && rest && n === Math.floor(A[i] / t.b)) ctx.miss(S.machen.forgotRest(ctx.num(rest)));
      else ctx.miss(S.machen.miss);
      return false;
    }
    ctx.tap();
    if (t.op === "plus" || t.op === "mal") {
      s.set("res", i, ctx.num(v % 10), "pop");
      carry = Math.floor(v / 10);
      if (carry && k < cols.length - 1) s.set("carry", i + 1, ctx.num(carry), "carried pop");
      if (carry && k === cols.length - 1) {
        k++;
        return void (p.clear(), finish());
      }
    } else if (t.op === "minus") {
      s.set("res", i, ctx.num(v), "pop");
    } else {
      const cur = rest * 10 + A[i];
      rest = cur - v * t.b;
      if (v || started || i === 0) s.set("res", i, ctx.num(v), "pop");
      if (v) started = true;
      if (rest && i > 0) s.set("carry", i - 1, ctx.num(rest), "carried rest pop");
    }
    k++;
    p.clear();
    next();
    return true;
  }

  host.append(scene, say, tools, padBox);
  tools.append(trade);
  next();
  return {
    hint() {
      const i = col();
      if (i === undefined) return "";
      return columnSum(ctx, t, i, { cin: carry, top: top[i], rest });
    },
  };
}

// ---------- Forschen: one digit is missing

export function forschen(host, t, ctx) {
  const S = ctx.T.schriftlich;
  const s = sheet(ctx, t, { result: t.result });
  s.set(t.hide.row, t.hide.col, "?", "gap");
  const scene = el("div", "scene card sheet-scene");
  scene.append(s.node);
  if (t.op === "geteilt" && t.rest) scene.append(el("p", "sheet-say", S.restWord(ctx.num(t.rest))));
  let locked = false;
  const padBox = el("div");
  const p = pad(padBox, ctx, 1, (n) => {
    if (locked) return false;
    if (n !== t.answer) {
      p.clear();
      ctx.miss(S.forschen.miss);
      return false;
    }
    locked = true;
    p.show(n);
    p.lock(true);
    s.set(t.hide.row, t.hide.col, ctx.num(n), "found");
    ctx.solved(S.forschen.done(ctx.num(t.a), SIGN[t.op], ctx.num(t.b), ctx.num(t.result)));
    return true;
  });
  host.append(scene, padBox);
  ctx.tell(S.forschen.ask);
  return {
    hint() {
      s.mark(t.hide.col);
      return S.forschen.hint[t.op];
    },
  };
}

// ---------- Anwenden: a story, the sum already written down

export function anwenden(host, t, ctx) {
  const S = ctx.T.schriftlich;
  const story = S.stories[t.op][t.story];
  const s = sheet(ctx, t);
  const scene = el("div", "scene card sheet-scene");
  scene.append(s.node);
  let locked = false;
  const padBox = el("div");
  const p = pad(padBox, ctx, len(t.result), (n) => {
    if (locked) return false;
    if (n !== t.result) {
      p.clear();
      ctx.miss(missFor(ctx, t, n));
      return false;
    }
    locked = true;
    p.show(n);
    p.lock(true);
    digitsOf(t.result).forEach((d, i) => s.set("res", i, ctx.num(d), "pop"));
    ctx.solved(story.done(ctx.num(t.result), t.rest ? ctx.num(t.rest) : null));
    return true;
  });
  host.append(scene, padBox);
  ctx.tell(story.ask(ctx.num(t.a), ctx.num(t.b)));
  return {
    hint() {
      fill(ctx, t, s, t.op === "geteilt" ? len(t.a) - 1 : 1);
      return S.anwenden.hint[t.op];
    },
  };
}

// ---------- Prüfen: the owl calculated

export function pruefen(host, t, ctx) {
  const S = ctx.T.schriftlich;
  const s = sheet(ctx, t, { result: t.said });
  const scene = el("div", "scene card owl-scene sheet-scene");
  const talk = el("div", "talk");
  const bubble = el("div", "bubble", S.pruefen.said(ctx.num(t.a), SIGN[t.op], ctx.num(t.b), ctx.num(t.said)));
  talk.append(el("span", "owl", "🦉"), bubble);
  scene.append(talk, s.node);
  let locked = false;
  const padBox = el("div");
  padBox.hidden = true;
  const box = judge(ctx.T, (yes, b) => {
    if (locked) return;
    if (yes !== t.right) {
      shake(b);
      return ctx.miss(t.right ? S.pruefen.isRight : S.pruefen.lookAgain);
    }
    if (yes) {
      locked = true;
      return ctx.solved(S.pruefen.right(ctx.num(t.result)));
    }
    box.hidden = true;
    padBox.hidden = false;
    bubble.classList.add("wrong");
    ctx.tap();
    ctx.tell(S.pruefen.fix(S.mistake[t.kind]), undefined, true);
    const p = pad(padBox, ctx, len(t.result), (n) => {
      if (locked) return false;
      if (n !== t.result) {
        p.clear();
        ctx.miss(missFor(ctx, t, n));
        return false;
      }
      locked = true;
      p.show(n);
      p.lock(true);
      digitsOf(t.result).forEach((d, i) => s.set("res", i, ctx.num(d), "found"));
      for (let i = digitsOf(t.result).length; i < s.width; i++) s.set("res", i, "");
      ctx.solved(S.pruefen.fixed(ctx.num(t.result)));
      return true;
    });
  });
  host.append(scene, box, padBox);
  ctx.tell(S.pruefen.ask(ctx.num(t.a), SIGN[t.op], ctx.num(t.b), ctx.num(t.said)));
  return {
    hint() {
      return S.pruefen.hint[t.op];
    },
  };
}

void resultOf;
export const draw = port({ sehen, machen, forschen, anwenden, pruefen });
