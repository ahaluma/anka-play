// The puddle of the open Tal (#/pfuetze): look closely, remember a picture. Things stand at the edge and their
// mirror image lies in the puddle. The child taps the water and it ripples: nothing to get wrong. A leaf drifts
// onto the water and the wind blows it away: "Wo lag das Blatt?" The water wobbles and one thing in the mirror
// changes: "Was ist im Spiegelbild anders?" The plan comes from tal.js.

import { textsIn } from "../engine/i18n.js";
import { el, button, wait } from "../engine/ui/parts.js";
import { voice } from "../engine/ui/voice.js";
import * as P from "./tal.js";
import { figure } from "./figures.js";
import { setup } from "./scene.js";

export async function render(root) {
  const X = await textsIn(new URL("./lang/", import.meta.url));
  const Y = X.pfuetze;
  const S = setup(root, { place: "pfuetze", X, title: Y.title, skills: P.SKILLS_AT.pfuetze });
  const { rec, scene, askTap, tapTimes, onward } = S;

  const edge = el("div", "pf-edge");
  const water = el("div", "pf-water");
  const mirror = el("div", "pf-mirror");
  const spots = el("div", "pf-spots");
  water.append(mirror, spots);
  scene.append(edge, water);

  const thing = (kind, tap = false) => {
    const t = tap ? button(`pf-thing t-${kind}`, Y.things[kind]) : el("span", `pf-thing t-${kind}`);
    t.dataset.item = kind;
    t.append(figure(kind));
    return t;
  };
  const ripple = () => {
    water.classList.remove("ripple");
    void water.offsetWidth;
    water.classList.add("ripple");
  };

  async function event() {
    voice.newTask();
    const p = P.pfuetze(rec);
    scene.classList.remove("bye");
    edge.replaceChildren(...p.things.map((k) => thing(k)));
    const mirrored = p.things.map((k) => thing(k, true));
    mirror.replaceChildren(...mirrored);
    spots.replaceChildren();
    spots.classList.toggle("nine", p.spots === 9);
    const spotNodes = [...Array(p.spots).keys()].map((i) => {
      const s = button("pf-spot", Y.spot);
      s.dataset.at = i;
      spots.append(s);
      return s;
    });
    // The free action: every tap on the water makes it ripple.
    await tapTimes(Y.drop, water, 3, () => ripple());
    await wait(500);

    for (const st of p.steps) {
      voice.newTask();
      if (st.ask === "blatt") {
        // A leaf drifts down onto one place, stays a moment, and the wind blows it away.
        const leaf = el("span", "pf-leaf pop");
        leaf.append(figure("blatt"));
        spotNodes.at(p.leaf).append(leaf);
        await wait(2200);
        leaf.classList.add("blown");
        await wait(700);
        leaf.remove();
        spots.classList.add("open");
        await askTap(Y.blatt, st.skill, spotNodes, (n) => Number(n.dataset.at) === p.leaf);
        spots.classList.remove("open");
        continue;
      }
      // The water wobbles, and one thing in the mirror is different afterwards.
      ripple();
      await wait(350);
      const was = mirrored.at(st.at);
      const kind = was.dataset.item;
      let changed;
      if (st.change === "farbe") {
        changed = thing(kind, true);
        changed.classList.add("other");
      } else changed = thing(P.RAND.find((k) => !p.things.includes(k)) ?? kind, true);
      changed.dataset.changed = "1";
      was.replaceWith(changed);
      mirrored[st.at] = changed;
      await wait(700);
      await askTap(Y.spiegel, st.skill, mirrored, (n) => n.dataset.changed === "1");
      // The water settles: the mirror shows the things again as they are.
      ripple();
      await wait(350);
      const back = thing(kind, true);
      changed.replaceWith(back);
      mirrored[st.at] = back;
      await wait(500);
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
