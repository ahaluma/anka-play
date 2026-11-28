// The nests of the open Tal (#/nester): sorting. The child taps the sky and birds land on the branch, one per
// tap: nothing to get wrong. Each nest has a sign: an egg in its colour, or it is big or small. "In welches Nest
// gehört der Vogel?" Once that is sicher, four birds, one does not fit: "Welcher Vogel passt hier nicht?"
// The plan comes from tal.js.

import { textsIn } from "../engine/i18n.js";
import { el, button, wait } from "../engine/ui/parts.js";
import { voice } from "../engine/ui/voice.js";
import * as P from "./tal.js";
import { figure } from "./figures.js";
import { setup } from "./scene.js";

export async function render(root) {
  const X = await textsIn(new URL("./lang/", import.meta.url));
  const Y = X.nester;
  const S = setup(root, { place: "nester", X, title: Y.title, skills: P.SKILLS_AT.nester });
  const { rec, scene, askTap, tapTimes, onward } = S;

  const sky = el("div", "nester-sky");
  const branch = el("div", "nester-branch");
  const nests = el("div", "nester-nests");
  sky.append(branch);
  scene.append(sky, nests);

  const bird = ({ farbe, gross }, tap = false) => {
    const b = tap ? button(`nester-bird c-${farbe} ${gross ? "big" : "small"}`, Y.bird) : el("span", `nester-bird c-${farbe} ${gross ? "big" : "small"}`);
    b.append(figure("vogel"));
    return b;
  };

  async function event() {
    voice.newTask();
    const p = P.nester(rec);
    scene.classList.remove("bye");
    branch.replaceChildren();
    nests.replaceChildren();
    const nestNodes = p.nests.map((n, i) => {
      const box = button(`nester-nest n-${n}`, Y.nests[n]);
      box.dataset.at = i;
      const sign = el("span", "nester-sign");
      if (p.by === "farbe") sign.append(figure("ei", `c-${n}`));
      box.append(el("span", "nester-in"), el("span", "nester-bowl"), sign);
      nests.append(box);
      return box;
    });
    // The free action: every tap on the sky brings the next bird onto the branch.
    const birds = p.birds.map((b) => bird(b));
    await tapTimes(Y.call, sky, birds.length || 1, (k) => {
      const b = birds.at(k);
      if (!b) return;
      b.classList.add("pop");
      branch.append(b);
    });
    await wait(500);

    for (const st of p.steps) {
      voice.newTask();
      if (st.ask === "nest") {
        const b = birds.at(st.bird);
        b.classList.add("asked");
        await askTap(Y.nest, st.skill, nestNodes, (n) => Number(n.dataset.at) === st.nest);
        b.classList.remove("asked");
        b.classList.add("away");
        await wait(450);
        const sitting = bird(p.birds.at(st.bird));
        sitting.classList.add("pop");
        nestNodes.at(st.nest).querySelector(".nester-in").append(sitting);
        b.remove();
        await wait(400);
        continue;
      }
      // Four birds on the branch; one does not fit.
      for (const b of branch.children) b.classList.add("away");
      await wait(450);
      branch.replaceChildren();
      const four = st.four.map((b, i) => {
        const node = bird(b, true);
        node.dataset.at = i;
        node.classList.add("pop");
        branch.append(node);
        return node;
      });
      await wait(500);
      await askTap(Y.anders, st.skill, four, (n) => Number(n.dataset.at) === st.odd);
      four.at(st.odd).classList.add("away");
      await wait(700);
      branch.replaceChildren();
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
