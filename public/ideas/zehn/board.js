// The boards of the idea "zehn" (station teich): one picture for all five ways of playing, frogs on two
// lily pads. The whole is all the frogs, the parts are the two pads. The task is the `vars` of the recipe
// in idea.js; engine/ui/ported.js gives the board the round (ctx.tell, ctx.miss, ctx.solved, …).
//
// Frogs sit in rows of five, as in a ten-frame: 5 is seen at a glance, and 10 is two rows.

import { port, el, button, strip, shake, wait } from "../../engine/ui/ported.js";

const FROG = "🐸";

/** The number buttons: 1 to the rung's most. */
const answers = (ctx, t, onPick) => strip(ctx, 1, t.most, onPick);

/**
 * One lily pad with n frogs in rows of five.
 *   jumper  the place of the frog that will hop off it (-1: none); tap: (i) => … makes every frog a button
 *   ghost   a dashed frog where one will land
 */
function pad(ctx, n, { jumper = -1, ghost = false, tap = null, label = "" } = {}) {
  const leaf = el("div", "hop-leaf");
  const frogs = el("div", "hop-frogs");
  for (let i = 0; i < n; i++) {
    const cls = "hop-frog" + (i === jumper ? " jumper" : "");
    if (tap) {
      const f = button(cls + " tap", label, FROG);
      f.addEventListener("click", () => tap(i));
      frogs.append(f);
    } else frogs.append(el("span", cls, FROG));
  }
  if (ghost) frogs.append(el("span", "hop-frog ghost", FROG));
  leaf.append(frogs);
  return leaf;
}

/** The pond: left pad, something in the middle, right pad. */
function pond(left, middle, right) {
  const box = el("div", "scene card zehn-hop");
  box.append(left, middle ?? el("span", "hop-arrow"), right);
  return box;
}

/** The whole as places in rows of five: `a` red, `b` blue, the rest empty; what is over, as dots beside. */
function places(whole, a, b = 0) {
  const box = el("div", "ten-frames");
  const all = Math.max(whole, a + b);
  for (let f = 0; f < Math.ceil(whole / 5); f++) {
    const row = el("div", "ten-frame five");
    for (let i = f * 5; i < Math.min(whole, f * 5 + 5); i++) row.append(el("span", `tf-spot ${i < a ? "full" : i < a + b ? "full b" : "empty"}`));
    box.append(row);
  }
  if (all > whole) box.append(el("span", "over pop", "●".repeat(all - whole)));
  return box;
}

// ---------- Machen: the child makes the frogs hop. To a given number on one pad, or every way there is.

export function machen(host, t, ctx) {
  const { T } = ctx;
  const M = T.zehn.machen;
  // the frogs start on one pad: for a given number, on the other pad than the one asked for
  let left = t.all || !t.left ? t.whole : 0;
  let locked = false;
  const found = []; // the ways found (left counts), for the kind "all"

  const box = el("div", "zehn-make");
  const shelf = el("div", "hop-ways");
  // the ways still to find are empty frames: the picture says how many, not the sentence
  if (t.all) for (let i = 0; i < t.ways; i++) shelf.append(el("div", "hop-way empty"));
  const hop = (fromLeft) => {
    if (locked) return;
    left += fromLeft ? -1 : 1;
    ctx.tap();
    draw();
  };
  const draw = () => {
    box.innerHTML = "";
    box.append(
      pond(
        pad(ctx, left, { tap: () => hop(true), label: M.hop }),
        el("span", "hop-arrow", "⇄"),
        pad(ctx, t.whole - left, { tap: () => hop(false), label: M.hop }),
      ),
    );
  };
  draw();

  const check = button("btn ok check-btn", T.labels?.check ?? "✓", "✓");
  check.addEventListener("click", () => {
    if (locked) return;
    const right = t.whole - left;
    if (!t.all) {
      const has = t.left ? left : right;
      if (has === t.target) {
        locked = true;
        return void ctx.solved(T.zehn.friends(ctx.word(left), ctx.word(right), ctx.word(t.whole)));
      }
      shake(box);
      return void ctx.miss(M.miss(ctx.word(has), ctx.word(t.target), has, t.target));
    }
    // every way: both pads keep a frog, and a way counts once
    if (left === 0 || right === 0) return void (shake(box), ctx.tell(M.both, undefined, true));
    const seen = shelf.querySelector(`[data-left="${left}"]`);
    if (seen) return void (shake(seen), ctx.tell(M.again, undefined, true));
    found.push(left);
    const way = shelf.querySelector(".hop-way.empty");
    way.className = "hop-way pop";
    way.dataset.left = left;
    way.append(places(t.whole, left, right));
    ctx.tap();
    if (found.length >= t.ways) {
      locked = true;
      ctx.solved(M.allDone(ctx.word(t.whole)));
    } else ctx.tell(M.more, undefined, true);
  });
  const tools = el("div", "zehn-tools");
  tools.append(check);

  host.append(box, shelf, tools);
  (async () => {
    await ctx.tell(t.all ? M.allQuestion(ctx.word(t.whole)) : M.question(t.left ? "left" : "right", ctx.word(t.target), t.target));
    if (host.isConnected) ctx.tell(t.all ? M.allHow : M.how);
  })();

  return {
    hint() {
      if (t.all) return M.hintAll;
      box.querySelector(".zehn-hop").children[t.left ? 0 : 2].classList.add("asked");
      return M.hint(t.left ? "left" : "right");
    },
  };
}

