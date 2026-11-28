// Ported from think-lab (welt/ideas/zehn/boards.js) with only its imports changed: engine/ui/ported.js gives it
// the round it knew there. The task is the `vars` of the recipe in idea.js.
// The five boards of the idea "Zehn" (friends of ten): one per perspective.
// A board draws one task (plain data from tasks.js) into `host` and takes the child's answer.
// It never counts or saves anything: it tells the round (welt/spiel/spiel.js) through ctx (see
// ideas/teile/boards.js for what ctx holds).
//
// Everything is laid out in rows of five, as in a ten-frame: 5 and 10 are seen at a glance, and
// the empty places are seen as well as the full ones. Up to twenty there are two frames of ten.

import { port, el, button, strip, shake, wait } from "../../engine/ui/ported.js";
import { MOST } from "./data.js";

/**
 * A frame of places in rows of five. parts: [{ n, cls, icon }] fill the places in order; the rest
 * stay empty. Up to 20 places: one ten-frame per ten, with a little gap between them.
 */
function frame(whole, parts, className = "") {
  const box = el("div", `ten-frames ${className}`);
  const fill = parts.flatMap((p) => Array.from({ length: p.n }, () => p));
  for (let f = 0; f < Math.ceil(whole / 10); f++) {
    const one = el("div", "ten-frame" + (whole === 5 ? " five" : ""));
    for (let i = f * 10; i < Math.min(whole, f * 10 + 10); i++) {
      const p = fill[i];
      one.append(el("span", `tf-spot ${p ? `full ${p.cls || ""}` : "empty"}`, p?.icon ?? ""));
    }
    box.append(one);
  }
  return box;
}

/** "7 + ? = 10" as big text: the numbers in the digits of the language, the gap as a box. */
function sum(ctx, parts) {
  const line = el("div", "sum-line");
  for (const part of parts) {
    if (part === "?") line.append(el("b", "gap", "?"));
    else if (typeof part === "number") line.append(el("b", "", ctx.num(part)));
    else line.append(el("span", "op", part));
  }
  return line;
}

const answers = (ctx, t, onPick) => strip(ctx, 1, MOST[t.whole], onPick);

// ---------- Sehen: the pond. Frogs sit on lily pads: how many pads are free?

export function sehen(host, t, ctx) {
  const { T } = ctx;
  const Z = T.zehn;
  const pond = el("div", "scene card zehn-pond");
  const pads = frame(t.whole, [{ n: t.n, icon: "🐸" }], "pads");
  const fog = button("fog-cover", Z.sehen.look, "🌿");
  fog.hidden = true;
  pond.append(pads, fog);
  const hintBox = el("div", "hint-box");
  let locked = true;

  // From the second round on the pond is seen only for a moment: the child sees "a full row and two
  // more" instead of counting one by one. A tap on the leaves shows it again for a moment.
  const peek = async () => {
    fog.hidden = true;
    await wait(1500);
    if (host.isConnected && !locked) fog.hidden = false;
  };
  fog.addEventListener("click", () => {
    ctx.tap();
    peek();
  });

  const pick = answers(ctx, t, (n, b) => {
    if (locked) return;
    if (n !== t.answer) {
      shake(b);
      b.disabled = true;
      ctx.miss(Z.sehen.miss(ctx.word(n), ctx.word(t.n), ctx.word(t.n + n), ctx.word(t.whole)));
      return;
    }
    locked = true;
    fog.hidden = true;
    b.classList.add("right");
    for (const spot of pads.querySelectorAll(".tf-spot.empty")) spot.classList.add("free");
    ctx.solved(Z.friends(ctx.word(t.n), ctx.word(t.answer), ctx.word(t.whole)));
  });
  pick.classList.add("waiting");
  host.append(pond, hintBox, pick);

  (async () => {
    await ctx.tell(Z.sehen.story(ctx.word(t.whole), t.n, ctx.word(t.n)));
    if (!host.isConnected) return;
    locked = false;
    pick.classList.remove("waiting");
    ctx.ready();
    ctx.tell(Z.sehen.ask);
    if (!ctx.fresh()) {
      await wait(2500);
      if (host.isConnected && !locked) fog.hidden = false;
    }
  })();

  return {
    hint() {
      fog.hidden = true;
      pads.classList.add("show-empty");
      if (!hintBox.firstChild) hintBox.append(el("p", "hint-text pop", Z.sehen.rows(ctx.word(t.whole > 5 ? 5 : t.whole))));
      return Z.sehen.hint;
    },
  };
}

// ---------- Machen: the nut box. Take as many nuts as still fit, then pour them in.

