// Board "menge": a set of things, five in a row. See content/boards.js.
//
//   show.things   a thing id (engine/things.js) or an emoji
//   show.n        how many are shown
//   show.flash    after the first round of a perspective the things show only for a short look, then a bush
//                 covers them (text "look", then "ask" with v.seen = true)
//   show.pool     build: that many lie on the field; the child taps them into the basket and checks (✓).
//                 The answer is the number in the basket. A sign shows the number to make.
//   show.change   a story: n are there (text "start"), then `change` come (+) or go (−) (text "change");
//                 from the second round a bush covers them first, so the child thinks instead of counting again
//   show.owl      { says }: the owl claims a number; the child checks it (answer mode yesNo, with fix)
//
// Texts of the task (ideas/<id>/lang): ask, and look / start / change as above; hint, right, miss.

import { el, button, group, sign, dots, wait } from "../engine/ui/parts.js";

export function draw(host, t, ctx) {
  const s = t.show;
  if (s.pool !== undefined) return build(host, t, ctx);
  if (s.change !== undefined) return story(host, t, ctx);
  if (s.owl) return owl(host, t, ctx);
  return look(host, t, ctx);
}

const bush = () => {
  const b = el("div", "bush", "🌿");
  b.append(el("b", "unknown", "?"));
  b.hidden = true;
  return b;
};

/** How long a short look lasts: things stand in rows of five, no time to count one by one. */
const lookTime = (n) => Math.min(4500, 1200 + n * 250);

function look(host, t, ctx) {
  const { n, flash } = t.show;
  const scene = el("div", "scene card flower-scene");
  const things = group(n, ctx.icon(t.show.things));
  const cover = bush();
  scene.append(things, cover);
  host.append(scene);
  const short = flash && !ctx.fresh(); // the very first round: nothing hides, count in peace
  let helped = false;
  const shown = (on) => {
    things.hidden = !on;
    cover.hidden = on;
  };

  const ready = (async () => {
    if (short) {
      await Promise.all([ctx.ask("look"), wait(lookTime(n))]);
      if (!host.isConnected) return;
      shown(false);
    }
    await ctx.ask("ask", { seen: short });
  })();

  return {
    ready,
    async onAnswer(given, right) {
      if (!short || helped) return;
      shown(true); // a second look, the same length; or the answer
      if (right) return;
      await wait(lookTime(n));
      if (host.isConnected && !helped) shown(false);
    },
    hint() {
      helped = true; // they stay now, so they can be counted
      shown(true);
    },
  };
}

function build(host, t, ctx) {
  const { pool } = t.show;
  const target = t.answer.value;
  const icon = ctx.icon(t.show.things);
  let picked = 0;
  let locked = false;
  const scene = el("div", "scene card pick-scene");
  const field = el("div", "field");
  field.setAttribute("aria-label", ctx.label("field"));
  const basket = el("div", "basket");
  basket.setAttribute("aria-label", ctx.label("basket"));
  const help = el("div", "hint-box");
  const check = button("btn ok check-btn", ctx.label("done"), "✓");

  const move = (d) => {
    if (locked) return;
    picked += d;
    ctx.tap();
    redraw();
  };
  function redraw() {
    const left = el("span", "pics" + (pool > 10 ? " many" : ""));
    for (let i = 0; i < pool - picked; i++) {
      const p = button("pic thing", ctx.label("thing"), icon);
      p.addEventListener("click", () => move(1));
      left.append(p);
    }
    field.replaceChildren(left);
    const inside = el("span", "pics" + (picked > 10 ? " many" : ""));
    for (let i = 0; i < picked; i++) {
      const p = button("pic thing", ctx.label("thing"), icon);
      p.addEventListener("click", () => move(-1));
      inside.append(p);
    }
    basket.replaceChildren(el("span", "basket-icon", "🧺"), inside);
    if (help.firstChild) help.replaceChildren(places(target, Math.min(picked, target), icon));
  }
  check.addEventListener("click", async () => {
    if (locked) return;
    locked = true;
    const right = await ctx.give(picked);
    locked = right;
  });
  scene.append(sign(target, ctx.num), field);
  host.append(scene, basket, help, check);
  redraw();
  ctx.ask("ask");
  return {
    ownAnswer: true,
    hint() {
      if (!help.firstChild) help.append(places(target, Math.min(picked, target), icon));
    },
  };
}

/** A row of places, the first `filled` taken: how many are still missing. */
function places(n, filled, icon) {
  const row = el("div", "places pop");
  for (let i = 0; i < n; i++) row.append(el("span", i < filled ? "place full" : "place", i < filled ? icon : ""));
  return row;
}

function story(host, t, ctx) {
  const { n, change } = t.show;
  const k = Math.abs(change);
  const icon = ctx.icon(t.show.things);
  const scene = el("div", "scene card flower-scene story-scene");
  let things = group(n, icon);
  const cover = bush();
  const note = el("div", "change-sign");
  scene.append(things, cover, note);
  host.append(scene);
  const hide = !ctx.fresh(); // from the second round: think, do not count again

  const ready = (async () => {
    await ctx.ask("start");
    if (!host.isConnected) return;
    if (hide) {
      things.hidden = true;
      cover.hidden = false;
    }
    note.textContent = `${change > 0 ? "+" : "−"} ${icon.repeat(k)}`;
    note.classList.add("pop", change > 0 ? "in" : "out");
    if (!hide) {
      if (change > 0) for (let i = 0; i < k; i++) things.append(el("span", "pic pop", icon));
      else for (let i = 0; i < k; i++) things.children[things.children.length - 1 - i]?.classList.add("go-away");
    }
    await Promise.all([ctx.ask("change"), wait(900)]);
    if (!host.isConnected) return;
    if (!hide && change < 0) for (let i = 0; i < k; i++) things.lastChild?.remove();
    await ctx.ask("ask");
  })();

  return {
    ready,
    onAnswer(given, right) {
      if (!right) return;
      cover.hidden = true;
      const after = group(n + change, icon);
      things.replaceWith(after);
      things = after;
    },
    hint() {
      cover.hidden = true;
      things.hidden = false;
    },
  };
}

function owl(host, t, ctx) {
  const { n } = t.show;
  const scene = el("div", "scene card owl-scene");
  const bubble = el("div", "bubble");
  const said = el("b", "said");
  const saidDots = el("span");
  const show = (x) => {
    said.textContent = ctx.num(x);
    saidDots.replaceChildren(dots(x, "sign-dots"));
  };
  show(t.show.owl.says);
  bubble.append(said, saidDots);
  const talk = el("div", "talk");
  talk.append(el("span", "owl", "🦉"), bubble);
  const part = el("div", "part");
  const things = group(n, ctx.icon(t.show.things));
  part.append(things);
  scene.append(talk, part);
  host.append(scene);
  ctx.ask("ask");
  return {
    onAnswer(given, right, stage) {
      if (stage === "judge") {
        if (right && given === false) said.classList.add("wrong");
        if (right && given === true) said.classList.add("right");
        return;
      }
      show(given); // fixing: the owl's number becomes the child's
      if (right) {
        said.classList.remove("wrong");
        said.classList.add("right");
      }
    },
    hint() {
      // counting with the finger: every thing gets its number
      [...things.children].forEach((pic, i) => {
        pic.dataset.n = ctx.num(i + 1);
        pic.classList.add("numbered");
      });
    },
  };
}
