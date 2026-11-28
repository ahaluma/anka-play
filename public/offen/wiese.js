// The meadow of the open Tal (#/wiese): the number line and counting beyond ten. The child taps the meadow and
// the stepping stones lie down in order, one per tap (pale places show how many still come): nothing to get
// wrong. Then a butterfly sits on a stone and hides its number: "Welche Zahl kommt nach sechs?" Or butterflies
// land on the grass, in rows of five: "Wie viele Schmetterlinge?" (up to 20 once counting to 10 was sicher).
// The plan comes from tal.js.

import { textsIn, num } from "../engine/i18n.js";
import { el, wait } from "../engine/ui/parts.js";
import { voice } from "../engine/ui/voice.js";
import { sound } from "../engine/ui/sound.js";
import * as P from "./tal.js";
import { figure } from "./figures.js";
import { setup, w, topFor } from "./scene.js";

export async function render(root) {
  const X = await textsIn(new URL("./lang/", import.meta.url));
  const Y = X.wiese;
  const S = setup(root, { place: "wiese", X, title: Y.title, skills: P.SKILLS_AT.wiese });
  const { rec, scene, askNumber, tapTimes, onward, countAlong } = S;

  const path = el("div", "wiese-path");
  const grass = el("div", "wiese-grass");
  scene.append(path, grass);

  async function event() {
    voice.newTask();
    const p = P.wiese(rec);
    scene.classList.remove("bye");
    grass.replaceChildren();
    path.replaceChildren();
    path.classList.toggle("ten", p.top === 10);
    const stones = [];
    for (let i = 1; i <= p.top; i++) {
      const s = el("span", "wiese-stone bud");
      s.setAttribute("aria-label", Y.stone(i));
      path.append(s);
      stones.push(s);
    }
    // The free action: every tap lays the next stone of the path.
    await tapTimes(Y.lay, scene, p.top, (k) => {
      const s = stones.at(k);
      s.classList.remove("bud");
      s.classList.add("pop");
      s.textContent = num(k + 1);
    });
    await wait(500);

    for (const st of p.steps) {
      voice.newTask();
      if (st.ask === "falter") {
        grass.replaceChildren();
        const rows = [];
        for (let i = 0; i < st.n; i++) {
          if (i % 5 === 0) rows.push(grass.appendChild(el("div", "wiese-row")));
          const f = el("span", "wiese-falter pop");
          f.append(figure("falter"));
          rows.at(-1).append(f);
          await wait(st.n > 10 ? 70 : 130);
        }
        await wait(300);
        const big = st.n > 10;
        if (!(await askNumber(Y.falter, st.skill, st.n, big ? 20 : topFor(st.n), big ? 10 : 0))) await countAlong([...grass.querySelectorAll(".wiese-falter")], big ? 260 : 450);
        await wait(400);
        grass.classList.add("away");
        await wait(600);
        grass.classList.remove("away");
        grass.replaceChildren();
        continue;
      }
      // A butterfly lands on the stone of the answer and hides its number.
      const hidden = stones.at(st.answer - 1);
      const asked = stones.at(st.at - 1);
      const f = el("span", "wiese-falter on-stone pop");
      f.append(figure("falter"));
      hidden.append(f);
      hidden.classList.add("covered");
      asked.classList.add("asked");
      await wait(500);
      await askNumber(st.ask === "nach" ? Y.nach(w(st.at)) : Y.vor(w(st.at)), st.skill, st.answer, p.top);
      f.classList.add("away");
      await wait(500);
      f.remove();
      hidden.classList.remove("covered");
      hidden.classList.add("asked");
      sound.tap();
      await wait(700);
      asked.classList.remove("asked");
      hidden.classList.remove("asked");
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
