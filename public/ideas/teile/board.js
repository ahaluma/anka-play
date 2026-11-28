// Ported from think-lab (welt/ideas/teile/boards.js) with only its imports changed: engine/ui/ported.js gives it
// the round it knew there. The task is the `vars` of the recipe in idea.js.
// The five boards of the idea "Teile" (numbers are made of numbers): one per perspective.
// A board draws one task (plain data from tasks.js) into `host` and takes the child's answer.
// It never counts or saves anything: it tells the round (welt/spiel/spiel.js) through ctx.
//
//   board(host, task, ctx) → { hint() }
//
//   ctx.T              texts of the world (welt/lang) plus the shared words
//   ctx.num(n)         a number in the digits of the language
//   ctx.word(n)        a number word ("drei")
//   ctx.thing(id)      { icon, one, many } of a shared thing (shared/things.js)
//   ctx.tell(text)     show and read a sentence
//   ctx.miss(text)     a wrong answer: soft sound, the sentence; after the second one the hint shows
//   ctx.solved(text)   the task is done: praise, the sentence, then the next task
//   ctx.tap()          the small tap sound
//   ctx.ready()        the story of the task was shown, the child can answer now (optional)
//   ctx.fresh()        true in the child's very first round of this perspective: show more, hide less
//
// A wrong answer first says what the child did ("Fünf und vier sind neun. Es sind aber sieben."),
// the hint shows the structure, never just the answer.

import { port, el, button, group, sign, strip, shake, wait } from "../../engine/ui/ported.js";
import { myOwl } from "../../engine/ui/owl.js";

/** The hint of the "missing part" boards: the whole as a row of places, the known part filled in. */
function partsHint(total, known, icon) {
  const row = el("div", "parts-hint pop");
  for (let i = 0; i < total; i++) row.append(el("span", i < known ? "place full" : "place", i < known ? icon : ""));
  return row;
}

// ---------- Sehen: the burrow. Some animals are outside, the others hide: how many?

export function sehen(host, t, ctx) {
  const { T } = ctx;
  const animal = ctx.thing(t.animal);
  const scene = el("div", "scene card burrow-scene");
  const meadow = el("div", "meadow");
  const all = group(t.total, animal.icon);
  meadow.append(all);
  const burrow = el("div", "burrow");
  const den = el("div", "den");
  den.setAttribute("aria-label", T.sehen.denLabel);
  burrow.append(den);
  scene.append(sign(ctx, t.total), meadow, burrow);
  const hintBox = el("div", "hint-box");
  let locked = true; // until the story was shown
  let shown = false; // the animals in the burrow are visible (first round)

  const answers = strip(ctx, 1, Math.max(5, t.range), (n, b) => {
    if (locked) return;
    if (n !== t.inside) {
      shake(b);
      b.disabled = true;
      ctx.miss(T.sehen.miss(ctx.word(n), ctx.word(t.outside), ctx.word(n + t.outside), ctx.word(t.total)));
      return;
    }
    locked = true;
    b.classList.add("right");
    if (!shown) {
      den.textContent = "";
      den.classList.add("open");
      den.append(group(t.inside, animal.icon));
    }
    ctx.solved(T.together(ctx.word(t.outside), ctx.word(t.inside), ctx.word(t.total)));
  });

  host.append(scene, hintBox, answers);
  answers.classList.add("waiting");

  // Show the story instead of telling it: all animals are outside, then some walk into the burrow.
  (async () => {
    await ctx.tell(T.sehen.all(ctx.word(t.total), animal));
    if (!host.isConnected) return;
    const goers = [...all.children].slice(t.outside);
    for (const pic of goers) pic.classList.add("go-in");
    den.classList.add("open");
    await Promise.all([ctx.tell(T.sehen.hide), wait(1100)]);
    if (!host.isConnected) return;
    for (const pic of goers) pic.remove();
    if (ctx.fresh()) {
      // The very first round: the burrow stays open and the animals inside can be counted.
      // From the second round on they hide, and the child works it out from the whole.
      den.append(group(t.inside, animal.icon));
      shown = true;
    } else {
      den.classList.remove("open");
      den.textContent = "?";
    }
    answers.classList.remove("waiting");
    locked = false;
    ctx.ready();
    ctx.tell(T.sehen.ask);
  })();

  return {
    hint() {
      if (!hintBox.firstChild) hintBox.append(partsHint(t.total, t.outside, animal.icon));
      return T.sehen.hint;
    },
  };
}

