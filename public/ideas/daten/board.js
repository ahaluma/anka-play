// The boards of the idea "daten": tally lists (four strokes and one across, five in a bundle), charts with
// pictures or bars and a scale, the bag of balls and the dice. The bag and the weather chart are the sunny rock's
// boards (ideas/zeit), moved here with their sentences. Interface of the ported boards (engine/ui/ported.js).

import { port, el, button, shake, numpad, judge } from "../../engine/ui/ported.js";
import { EVENTS } from "./tasks.js";
import { myOwl } from "../../engine/ui/owl.js";

let current = null;
function pad(box, ctx, digits, onCheck) {
  current?.remove();
  current = numpad(box, ctx.T, { digits, onCheck });
  return current;
}

const ANIMAL = { bird: "🐦", duck: "🦆", frog: "🐸", butterfly: "🦋", bee: "🐝" };
const ICON = { sun: "☀️", cloud: "☁️", rain: "🌧️", snow: "❄️" };
const BALL = { red: "#ff5a36", blue: "#2456b8", yellow: "#ffc83a", green: "#12a564" };
const DIE = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const NS = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};

/** Tally marks for n: bundles of five (four strokes, one across), then the rest. */
function tally(n) {
  const box = el("span", "tally-marks");
  for (let i = 0; i < Math.floor(n / 5); i++) {
    const s = svgEl("svg", { viewBox: "0 0 40 36", class: "tally-five" });
    for (let k = 0; k < 4; k++) s.append(svgEl("line", { x1: 6 + k * 8, y1: 4, x2: 6 + k * 8, y2: 32 }));
    s.append(svgEl("line", { x1: 1, y1: 28, x2: 37, y2: 8 }));
    box.append(s);
  }
  const rest = n % 5;
  if (rest) {
    const s = svgEl("svg", { viewBox: `0 0 ${rest * 8 + 4} 36`, class: "tally-rest" });
    s.style.width = `${rest * 8 + 4}px`;
    for (let k = 0; k < rest; k++) s.append(svgEl("line", { x1: 6 + k * 8, y1: 4, x2: 6 + k * 8, y2: 32 }));
    box.append(s);
  }
  return box;
}

/** A chart: one row per kind, a bar of cells (one cell = `step`), the scale below. `pictures`: icons, no scale. */
function chart(ctx, counts, { step = 1, max = 20, pictures = false, icons = ANIMAL, onChange = null } = {}) {
  const box = el("div", "dchart" + (pictures ? " pics" : ""));
  box.style.setProperty("--cells", max / step);
  const rows = {};
  for (const [k, n] of Object.entries(counts)) {
    const row = el("div", "dchart-row");
    row.append(el("span", "dchart-key", icons[k]));
    const bar = el("span", "dchart-bar");
    const set = (v) => {
      bar.replaceChildren();
      for (let i = 0; i < v / step; i++) bar.append(el("span", pictures ? "dchart-pic" : "dchart-cell", pictures ? icons[k] : ""));
    };
    set(n);
    row.append(bar);
    if (onChange) {
      const minus = button("btn dchart-btn", "−", "−");
      const plus = button("btn dchart-btn", "+", "+");
      minus.addEventListener("click", () => onChange(k, -step, set));
      plus.addEventListener("click", () => onChange(k, step, set));
      row.append(minus, plus);
    }
    rows[k] = { row, set };
    box.append(row);
  }
  if (!pictures) {
    const axis = el("div", "dchart-axis");
    for (let v = 0; v <= max; v += step * (max / step > 10 ? 2 : 1)) {
      const s = el("span", "", ctx.num(v));
      s.style.left = `${(100 * v) / max}%`;
      axis.append(s);
    }
    box.append(axis);
  }
  return { box, rows };
}

// ---------- Sehen: a tally list

