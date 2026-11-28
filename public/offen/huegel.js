// The hill of the open Tal (#/huegel): where is it? A bench and a stone stand on the hill. The child taps places
// and the animals sit there, one per tap: nothing to get wrong. "Wer sitzt auf der Bank?" "Setz den Hasen unter
// die Bank!" Before a question an animal may hop to another place (seen, not told). The plan comes from tal.js.

import { textsIn } from "../engine/i18n.js";
import { el, button, wait } from "../engine/ui/parts.js";
import { voice } from "../engine/ui/voice.js";
import { sound } from "../engine/ui/sound.js";
import * as P from "./tal.js";
import { figure } from "./figures.js";
import { setup } from "./scene.js";

const WHERE = [...P.LAGE1, ...P.LAGE2];
const FIG = { hase: "hare", frosch: "frog", maus: "maus", vogel: "vogel" };

export async function render(root) {
  const X = await textsIn(new URL("./lang/", import.meta.url));
  const Y = X.huegel;
  const S = setup(root, { place: "huegel", X, title: Y.title, skills: P.SKILLS_AT.huegel });
  const { rec, scene, askTap, onward } = S;

  const hill = el("div", "hg-hill");
  const stone = el("span", "hg-stone");
  stone.append(figure("stein"));
  const bench = el("span", "hg-bench");
  bench.append(el("span", "hg-seat"), el("span", "hg-leg l"), el("span", "hg-leg r"));
  hill.append(stone, bench);
  const spots = Object.fromEntries(
    WHERE.map((w) => {
      const s = button(`hg-spot at-${w}`, Y.spot);
      s.dataset.where = w;
      hill.append(s);
      return [w, s];
    }),
  );
  scene.append(hill);

  let animals = []; // { kind, where, node }
  const put = (a, where) => {
    a.where = where;
    a.node.className = `hg-animal at-${where} a-${a.kind}`;
  };
  const free = () => WHERE.filter((w) => !animals.some((a) => a.where === w));
  const hop = async (a, where) => {
    put(a, where);
    a.node.classList.add("hop");
    sound.tap();
    await wait(700);
  };

  async function event() {
    voice.newTask();
    const p = P.huegel(rec);
    scene.classList.remove("bye");
    animals.forEach((a) => a.node.remove());
    animals = [];
    // The free action: every tap on a free place lets the next animal sit there.
    hill.classList.add("offer");
    const asked = voice.ask(Y.sit, true, true);
    await new Promise((resolve) => {
      const offs = Object.values(spots).map((s) => {
        const f = () => {
          if (document.body.classList.contains("listening") || animals.some((a) => a.where === s.dataset.where)) return;
          const kind = p.animals.at(animals.length);
          const node = button("hg-animal", Y.animals[kind][0]);
          node.append(figure(FIG[kind]));
          const a = { kind, where: null, node };
          node.dataset.kind = kind;
          animals.push(a);
          put(a, s.dataset.where);
          node.classList.add("pop");
          hill.append(node);
          sound.tap();
          if (animals.length === p.animals.length) {
            offs.forEach((off) => off());
            resolve();
          }
        };
        s.addEventListener("click", f);
        return () => s.removeEventListener("click", f);
      });
    });
    await asked;
    hill.classList.remove("offer");
    voice.newTask();
    await wait(600);

    for (const st of p.steps) {
      voice.newTask();
      if (st.ask === "wer") {
        let a = animals.find((x) => x.where === st.where);
        if (!a) {
          a = animals[Math.floor(Math.random() * animals.length)];
          await hop(a, st.where);
        }
        await askTap(Y.wer(Y.at[st.where]), st.skill, animals.map((x) => x.node), (n) => n === a.node);
        continue;
      }
      // "Setz den Hasen unter die Bank!": the place must be free, and the animal somewhere else.
      const there = animals.find((x) => x.where === st.where);
      if (there) await hop(there, free().find((w) => w !== st.where));
      const a = animals[Math.floor(Math.random() * animals.length)];
      hill.classList.add("choosing");
      const targets = free().map((w) => spots[w]);
      a.node.classList.add("asked");
      const right = await askTap(Y.setz(Y.animals[a.kind][1], Y.to[st.where]), st.skill, targets, (n) => n.dataset.where === st.where);
      a.node.classList.remove("asked");
      hill.classList.remove("choosing");
      await hop(a, st.where);
      if (!right) await wait(300);
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