// ---------- Machen: put the things on two leaves, in two different ways.

export function machen(host, t, ctx) {
  const { T } = ctx;
  const thing = ctx.thing(t.thing);
  const sides = [0, 0];
  let basket = t.total;
  const found = []; // "3+4"
  let locked = false;

  let held = false; // a thing from the basket was tapped and waits for a leaf

  const scene = el("div", "scene card pond-scene");
  const leaves = [0, 1].map((side) => {
    const leaf = button("leaf", `${T.machen.leaf} ${ctx.num(side + 1)}`);
    leaf.addEventListener("click", () => move("basket", side));
    return leaf;
  });
  scene.append(...leaves);
  const basketBox = el("div", "basket");
  basketBox.setAttribute("aria-label", T.machen.basket);
  const ways = el("div", "ways");
  const check = button("btn ok check-btn", T.machen.check, "✓");

  const count = (where) => (where === "basket" ? basket : sides[where]);
  const add = (where, d) => (where === "basket" ? (basket += d) : (sides[where] += d));

  /** One thing goes from the basket or a leaf ("basket", 0, 1) to another of them. */
  function move(from, to) {
    if (locked || from === to || count(from) === 0) return;
    add(from, -1);
    add(to, 1);
    held = false;
    ctx.tap();
    draw();
  }

  // Children move the things themselves, the way they would with real carrots:
  //   drag a thing with the finger onto a leaf (or back into the basket), or
  //   tap a thing in the basket (it lifts), then tap a leaf. A tap on a thing on a leaf takes it back.
  // A tap on a leaf alone still works: one thing hops over from the basket.
  function thingPic(where, lifted) {
    const pic = el("span", "pic thing" + (lifted ? " held" : ""), thing.icon);
    let start = null;
    let dragging = false;
    pic.addEventListener("pointerdown", (e) => {
      if (locked) return;
      start = { x: e.clientX, y: e.clientY };
      dragging = false;
      pic.setPointerCapture?.(e.pointerId);
    });
    pic.addEventListener("pointermove", (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!dragging && Math.hypot(dx, dy) > 8) {
        dragging = true;
        pic.classList.add("dragging");
      }
      if (dragging) pic.style.transform = `translate(${dx}px, ${dy}px) scale(1.25)`;
    });
    const end = (e) => {
      if (!start) return;
      const dragged = dragging;
      start = null;
      dragging = false;
      pic.style.transform = "";
      pic.classList.remove("dragging");
      if (e.type === "pointercancel") return;
      if (!dragged) {
        if (where === "basket") {
          held = !held;
          ctx.tap();
          draw();
        } else move(where, "basket");
        return;
      }
      const under = document.elementsFromPoint(e.clientX, e.clientY);
      const side = leaves.findIndex((leaf) => under.includes(leaf));
      if (side >= 0) move(where, side);
      else if (under.includes(basketBox)) move(where, "basket");
    };
    pic.addEventListener("pointerup", end);
    pic.addEventListener("pointercancel", end);
    pic.addEventListener("click", (e) => e.stopPropagation()); // the leaf below must not take it as its own tap
    return pic;
  }

  function draw() {
    leaves.forEach((leaf, side) => {
      leaf.innerHTML = "";
      for (let i = 0; i < sides[side]; i++) leaf.append(thingPic(side, false));
    });
    basketBox.innerHTML = "";
    const pics = el("span", "pics");
    for (let i = 0; i < basket; i++) pics.append(thingPic("basket", held && i === basket - 1));
    basketBox.append(el("span", "basket-icon", "🧺"), pics);
    scene.classList.toggle("picking", held && basket > 0);
    check.disabled = basket > 0;
  }

  check.addEventListener("click", () => {
    if (locked) return;
    const way = `${sides[0]}+${sides[1]}`;
    if (sides[0] === 0 || sides[1] === 0) return void ctx.miss(T.machen.both);
    if (found.includes(way)) return void ctx.miss(T.machen.had);
    found.push(way);
    ways.append(el("span", "chip pop", `${ctx.num(sides[0])} + ${ctx.num(sides[1])}`));
    if (found.length === 2) {
      locked = true;
      const [a, b, c, d] = found.flatMap((w) => w.split("+")).map((n) => ctx.word(+n));
      ctx.solved(T.machen.done(a, b, c, d, ctx.word(t.total)));
      return;
    }
    // The things stay where they are: the second way is found by moving some of them over.
    ctx.tap();
    ctx.tell(T.machen.another);
  });

  host.append(sign(ctx, t.total), scene, basketBox, ways, check);
  draw();
  ctx.tell(T.machen.question(ctx.word(t.total), thing));

  return {
    hint() {
      leaves.forEach((leaf) => shake(leaf));
      return found.length ? T.machen.hintMove : T.machen.hint;
    },
  };
}