// ---------- Sehen: all frogs are seen, then a leaf covers the right pad. How many hide under it?

export function sehen(host, t, ctx) {
  const { T } = ctx;
  const S = T.zehn.sehen;
  const right = pad(ctx, t.answer);
  const lid = el("div", "hop-lid", "?");
  right.append(lid);
  const scene = pond(pad(ctx, t.n), null, right);
  const hintBox = el("div", "hint-box");
  let locked = true;

  const pick = answers(ctx, t, (n, b) => {
    if (locked) return;
    if (n !== t.answer) {
      shake(b);
      b.disabled = true;
      ctx.miss(S.miss(ctx.word(t.n), ctx.word(n), ctx.word(t.n + n), ctx.word(t.whole)));
      return;
    }
    locked = true;
    b.classList.add("right");
    right.classList.remove("covered");
    ctx.solved(T.zehn.friends(ctx.word(t.n), ctx.word(t.answer), ctx.word(t.whole)));
  });
  pick.classList.add("waiting");
  host.append(scene, hintBox, pick);

  (async () => {
    await ctx.tell(S.story(ctx.word(t.whole)));
    if (!host.isConnected) return;
    await wait(ctx.fresh() ? 1200 : 600);
    if (!host.isConnected) return;
    right.classList.add("covered"); // the leaf comes down over the right pad
    await ctx.tell(S.dive);
    if (!host.isConnected) return;
    locked = false;
    pick.classList.remove("waiting");
    ctx.ready();
    ctx.tell(S.ask(ctx.word(t.n), t.n));
  })();

  return {
    hint() {
      // all places of the whole, the frogs that are seen in them: the empty ones are the hidden frogs
      if (!hintBox.firstChild) hintBox.append(places(t.whole, t.n));
      return S.hint(ctx.word(t.whole));
    },
  };
}

// ---------- Forschen: a frog hops across. How many sit on one pad then? One more where it lands, one fewer
// where it left: together it stays the same.

export function forschen(host, t, ctx) {
  const { T } = ctx;
  const H = T.zehn.forschen;
  const side = t.left ? "left" : "right"; // where the frog lands
  const box = el("div", "zehn-make");
  const hintBox = el("div", "hint-box");
  let locked = true;

  const draw = (after = false, ghost = false) => {
    box.innerHTML = "";
    const a = after ? t.a + (t.left ? 1 : -1) : t.a;
    const b = t.whole - a;
    // the frog that hops sits nearest to the other pad
    const L = pad(ctx, a, { jumper: !after && !t.left ? Math.min(a, 5) - 1 : -1, ghost: ghost && t.left });
    const R = pad(ctx, b, { jumper: !after && t.left ? 0 : -1, ghost: ghost && !t.left });
    ((t.more ? t.left : !t.left) ? L : R).classList.add("asked");
    if (after) {
      L.append(el("b", "hop-count pop", ctx.num(a)));
      R.append(el("b", "hop-count pop", ctx.num(b)));
    }
    box.append(pond(L, el("span", "hop-arrow" + (after ? " done" : ""), t.left ? "←" : "→"), R));
  };
  draw();

  const pick = answers(ctx, t, (n, b) => {
    if (locked) return;
    if (n !== t.answer) {
      shake(b);
      b.disabled = true;
      const now = t.more ? (t.left ? t.a : t.b) : t.left ? t.b : t.a; // on the asked pad before the hop
      if (t.more) ctx.miss(n <= now ? H.more : H.onlyOneIn);
      else ctx.miss(n >= now ? H.fewer : H.onlyOneOut);
      return;
    }
    locked = true;
    b.classList.add("right");
    draw(true);
    ctx.solved(H.done(ctx.word(t.whole)));
  });
  pick.classList.add("waiting");
  host.append(box, hintBox, pick);

  (async () => {
    await ctx.tell(H.story(ctx.word(t.whole)));
    if (!host.isConnected) return;
    await ctx.tell(H.jump[side]);
    if (!host.isConnected) return;
    locked = false;
    pick.classList.remove("waiting");
    ctx.ready();
    ctx.tell(H.ask[t.more ? side : side === "left" ? "right" : "left"]);
  })();

  return {
    hint() {
      // the frog is seen on both pads at once: where it sits now, and dashed where it lands
      draw(false, true);
      if (!hintBox.firstChild) hintBox.append(el("p", "hint-text pop", H.hintShown));
      return H.hint;
    },
  };
}