export function sehen(host, t, ctx) {
  const S = ctx.T.daten;
  const scene = el("div", "scene card data-scene");
  const list = el("div", "tally-list");
  for (const [k, n] of Object.entries(t.counts)) {
    const row = el("div", "tally-row" + (k === t.ask ? " on" : ""));
    row.append(el("span", "dchart-key", ANIMAL[k]), tally(n));
    list.append(row);
  }
  scene.append(el("p", "chart-title", S.title), list);
  let locked = false;
  const padBox = el("div");
  const p = pad(padBox, ctx, 2, (n) => {
    if (locked) return false;
    if (n !== t.answer) {
      p.clear();
      ctx.miss(S.sehen.miss);
      return false;
    }
    locked = true;
    p.show(n);
    p.lock(true);
    ctx.solved(S.sehen.done(S.animals[t.ask].many, ctx.num(n)));
    return true;
  });
  host.append(scene, padBox);
  ctx.tell(S.sehen.ask(S.animals[t.ask].many));
  return { hint: () => S.sehen.hint };
}

// ---------- Machen: from the tally list to the chart

export function machen(host, t, ctx) {
  const S = ctx.T.daten;
  const scene = el("div", "scene card data-scene");
  const list = el("div", "tally-list small");
  for (const [k, n] of Object.entries(t.counts)) {
    const row = el("div", "tally-row");
    row.append(el("span", "dchart-key", ANIMAL[k]), tally(n));
    list.append(row);
  }
  const have = Object.fromEntries(Object.keys(t.counts).map((k) => [k, 0]));
  let locked = false;
  const c = chart(ctx, have, {
    step: t.step,
    max: t.max,
    pictures: t.max <= 10,
    onChange(k, d, set) {
      if (locked) return;
      have[k] = Math.max(0, Math.min(t.max, have[k] + d));
      set(have[k]);
      ctx.tap();
    },
  });
  scene.append(list, c.box);
  if (t.step > 1) scene.append(el("p", "data-step", S.machen.step(ctx.num(t.step))));
  const check = button("btn ok check-btn", S.machen.check, "✓");
  check.addEventListener("click", () => {
    if (locked) return;
    const wrong = Object.keys(t.counts).find((k) => have[k] !== t.counts[k]);
    if (wrong) {
      shake(check);
      c.rows[wrong].row.classList.add("shake");
      setTimeout(() => c.rows[wrong].row.classList.remove("shake"), 500);
      return ctx.miss(S.machen.miss(S.animals[wrong].many));
    }
    locked = true;
    ctx.solved(S.machen.done);
  });
  host.append(scene, check);
  ctx.tell(t.step > 1 ? S.machen.askStep(ctx.num(t.step)) : S.machen.ask);
  return { hint: () => (t.step > 1 ? S.machen.hintStep(ctx.num(t.step)) : S.machen.hint) };
}

// ---------- Forschen: a bag of balls (from the sunny rock). Take one out, as often as you like, then think.