// ---------- Forschen: shake the apple tree. Some apples fall down, the others stay up. Try, then predict.
// think-lab had a hollow tree here: nuts in, "total − x" nuts out, and the child had to find out what the tree
// does. That rule was hidden and too hard for children of 3 to 6. Now nothing is hidden: all apples hang in the
// tree, the child says how many fall, and sees the others stay up. What there is to find is in plain sight:
// down and up are always all the apples together.

export function forschen(host, t, ctx) {
  const { T } = ctx;
  const F = T.forschen;
  const APPLE = "🍎";
  const tried = []; // how many fell, in the order the child tried
  let mode = "test"; // "test" | "predict"
  let ask = 0; // predict: how many fall
  let locked = false;

  const scene = el("div", "scene card shake-scene");
  const tree = el("div", "tree");
  const crown = el("div", "crown");
  tree.append(el("span", "tree-top", "🌳"), crown);
  const ground = el("div", "ground");
  scene.append(tree, ground);
  const log = el("div", "ways");
  log.setAttribute("aria-label", F.tried);
  const know = button("btn sun know-btn", F.know, "💡");
  know.hidden = true;

  /** All apples in the tree; then `down` of them fall (shown at once when `now`). */
  function draw(down, { now = false, pale = 0 } = {}) {
    crown.innerHTML = "";
    ground.innerHTML = "";
    for (let i = 0; i < t.total - down; i++) crown.append(el("span", "apple" + (i >= t.total - down - pale ? " pale" : ""), APPLE));
    for (let i = 0; i < down; i++) {
      const a = el("span", "apple" + (now ? "" : " falls"), APPLE);
      a.style.animationDelay = `${i * 90}ms`;
      ground.append(a);
    }
  }

  function addPair(down) {
    const chip = el("span", "chip pop", `${ctx.num(down)} + ${ctx.num(t.total - down)} = ${ctx.num(t.total)}`);
    log.append(chip);
  }

  function predict() {
    mode = "predict";
    know.hidden = true;
    const all = Array.from({ length: t.total - 1 }, (_, i) => i + 1);
    const fresh = all.filter((x) => !tried.includes(x));
    const pool = fresh.length ? fresh : all.filter((x) => x !== ask);
    ask = pool[Math.floor(pool.length / 2)];
    for (const b of answers.children) b.disabled = false;
    answers.classList.add("predict");
    draw(0);
    ctx.tell(F.predict(ask, ctx.word(ask)), undefined, true); // the new question goes to the top
  }

  const answers = strip(ctx, 1, t.total - 1, async (n, b) => {
    if (locked) return;
    if (mode === "test") {
      ctx.tap();
      tree.classList.remove("working");
      void tree.offsetWidth;
      tree.classList.add("working");
      draw(n);
      if (!tried.includes(n)) {
        tried.push(n);
        addPair(n);
      }
      if (tried.length >= 2) know.hidden = false;
      const next = tried.length === 1 ? F.more : tried.length === 2 ? F.ready : "";
      ctx.tell(`${F.out(n, t.total - n, ctx.word(n), ctx.word(t.total - n))} ${next}`.trim());
      return;
    }
    // Predict: one committed answer, then the apples fall and show how many stay up.
    const up = t.total - ask;
    tree.classList.remove("working");
    void tree.offsetWidth;
    tree.classList.add("working");
    draw(ask);
    if (n === up) {
      locked = true;
      b.classList.add("right");
      ctx.solved(F.rule(ctx.word(ask), ctx.word(up), ctx.word(t.total)));
      return;
    }
    shake(b);
    if (!tried.includes(ask)) {
      tried.push(ask);
      addPair(ask);
    }
    locked = true; // wait for the sentence, then ask about another number
    await ctx.miss(F.predictMiss(up, ctx.word(up)));
    locked = false;
    predict();
  });

  know.addEventListener("click", () => {
    if (!locked && mode === "test") predict();
  });

  host.append(sign(ctx, t.total), scene, log, answers, know);
  draw(0);
  ctx.tell(F.question(ctx.word(t.total)));

  return {
    hint() {
      if (mode === "predict") {
        draw(0, { pale: ask }); // the apples that will fall look pale: count the others
        return F.hintPredict;
      }
      return F.hint;
    },
  };
}

