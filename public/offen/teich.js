// The pond of the open Tal (#/offen/teich): the first scene of the concept "Das offene Tal". No round, no
// station: frogs come to the shore, the child sets them on two lily pads, and the owl (owl.js) asks what the
// skills need (skills.js). The frogs live in a simulated world (world.js): every move is an event sent to it,
// the screen draws its state, and the questions of the catalogue (questions.js) read their answers from it. One star for every right answer. The current Tal stays as it is beside it.
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
import * as World from "./world.js";
import { RUNS } from "./runs.js";
import { skillOf, answerOf } from "./questions.js";
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
  root.append(topbar({ back: { href: href.home(), label: T.labels.home, icon: undefined }, middle: el("h1", "title", X.title), extra: [starBox] }));
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
  const world = World.create();
  const at = world.state; // read only: every change is an event sent to the world
  const hop = (from, to) => world.send({ type: "huepf", from, to });
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
  let masked = null; // the pad whose frogs wear their masks: { pad, on } on = invisible behind them
  let onMoved = () => {};
  let onPad = null;

  const draw = () => {
    for (const z of ZONES) {
      const { box, frogs } = zone[z];
      frogs.replaceChildren();
      box.classList.toggle("under", hidden === z);
      if (masked?.pad === z && masked.on) {
        // Invisible: one mask floats over the pad, never one per frog, so nothing gives the number away.
        const m = el("span", "offen-masked");
        m.append(figure("mask"));
        frogs.append(m);
        continue;
      }
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
        if (masked?.pad === z) f.append(figure("mask", "on-frog"));
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
    if (mode === "share" && to === "shore") return;
    if (!hop(from, to)) return;
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

  // ---- Answers under the pond. Buttons carry a sign, not a word (a child who cannot read); the word stays as
  // the label for screen readers.
  const signButton = (cls, label, sign) => {
    const b = button(cls, label);
    b.append(figure(sign, "btn-sign"));
    return b;
  };
  const choose = (options, labels = null) =>
    new Promise((resolve) => {
      below.replaceChildren();
      const box = el("div", labels ? "answers words" : "answers strip");
      for (const o of options) {
        const b = button(labels ? "btn word-btn" : "btn num-btn", labels ? labels[o] : w(o));
        if (labels) b.append(figure(o === "ja" ? "ok" : "no", "btn-sign"));
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
  async function askCount(q, pad) {
    const k = answerOf(q, at, pad);
    const skill = skillOf(q, at, pad);
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
  async function askTotal(q) {
    const n = answerOf(q, at);
    zone.rot.box.classList.add("asked");
    zone.gruen.box.classList.add("asked");
    if (!(await askNumber(X.total, skillOf(q, at), n, topFor(n)))) {
      await countAll();
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
  async function askOne(q, pad) {
    const more = q.id === "einer-dazu";
    showSign(pad);
    const before = at[pad];
    zone[pad].box.classList.add("asked");
    await wait(600);
    if (!more) {
      // The frog jumps off the pad: seen, not told.
      const frogs = zone[pad].frogs.children;
      frogs[frogs.length - 1]?.classList.add("leave");
      await wait(500);
    }
    for (const e of q.events(at, pad)) world.send(e);
    signs[pad].textContent = "?";
    signs[pad].classList.remove("known");
    sound.tap();
    draw();
    const frogs = zone[pad].frogs.children;
    if (more && frogs.length) frogs[frogs.length - 1].classList.add("pop");
    await wait(500);
    const k = answerOf(q, at, pad);
    if (!(await askNumber(X.now(pad), skillOf(q, at, pad), k, q.choices(at, pad)))) {
      await countAlong(pad);
    }
    showSign(pad);
    if ((before === 5 || before === 10) && S.isSure(rec, more ? "dazu" : "weg")) await sayAloud(before, 1, !more);
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
    zone[pad].box.classList.add("asked");
    await voice.tell(X.diffMiss(pad, at[pad], w(at[pad]), at[OTHER[pad]], w(at[OTHER[pad]]), word ?? "mehr"));
    zone[pad].box.classList.remove("asked");
  }

  async function askSame(q) {
    await grumble();
    await voice.ask(X.same, true, true);
    const { value, node } = await choose(["ja", "nein"], { ja: X.yes, nein: X.no });
    below.replaceChildren();
    const same = answerOf(q, at);
    const skill = skillOf(q, at);
    if ((value === "ja") === same) {
      sound.right();
      count(skill, true);
      await praise();
      if (same) await voice.tell(X.joke);
    } else {
      sound.wrong();
      shake(node);
      count(skill, false);
      if (same) await explain();
      else {
        showSign("rot");
        showSign("gruen");
        await wait(1200);
      }
    }
  }

  /** "Zeig das Blatt, wo mehr (weniger) Frösche sitzen." word: "mehr" | "weniger" */
  async function askPoint(q) {
    const word = q.id === "zeig-mehr" ? "mehr" : "weniger";
    const truth = answerOf(q, at);
    const skill = skillOf(q, at);
    await grumble();
    await voice.ask(X.point(word), true, true);
    mode = "pick";
    draw();
    const pad = await new Promise((resolve) => (onPad = resolve));
    onPad = null;
    mode = "wait";
    draw();
    if (pad === truth) {
      sound.right();
      count(skill, true);
      zone[pad].box.classList.add("asked");
      await praise();
      zone[pad].box.classList.remove("asked");
    } else {
      sound.wrong();
      shake(zone[pad].box);
      count(skill, false);
      await explain(word);
    }
  }

  async function askShare(q) {
    const skill = skillOf(q, at);
    await voice.ask(X.share, true, true);
    await voice.tell(X.shareHow);
    mode = "share";
    signs.rot.textContent = signs.gruen.textContent = "?";
    draw();
    const done = signButton("btn ok offen-done", X.done, "ok");
    below.replaceChildren(done);
    await new Promise((resolve) => done.addEventListener("click", resolve));
    mode = "wait";
    selected = null;
    below.replaceChildren();
    draw();
    if (answerOf(q, at)) {
      sound.right();
      count(skill, true);
      await praise();
    } else {
      sound.wrong();
      count(skill, false);
      await oops();
      showSign("rot");
      showSign("gruen");
      // The owl lets one frog hop at a time until it is fair.
      while (at.rot !== at.gruen) {
        const from = at.rot > at.gruen ? "rot" : "gruen";
        hop(from, OTHER[from]);
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
    const k = q.each(at);
    if (!(await askNumber(X.each, Owl.countSkill(k), k, topFor(k)))) await countAlong("rot");
    showSign("rot");
    showSign("gruen");
  }

  /** Now and then, when one pad holds five or ten and the other some more, the owl says the sum aloud:
   *  "Fünf plus zwei ist sieben." The caption shows it in digits, 5 + 2 = 7: heard and seen, not the same twice. */
  async function sumAloud() {
    const full = ["rot", "gruen"].find((p) => at[p] === 5 || at[p] === 10);
    if (!full || !at[OTHER[full]] || !S.isSure(rec, "zaehlen10")) return;
    await sayAloud(at[full], at[OTHER[full]], false);
  }

  /** "Fünf minus eins ist vier." aloud, 5 − 1 = 4 in digits. Plus and minus come in subtly: only from 100 stars
   *  on, only once the child does it with the frogs for sure (one more / one fewer sicher; for 5 + 2, counting to
   *  10 sicher), and then only about 3 times in 10 when it fits. Never asked, never counted. */
  async function sayAloud(a, b, minus, chance = 0.3) {
    if (rec.stars < 100 || Math.random() >= chance) return;
    const c = minus ? a - b : a + b;
    voice.newTask();
    caption.textContent = `${num(a)} ${minus ? "−" : "+"} ${num(b)} = ${num(c)}`;
    await voice.tell(X.sum(w(a), w(b), w(c), minus), false);
    await wait(800);
  }

  /** Now and then (about every fifth comparison) the pad with more frogs wins: applause, confetti in the pond's
   *  colours, "Yeaaah! Rot hat gewonnen!". A joke of the scene, not praise for the child, and no star. */
  async function cheer() {
    if (at.rot === at.gruen || Math.random() >= 0.2) return;
    const pad = at.rot > at.gruen ? "rot" : "gruen";
    zone[pad].box.classList.add("won");
    sound.applause();
    celebrate(36, ["#dca79c", "#86b884", "#f0b232"]);
    await voice.tell(X.won(pad));
    await wait(600);
    zone[pad].box.classList.remove("won");
  }

  /** The frogs on one pad put on their funny masks and are invisible. "Wie viele waren es?" Then masks off. */
  async function askMask(q, pad) {
    const k = answerOf(q, at, pad);
    zone[pad].box.classList.add("asked");
    await voice.tell(X.look(pad));
    await wait(1500);
    masked = { pad, on: false };
    sound.tap();
    draw();
    await wait(500);
    masked.on = true;
    draw();
    zone[pad].box.classList.remove("asked");
    const right = await askNumber(X.masked(pad), skillOf(q, at, pad), k, q.choices(at, pad));
    masked.on = false;
    draw();
    await wait(700);
    masked = null;
    sound.tap();
    draw();
    if (!right) await countAlong(pad);
    showSign(pad);
  }

  async function askPartner(q, shown) {
    const n = world.total;
    const skill = skillOf(q, at, shown);
    const truth = answerOf(q, at, shown);
    const pad = OTHER[shown];
    hidden = pad;
    signs[pad].textContent = "?";
    signs[pad].classList.remove("known");
    showSign(shown);
    draw();
    await wait(800);
    await voice.ask(X.partner(n, shown, at[shown], w(at[shown]), pad), true, true);
    const { value, node } = await choose(Array.from({ length: n + 1 }, (_, i) => i));
    below.replaceChildren();
    const right = value === truth;
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
    const done = signButton("btn ok offen-done", X.done, "ok");
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
        if (at[pad] > k) hop(pad, "shore");
        else if (at.shore) hop("shore", pad);
        else hop(OTHER[pad], pad);
        sound.tap();
        draw();
        await wait(600);
      }
      showSign(pad);
      await wait(600);
      mode = "place";
      draw();
    }
    if (at.shore) await voice.ask(X.rest(OTHER[pad]), true, true);
  }

  /** "Verteil die Frösche gerecht auf die zwei Seerosen." From the shore onto both pads, the same on each; with an
   *  odd number one frog stays on the shore. Then Fertig, and a question about what came out. */
  async function shareOut(withRest) {
    const n = at.shore;
    await voice.ask(withRest ? X.shareOutRest : X.shareOut, true, true);
    if (!rec.stars) voice.tell(X.how);
    const done = signButton("btn ok offen-done", X.done, "ok");
    below.replaceChildren(done);
    await new Promise((resolve) => done.addEventListener("click", resolve));
    below.replaceChildren();
    mode = "wait";
    selected = null;
    draw();
    const half = Math.floor(n / 2);
    const right = at.rot === half && at.gruen === half;
    const skill = "verteilen"; // the frog left over is only to be seen, not practised here
    if (right) sound.right();
    else sound.wrong();
    count(skill, right);
    await (right ? praise() : oops());
    if (!right) {
      // The owl puts it right, one frog at a time: back to the shore what is too many, then onto the pad with fewer.
      const step = async () => {
        sound.tap();
        draw();
        await wait(600);
      };
      for (const p of ["rot", "gruen"])
        while (at[p] > half) {
          hop(p, "shore");
          await step();
        }
      while (at.shore > n - 2 * half) {
        const p = at.rot <= at.gruen ? "rot" : "gruen";
        hop("shore", p);
        await step();
      }
    }
    // Ask instead of telling.
    voice.newTask();
    if (!(await askNumber(X.each, Owl.countSkill(half), half, topFor(half)))) await countAlong("rot");
    showSign("rot");
    showSign("gruen");
    if (withRest) await voice.tell(X.leftIs);
  }

  // ---- One event, then the next.
  async function event() {
    voice.newTask();
    below.replaceChildren();
    hidden = null;
    masked = null;
    selected = null;
    grumbled = false;
    world.send({ type: "platsch" });
    for (const p of ["rot", "gruen"]) {
      signs[p].textContent = "?";
      signs[p].classList.remove("known");
    }
    const plan = Owl.placement(rec);
    world.send({ type: "kommen", n: plan.n });
    mode = "wait";
    draw();
    pond.classList.remove("bye");
    await wait(700);
    mode = "place";
    draw();
    if (plan.kind === "make") await makeAmount(plan);
    else if (plan.kind === "share" || plan.kind === "rest") await shareOut(plan.kind === "rest");
    else {
      await voice.ask(X.place, true, true);
      if (!rec.stars) voice.tell(X.how);
    }
    if (at.shore && plan.kind !== "rest") await new Promise((resolve) => (onMoved = () => at.shore === 0 && resolve()));
    onMoved = () => {};
    mode = "wait";
    draw();
    await wait(400);

    // The questions start with fresh signs: what was shown while placing is not given away.
    for (const p of ["rot", "gruen"]) {
      signs[p].textContent = "?";
      signs[p].classList.remove("known");
    }
    // The GameRun of the pond: the owl picks questions of the catalogue per position, or skips a position. Each
    // is checked again against the world as it is now, since the child's answers and the owl's help change it.
    const ASK = {
      maske: askMask,
      "wie-viele": askCount,
      zusammen: askTotal,
      "gleich-viele": askSame,
      "zeig-mehr": askPoint,
      "zeig-weniger": askPoint,
      "einer-dazu": askOne,
      "einer-weg": askOne,
      "mach-gerecht": askShare,
      partner: askPartner,
    };
    const run = Owl.plan(RUNS.teich, rec, at);
    for (const [i, { q, p }] of run.entries()) {
      voice.newTask();
      if (!q.fits(at, Owl.context(rec))) continue;
      if (q.events && q.form !== "action" && !q.events(at, p).every((e) => World.next(at, e))) continue;
      await ASK[q.id](q, p);
      if (q.position === "vergleichen" && run[i + 1]?.q.position !== "vergleichen") await cheer();
      await wait(300);
    }

    await sumAloud();
    voice.newTask();
    pond.classList.add("bye");
    await wait(900);
    if (rec.stars && rec.stars % 10 === 0) celebrate(40);
    const next = signButton("btn go offen-next", X.next, "next");
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