export function forschen(host, t, ctx) {
  const Z = ctx.T.daten.forschen;
  const scene = el("div", "scene card bag-scene");
  const bag = el("div", "bag");
  const all = [];
  for (const [colour, n] of Object.entries(t.bag)) for (let i = 0; i < n; i++) all.push(colour);
  for (const colour of all) {
    const b = el("span", "ball");
    b.style.background = BALL[colour];
    bag.append(b);
  }
  scene.append(el("span", "bag-icon", "👜"), bag);
  const tallyBox = el("div", "tally");
  const counts = {};
  const draw = button("btn sun draw-btn", Z.draw, `✋ ${Z.draw}`);
  draw.addEventListener("click", () => {
    const c = all[Math.floor(Math.random() * all.length)];
    counts[c] = (counts[c] || 0) + 1;
    ctx.tap();
    tallyBox.innerHTML = "";
    for (const [col, n] of Object.entries(counts)) {
      const chip = el("span", "chip pop");
      const dot = el("i", "ball small");
      dot.style.background = BALL[col];
      chip.append(dot, el("b", "", ctx.num(n)));
      tallyBox.append(chip);
    }
  });
  let locked = false;
  const answers = el("div", "name-row");
  const opts = t.kind === "most" ? [...Object.keys(t.bag), "same"] : ["sure", "maybe", "never"];
  for (const o of opts) {
    const label = t.kind === "most" ? (o === "same" ? Z.same : Z.colours[o]) : Z.chance[o];
    const b = button("btn name-btn", label, "");
    if (t.kind === "most" && o !== "same") {
      const dot = el("i", "ball small");
      dot.style.background = BALL[o];
      b.append(dot);
    }
    b.append(el("span", "", label));
    b.addEventListener("click", () => {
      if (locked) return;
      if (o !== t.answer) {
        shake(b);
        b.disabled = true;
        ctx.miss(t.kind === "most" ? Z.missMost : Z.missChance[o]);
        return;
      }
      locked = true;
      b.classList.add("right");
      ctx.solved(t.kind === "most" ? (o === "same" ? Z.doneSame : Z.doneMost(Z.colours[o])) : Z.doneChance[o](Z.colours[t.colour]));
    });
    answers.append(b);
  }
  host.append(scene, draw, tallyBox, answers);
  ctx.tell(t.kind === "most" ? Z.askMost : Z.askChance(Z.colours[t.colour]));
  return {
    hint() {
      bag.classList.add("sorted");
      [...bag.children].sort((a, b) => a.style.background.localeCompare(b.style.background)).forEach((b) => bag.append(b));
      return t.kind === "most" ? Z.hintMost : Z.hintChance;
    },
  };
}

// ---------- Anwenden: the weather of two weeks as a chart (from the sunny rock); the dice

function weatherChart(ctx, days, scale) {
  const box = el("div", "chart" + (scale ? " scaled" : ""));
  for (const [w, n] of Object.entries(days)) {
    const row = el("div", "chart-row");
    row.append(el("span", "chart-key", ICON[w]));
    const bar = el("span", "chart-bar");
    if (scale) {
      const fill = el("span", "bar-fill");
      fill.style.width = `${(100 * n) / 14}%`;
      bar.append(fill);
    } else for (let i = 0; i < n; i++) bar.append(el("span", "pic", ICON[w]));
    row.append(bar);
    box.append(row);
  }
  if (scale) {
    const axis = el("div", "chart-axis");
    for (let i = 0; i <= 14; i += 2) {
      const s = el("span", "", ctx.num(i));
      s.style.left = `${(100 * i) / 14}%`;
      axis.append(s);
    }
    box.append(axis);
  }
  return box;
}