// ---------- Anwenden: a little scene. The whole and one part are known, the other part is hidden.

const SCENE_ART = {
  frogs: { known: "🐸", hidden: "🐸", cover: "🌾" },
  eggs: { known: "🐥", hidden: "🥚", cover: "🍃" },
  apples: { known: "🍎", hidden: "🍎", cover: "🌳", fall: true }, // the tree is above, the grass below
};

export function anwenden(host, t, ctx) {
  const { T } = ctx;
  const art = SCENE_ART[t.scene];
  const scene = el("div", `scene card use-scene use-${t.scene}`);
  const known = el("div", "zone known");
  const hidden = el("div", "zone hidden");
  const whole = group(t.total, art.hidden);
  // The place (tree, reeds, nest leaf) is in the picture from the start, so "on the tree" is seen.
  const place = el("span", "cover");
  place.append(el("span", "cover-icon", art.cover), whole);
  hidden.append(place);
  const cover = el("span", "cover");
  cover.append(el("span", "cover-icon", art.cover), el("b", "unknown", "?"));
  // The picture follows the real world: what falls ends up below. Apples hang on the tree at the
  // top and fall into the grass at the bottom; frogs hop up onto the leaf, chicks climb out of the nest.
  scene.append(sign(ctx, t.total), ...(art.fall ? [hidden, known] : [known, hidden]));
  const hintBox = el("div", "hint-box");
  let locked = true; // until the story was shown

  const answers = strip(ctx, 1, Math.max(5, t.range), (n, b) => {
    if (locked) return;
    if (n !== t.answer) {
      shake(b);
      b.disabled = true;
      ctx.miss(T.sehen.miss(ctx.word(n), ctx.word(t.known), ctx.word(n + t.known), ctx.word(t.total)));
      return;
    }
    locked = true;
    b.classList.add("right");
    hidden.innerHTML = "";
    hidden.append(group(t.answer, art.hidden));
    ctx.solved(T.together(ctx.word(t.known), ctx.word(t.answer), ctx.word(t.total)));
  });

  host.append(scene, hintBox, answers);
  answers.classList.add("waiting");

  // Show the story: first the whole is there, then one part moves away, then the rest is covered.
  const [start, then, ask] = T.anwenden[t.scene](ctx.word(t.total), t.known, ctx.word(t.known));
  (async () => {
    await ctx.tell(start);
    if (!host.isConnected) return;
    const movers = [...whole.children].slice(0, t.known);
    for (const pic of movers) pic.classList.add(art.fall ? "go-down" : "go-away");
    await wait(500);
    for (const pic of movers) pic.remove();
    known.append(group(t.known, art.known));
    await Promise.all([ctx.tell(then), wait(900)]);
    if (!host.isConnected) return;
    hidden.innerHTML = "";
    hidden.append(cover);
    answers.classList.remove("waiting");
    locked = false;
    ctx.ready();
    ctx.tell(ask);
  })();

  return {
    hint() {
      if (!hintBox.firstChild) hintBox.append(partsHint(t.total, t.known, art.known));
      return T.anwenden.hint;
    },
  };
}

