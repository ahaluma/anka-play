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
import { mountFigures, figure } from "./figures.js";
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
  mountFigures();
  const starBox = el("span", "offen-stars");
  const starNum = el("b", "", num(rec.stars));
  starBox.append(figure("star"), starNum);
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
    if (z !== "shore") box.append(figure("pad", "offen-pad"));
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
          const r = el("span", "offen-frog bubble");
          r.append(figure("ring"));
          frogs.append(r);
          continue;
        }
        const movable = (mode === "place" || (mode === "share" && z !== "shore"));
        const f = movable ? button("offen-frog", X.frog) : el("span", "offen-frog");
        f.append(figure("frog"));
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
          ghost = el("span", "offen-ghost");
          ghost.append(figure("frog"));
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
    if (right) flyStar(rec.stars);
    else starNum.textContent = num(rec.stars);
    drawParents();
  };

  /** A right answer: a big star appears over the pond and flies to the stars in the top bar, which then count
   *  one up. So the child sees the reward land (asked for 28.11.). */
  function flyStar(total) {
    const from = pond.getBoundingClientRect();
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
      starBox.classList.remove("pop");
      void starBox.offsetWidth;
      starBox.classList.add("pop");
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
  // Feedback is only "Richtig!" or "Falsch." (decided 28.11.); the stars in the top bar show what was earned.
  const praise = () => voice.tell(X.right);
  const oops = () => voice.tell(X.wrong);

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
      await oops();
      await countAlong(pad);
      showSign(pad);
      await voice.tell(X.countMiss(pad, k, w(k)));
    }
    zone[pad].box.classList.remove("asked");
  }

  /** A number question: the buttons 0 to top. Returns whether it was right; on a miss the owl says "Falsch."
   *  and the caller reveals. */
  async function askNumber(text, skill, truth, top) {
    await voice.ask(text, true, true);
    const { value, node } = await choose(Array.from({ length: top + 1 }, (_, i) => i));
    below.replaceChildren();
    const right = value === truth;
    if (right) sound.right();
    else {
      sound.wrong();
      shake(node);
    }
    count(skill, right);
    await (right ? praise() : oops());
    return right;
  }
  const topFor = (n) => (n <= 5 ? 5 : 10);

  /** "Wie viele sind es insgesamt?" Both pads together; on a miss the owl counts all of them. */
  async function askTotal() {
    const n = at.rot + at.gruen;
    zone.rot.box.classList.add("asked");
    zone.gruen.box.classList.add("asked");
    if (!(await askNumber(X.total, Owl.countSkill(n), n, topFor(n)))) {
      await countAll();
      await voice.tell(X.totalIs(n, w(n)));
    }
    zone.rot.box.classList.remove("asked");
    zone.gruen.box.classList.remove("asked");
  }

  async function countAll() {
    const frogs = [...zone.gruen.frogs.children, ...zone.rot.frogs.children];
    for (let i = 0; i < frogs.length; i++) {
      frogs[i].classList.add("counted");
      frogs[i].dataset.n = num(i + 1);
      await Promise.all([voice.tell(W(i + 1)), wait(450)]);
    }
  }

  /** One more or one fewer: the pad's number is shown, a frog hops on or jumps off, "Wie viele sind es jetzt?" */
  async function askOne(pad, more) {
    showSign(pad);
    zone[pad].box.classList.add("asked");
    await wait(600);
    at[pad] += more ? 1 : -1;
    signs[pad].textContent = "?";
    signs[pad].classList.remove("known");
    sound.tap();
    draw();
    const frogs = zone[pad].frogs.children;
    if (more && frogs.length) frogs[frogs.length - 1].classList.add("pop");
    await voice.tell(more ? X.hopOn(pad) : X.hopOff(pad));
    const k = at[pad];
    if (!(await askNumber(X.now, more ? "dazu" : "weg", k, topFor(Math.max(k, k + (more ? 0 : 1)))))) {
      await countAlong(pad);
    }
    showSign(pad);
    zone[pad].box.classList.remove("asked");
  }

  // The frogs grumble once per event before the first comparing question; when both pads hold the same, they
  // only joke.
  let grumbled = false;
  async function grumble() {
    if (grumbled) return;
    grumbled = true;
    const a = at.rot;
    const b = at.gruen;
    const full = a === b ? pick(["rot", "gruen"]) : a > b ? "rot" : "gruen";
    zone[full].box.classList.add("grumble");
    await voice.tell(X.grumble);
    zone[full].box.classList.remove("grumble");
  }

  /** The owl explains with both numbers shown. */
  async function explain(word) {
    showSign("rot");
    showSign("gruen");
    const a = at.rot;
    const b = at.gruen;
    if (a === b) return voice.tell(X.sameMiss(a, w(a)));
    const big = a > b ? "rot" : "gruen";
    const pad = word === "weniger" ? OTHER[big] : big;
    await voice.tell(X.diffMiss(pad, at[pad], w(at[pad]), at[OTHER[pad]], w(at[OTHER[pad]]), word ?? "mehr"));
  }

  async function askSame() {
    await grumble();
    await voice.ask(X.same, true, true);
    const { value, node } = await choose(["ja", "nein"], { ja: X.yes, nein: X.no });
    below.replaceChildren();
    const same = at.rot === at.gruen;
    if ((value === "ja") === same) {
      sound.right();
      count("gleich", true);
      await praise();
      if (same) await voice.tell(X.joke);
    } else {
      sound.wrong();
      shake(node);
      count("gleich", false);
      if (same) await explain();
      else {
        showSign("rot");
        showSign("gruen");
        await voice.tell(X.notSame(num(at.rot), num(at.gruen)));
      }
    }
  }

  /** "Zeig das Blatt, wo mehr (weniger) Frösche sitzen." word: "mehr" | "weniger" */
  async function askPoint(word) {
    await grumble();
    await voice.ask(X.point(word), true, true);
    mode = "pick";
    draw();
    const pad = await new Promise((resolve) => (onPad = resolve));
    onPad = null;
    mode = "wait";
    draw();
    const big = at.rot > at.gruen ? "rot" : "gruen";
    const truth = word === "mehr" ? big : OTHER[big];
    if (pad === truth) {
      sound.right();
      count(word, true);
      zone[pad].box.classList.add("asked");
      await praise();
      zone[pad].box.classList.remove("asked");
    } else {
      sound.wrong();
      shake(zone[pad].box);
      count(word, false);
      await explain(word);
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
    if (at.rot === at.gruen) {
      sound.right();
      count("umverteilen", true);
      await praise();
    } else {
      sound.wrong();
      count("umverteilen", false);
      await oops();
      showSign("rot");
      showSign("gruen");
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
    }
    // Ask instead of telling: how many sit on each pad now?
    signs.rot.textContent = signs.gruen.textContent = "?";
    signs.rot.classList.remove("known");
    signs.gruen.classList.remove("known");
    const k = at.rot;
    if (!(await askNumber(X.each, Owl.countSkill(k), k, topFor(k)))) await countAlong("rot");
    showSign("rot");
    showSign("gruen");
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
    const right = value === at[pad];
    if (right) sound.right();
    else {
      sound.wrong();
      shake(node);
    }
    count(skill, right);
    hidden = null;
    draw();
    await (right ? praise() : oops());
    if (!right) await countAlong(pad);
    showSign(pad);
  }

  /** "Setz drei Frösche auf die rote Seerose." The child places, then taps Fertig. The other frogs go on the
   *  other pad afterwards. */
  async function makeAmount({ pad, k }) {
    await voice.ask(X.make(pad, k, w(k)), true, true);
    if (!rec.stars) voice.tell(X.how);
    const done = button("btn ok offen-done", X.done, X.done);
    below.replaceChildren(done);
    await new Promise((resolve) => done.addEventListener("click", resolve));
    below.replaceChildren();
    const right = at[pad] === k;
    if (right) sound.right();
    else sound.wrong();
    count("legen", right);
    await (right ? praise() : oops());
    if (!right) {
      // The owl puts it right, one frog at a time, and the child sees the number.
      mode = "wait";
      while (at[pad] !== k) {
        if (at[pad] > k) {
          at[pad]--;
          at.shore++;
        } else if (at.shore) {
          at.shore--;
          at[pad]++;
        } else {
          at[OTHER[pad]]--;
          at[pad]++;
        }
        sound.tap();
        draw();
        await wait(600);
      }
      showSign(pad);
      await voice.tell(X.madeIs(pad, k, w(k)));
      mode = "place";
      draw();
    }
    if (at.shore) await voice.ask(X.rest(OTHER[pad]), true, true);
  }

  // ---- One event, then the next.
  async function event() {
    voice.newTask();
    below.replaceChildren();
    hidden = null;
    selected = null;
    grumbled = false;
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
    const goal = Owl.target(rec, at.shore);
    if (goal) await makeAmount(goal);
    else {
      await voice.ask(X.place, true, true);
      if (!rec.stars) voice.tell(X.how);
    }
    if (at.shore) await new Promise((resolve) => (onMoved = () => at.shore === 0 && resolve()));
    onMoved = () => {};
    mode = "wait";
    draw();
    await wait(400);

    const steps = Owl.steps(rec, at.rot, at.gruen);
    for (const step of steps) {
      voice.newTask();
      if (step.kind === "count") await askCount(step.pad);
      else if (step.kind === "total") await askTotal();
      else if (step.kind === "plus" && at[step.pad] < 10) await askOne(step.pad, true);
      else if (step.kind === "minus" && at[step.pad] > 0) await askOne(step.pad, false);
      else if (step.kind === "same") await askSame();
      else if ((step.kind === "more" || step.kind === "less") && at.rot !== at.gruen) await askPoint(step.kind === "more" ? "mehr" : "weniger");
      else if (step.kind === "share" && at.rot !== at.gruen && (at.rot + at.gruen) % 2 === 0) await askShare();
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
    document.querySelectorAll(".offen-ghost, .offen-fly").forEach((g) => g.remove());
  };
}