// ---------- Anwenden: no frogs any more. "3 and ? are 5": dots, then dots with the digit, then the digit.

/** A number in a box, as the rung shows it. */
function mark(ctx, n, how) {
  const box = el("div", "part-box");
  if (how !== "digits") {
    const dots = el("div", "part-dots");
    dots.style.gridTemplateColumns = `repeat(${Math.min(n, 5)}, 10px)`;
    for (let i = 0; i < n; i++) dots.append(el("i"));
    box.append(dots);
  }
  if (how !== "dots") box.append(el("b", "part-digit", ctx.num(n)));
  return box;
}

export function anwenden(host, t, ctx) {
  const { T } = ctx;
  const A = T.zehn.anwenden;
  const line = el("div", "scene card part-line");
  const gap = el("div", "part-box gap", "?");
  line.append(mark(ctx, t.n, t.marks), el("span", "part-word", A.and), gap, el("span", "part-word", A.are), mark(ctx, t.whole, t.marks));
  const hintBox = el("div", "hint-box");
  let locked = false;

  const pick = answers(ctx, t, (n, b) => {
    if (locked) return;
    if (n !== t.answer) {
      shake(b);
      b.disabled = true;
      ctx.miss(A.miss(ctx.word(t.n), ctx.word(n), ctx.word(t.n + n), ctx.word(t.whole)));
      return;
    }
    locked = true;
    b.classList.add("right");
    gap.replaceWith(mark(ctx, n, t.marks));
    line.children[2].classList.add("found");
    ctx.solved(T.zehn.friends(ctx.word(t.n), ctx.word(t.answer), ctx.word(t.whole)));
  });

  host.append(line, hintBox, pick);
  ctx.tell(A.question(ctx.word(t.n), ctx.word(t.whole)));

  return {
    hint() {
      if (!hintBox.firstChild) hintBox.append(places(t.whole, t.n));
      hintBox.firstChild.classList.add("show-empty");
      return A.hint;
    },
  };
}

// ---------- Prüfen: the owl has put frogs on the pads and says they are all. Right? If not: how many on the right?

export function pruefen(host, t, ctx) {
  const { T } = ctx;
  const P = T.zehn.pruefen;
  let locked = false;
  let b = t.b;

  const box = el("div", "zehn-make");
  const talk = el("div", "talk");
  talk.append(el("span", "owl", "🦉"), el("div", "bubble", P.says(ctx.word(t.whole))));
  const draw = () => {
    box.innerHTML = "";
    box.append(pond(pad(ctx, t.a), null, pad(ctx, b)));
  };
  draw();
  const hintBox = el("div", "hint-box");

  const judge = el("div", "judge");
  const yes = button("btn ok judge-btn", T.pruefen.yes, "✓");
  const no = button("btn go judge-btn", T.pruefen.no, "✗");
  judge.append(yes, no);

  const fixer = answers(ctx, t, (n, btn) => {
    if (locked) return;
    b = n;
    draw();
    if (n !== t.answer) {
      shake(btn);
      btn.disabled = true;
      ctx.miss(P.fixMiss(ctx.word(t.a), ctx.word(n), ctx.word(t.a + n), ctx.word(t.whole)));
      return;
    }
    locked = true;
    btn.classList.add("right");
    ctx.solved(T.zehn.friends(ctx.word(t.a), ctx.word(n), ctx.word(t.whole)));
  });
  fixer.hidden = true;

  yes.addEventListener("click", () => {
    if (locked) return;
    if (!t.right) return void (shake(yes), ctx.miss(P.look(t.b > t.answer)));
    locked = true;
    ctx.solved(T.zehn.friends(ctx.word(t.a), ctx.word(t.b), ctx.word(t.whole)));
  });
  no.addEventListener("click", () => {
    if (locked) return;
    if (t.right) return void (shake(no), ctx.miss(P.isRight(ctx.word(t.whole))));
    judge.hidden = true;
    fixer.hidden = false;
    ctx.tap();
    ctx.tell(P.fix(ctx.word(t.whole)), undefined, true);
  });

  host.append(talk, box, hintBox, judge, fixer);
  ctx.tell(P.question(ctx.word(t.a), ctx.word(t.b), ctx.word(t.whole)));

  return {
    hint() {
      // the whole as places: the owl's frogs in them, what is over beside
      if (!hintBox.firstChild) hintBox.append(places(t.whole, t.a, b));
      return P.hint(ctx.word(t.whole));
    },
  };
}

export const draw = port({ machen, sehen, forschen, anwenden, pruefen });
