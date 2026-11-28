// The sky of the open Tal (#/himmel): first and then. Birds sit on a branch; the child taps them and each flies
// up, in the order tapped: nothing to get wrong. The first one flies in front. "Wer fliegt als Erster?" Once that
// is sicher, a little story in the sky (a cloud rains, an egg hatches, a seed grows): "Was war vorher?" "Was kommt
// danach?" The plan comes from tal.js.

import { textsIn } from "../engine/i18n.js";
import { el, button, wait } from "../engine/ui/parts.js";
import { voice } from "../engine/ui/voice.js";
import { sound } from "../engine/ui/sound.js";
import * as P from "./tal.js";
import { figure } from "./figures.js";
import { setup } from "./scene.js";

const COLOURS = ["blau", "gelb", "rot", "gruen"];

export async function render(root) {
  const X = await textsIn(new URL("./lang/", import.meta.url));
  const Y = X.himmel;
  const S = setup(root, { place: "himmel", X, title: Y.title, skills: P.SKILLS_AT.himmel });
  const { rec, scene, below, askTap, cards, onward } = S;

  const sky = el("div", "himmel-sky");
  const flock = el("div", "himmel-flock");
  const story = el("div", "himmel-story");
  sky.append(el("span", "himmel-sun"), story, flock);
  const branch = el("div", "himmel-branch");
  scene.append(sky, branch);

  const bird = (colour, tap) => {
    const b = tap ? button(`himmel-bird c-${colour}`, Y.bird) : el("span", `himmel-bird c-${colour}`);
    b.append(figure("vogel"));
    return b;
  };
  const pic = (id) => {
    const s = el("span", "himmel-pic");
    s.append(figure(id));
    return s;
  };

  async function event() {
    voice.newTask();
    const p = P.himmel(rec);
    scene.classList.remove("bye");
    flock.replaceChildren();
    story.replaceChildren();
    branch.replaceChildren(el("span", "himmel-wood"));
    const colours = P.shuffled(Math.random, COLOURS).slice(0, p.birds);
    const order = [];
    // The free action: the child taps the birds, each flies up into the sky in the order tapped.
    branch.classList.add("offer");
    const sitting = colours.map((c) => {
      const b = bird(c, true);
      branch.append(b);
      return b;
    });
    const asked = voice.ask(Y.fly, true, true);
    await new Promise((resolve) => {
      for (const b of sitting)
        b.addEventListener("click", () => {
          if (document.body.classList.contains("listening") || b.classList.contains("gone")) return;
          sound.tap();
          b.classList.add("gone");
          const f = bird(b.className.match(/c-(\w+)/)[1], false);
          f.classList.add("pop");
          flock.append(f);
          order.push(f);
          if (order.length === sitting.length) resolve();
        });
    });
    await asked;
    branch.classList.remove("offer");
    voice.newTask();
    await wait(600);

    for (const st of p.steps) {
      voice.newTask();
      if (st.ask === "rang") {
        const last = st.rank === p.birds - 1 && (st.rank > 2 || Math.random() < 0.5);
        const right = order.at(st.rank);
        await askTap(last ? Y.last : Y.rang[st.rank], st.skill, order, (n) => n === right);
        continue;
      }
      // A story in the sky: one picture shown, the one before or after it to find.
      const frames = P.STORIES[st.story];
      const truth = frames.at(st.dir === "vorher" ? st.at - 1 : st.at + 1);
      story.replaceChildren(pic(frames.at(st.at)));
      story.classList.add("pop");
      await wait(600);
      const nodes = cards(P.shuffled(Math.random, frames), (f) => figure(f), (f) => Y.pics[f]);
      await askTap(st.dir === "vorher" ? Y.vorher : Y.danach, st.skill, nodes, (n) => n.dataset.item === truth);
      below.replaceChildren();
      // The whole story, in order.
      story.replaceChildren(...frames.map(pic));
      await wait(1600);
      story.replaceChildren();
      story.classList.remove("pop");
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
