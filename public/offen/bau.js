// The burrow of the open Tal (#/bau). Hares live here: the child taps them into the burrow (nothing to get wrong),
// some come out one by one. Then a sequence of three to five questions: "Wie viele sind draußen?", "Wie viele
// sind noch drin?" (the ones inside cannot be seen: zerlegen), and hares that come and go: "Wie viele sind jetzt
// draußen?". The world (hasen.js) changes
// only through events; the screen draws its state.

import { textsIn, num } from "../engine/i18n.js";
import { el, wait } from "../engine/ui/parts.js";
import { voice } from "../engine/ui/voice.js";
import { sound } from "../engine/ui/sound.js";
import * as H from "./hasen.js";
import { figure } from "./figures.js";
import { setup } from "./scene.js";

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
  let onHare = null; // while the child taps the hares into the burrow
  const hare = (cls = "") => {
    const h = el("span", `bau-hare ${cls}`.trim());
    h.append(figure("hare"));
    return h;
  };
  meadow.addEventListener("click", () => {
    if (!onHare || document.body.classList.contains("listening")) return;
    onHare(); // a tap anywhere on the meadow will do: forgiving for small fingers
  });
  function draw() {
    const s = world.state;
    meadow.classList.toggle("offer", !!onHare);
    meadow.replaceChildren();
    for (let i = 0; i < s.outside; i++) meadow.append(hare());
    hole.replaceChildren();
    if (peek) for (let i = 0; i < s.inside; i++) hole.append(hare("peek"));
  }
  const setSign = (node, n) => {
    node.textContent = n === null ? "?" : num(n);
    node.classList.toggle("known", n !== null);
  };

  /** One question of the sequence: those outside (seen) or those still inside (not seen). */
  async function ask(step, n) {
    voice.newTask();
    if (step.ask === "out") {
      const k = world.state.outside;
      meadow.classList.add("asked");
      if (!(await askNumber(step.change ? Y.now : Y.out, step.skill, k, topFor(n)))) await countAlong([...meadow.children]);
      meadow.classList.remove("asked");
      return;
    }
    const k = world.state.inside;
    hill.classList.add("asked");
    insideSign.hidden = false;
    setSign(insideSign, null);
    if (!(await askNumber(Y.inside, step.skill, k, topFor(n)))) {
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

  async function event() {
    voice.newTask();
    const p = H.plan(rec);
    scene.classList.remove("bye");
    setSign(insideSign, null);
    insideSign.hidden = true;
    // n hares live here (the sign on the hill says how many): they sit in front of the burrow, and the child taps
    // them in, one per tap. Nothing to get wrong; the hares bob until all are in.
    world.send({ type: "wohnen", n: p.n });
    for (let i = 0; i < p.n; i++) world.send({ type: "raus" });
    setSign(homeSign, p.n);
    draw();
    // A short instruction says what to do (asked for 28.11.: the bobbing alone did not carry it).
    await voice.ask(Y.sendIn, true, true);
    await new Promise((resolve) => {
      onHare = () => {
        if (!world.send({ type: "rein" })) return;
        sound.tap();
        draw();
        if (!world.state.outside) resolve();
      };
      draw();
    });
    onHare = null;
    voice.newTask();
    draw();
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

    for (const step of p.steps) {
      if (step.change) {
        voice.newTask();
        await wait(400);
        if (step.change === "rein") meadow.lastChild?.classList.add("leave");
        await wait(450);
        world.send({ type: step.change });
        sound.tap();
        draw();
        if (step.change === "raus") meadow.lastChild?.classList.add("pop");
        setSign(insideSign, null);
        await wait(500);
      }
      await ask(step, p.n);
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