export function machen(host, t, ctx) {
  const { T } = ctx;
  const Z = T.zehn;
  const NUT = "🌰";
  let taken = 0;
  let locked = false;

  const scene = el("div", "scene card zehn-box-scene");
  const boxArt = el("div", "nut-box");
  const drawBox = (extra = 0) => {
    boxArt.innerHTML = "";
    boxArt.append(frame(t.whole, [{ n: t.n, icon: NUT }, { n: Math.min(extra, t.answer), icon: NUT, cls: "b" }], "holes"));
  };
  drawBox();
  scene.append(boxArt);

  const hand = el("div", "paw");
  hand.setAttribute("aria-label", Z.machen.paw);
  const basket = button("btn take-btn", Z.machen.take, "🧺 ➜ " + NUT);
  const pour = button("btn ok check-btn", Z.machen.pour, "✓");
  const tools = el("div", "zehn-tools");
  tools.append(basket, pour);

  function drawHand() {
    hand.innerHTML = "";
    const pics = el("span", "pics");
    for (let i = 0; i < taken; i++) {
      const nut = button("pic thing", Z.machen.back, NUT);
      nut.addEventListener("click", () => {
        if (locked) return;
        taken--;
        ctx.tap();
        drawHand();
      });
      pics.append(nut);
    }
    hand.append(el("span", "paw-icon", "🐿️"), pics);
    pour.disabled = taken === 0;
  }

  basket.addEventListener("click", () => {
    if (locked || taken >= 10) return;
    taken++;
    ctx.tap();
    drawHand();
  });

  pour.addEventListener("click", async () => {
    if (locked || !taken) return;
    locked = true;
    drawBox(taken);
    if (taken === t.answer) {
      hand.innerHTML = "";
      ctx.solved(Z.friends(ctx.word(t.n), ctx.word(t.answer), ctx.word(t.whole)));
      return;
    }
    const off = Math.abs(taken - t.answer);
    if (taken > t.answer) boxArt.append(el("span", "rolled pop", NUT.repeat(off)));
    await ctx.miss(taken < t.answer ? Z.machen.tooFew(off, ctx.word(off)) : Z.machen.tooMany(off, ctx.word(off)));
    // The nuts come back to the paw: the child changes how many and pours again.
    drawBox();
    locked = false;
  });

  host.append(scene, hand, tools);
  drawHand();
  ctx.tell(Z.machen.question(ctx.word(t.whole), ctx.word(t.n)));

  return {
    hint() {
      boxArt.querySelector(".holes")?.classList.add("show-empty");
      return Z.machen.hint;
    },
  };
}

// ---------- Forschen: the staircase of friends. One goes up, the other goes down.

export function forschen(host, t, ctx) {
  const { T } = ctx;
  const Z = T.zehn;
  const table = el("div", "scene card zehn-stairs");
  const hintBox = el("div", "hint-box");
  let locked = false;

  if (t.whole === 20) {
    // The friend of ten, then the same friend one ten higher.
    const small = el("div", "stair-row");
    small.append(frame(10, [{ n: t.a, icon: "" }, { n: t.b, icon: "", cls: "b" }], "mini"), sum(ctx, [t.a, "+", t.b, "=", 10]));
    const big = el("div", "stair-row ask");
    big.append(frame(20, [{ n: t.n, icon: "" }], "mini"), sum(ctx, [t.n, "+", "?", "=", 20]));
    table.append(small, big);
  } else {
    t.rows.forEach(([a, b], i) => {
      const row = el("div", "stair-row" + (i === t.gap ? " ask" : ""));
      const shown = i === t.gap ? [{ n: a, icon: "" }] : [{ n: a, icon: "" }, { n: b, icon: "", cls: "b" }];
      row.append(frame(t.whole, shown, "mini"), sum(ctx, [a, "+", i === t.gap ? "?" : b, "=", t.whole]));
      table.append(row);
    });
  }

  const pick = answers(ctx, t, (n, b) => {
    if (locked) return;
    if (n !== t.answer) {
      shake(b);
      b.disabled = true;
      ctx.miss(t.whole === 20 ? Z.forschen.missTwenty(ctx.word(t.n), ctx.word(n), ctx.word(t.n + n)) : Z.forschen.miss(ctx.word(n)));
      return;
    }
    locked = true;
    b.classList.add("right");
    const ask = table.querySelector(".ask");
    ask.querySelector(".gap").textContent = ctx.num(t.answer);
    ask.querySelector(".gap").classList.add("found");
    if (t.whole === 20) ctx.solved(Z.forschen.doneTwenty(ctx.word(t.a), ctx.word(t.b), ctx.word(t.n)));
    else ctx.solved(Z.forschen.done(ctx.word(t.whole)));
  });

  host.append(table, hintBox, pick);
  ctx.tell(t.whole === 20 ? Z.forschen.questionTwenty : Z.forschen.question);

  return {
    hint() {
      if (t.whole === 20) table.firstChild.classList.add("glow");
      else table.classList.add("show-stairs");
      if (!hintBox.firstChild) hintBox.append(el("p", "hint-text pop", t.whole === 20 ? Z.forschen.hintTwenty(ctx.num(t.a), ctx.num(t.n)) : Z.forschen.hintRows));
      return t.whole === 20 ? Z.forschen.hintTwenty(ctx.word(t.a), ctx.word(t.n)) : Z.forschen.hint;
    },
  };
}

