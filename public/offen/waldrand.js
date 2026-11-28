// The edge of the wood in the open Tal (#/waldrand): patterns. The child taps and a row of mushrooms, leaves,
// berries and cones grows, one thing per tap (pale buds show how many still come): nothing to get wrong. Then
// "Was wächst als Nächstes?", two or three times, the row growing with each answer. With three things, sometimes
// a new row with one mistake: "Wo stimmt die Reihe nicht?" The plan comes from tal.js.

import { textsIn } from "../engine/i18n.js";
import { el, button, wait } from "../engine/ui/parts.js";
import { voice } from "../engine/ui/voice.js";
import * as P from "./tal.js";
import { figure } from "./figures.js";
import { setup } from "./scene.js";

export async function render(root) {
  const X = await textsIn(new URL("./lang/", import.meta.url));
  const Y = X.waldrand;
  const S = setup(root, { place: "waldrand", X, title: Y.title, skills: P.SKILLS_AT.waldrand });
  const { rec, scene, below, askTap, cards, tapTimes, onward } = S;

  const trees = el("div", "wald-trees");
  const row = el("div", "wald-row");
  scene.append(trees, row);
  for (let i = 0; i < 5; i++) trees.append(el("span", "wald-tree"));

  const thing = (kind, cls = "", tap = false) => {
    const t = tap ? button(`wald-thing ${cls}`.trim(), Y.things[kind]) : el("span", `wald-thing ${cls}`.trim());
    t.dataset.item = kind;
    t.append(figure(kind));
    return t;
  };

  async function event() {
    voice.newTask();
    const p = P.waldrand(rec);
    scene.classList.remove("bye");
    row.replaceChildren();
    const buds = [];
    for (let i = 0; i < p.shown; i++) {
      const b = thing(P.nth(p.unit, i), "bud");
      row.append(b);
      buds.push(b);
    }
    // The free action: every tap lets the next thing of the row grow.
    await tapTimes(Y.grow, scene, p.shown, (k) => {
      buds.at(k).classList.remove("bud");
      buds.at(k).classList.add("pop");
    });
    await wait(500);

    let length = p.shown;
    const kinds = [...new Set(p.unit)];
    const other = P.THINGS.filter((t) => !kinds.includes(t));
    for (const st of p.steps) {
      voice.newTask();
      if (st.ask === "next") {
        const truth = P.nth(p.unit, length);
        const gap = el("span", "wald-thing gap", "?");
        row.append(gap);
        const options = P.shuffled(Math.random, kinds.length < 3 || Math.random() < 0.5 ? [...kinds, other.at(0)] : kinds);
        const nodes = cards(options, (k) => figure(k), (k) => Y.things[k]);
        await askTap(Y.next, st.skill, nodes, (n) => n.dataset.item === truth);
        below.replaceChildren();
        gap.replaceWith(thing(truth, "pop"));
        length++;
        await wait(500);
        continue;
      }
      // A new row with one mistake in it.
      row.classList.add("away");
      await wait(500);
      row.classList.remove("away");
      row.replaceChildren();
      const nodes = st.row.map((k, i) => {
        const t = thing(k, "pop", true);
        t.dataset.at = i;
        row.append(t);
        return t;
      });
      await wait(500);
      await askTap(Y.fehler, st.skill, nodes, (n) => Number(n.dataset.at) === st.wrong);
      const fixed = thing(P.nth(p.unit, st.wrong), "pop");
      nodes.at(st.wrong).replaceWith(fixed);
      await wait(800);
    }

    voice.newTask();
    scene.classList.add("bye");
    await wait(600);
    await onward();
    return event();
  }

  event().catch(() => {});
  return () => {
    voice.clear();
    document.querySelectorAll(".offen-fly").forEach((g) => g.remove());
  };
}
