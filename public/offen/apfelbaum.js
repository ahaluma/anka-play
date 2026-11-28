// The apple tree of the open Tal (#/apfelbaum). Apples grow, the child picks as many as the owl says, then:
// "Wie viele hängen noch?" Once sharing fairly is sicher at the pond, hares come and the picked apples are
// shared: "Gib jedem gleich viele.", later with a rest: "Wie viele bleiben übrig?". The world (apfel.js) changes
// only through events; the screen draws its state.

import { textsIn, num } from "../engine/i18n.js";
import { el, button, wait } from "../engine/ui/parts.js";
import { voice } from "../engine/ui/voice.js";
import { sound } from "../engine/ui/sound.js";
import * as A from "./apfel.js";
import { figure } from "./figures.js";
import { setup, w } from "./scene.js";

export async function render(root) {
  const X = await textsIn(new URL("./lang/", import.meta.url));
  const Y = X.apfel;
  const S = setup(root, { place: "apfelbaum", X, title: Y.title, skills: ["legen", "zaehlen5", "zaehlen10", "teilen", "rest"] });
  const { rec, count, scene, askNumber, done, onward, countAlong } = S;

  const world = A.create();
  const send = (e) => world.send(e);
  const crown = el("div", "apfel-crown");
  const treeSign = el("span", "offen-sign", "?");
  const tree = el("div", "apfel-tree");
  tree.append(el("span", "apfel-trunk"), crown, treeSign);
  const ground = el("div", "apfel-ground");
  const basket = el("div", "apfel-basket");
  basket.setAttribute("aria-label", Y.basket);
  const hares = el("div", "apfel-hares");
  ground.append(basket, hares);
  scene.append(tree, ground);

  let mode = "wait"; // wait | pick | share
  const apple = (cls, label, onTap) => {
    const b = onTap ? button(`apfel-apple ${cls}`, label) : el("span", `apfel-apple ${cls}`);
    b.append(figure("apple"));
    if (onTap)
      b.addEventListener("click", () => {
        if (document.body.classList.contains("listening")) return;
        onTap();
      });
    return b;
  };
  const tapped = (e) => () => {
    if (send(e)) {
      sound.tap();
      draw();
    }
  };

  function draw() {
    const s = world.state;
    crown.replaceChildren();
    for (let i = 0; i < s.tree; i++) crown.append(apple("on-tree", Y.apple, mode === "pick" ? tapped({ type: "pflueck" }) : null));
    basket.replaceChildren(el("span", "apfel-basket-bowl"));
    const inBasket = el("div", "apfel-pile");
    for (let i = 0; i < s.basket; i++) inBasket.append(apple("", Y.apple, mode === "pick" ? tapped({ type: "zurueck" }) : null));
    basket.append(inBasket);
    hares.replaceChildren();
    s.hares.forEach((h, i) => {
      const box = mode === "share" ? button("apfel-hare", Y.hare) : el("div", "apfel-hare");
      if (mode === "share")
        box.addEventListener("click", (e) => {
          if (document.body.classList.contains("listening")) return;
          if (e.target.closest(".apfel-apple")) return;
          tapped({ type: "gib", to: i })();
        });
      box.classList.toggle("tappable", mode === "share");
      const face = el("span", "apfel-hare-face");
      face.append(figure("hare"));
      const pile = el("div", "apfel-pile");
      for (let k = 0; k < h; k++) pile.append(apple("", Y.apple, mode === "share" ? tapped({ type: "nimm", from: i }) : null));
      box.append(face, pile);
      hares.append(box);
    });
    hares.hidden = !s.hares.length;
  }

  const step = async () => {
    sound.tap();
    draw();
    await wait(550);
  };

  async function event() {
    voice.newTask();
    const p = A.plan(rec);
    treeSign.textContent = "?";
    treeSign.classList.remove("known");
    scene.classList.remove("bye");
    mode = "wait";
    send({ type: "wachsen", n: p.n });
    draw();
    await wait(800);

    // "Pflück vier Äpfel."
    mode = "pick";
    draw();
    await voice.ask(Y.pick(p.pick, w(p.pick)), true, true);
    if (!rec.stars) voice.tell(Y.how);
    await done();
    mode = "wait";
    draw();
    const right = world.state.basket === p.pick;
    right ? sound.right() : sound.wrong();
    count("legen", right);
    await voice.tell(right ? X.right : X.wrong);
    if (!right) {
      while (world.state.basket !== p.pick) {
        send({ type: world.state.basket > p.pick ? "zurueck" : "pflueck" });
        await step();
      }
    }

    // "Wie viele hängen noch?"
    if (p.askLeft) {
      voice.newTask();
      const left = world.state.tree;
      crown.classList.add("asked");
      if (!(await askNumber(Y.left, A.countSkill(left), left))) await countAlong([...crown.children]);
      crown.classList.remove("asked");
    }
    treeSign.textContent = num(world.state.tree);
    treeSign.classList.add("known");

    // Hares come: "Gib jedem gleich viele."
    if (p.share) {
      voice.newTask();
      send({ type: "hasen", n: p.share.hares });
      draw();
      await wait(700);
      mode = "share";
      draw();
      await voice.ask(Y.share, true, true);
      if (p.share.rest) await voice.ask(Y.shareRest, true);
      if (!rec.skills.teilen) voice.tell(Y.shareHow);
      await done();
      mode = "wait";
      draw();
      const fair = A.fair(world.state);
      fair ? sound.right() : sound.wrong();
      count("teilen", fair);
      await voice.tell(fair ? X.right : X.wrong);
      if (!fair) {
        // The owl shares again, one apple to each hare in turn.
        for (let i = 0; i < world.state.hares.length; i++)
          while (world.state.hares[i] > 0) {
            send({ type: "nimm", from: i });
            await step();
          }
        let i = 0;
        while (world.state.basket >= world.state.hares.length) {
          send({ type: "gib", to: i });
          i = (i + 1) % world.state.hares.length;
          await step();
        }
      }
      voice.newTask();
      if (p.share.rest) {
        basket.classList.add("asked");
        const r = world.state.basket;
        if (!(await askNumber(Y.rest, "rest", r, Math.max(3, r)))) await countAlong([...basket.querySelectorAll(".apfel-apple")]);
        basket.classList.remove("asked");
      } else {
        const each = world.state.hares[0];
        hares.classList.add("asked");
        if (!(await askNumber(Y.each, A.countSkill(each), each))) await countAlong([...hares.firstChild.querySelectorAll(".apfel-apple")]);
        hares.classList.remove("asked");
      }
    }

    voice.newTask();
    scene.classList.add("bye");
    await wait(700);
    await onward();
    return event();
  }

  event().catch(() => {});
  return () => {
    voice.clear();
    document.querySelectorAll(".offen-fly").forEach((g) => g.remove());
  };
}