// ---------- Forschen, first kind: the frog hops. Frogs sit on two lily pads; one hops across.
// How many sit on one pad then? One more where it lands, one fewer where it left: together it stays the same.

/** One lily pad with n frogs in rows of five; `jumper` is the place of the frog that will hop off it (-1: none). */
function leaf(ctx, n, { jumper = -1, ghost = false } = {}) {
  const pad = el("div", "hop-leaf");
  const frogs = el("div", "hop-frogs");
  for (let i = 0; i < n; i++) frogs.append(el("span", "hop-frog" + (i === jumper ? " jumper" : ""), "🐸"));
  if (ghost) frogs.append(el("span", "hop-frog ghost", "🐸"));
  pad.append(frogs);
  return pad;
}

export function huepfen(host, t, ctx) {
  const { T } = ctx;
  const H = T.zehn.huepfen;
  const side = t.left ? "left" : "right"; // where the frog lands
  const pond = el("div", "scene card zehn-hop");
  const hintBox = el("div", "hint-box");
  let locked = true;

  // left pad, arrow, right pad: the frog that hops sits on the other pad and bobs
  const draw = (after = false, ghost = false) => {
    pond.innerHTML = "";
    const a = after ? t.a + (t.left ? 1 : -1) : t.a;
    const b = after ? t.whole - a : t.b;
    // the frog that hops sits nearest to the other pad
    const L = leaf(ctx, a, { jumper: !after && !t.left ? Math.min(a, 5) - 1 : -1, ghost: ghost && t.left });
    const R = leaf(ctx, b, { jumper: !after && t.left ? 0 : -1, ghost: ghost && !t.left });
    const asked = t.left ? L : R;
    if (t.more) asked.classList.add("asked");
    else (t.left ? R : L).classList.add("asked");
    if (after) {
      L.append(el("b", "hop-count pop", ctx.num(a)));
      R.append(el("b", "hop-count pop", ctx.num(b)));
    }
    pond.append(L, el("span", "hop-arrow" + (after ? " done" : ""), t.left ? "←" : "→"), R);
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
  host.append(pond, hintBox, pick);

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

// ---------- Forschen, second kind: the stone stairs. Every tower has the whole number of stones, red below,
// blue above; from tower to tower one more is red and one fewer blue. One tower is missing: build it.

/** A tower of `whole` stones, `red` of them red from below; red === null: still grey. */
function tower(whole, red, className = "") {
  const box = el("div", `stone-tower ${className}`);
  for (let i = 0; i < whole; i++) box.append(el("span", "zstone" + (red === null ? "" : i < red ? " red" : " blue")));
  return box;
}

export function treppe(host, t, ctx) {
  const { T } = ctx;
  const S = T.zehn.treppe;
  const stairs = el("div", "scene card zehn-towers" + (t.whole > 5 ? " ten" : ""));
  let red = null;
  let locked = false;

  const gapTower = el("div", "stone-tower build");
  const drawGap = () => {
    gapTower.innerHTML = "";
    for (let i = 0; i < t.whole; i++) {
      const stone = button("zstone" + (red === null ? " open" : i < red ? " red" : " blue"), S.stone(ctx.num(i + 1)));
      stone.addEventListener("click", () => {
        if (locked) return;
        ctx.tap();
        red = red === i + 1 ? i : i + 1; // tap the top red stone again: it turns blue
        drawGap();
        check.disabled = false;
      });
      gapTower.append(stone);
    }
  };
  t.rows.forEach(([a], i) => stairs.append(i === t.gap ? gapTower : tower(t.whole, a)));
  drawGap();

  const check = button("btn ok check-btn", T.labels?.check ?? "✓", "✓");
  check.disabled = true;
  check.addEventListener("click", () => {
    if (locked || red === null) return;
    if (red === t.answer) {
      locked = true;
      gapTower.classList.add("found");
      ctx.solved(S.done(ctx.word(t.whole), t.step > 0));
      return;
    }
    // the tower stays as it is built: the child changes it and checks again
    shake(gapTower);
    ctx.miss(S.miss(ctx.word(red), ctx.word(t.whole - red), red, t.whole - red));
  });
  const tools = el("div", "zehn-tools");
  tools.append(check);

  host.append(stairs, tools);
  ctx.tell(S.question(ctx.word(t.whole)));

  return {
    hint() {
      // the tower before the gap glows (after it, when the gap is the first)
      const near = stairs.children[t.gap > 0 ? t.gap - 1 : t.gap + 1];
      near.classList.add("glow");
      return t.step > 0 ? S.hintUp : S.hintDown;
    },
  };
}

// ---------- Anwenden: just the numbers. 7 + ? = 10, ? + 4 = 10, 13 + ? = 20.

export function anwenden(host, t, ctx) {
  const { T } = ctx;
  const Z = T.zehn;
  const box = el("div", "scene card zehn-sum");
  const line = sum(ctx, t.gap === "b" ? [t.n, "+", "?", "=", t.whole] : ["?", "+", t.n, "=", t.whole]);
  box.append(line);
  const hintBox = el("div", "hint-box");
  let locked = false;

  const pick = answers(ctx, t, (n, b) => {
    if (locked) return;
    if (n !== t.answer) {
      shake(b);
      b.disabled = true;
      ctx.miss(Z.anwenden.miss(ctx.word(t.n), ctx.word(n), ctx.word(t.n + n), ctx.word(t.whole)));
      return;
    }
    locked = true;
    b.classList.add("right");
    line.querySelector(".gap").textContent = ctx.num(n);
    line.querySelector(".gap").classList.add("found");
    ctx.solved(Z.friends(ctx.word(t.n), ctx.word(t.answer), ctx.word(t.whole)));
  });

  host.append(box, hintBox, pick);
  ctx.tell(Z.anwenden.question(ctx.word(t.n), ctx.word(t.whole)));

  return {
    hint() {
      if (!hintBox.firstChild) hintBox.append(frame(t.whole, [{ n: t.n, icon: "" }], "mini show-empty pop"));
      return Z.anwenden.hint;
    },
  };
}

// ---------- Prüfen: the owl says "a and b are friends". Is that right? If not: find the friend.

export function pruefen(host, t, ctx) {
  const { T } = ctx;
  const Z = T.zehn;
  let locked = false;

  const scene = el("div", "scene card owl-scene");
  const talk = el("div", "talk");
  const bubble = el("div", "bubble");
  const said = el("b", "said", ctx.num(t.b));
  bubble.append(el("span", "", `${ctx.num(t.a)}\u00a0+\u00a0`), said);
  talk.append(el("span", "owl", "🦉"), bubble);
  const art = el("div", "owl-frame");
  const draw = (b) => {
    art.innerHTML = "";
    art.append(frame(t.whole, [{ n: t.a, icon: "" }, { n: Math.min(b, t.whole - t.a), icon: "", cls: "b" }], "mini"));
    const over = t.a + b - t.whole;
    if (over > 0) art.append(el("span", "over pop", "●".repeat(over)));
  };
  draw(t.b);
  scene.append(talk, art);

  const judge = el("div", "judge");
  const yes = button("btn ok judge-btn", T.pruefen.yes, "✓");
  const no = button("btn go judge-btn", T.pruefen.no, "✗");
  judge.append(yes, no);

  const fixer = answers(ctx, t, (n, b) => {
    if (locked) return;
    said.textContent = ctx.num(n);
    draw(n);
    if (n !== t.whole - t.a) {
      shake(b);
      b.disabled = true;
      ctx.miss(Z.pruefen.fixMiss(ctx.word(t.whole)));
      return;
    }
    locked = true;
    b.classList.add("right");
    said.classList.remove("wrong");
    said.classList.add("right");
    ctx.solved(Z.friends(ctx.word(t.a), ctx.word(n), ctx.word(t.whole)));
  });
  fixer.hidden = true;

  yes.addEventListener("click", () => {
    if (locked) return;
    if (!t.right) return void (shake(yes), ctx.miss(Z.pruefen.look));
    locked = true;
    said.classList.add("right");
    ctx.solved(Z.friends(ctx.word(t.a), ctx.word(t.b), ctx.word(t.whole)));
  });

  no.addEventListener("click", () => {
    if (locked) return;
    if (t.right) return void (shake(no), ctx.miss(Z.pruefen.look));
    judge.hidden = true;
    fixer.hidden = false;
    said.classList.add("wrong");
    ctx.tap();
    ctx.tell(Z.pruefen.fix(ctx.word(t.a), ctx.word(t.whole)));
  });

  host.append(scene, judge, fixer);
  ctx.tell(Z.pruefen.question(ctx.word(t.a), ctx.word(t.b), ctx.word(t.whole)));

  return {
    hint() {
      art.querySelector(".ten-frames")?.classList.add("show-empty");
      return Z.pruefen.hint(ctx.word(t.whole));
    },
  };
}

export const draw = port({ sehen, machen, forschen, huepfen, treppe, anwenden, pruefen });
