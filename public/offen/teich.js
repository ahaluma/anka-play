// The pond of the open Tal (#/offen/teich): the first scene of the concept "Das offene Tal". No round, no
// station: frogs come to the shore, the child sets them on two lily pads, and the owl (owl.js) asks what the
// skills need (skills.js). One star for every right answer. The current Tal stays as it is beside it.
//
// Moving a frog: drag it, or tap it and then tap where it should go. While the voice reads a question, the
// board takes no taps (body.listening, engine/ui/voice.js).

import { state } from "../engine/app.js";
import { store } from "../engine/store.js";
import * as profiles from "../engine/profiles.js";
import { shared as T, textsIn, num, helpers } from "../engine/i18n.js";
import { href } from "../engine/router.js";
import { el, button, dots, wait, shake } from "../engine/ui/parts.js";
import { topbar } from "../engine/ui/topbar.js";
import { voice } from "../engine/ui/voice.js";
import { sound, celebrate } from "../engine/ui/sound.js";
import * as S from "./skills.js";
import * as Owl from "./owl.js";

const FROG = "🐸";
const ZONES = ["gruen", "rot", "shore"];
const OTHER = { rot: "gruen", gruen: "rot" };
const w = (n) => helpers.w(n);
const W = (n) => helpers.big(helpers.w(n));
const pick = (list) => list[Math.floor(Math.random() * list.length)];

