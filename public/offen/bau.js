// The burrow of the open Tal (#/bau). Hares live here: they all go in, some come out one by one. Then:
// "Wie viele sind draußen?", "Wie viele sind noch drin?" (the ones inside cannot be seen: zerlegen), and now and
// then one more comes out or one goes back in: "Wie viele sind jetzt draußen?". The world (hasen.js) changes
// only through events; the screen draws its state.

import { textsIn, num } from "../engine/i18n.js";
import { el, wait } from "../engine/ui/parts.js";
import { voice } from "../engine/ui/voice.js";
import { sound } from "../engine/ui/sound.js";
import * as H from "./hasen.js";
import { figure } from "./figures.js";
import { setup, w } from "./scene.js";

export async function render(root) {
  const X = await textsIn(new URL("./lang/", import.meta.url));
  const Y = X.bau;
  const S = setup(root, { place: "bau", X, title: Y.title, skills: ["zaehlen5", "zaehlen10", "zerlegen5", "zerlegen10", "dazu", "weg"] });
  const { rec, count, scene, askNumber, onward, countAlong } = S;

  const world = H.create();
  const hill = el("div", "bau-hill");
  const hole = el("div", "bau-hole");
  const homeSign = el("span", "offen-sign bau-home", "?");
  const insideSign = el("span", "offen-sign bau-in", "?");
  hill.append(hole, homeSign, insideSign);
  const meadow = el("div", "bau-meadow");
  scene.append(hill, meadow);

  let peek = false; // the hares inside come out for a moment to be counted
  const hare = (cls = "") => {
    const h = el("span", `bau-hare ${cls}`.trim());
    h.append(figure("hare"));
    return h;
  };
  function draw() {
    const s = world.state;
    meadow.replaceChildren();
    for (let i = 0; i < s.outside; i++) meadow.append(hare());
    hole.replaceChildren();
    if (peek) for (let i = 0; i < s.inside; i++) hole.append(hare("peek"));
  }
  const setSign = (node, n) => {
    node.textContent = n === null ? "?" : num(n);
    node.classList.toggle("known", n !== null);
  };

  async function event() {
    voice.newTask();
    const p = H.plan(rec);
    scene.classList.remove("bye");
    setSign(insideSign, null);
    insideSign.hidden = true;
    // n hares live here: seen in front of the burrow, then they hop in one after the other.
    world.send({ type: "wohnen", n: p.n });
    for (let i = 0; i < p.n; i++) world.send({ type: "raus" });
    draw();
    setSign(homeSign, p.n);
    await voice.tell(Y.live(p.n, w(p.n)));
    await wait(500);
    while (world.state.outside) {
      world.send({ type: "rein" });
      sound.tap();
      draw();
      await wait(350);
    }
    await wait(600);
    // Some come out, one by one: seen, not told.
    for (let i = 0; i < p.out; i++) {
      world.send({ type: "raus" });
      sound.tap();
      draw();
      meadow.lastChild?.classList.add("pop");
      await wait(600);
    }
    await wait(400);

    if (p.askOut) {
      voice.newTask();
      const k = world.state.outside;
      meadow.classList.add("asked");
      if (!(await askNumber(Y.out, H.countSkill(k), k))) await countAlong([...meadow.children]);
      meadow.classList.remove("asked");
    }
    if (p.askIn) {
      voice.newTask();
      const k = world.state.inside;
      hill.classList.add("asked");
      insideSign.hidden = false;
      const right = await askNumber(Y.inside, H.splitSkill(p.n), k, topFor(p.n));
      if (!right) {
        // The ones inside peek out to be counted, then go back in.
        peek = true;
        draw();
        await countAlong([...hole.children]);
        peek = false;
        draw();
      }
      setSign(insideSign, k);
      hill.classList.remove("asked");
    }
    if (p.change) {
      voice.newTask();
      await wait(400);
      if (p.change === "rein") meadow.lastChild?.classList.add("leave");
      await wait(450);
      world.send({ type: p.change });
      sound.tap();
      draw();
      if (p.change === "raus") meadow.lastChild?.classList.add("pop");
      setSign(insideSign, null);
      await wait(500);
      const k = world.state.outside;
      meadow.classList.add("asked");
      if (!(await askNumber(Y.now, p.change === "raus" ? "dazu" : "weg", k, topFor(Math.max(k, p.n))))) await countAlong([...meadow.children]);
      meadow.classList.remove("asked");
    }

    voice.newTask();
    scene.classList.add("bye");
    await wait(700);
    await onward();
    return event();
  }
  const topFor = (n) => (n <= 5 ? 5 : 10);

  event().catch(() => {});
  return () => {
    voice.clear();
    document.querySelectorAll(".offen-fly").forEach((g) => g.remove());
  };
}
