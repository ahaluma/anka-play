// The apple tree of the open Tal (#/apfelbaum). The child taps the bare crown and apples grow, one per tap, until
// the tree is full: nothing to get wrong. "Wie viele Äpfel hängen auf dem Baum?" comes first,
// every round while counting is practised, then about every third round. Then the child picks as many as the
// owl says (or they fall by themselves), then:
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

  let mode = "wait"; // wait | grow | pick | share
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

  // Growing: every tap on the crown lets one apple grow, until the owl's number is reached. The crown bobs while
  // it waits for taps, so no words are needed.
  let onGrow = null;
  crown.addEventListener("click", () => {
    if (mode !== "grow" || document.body.classList.contains("listening")) return;
    onGrow?.();
  });

  function draw() {
    const s = world.state;
    crown.classList.toggle("offer", mode === "grow");
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

  /** "Pflück vier Äpfel." The child picks, then Fertig; on a miss the owl puts it right. */
  async function pickApples(p) {
    mode = "pick";
    draw();
    await voice.ask(Y.pick(p.pick, w(p.pick)), true, true);
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
  }

  async function event() {
    voice.newTask();
    const p = A.plan(rec);
    treeSign.textContent = "?";
    treeSign.classList.remove("known");
    scene.classList.remove("bye");
    // The bare tree: the child taps, the apples grow. No question, no wrong answer; a short instruction says what
    // to do (asked for 28.11.: the bobbing alone did not carry it).
    send({ type: "leer" });
    mode = "grow";
    draw();
    await voice.ask(Y.grow, true, true);
    await new Promise((resolve) => {
      onGrow = () => {
        if (world.state.tree >= p.n || !send({ type: "wachs" })) return;
        sound.tap();
        draw();
        crown.lastChild?.classList.add("pop");
        if (world.state.tree >= p.n) resolve();
      };
    });
    onGrow = null;
    voice.newTask();
    mode = "wait";
    draw();
    await wait(800);

    // The first question: "Wie viele Äpfel hängen auf dem Baum?" Every round while counting is practised,
    // then about every third round (apfel.js plan).
    if (p.askFirst) {
      crown.classList.add("asked");
      if (!(await askNumber(Y.first, A.countSkill(p.n), p.n))) await countAlong([...crown.children]);
      crown.classList.remove("asked");
      treeSign.textContent = num(p.n);
      treeSign.classList.add("known");
      await wait(500);
      treeSign.textContent = "?";
      treeSign.classList.remove("known");
      voice.newTask();
    }

    if (p.fall) {
      // The apples fall into the basket by themselves, one after the other.
      while (world.state.basket < p.pick) {
        send({ type: "pflueck" });
        sound.tap();
        draw();
        basket.querySelector(".apfel-pile")?.lastChild?.classList.add("fall");
        await wait(500);
      }
      await wait(300);
    } else await pickApples(p);

    // "Wie viele Äpfel sind im Korb?"
    if (p.askBasket) {
      voice.newTask();
      const k = world.state.basket;
      basket.classList.add("asked");
      if (!(await askNumber(Y.inBasket, A.countSkill(k), k))) await countAlong([...basket.querySelectorAll(".apfel-apple")]);
      basket.classList.remove("asked");
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

    // One more apple falls by itself (seen, not told): "Wie viele sind jetzt im Korb?"
    if (p.oneFalls) {
      voice.newTask();
      await wait(500);
      send({ type: "pflueck" });
      sound.tap();
      draw();
      basket.querySelector(".apfel-pile")?.lastChild?.classList.add("fall");
      treeSign.textContent = num(world.state.tree);
      await wait(700);
      const k = world.state.basket;
      basket.classList.add("asked");
      if (!(await askNumber(Y.basketNow, A.oneMoreSkill(rec, k), k))) await countAlong([...basket.querySelectorAll(".apfel-apple")]);
      basket.classList.remove("asked");
    }

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
