// The stream of the open Tal (#/bach): shapes and sizes. The child taps the water and the stream washes stones
// ashore, one per tap: nothing to get wrong. "Zeig mir das Dreieck!" Later shapes turned, big and small: "Wo ist
// noch ein Dreieck?" Sticks, a pumpkin and pebbles come with the water: "Welcher Stock ist länger?" "Was ist
// schwerer?" "Welcher Turm ist höher?" "Leg die Stöcke vom kurzen zum langen!" The plan comes from tal.js.

import { textsIn } from "../engine/i18n.js";
import { el, button, wait, shake } from "../engine/ui/parts.js";
import { voice } from "../engine/ui/voice.js";
import { sound } from "../engine/ui/sound.js";
import * as P from "./tal.js";
import { figure } from "./figures.js";
import { setup } from "./scene.js";

export async function render(root) {
  const X = await textsIn(new URL("./lang/", import.meta.url));
  const Y = X.bach;
  const S = setup(root, { place: "bach", X, title: Y.title, skills: P.SKILLS_AT.bach });
  const { rec, count, scene, below, askTap, cards, tapTimes, onward } = S;

  const water = el("div", "bach-water");
  const bank = el("div", "bach-bank");
  scene.append(water, bank);

  const stone = (form, tap = true, style = "") => {
    const s = tap ? button(`bach-stone f-${form}`, Y.names[form]) : el("span", `bach-stone f-${form}`);
    s.dataset.item = form;
    const f = figure(form);
    if (style) f.style.transform = style;
    s.append(f);
    return s;
  };
  const stick = (len, i) => {
    const s = button("bach-stick", Y.stick);
    s.dataset.len = len;
    s.dataset.at = i;
    s.style.setProperty("--len", len);
    s.append(el("span", "bach-wood"));
    return s;
  };
  const clearBank = async () => {
    if (!bank.children.length) return;
    bank.classList.add("away");
    await wait(450);
    bank.classList.remove("away");
    bank.replaceChildren();
  };
  const turned = () => {
    const r = [0, 30, 45, 90, 135, 200][Math.floor(Math.random() * 6)];
    const k = [0.6, 0.8, 1, 1][Math.floor(Math.random() * 4)];
    return `rotate(${r}deg) scale(${k})`;
  };

  async function event() {
    voice.newTask();
    const p = P.bach(rec);
    scene.classList.remove("bye");
    bank.replaceChildren();
    water.replaceChildren();
    // The free action: every tap on the water washes the next stone ashore.
    const stones = [];
    await tapTimes(Y.wash, water, p.stones.length, (k) => {
      const s = stone(p.stones.at(k));
      s.classList.add("wash");
      bank.append(s);
      stones.push(s);
    });
    await wait(500);
    let first = true;

    for (const st of p.steps) {
      voice.newTask();
      if (st.ask === "form") {
        if (!first || !stones.length) {
          await clearBank();
          stones.length = 0;
          for (const f of P.shuffled(Math.random, p.stones)) {
            const s = stone(f);
            s.classList.add("wash");
            bank.append(s);
            stones.push(s);
          }
          await wait(500);
        }
        first = false;
        await askTap(Y.form[st.form], st.skill, stones, (n) => n.dataset.item === st.form);
        continue;
      }
      first = false;
      await clearBank();
      if (st.ask === "noch") {
        // The owl holds one stone in the water; below, the same shape turned or smaller, and two others.
        water.replaceChildren(stone(st.form, false));
        const nodes = cards(st.choices, (f) => {
          const g = figure(f, "turned");
          g.style.transform = turned();
          return g;
        }, (f) => Y.names[f]);
        await askTap(Y.noch[st.form], st.skill, nodes, (n) => n.dataset.item === st.form);
        below.replaceChildren();
        water.replaceChildren();
      } else if (st.ask === "stock") {
        const two = P.shuffled(Math.random, [st.a, st.b]).map((len, i) => stick(len, i));
        const pile = el("div", "bach-sticks");
        pile.append(...two);
        bank.append(pile);
        await wait(400);
        const best = st.more ? Math.max(st.a, st.b) : Math.min(st.a, st.b);
        await askTap(st.more ? Y.laenger : Y.kuerzer, st.skill, two, (n) => Number(n.dataset.len) === best);
      } else if (st.ask === "waage") {
        // The scale tips towards the heavier side: the pumpkin.
        const left = Math.random() < 0.5;
        const scale = el("div", `bach-scale ${left ? "down-l" : "down-r"}`);
        const beam = el("div", "bach-beam");
        const pans = ["l", "r"].map((side) => {
          const heavy = side === "l" ? left : !left;
          const b = button(`bach-pan ${side}`, Y.things[heavy ? "kuerbis" : "kiesel"]);
          b.dataset.heavy = heavy ? "1" : "";
          b.append(figure(heavy ? "kuerbis" : "kiesel"));
          beam.append(b);
          return b;
        });
        scale.append(beam, el("span", "bach-post"));
        bank.append(scale);
        await wait(500);
        await askTap(st.more ? Y.schwerer : Y.leichter, st.skill, pans, (n) => !!n.dataset.heavy === st.more);
      } else if (st.ask === "turm") {
        const a = 2 + Math.floor(Math.random() * 4);
        const b = a + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 2));
        const towers = [a, Math.max(1, b)].map((h) => {
          const t = button("bach-tower", Y.tower);
          t.dataset.h = h;
          for (let i = 0; i < h; i++) t.append(el("span", "bach-pebble"));
          return t;
        });
        const row = el("div", "bach-towers");
        row.append(...towers);
        bank.append(row);
        await wait(400);
        const hs = towers.map((t) => Number(t.dataset.h));
        const best = st.more ? Math.max(...hs) : Math.min(...hs);
        await askTap(st.more ? Y.hoeher : Y.niedriger, st.skill, towers, (n) => Number(n.dataset.h) === best);
      } else {
        await ordnen(st);
      }
    }

    voice.newTask();
    scene.classList.add("bye");
    await wait(600);
    await onward();
    return event();
  }

  /** "Leg die Stöcke vom kurzen zum langen!": three sticks, tapped in order. One answer for the skill. */
  async function ordnen(st) {
    const lens = P.shuffled(Math.random, [3, 5, 8]);
    const sticks = lens.map((len, i) => stick(len, i));
    const pile = el("div", "bach-sticks");
    pile.append(...sticks);
    const line = el("div", "bach-line");
    bank.append(pile, line);
    await voice.ask(Y.ordnen, true, true);
    const sorted = [...lens].sort((a, b) => a - b);
    let right = true;
    for (let i = 0; i < 3; i++) {
      const node = await new Promise((resolve) => {
        const left = sticks.filter((s) => s.parentNode === pile);
        const offs = left.map((s) => {
          const f = () => {
            if (document.body.classList.contains("listening")) return;
            offs.forEach((off) => off());
            resolve(s);
          };
          s.classList.add("choosable");
          s.addEventListener("click", f);
          return () => {
            s.removeEventListener("click", f);
            s.classList.remove("choosable");
          };
        });
      });
      if (Number(node.dataset.len) !== sorted.at(i)) {
        right = false;
        shake(node);
        break;
      }
      sound.tap();
      line.append(node);
    }
    if (right) sound.right();
    else sound.wrong();
    count(st.skill, right);
    await voice.tell(right ? X.right : X.wrong);
    if (!right) {
      // The owl lays them in order.
      for (const len of sorted) {
        const s = sticks.find((x) => Number(x.dataset.len) === len);
        if (s.parentNode !== line) {
          line.append(s);
          sound.tap();
          await wait(450);
        }
      }
      await wait(600);
    }
  }

  event().catch(() => {});
  return () => {
    voice.clear();
    document.querySelectorAll(".offen-fly").forEach((g) => g.remove());
  };
}
