// The frame every new place of the open Tal shares (apfelbaum.js, bau.js): the top bar with the stars, the
// question and caption, the board, the answers below it, the portals to the two neighbouring places, and the
// parents' table. The skill record is the same at every place (key "offen:<child>"), so a skill learnt at the
// pond counts at the tree too.

import { state } from "../engine/app.js";
import { store } from "../engine/store.js";
import * as profiles from "../engine/profiles.js";
import { shared as T, num, helpers } from "../engine/i18n.js";
import { href } from "../engine/router.js";
import { el, button, dots, wait, shake } from "../engine/ui/parts.js";
import { topbar } from "../engine/ui/topbar.js";
import { voice } from "../engine/ui/voice.js";
import { sound } from "../engine/ui/sound.js";
import * as S from "./skills.js";
import { mountFigures, figure } from "./figures.js";
import { portals } from "./portals.js";

export const w = (n) => helpers.w(n);
export const W = (n) => helpers.big(helpers.w(n));
export const topFor = (n) => (n <= 5 ? 5 : 10);

/** skills: the skills this place asks, in the order the parents' table shows them. */
export function setup(root, { place, X, title, skills }) {
  const key = `offen:${state.kid?.id ?? "guest"}`;
  const rec = S.valid(store.get(key, null));
  const save = () => store.set(key, rec);
  voice.aloud = profiles.readAloud(state.kid, "vorschule");
  mountFigures();

  const starBox = el("span", "offen-stars");
  const starNum = el("b", "", num(rec.stars));
  starBox.append(figure("star"), starNum);
  starBox.setAttribute("aria-label", X.stars);
  root.append(topbar({ back: { href: href.home(), label: T.labels.home, kid: true }, middle: el("h1", "title", title), extra: [starBox] }));
  const question = el("p", "question card");
  question.hidden = true;
  const caption = el("p", "caption");
  caption.setAttribute("aria-live", "polite");
  const board = el("div", "board offen");
  const scene = el("div", `offen-scene scene-${place} card`);
  const below = el("div", "offen-below");
  board.append(scene, below);
  const parents = el("details", "offen-parents card");
  root.append(question, caption, board, portals(place, X.places, X.portals), parents);
  voice.mount({ caption, question });

  function flyStar(total) {
    const from = scene.getBoundingClientRect();
    const to = starBox.getBoundingClientRect();
    const star = el("span", "offen-fly");
    star.append(figure("star"));
    star.setAttribute("aria-hidden", "true");
    const x0 = from.left + from.width / 2 - 30;
    const y0 = from.top + from.height / 2 - 30;
    star.style.transform = `translate(${x0}px, ${y0}px) scale(0.2)`;
    document.body.append(star);
    const land = () => {
      star.remove();
      starNum.textContent = num(total);
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return land();
    requestAnimationFrame(() => {
      star.style.transform = `translate(${x0}px, ${y0}px) scale(1.4)`;
      setTimeout(() => {
        star.classList.add("going");
        star.style.transform = `translate(${to.left + 4}px, ${to.top - 6}px) scale(0.55)`;
      }, 380);
    });
    setTimeout(land, 1250);
  }

  function drawParents() {
    const P = X.parents;
    parents.replaceChildren(el("summary", "", P.title), el("p", "offen-note", P.note));
    const table = el("table", "offen-table");
    const head = el("tr");
    for (const h of P.head) head.append(el("th", "", h));
    table.append(head);
    for (const r of S.report(rec).filter((r) => skills.includes(r.id))) {
      const tr = el("tr", `st-${r.stand}`);
      tr.append(el("td", "", P.skills[r.id]), el("td", "", num(r.right)), el("td", "", num(r.wrong)), el("td", "", r.lastN ? P.of(num(r.lastRight), num(r.lastN)) : "–"), el("td", "", P.stands[r.stand]));
      table.append(tr);
    }
    parents.append(table);
  }
  drawParents();

  const count = (skill, right) => {
    S.answer(rec, skill, right);
    save();
    if (right) flyStar(rec.stars);
    else starNum.textContent = num(rec.stars);
    drawParents();
  };

  const signButton = (cls, label, sign) => {
    const b = button(cls, label);
    b.append(figure(sign, "btn-sign"));
    return b;
  };

  /** Number buttons 0 to top, each with its digit and dots. */
  const choose = (top) =>
    new Promise((resolve) => {
      below.replaceChildren();
      const box = el("div", "answers strip");
      for (let o = 0; o <= top; o++) {
        const b = button("btn num-btn", w(o));
        b.append(el("b", "", num(o)), dots(o));
        b.addEventListener("click", () => resolve({ value: o, node: b }));
        box.append(b);
      }
      below.append(box);
    });

  /** Ask a number; counts the answer for the skill. Returns whether it was right. */
  async function askNumber(text, skill, truth, top = topFor(truth)) {
    await voice.ask(text, true, true);
    const { value, node } = await choose(top);
    below.replaceChildren();
    const right = value === truth;
    if (right) sound.right();
    else {
      sound.wrong();
      shake(node);
    }
    count(skill, right);
    await voice.tell(right ? X.right : X.wrong);
    return right;
  }

  /** The Fertig button (a tick); resolves when tapped. */
  const done = () =>
    new Promise((resolve) => {
      const b = signButton("btn ok offen-done", X.done, "ok");
      below.replaceChildren(b);
      b.addEventListener("click", () => {
        below.replaceChildren();
        resolve();
      });
    });

  /** The Weiter button (an arrow); resolves when tapped. */
  const onward = () =>
    new Promise((resolve) => {
      const b = signButton("btn go offen-next", X.next, "next");
      below.replaceChildren(b);
      b.addEventListener("click", () => {
        below.replaceChildren();
        resolve();
      });
    });

  /** The owl counts along: each node lights up with its number. */
  async function countAlong(nodes, pause = 500) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].classList.add("counted");
      nodes[i].dataset.n = num(i + 1);
      await Promise.all([voice.tell(W(i + 1)), wait(pause)]);
    }
  }

  return { rec, count, scene, below, caption, askNumber, done, onward, countAlong, signButton };
}