export function anwenden(host, t, ctx) {
  const Z = ctx.T.daten.anwenden;
  let locked = false;
  const win = (text) => {
    locked = true;
    ctx.solved(text);
  };

  if (t.kind === "dice") {
    const scene = el("div", "scene card data-scene");
    const faces = el("div", "dice-faces");
    const nodes = DIE.map((d) => el("span", "die", d));
    faces.append(...nodes);
    scene.append(faces);
    const row = el("div", "name-row");
    for (const o of ["a", "b", "same"]) {
      const label = o === "same" ? Z.diceSame : Z.events[t[o]];
      const b = button("btn name-btn", label, label);
      b.addEventListener("click", () => {
        if (locked) return;
        if (o !== t.answer) return void (shake(b), (b.disabled = true), ctx.miss(Z.diceMiss));
        b.classList.add("right");
        win(Z.diceDone(Z.events[t.a], ctx.num(EVENTS[t.a].length), Z.events[t.b], ctx.num(EVENTS[t.b].length)));
      });
      row.append(b);
    }
    host.append(scene, row);
    ctx.tell(Z.diceAsk(Z.events[t.a], Z.events[t.b]));
    return {
      hint() {
        EVENTS[t.a].forEach((f) => nodes[f - 1].classList.add("on-a"));
        EVENTS[t.b].forEach((f) => nodes[f - 1].classList.add("on-b"));
        return Z.diceHint;
      },
    };
  }

  const scene = el("div", "scene card chart-scene");
  scene.append(el("p", "chart-title", Z.chartTitle), weatherChart(ctx, t.days, t.range > 1));
  if (t.kind === "most") {
    const row = el("div", "name-row");
    for (const w of Object.keys(t.days)) {
      const b = button("btn name-btn weather-btn", Z.weather[w], ICON[w]);
      b.addEventListener("click", () => {
        if (locked) return;
        if (w !== t.answer) return void (shake(b), (b.disabled = true), ctx.miss(Z.mostMiss));
        b.classList.add("right");
        win(Z.mostDone(Z.weather[w], ctx.word(t.days[w])));
      });
      row.append(b);
    }
    host.append(scene, row);
    ctx.tell(Z.mostAsk);
    return { hint: () => Z.mostHint };
  }
  const hintBox = el("div", "hint-box");
  const padBox = el("div");
  const p = pad(padBox, ctx, 2, (n) => {
    if (locked) return false;
    if (n !== t.answer) {
      p.clear();
      ctx.miss(t.kind === "diff" ? (n === t.days[t.a] + t.days[t.b] ? Z.diffSum : Z.diffMiss) : Z.countMiss);
      return false;
    }
    p.show(n);
    p.lock(true);
    win(t.kind === "diff" ? Z.diffDone(Z.weather[t.a], Z.weather[t.b], ctx.word(n)) : Z.countDone(Z.weather[t.ask], ctx.word(n), n));
    return true;
  });
  host.append(scene, hintBox, padBox);
  ctx.tell(t.kind === "diff" ? Z.diffAsk(Z.weather[t.a], Z.weather[t.b]) : Z.countAsk(Z.weather[t.ask]));
  return {
    hint() {
      if (!hintBox.firstChild && t.range > 1) {
        const row = el("div", "count-row pop");
        for (const w of Object.keys(t.days)) if (t.kind === "count" ? w === t.ask : w === t.a || w === t.b) row.append(el("span", "chip", `${ICON[w]} ${ctx.num(t.days[w])}`));
        hintBox.append(row);
      }
      return t.kind === "diff" ? Z.diffHint : Z.countHint;
    },
  };
}

// ---------- Prüfen: the owl reads the chart

export function pruefen(host, t, ctx) {
  const S = ctx.T.daten;
  const scene = el("div", "scene card owl-scene data-scene");
  const talk = el("div", "talk");
  const bubble = el("div", "bubble", `${ANIMAL[t.ask]} ${ctx.num(t.said)}`);
  talk.append(myOwl(), bubble);
  const c = chart(ctx, t.counts, { step: t.step, max: t.max });
  scene.append(talk, c.box);
  let locked = false;
  const padBox = el("div");
  padBox.hidden = true;
  const box = judge(ctx.T, (yes, b) => {
    if (locked) return;
    if (yes !== t.right) {
      shake(b);
      return ctx.miss(S.pruefen.look);
    }
    if (yes) {
      locked = true;
      return ctx.solved(S.sehen.done(S.animals[t.ask].many, ctx.num(t.answer)));
    }
    box.hidden = true;
    padBox.hidden = false;
    bubble.classList.add("wrong");
    ctx.tap();
    ctx.tell(S.pruefen.fix(S.pruefen.why[t.why], S.animals[t.ask].many), undefined, true);
    const p = pad(padBox, ctx, 2, (n) => {
      if (locked) return false;
      if (n !== t.answer) {
        p.clear();
        ctx.miss(S.pruefen.look);
        return false;
      }
      locked = true;
      p.show(n);
      p.lock(true);
      bubble.textContent = `${ANIMAL[t.ask]} ${ctx.num(n)}`;
      ctx.solved(S.sehen.done(S.animals[t.ask].many, ctx.num(n)));
      return true;
    });
  });
  host.append(scene, box, padBox);
  ctx.tell(S.pruefen.ask(S.animals[t.ask].many, ctx.num(t.said)));
  return {
    hint() {
      c.rows[t.ask].row.classList.add("glow");
      return t.step > 1 ? S.pruefen.hintStep(ctx.num(t.step)) : S.pruefen.hint;
    },
  };
}

export const draw = port({ sehen, machen, forschen, anwenden, pruefen });