// ---------- Prüfen: the owl says "a and b are …". Is that right? If not: make it right.

export function pruefen(host, t, ctx) {
  const { T } = ctx;
  const thing = ctx.thing(t.thing);
  const sum = t.a + t.b;
  let said = t.said;
  let locked = false;

  const scene = el("div", "scene card owl-scene");
  const talk = el("div", "talk");
  const saidBox = el("b", "said", ctx.num(said));
  const bubble = el("div", "bubble");
  // The owl's number with that many dots, so the claim can be checked by counting. No equation:
  // a child who cannot read "2 + 1 = 4" yet can still compare the dots with the things.
  const saidDots = el("span", "sign-dots");
  const drawSaid = () => {
    saidDots.innerHTML = "";
    for (let i = 0; i < said; i++) saidDots.append(el("i"));
  };
  drawSaid();
  bubble.append(saidBox, saidDots);
  talk.append(myOwl(), bubble);
  const groups = el("div", "groups" + (t.a + t.b > 6 ? " big" : "")); // two rows of more than three must still fit side by side
  const parts = [t.a, t.b].map((n) => {
    const box = el("div", "part");
    box.append(group(n, thing.icon));
    return box;
  });
  groups.append(...parts);
  scene.append(talk, groups);

  const judge = el("div", "judge");
  const yes = button("btn ok judge-btn", T.pruefen.yes, "✓");
  const no = button("btn go judge-btn", T.pruefen.no, "✗");
  judge.append(yes, no);

  // The owl was wrong: the child taps the right number, the same number buttons as everywhere.
  const fixer = strip(ctx, 1, Math.max(5, t.range), (n, b) => {
    if (locked) return;
    said = n;
    saidBox.textContent = ctx.num(said);
    drawSaid();
    if (n !== sum) {
      shake(b);
      b.disabled = true;
      ctx.miss(T.pruefen.fixMiss);
      return;
    }
    locked = true;
    b.classList.add("right");
    saidBox.classList.remove("wrong");
    saidBox.classList.add("right");
    ctx.solved(T.pruefen.fixed(ctx.word(t.a), ctx.word(t.b), ctx.word(sum)));
  });
  fixer.hidden = true;

  yes.addEventListener("click", () => {
    if (locked) return;
    if (!t.right) return void (shake(yes), ctx.miss(T.pruefen.countAgain));
    locked = true;
    saidBox.classList.add("right");
    ctx.solved(T.pruefen.right(ctx.word(t.a), ctx.word(t.b), ctx.word(sum)));
  });

  no.addEventListener("click", () => {
    if (locked) return;
    if (t.right) return void (shake(no), ctx.miss(T.pruefen.countAgain));
    judge.hidden = true;
    fixer.hidden = false;
    saidBox.classList.add("wrong");
    ctx.tap();
    ctx.tell(T.pruefen.fix);
  });

  host.append(scene, judge, fixer);
  ctx.tell(T.pruefen.question(ctx.word(t.a), ctx.word(t.b), ctx.word(t.said)));

  return {
    hint() {
      parts.forEach((box, i) => {
        if (!box.querySelector(".count")) box.append(el("b", "count pop", ctx.num([t.a, t.b][i])));
      });
      return T.pruefen.hint;
    },
  };
}

export const draw = port({ sehen, machen, forschen, anwenden, pruefen });