export async function render(root) {
  const X = await textsIn(new URL("./lang/", import.meta.url));
  const key = `offen:${state.kid?.id ?? "guest"}`;
  const rec = S.valid(store.get(key, null));
  const save = () => store.set(key, rec);
  voice.aloud = profiles.readAloud(state.kid, "vorschule");

  // ---- The screen: top bar with the stars, question, caption, the pond, the answers, parents' table.
  const starBox = el("span", "offen-stars", `⭐ ${num(rec.stars)}`);
  starBox.setAttribute("aria-label", X.stars);
  root.append(topbar({ back: { href: href.map("tal"), label: T.labels.map, icon: undefined }, middle: el("h1", "title", X.title), extra: [starBox] }));
  const question = el("p", "question card");
  question.hidden = true;
  const caption = el("p", "caption");
  caption.setAttribute("aria-live", "polite");
  const board = el("div", "board offen");
  const pond = el("div", "offen-pond card");
  const water = el("div", "offen-water");
  const shoreBox = el("div", "offen-shore");
  const below = el("div", "offen-below");
  pond.append(water, shoreBox);
  board.append(pond, below);
  const parents = el("details", "offen-parents card");
  root.append(question, caption, board, parents);
  voice.mount({ caption, question });

  // ---- The frogs: how many sit where, and the zones that draw them.
  const at = { rot: 0, gruen: 0, shore: 0 };
  const zone = {};
  const signs = {};
  for (const z of ZONES) {
    const box = el("div", `offen-zone z-${z}`);
    box.dataset.zone = z;
    box.setAttribute("aria-label", X.pads[z]);
    const frogs = el("div", "offen-frogs");
    box.append(frogs);
    if (z !== "shore") {
      signs[z] = el("span", "offen-sign", "?");
      box.append(signs[z]);
      water.append(box);
    } else shoreBox.append(box);
    zone[z] = { box, frogs };
  }

  let mode = "wait"; // wait | place | share | pick (tap a pad to answer) | hidden
  let selected = null; // the zone of the tapped frog
  let hidden = null; // the pad whose frogs dove
  let onMoved = () => {};
  let onPad = null;

  const draw = () => {
    for (const z of ZONES) {
      const { box, frogs } = zone[z];
      frogs.replaceChildren();
      box.classList.toggle("under", hidden === z);
      box.classList.toggle("target", (mode === "place" || mode === "share") && selected !== null && selected !== z && (mode !== "share" || z !== "shore"));
      box.classList.toggle("tappable", mode === "pick" && z !== "shore");
      for (let i = 0; i < at[z]; i++) {
        if (hidden === z) {
          frogs.append(el("span", "offen-frog bubble", "💧"));
          continue;
        }
        const movable = (mode === "place" || (mode === "share" && z !== "shore"));
        const f = movable ? button("offen-frog", X.frog, FROG) : el("span", "offen-frog", FROG);
        if (movable) {
          f.dataset.zone = z;
          if (selected === z && i === at[z] - 1) f.classList.add("lifted");
          grab(f, z);
        }
        frogs.append(f);
      }
    }
  };

  const move = (from, to) => {
    if (from === to || !at[from] || (mode === "share" && to === "shore")) return;
    at[from]--;
    at[to]++;
    selected = null;
    sound.tap();
    draw();
    onMoved();
  };

  // A tap on a frog lifts it; a tap on a zone sets it down there. Dragging does both at once.
  function grab(f, z) {
    f.addEventListener("pointerdown", (e) => {
      if (document.body.classList.contains("listening")) return;
      e.preventDefault();
      const start = { x: e.clientX, y: e.clientY };
      let ghost = null;
      const moveTo = (ev) => {
        if (!ghost && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 10) {
          ghost = el("span", "offen-ghost", FROG);
          document.body.append(ghost);
          f.classList.add("away");
        }
        if (ghost) ghost.style.transform = `translate(${ev.clientX - 24}px, ${ev.clientY - 24}px)`;
      };
      const up = (ev) => {
        removeEventListener("pointermove", moveTo);
        removeEventListener("pointerup", up);
        removeEventListener("pointercancel", up);
        if (!ghost) {
          selected = selected === z ? null : z;
          sound.tap();
          return draw();
        }
        ghost.remove();
        const target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest("[data-zone]")?.dataset.zone;
        f.classList.remove("away");
        if (target && target !== z) move(z, target);
        else draw();
      };
      addEventListener("pointermove", moveTo);
      addEventListener("pointerup", up);
      addEventListener("pointercancel", up);
    });
  }

  for (const z of ZONES)
    zone[z].box.addEventListener("click", (e) => {
      if (mode === "pick" && z !== "shore") return onPad?.(z);
      if (e.target.closest(".offen-frog")) return;
      if (selected && selected !== z) move(selected, z);
    });

  // ---- Answers under the pond.
  const choose = (options, labels = null) =>
    new Promise((resolve) => {
      below.replaceChildren();
      const box = el("div", labels ? "answers words" : "answers strip");
      for (const o of options) {
        const b = button(labels ? "btn word-btn" : "btn num-btn", labels ? labels[o] : w(o));
        if (labels) b.textContent = labels[o];
        else b.append(el("b", "", num(o)), dots(o));
        b.addEventListener("click", () => resolve({ value: o, node: b }));
        box.append(b);
      }
      below.append(box);
    });

  const showSign = (pad) => {
    signs[pad].textContent = num(at[pad]);
    signs[pad].classList.add("known", "pop");
  };

  // ---- Counting what the owl's questions earn.
  const count = (skill, right) => {
    S.answer(rec, skill, right);
    save();
    starBox.textContent = `⭐ ${num(rec.stars)}`;
    if (right) {
      starBox.classList.remove("pop");
      void starBox.offsetWidth;
      starBox.classList.add("pop");
    }
    drawParents();
  };
  const praise = () => voice.tell(pick(T.praise));

  /** The owl counts along: every frog of the pad lights up with its number. */
  async function countAlong(pad) {
    const frogs = [...zone[pad].frogs.children];
    for (let i = 0; i < frogs.length; i++) {
      frogs[i].classList.add("counted");
      frogs[i].dataset.n = num(i + 1);
      await Promise.all([voice.tell(W(i + 1)), wait(500)]);
    }
  }

  // ---- The steps of an event.
  async function askCount(pad) {
    const k = at[pad];
    const skill = Owl.countSkill(k);
    zone[pad].box.classList.add("asked");
    await voice.ask(X.count(pad), true, true);
    const top = skill === "zaehlen5" ? 5 : 10;
    const { value, node } = await choose(Array.from({ length: top + 1 }, (_, i) => i));
    below.replaceChildren();
    if (value === k) {
      sound.right();
      count(skill, true);
      showSign(pad);
      await praise();
    } else {
      sound.wrong();
      shake(node);
      count(skill, false);
      await voice.tell(pick(T.oops));
      await countAlong(pad);
      showSign(pad);
      await voice.tell(X.countMiss(pad, k, w(k)));
    }
    zone[pad].box.classList.remove("asked");
  }

  async function askCompare() {
    const a = at.rot;
    const b = at.gruen;
    const skill = Owl.compareSkill(a, b);
    const full = a === b ? pick(["rot", "gruen"]) : a > b ? "rot" : "gruen";
    zone[full].box.classList.add("grumble");
    await voice.tell(X.grumble);
    zone[full].box.classList.remove("grumble");
    await voice.ask(X.compare, true, true);
    mode = "pick";
    draw();
    const answer = await new Promise((resolve) => {
      onPad = (pad) => resolve(pad);
      choose(["same"], { same: X.same }).then(({ value }) => resolve(value));
    });
    onPad = null;
    mode = "wait";
    below.replaceChildren();
    draw();
    const truth = a === b ? "same" : a > b ? "rot" : "gruen";
    if (answer === truth) {
      sound.right();
      count(skill, true);
      await praise();
      if (truth === "same") await voice.tell(X.compareSame);
    } else {
      sound.wrong();
      count(skill, false);
      showSign("rot");
      showSign("gruen");
      if (truth === "same") await voice.tell(X.compareSameMiss(a, w(a)));
      else await voice.tell(X.compareMiss(truth, at[truth], w(at[truth]), at[OTHER[truth]], w(at[OTHER[truth]])));
    }
  }

  async function askShare() {
    await voice.ask(X.share, true, true);
    await voice.tell(X.shareHow);
    mode = "share";
    signs.rot.textContent = signs.gruen.textContent = "?";
    draw();
    const done = button("btn ok offen-done", X.done, X.done);
    below.replaceChildren(done);
    await new Promise((resolve) => done.addEventListener("click", resolve));
    mode = "wait";
    selected = null;
    below.replaceChildren();
    draw();
    showSign("rot");
    showSign("gruen");
    if (at.rot === at.gruen) {
      sound.right();
      count("umverteilen", true);
      await voice.tell(X.shareRight(at.rot, w(at.rot)));
    } else {
      sound.wrong();
      count("umverteilen", false);
      await voice.tell(X.shareMiss(num(at.rot), num(at.gruen)));
      // The owl lets one frog hop at a time until it is fair.
      while (at.rot !== at.gruen) {
        const from = at.rot > at.gruen ? "rot" : "gruen";
        at[from]--;
        at[OTHER[from]]++;
        sound.tap();
        draw();
        showSign("rot");
        showSign("gruen");
        await wait(700);
      }
      await voice.tell(X.shareRight(at.rot, w(at.rot)));
    }
  }

  async function askPartner(shown) {
    const n = at.rot + at.gruen;
    const skill = Owl.partnerSkill(n);
    const pad = OTHER[shown];
    hidden = pad;
    signs[pad].textContent = "?";
    signs[pad].classList.remove("known");
    showSign(shown);
    draw();
    await voice.tell(X.dive(pad));
    await voice.ask(X.partner(n, shown, at[shown], w(at[shown]), pad), true, true);
    const { value, node } = await choose(Array.from({ length: n + 1 }, (_, i) => i));
    below.replaceChildren();
    hidden = null;
    draw();
    showSign(pad);
    if (value === at[pad]) {
      sound.right();
      count(skill, true);
      await praise();
    } else {
      sound.wrong();
      shake(node);
      count(skill, false);
    }
    await voice.tell(X.partnerMiss(W(at.rot), w(at.gruen), w(n)));
  }

  // ---- One event, then the next.
  async function event() {
    voice.newTask();
    below.replaceChildren();
    hidden = null;
    selected = null;
    at.rot = at.gruen = 0;
    for (const p of ["rot", "gruen"]) {
      signs[p].textContent = "?";
      signs[p].classList.remove("known");
    }
    at.shore = Owl.frogs(rec);
    mode = "wait";
    draw();
    pond.classList.remove("bye");
    await voice.tell(X.arrive(at.shore));
    mode = "place";
    draw();
    await voice.ask(X.place, true, true);
    if (!rec.stars) voice.tell(X.how);
    await new Promise((resolve) => (onMoved = () => at.shore === 0 && resolve()));
    onMoved = () => {};
    mode = "wait";
    draw();
    await wait(400);

    const steps = Owl.steps(rec, at.rot, at.gruen);
    for (const step of steps) {
      voice.newTask();
      if (step.kind === "count") await askCount(step.pad);
      else if (step.kind === "compare") await askCompare();
      else if (step.kind === "share" && at.rot !== at.gruen) await askShare();
      else if (step.kind === "partner" && Owl.partnerSkill(at.rot + at.gruen)) await askPartner(step.shown);
      await wait(300);
    }

    voice.newTask();
    pond.classList.add("bye");
    await voice.tell(X.bye);
    if (rec.stars && rec.stars % 10 === 0) celebrate(40);
    const next = button("btn go offen-next", X.next, X.next);
    below.replaceChildren(next);
    next.addEventListener("click", () => event());
  }

  // ---- For parents: one line per skill.
  function drawParents() {
    const P = X.parents;
    parents.replaceChildren(el("summary", "", P.title), el("p", "offen-note", P.note));
    const table = el("table", "offen-table");
    const head = el("tr");
    for (const h of P.head) head.append(el("th", "", h));
    table.append(head);
    for (const r of S.report(rec)) {
      const tr = el("tr", `st-${r.stand}`);
      tr.append(el("td", "", P.skills[r.id]), el("td", "", num(r.right)), el("td", "", num(r.wrong)), el("td", "", r.lastN ? P.of(num(r.lastRight), num(r.lastN)) : "–"), el("td", "", P.stands[r.stand]));
      table.append(tr);
    }
    parents.append(table);
  }
  drawParents();

  event().catch(() => {});
  return () => {
    voice.clear();
    document.querySelectorAll(".offen-ghost").forEach((g) => g.remove());
  };
}
