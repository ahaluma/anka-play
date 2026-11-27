// Board "reihe": a row of numbers on stones, planks or a ruler. See content/boards.js.
//
//   show.from, show.step, show.len   the numbers from, from + step, …
//   show.missing                     the index of the stone with "?": the answer is its number
//   show.mixed                       instead: the stones lie mixed up on the bank; the child taps them in order
//                                    (answer mode "order", the answer is the list in order)
//   show.look                        "stones" (a frog hops over them) | "bridge" | "ruler"
//   show.dots                        up to 10: each stone also shows that many dots
//
// Texts of the task: ask, hint, right, miss. While laying the path a wrong stone is a miss with
// v.first (no stone laid yet), v.prev and v.chosen; the hint gets v.next (stones laid so far).

import { el, button, dots, shake } from "../engine/ui/parts.js";

function fill(stone, n, ctx, withDots) {
  stone.replaceChildren(el("b", "", ctx.num(n)));
  if (withDots) stone.append(dots(n));
}

export function draw(host, t, ctx) {
  return t.show.mixed ? order(host, t, ctx) : row(host, t, ctx);
}

function row(host, t, ctx) {
  const { from, step, len, missing, look = "stones" } = t.show;
  const scene = el("div", `scene card stones-scene look-${look}` + (step < 0 ? " back" : ""));
  const line = el("div", "stones");
  line.setAttribute("aria-label", ctx.label("stones"));
  const stones = [];
  for (let i = 0; i < len; i++) {
    const stone = el("div", i === missing ? "stone gap" : "stone");
    if (i === missing) stone.append(el("b", "", "?"));
    else fill(stone, from + i * step, ctx, t.show.dots);
    stones.push(stone);
    line.append(stone);
  }
  if (look === "stones") scene.append(el("span", "frog", "🐸"));
  scene.append(line);
  host.append(scene);
  ctx.ask("ask");
  return {
    onAnswer(given, right) {
      if (!right) return;
      const stone = stones[missing];
      stone.classList.remove("gap");
      stone.classList.add("pop");
      fill(stone, given, ctx, t.show.dots);
    },
    hint() {
      for (const stone of stones) shake(stone);
    },
  };
}

function order(host, t, ctx) {
  const want = t.answer.value;
  const scene = el("div", "scene card stones-scene look-stones");
  const path = el("div", "stones");
  path.setAttribute("aria-label", ctx.label("stones"));
  for (let i = 0; i < want.length; i++) path.append(el("div", "stone gap"));
  scene.append(el("span", "frog", "🐸"), path);
  const bank = el("div", "stone-bank");
  let next = 0;
  let locked = false;
  const loose = t.show.mixed.map((n) => {
    const stone = button("stone loose", ctx.word(n));
    fill(stone, n, ctx, t.show.dots);
    stone.addEventListener("click", async () => {
      if (locked || stone.disabled) return;
      if (n !== want[next]) {
        shake(stone);
        locked = true;
        await ctx.miss({ given: n, chosen: n, prev: want[next - 1], first: next === 0 });
        locked = false;
        return;
      }
      ctx.tap();
      stone.disabled = true;
      stone.classList.add("used");
      const slot = path.children[next];
      slot.classList.remove("gap");
      slot.classList.add("pop");
      fill(slot, n, ctx, t.show.dots);
      next++;
      if (next === want.length) {
        locked = true;
        ctx.give([...want]);
      }
    });
    bank.append(stone);
    return { n, stone };
  });
  host.append(scene, bank);
  ctx.ask("ask");
  return {
    ownAnswer: true,
    hint() {
      loose.find((l) => l.n === want[next])?.stone.classList.add("glow-next");
      return { next };
    },
  };
}
