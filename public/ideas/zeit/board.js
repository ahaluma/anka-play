// Ported from think-lab (welt/ideas/zeit/boards.js) with only its imports changed: engine/ui/ported.js gives it
// the round it knew there. The task is what ideas/zeit/tasks.js made.
// The five boards of the idea "Zeit" (clock and calendar): one per perspective. The bag of balls and the weather
// chart moved to the willow (ideas/daten/board.js).
// Same contract as every idea (see ideas/teile/boards.js): board(host, task, ctx) → { hint() }.
// Texts are in welt/lang/<language>.js under "zeit". The clock is SVG drawn here.

import { port, el, button, shake, numpad } from "../../engine/ui/ported.js";
import { myOwl } from "../../engine/ui/owl.js";

const NS = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};

let current = null;
function pad(box, ctx, digits, onCheck) {
  current?.remove();
  current = numpad(box, ctx.T, { digits, onCheck });
  return current;
}


/** "3:05" in the digits of the language. */
const clockText = (ctx, h, m) => `${ctx.num(h)}:${ctx.num(Math.floor(m / 10))}${ctx.num(m % 10)}`;

/** An analogue clock. Returns { svg, set(h, m), numbers(on) }. */
function clock(ctx, h, m, size = 190) {
  const svg = svgEl("svg", { viewBox: "-100 -100 200 200", width: size, height: size, class: "clock-svg" });
  svg.append(svgEl("circle", { r: 92, fill: "#fff", stroke: "#1b2140", "stroke-width": 6 }));
  for (let i = 0; i < 60; i++) {
    const a = (i * 6 * Math.PI) / 180;
    const long = i % 5 === 0;
    svg.append(svgEl("line", { x1: 84 * Math.sin(a), y1: -84 * Math.cos(a), x2: (long ? 74 : 79) * Math.sin(a), y2: -(long ? 74 : 79) * Math.cos(a), stroke: "#1b2140", "stroke-width": long ? 3 : 1.5 }));
  }
  for (let i = 1; i <= 12; i++) {
    const a = (i * 30 * Math.PI) / 180;
    const t = svgEl("text", { x: 60 * Math.sin(a), y: -60 * Math.cos(a) + 7, "text-anchor": "middle", class: "clock-no" });
    t.textContent = ctx.num(i);
    svg.append(t);
  }
  const minutes = svgEl("g", { class: "clock-minutes" });
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180;
    const t = svgEl("text", { x: 104 * Math.sin(a), y: -104 * Math.cos(a) + 5, "text-anchor": "middle", class: "clock-min" });
    t.textContent = ctx.num(i * 5);
    minutes.append(t);
  }
  minutes.style.display = "none";
  svg.append(minutes);
  const hourHand = svgEl("line", { x1: 0, y1: 0, x2: 0, y2: -42, stroke: "#e8488a", "stroke-width": 9, "stroke-linecap": "round", class: "hand" });
  const minHand = svgEl("line", { x1: 0, y1: 0, x2: 0, y2: -70, stroke: "#2456b8", "stroke-width": 5, "stroke-linecap": "round", class: "hand" });
  svg.append(hourHand, minHand, svgEl("circle", { r: 6, fill: "#1b2140" }));
  const set = (hh, mm) => {
    hourHand.setAttribute("transform", `rotate(${((hh % 12) + mm / 60) * 30})`);
    minHand.setAttribute("transform", `rotate(${mm * 6})`);
  };
  set(h, m);
  return { svg, set, minutes: () => (minutes.style.display = "") };
}

/** Buttons with times. onPick(time, button). */
function timeButtons(ctx, list, onPick) {
  const row = el("div", "name-row");
  for (const t of list) {
    const b = button("btn name-btn time-btn", clockText(ctx, t.h, t.m), clockText(ctx, t.h, t.m));
    b.addEventListener("click", () => onPick(t, b));
    row.append(b);
  }
  return row;
}

const isSame = (a, b) => a.h === b.h && a.m === b.m;

// ---------- Sehen: read the clock.

export function sehen(host, t, ctx) {
  const Z = ctx.T.zeit.sehen;
  const scene = el("div", "scene card clock-scene");
  const c = clock(ctx, t.h, t.m);
  scene.append(c.svg);
  let locked = false;
  const row = timeButtons(ctx, t.choices, (x, b) => {
    if (locked) return;
    if (!isSame(x, t)) {
      shake(b);
      b.disabled = true;
      ctx.miss(x.h === (t.m === 0 ? 12 : t.m / 5) && x.m === (t.h % 12) * 5 ? Z.missSwap : Z.miss);
      return;
    }
    locked = true;
    b.classList.add("right");
    ctx.solved(Z.done(clockText(ctx, t.h, t.m)));
  });
  host.append(scene, row);
  ctx.tell(Z.ask);
  return {
    hint() {
      c.minutes();
      return Z.hint;
    },
  };
}

// ---------- Machen: set the clock.

export function machen(host, t, ctx) {
  const Z = ctx.T.zeit.machen;
  let h = t.startH;
  let m = t.startM;
  const goal = el("div", "stellen-goal");
  goal.append(el("b", "", clockText(ctx, t.h, t.m)));
  const scene = el("div", "scene card clock-scene");
  const c = clock(ctx, h, m, 170);
  scene.append(c.svg);
  let locked = false;
  const tools = el("div", "clock-tools");
  const move = (dm) => {
    if (locked) return;
    let total = ((h % 12) * 60 + m + dm + 720) % 720;
    h = Math.floor(total / 60) || 12;
    m = total % 60;
    c.set(h, m);
    ctx.tap();
  };
  const add = (label, text, dm, cls) => {
    const b = button(`btn clock-btn ${cls}`, label, text);
    b.addEventListener("click", () => move(dm));
    tools.append(b);
  };
  add(Z.hourBack, "−1 h", -60, "hour");
  add(Z.hourOn, "+1 h", 60, "hour");
  if (t.step < 60) {
    add(Z.minBack, `−${t.step} min`, -t.step, "min");
    add(Z.minOn, `+${t.step} min`, t.step, "min");
  }
  const check = button("btn ok check-btn", Z.check, "✓");
  check.addEventListener("click", () => {
    if (locked) return;
    if (h !== t.h || m !== t.m) {
      shake(check);
      ctx.miss(m !== t.m ? Z.missMin : Z.missHour);
      return;
    }
    locked = true;
    ctx.solved(Z.done(clockText(ctx, t.h, t.m)));
  });
  host.append(goal, scene, tools, check);
  ctx.tell(Z.question(clockText(ctx, t.h, t.m)));
  return {
    hint() {
      c.minutes();
      return t.m >= 30 && t.m > 0 ? Z.hintHalf : Z.hint;
    },
  };
}

// ---------- Forschen: how long from one time to the other? Two clocks.

export function forschen(host, t, ctx) {
  const Z = ctx.T.zeit.forschen;
  const scene = el("div", "scene card clock-scene two-clocks");
  const a = clock(ctx, t.from.h, t.from.m, 140);
  const b = clock(ctx, t.to.h, t.to.m, 140);
  const box = (label, c, time) => {
    const d = el("div", "clock-half");
    d.append(el("b", "", label), c.svg, el("span", "clock-text", clockText(ctx, time.h, time.m)));
    return d;
  };
  scene.append(box(Z.from, a, t.from), box(Z.to, b, t.to));
  let locked = false;
  const padBox = el("div");
  const p = pad(padBox, ctx, 3, (n) => {
    if (locked) return false;
    if (n !== t.answer) {
      p.clear();
      ctx.miss(t.unit === "min" && n === t.answer / 60 ? Z.inMinutes : Z.miss);
      return false;
    }
    p.show(n);
    p.lock(true);
    locked = true;
    ctx.solved(Z.done(clockText(ctx, t.from.h, t.from.m), clockText(ctx, t.to.h, t.to.m), ctx.num(n), t.unit));
    return true;
  });
  host.append(scene, el("p", "size-unit", Z.unit[t.unit]), padBox);
  ctx.tell(Z.ask(clockText(ctx, t.from.h, t.from.m), clockText(ctx, t.to.h, t.to.m), t.unit));
  return {
    hint() {
      a.minutes();
      b.minutes();
      return t.unit === "h" ? Z.hintHours : t.range === 2 ? Z.hintQuarter : Z.hintFive;
    },
  };
}

// ---------- Anwenden: the clock and the calendar: in n hours, in n days, in n months, days of a month.

export function anwenden(host, t, ctx) {
  const Z = ctx.T.zeit.anwenden;
  let locked = false;
  const win = (text) => {
    locked = true;
    ctx.solved(text);
  };

  if (t.kind === "month" || t.kind === "monthDays") {
    const scene = el("div", "scene card week-scene");
    const year = el("div", "week months");
    Z.monthShort.forEach((m, i) => year.append(el("span", i === t.month ? "day today" : "day", m)));
    scene.append(year);
    if (t.kind === "monthDays") {
      const row = el("div", "name-row");
      for (const n of [28, 30, 31]) {
        const b = button("btn name-btn", ctx.num(n), ctx.num(n));
        b.addEventListener("click", () => {
          if (locked) return;
          if (n !== t.answer) return void (shake(b), (b.disabled = true), ctx.miss(Z.monthDaysMiss));
          b.classList.add("right");
          win(Z.monthDaysDone(Z.months[t.month], ctx.num(n)));
        });
        row.append(b);
      }
      host.append(scene, row);
      ctx.tell(Z.monthDaysAsk(Z.months[t.month]));
      return { hint: () => Z.monthDaysHint };
    }
    const row = el("div", "name-row days-row");
    Z.months.forEach((m, i) => {
      const b = button("btn name-btn", m, Z.monthShort[i]);
      b.addEventListener("click", () => {
        if (locked) return;
        if (i !== t.answer) return void (shake(b), (b.disabled = true), ctx.miss(Z.monthMiss));
        b.classList.add("right");
        win(Z.monthDone(m));
      });
      row.append(b);
    });
    host.append(scene, row);
    ctx.tell(Z.monthAsk(Z.months[t.month], ctx.num(t.add), t.add));
    return {
      hint() {
        [...year.children].forEach((s, i) => {
          const k = (i - t.month + 12) % 12;
          if (k > 0 && k <= t.add) s.append(el("small", "pop", `+${ctx.num(k)}`));
        });
        return Z.monthHint;
      },
    };
  }

  if (t.kind === "day") {
    const scene = el("div", "scene card week-scene");
    const week = el("div", "week");
    Z.days.forEach((d, i) => week.append(el("span", i === t.today ? "day today" : "day", Z.short[i])));
    scene.append(week);
    const row = el("div", "name-row days-row");
    Z.days.forEach((d, i) => {
      const b = button("btn name-btn", d, d);
      b.addEventListener("click", () => {
        if (locked) return;
        if (i !== t.answer) return void (shake(b), (b.disabled = true), ctx.miss(Z.dayMiss));
        b.classList.add("right");
        win(Z.dayDone(Z.days[t.today], ctx.word(t.add), d));
      });
      row.append(b);
    });
    host.append(scene, row);
    ctx.tell(Z.dayAsk(Z.days[t.today], ctx.word(t.add), t.add));
    return {
      hint() {
        [...week.children].forEach((s, i) => {
          const k = (i - t.today + 7) % 7;
          if (k > 0 && k <= t.add) s.append(el("small", "pop", `+${ctx.num(k)}`));
        });
        return Z.dayHint;
      },
    };
  }

  const scene = el("div", "scene card clock-scene");
  const c = clock(ctx, t.h, 0, 170);
  scene.append(c.svg);
  const padBox = el("div");
  const p = pad(padBox, ctx, 2, (n) => {
    if (locked) return false;
    if (n !== t.answer) {
      p.clear();
      ctx.miss(n === t.h + t.add ? Z.laterOver : Z.laterMiss);
      return false;
    }
    p.show(n);
    p.lock(true);
    c.set(t.answer, 0);
    win(Z.laterDone(ctx.word(t.answer)));
    return true;
  });
  host.append(scene, padBox);
  ctx.tell(Z.laterAsk(ctx.word(t.h), ctx.word(t.add), t.add));
  return { hint: () => Z.laterHint };
}

// ---------- Prüfen: the owl reads the clock.

export function pruefen(host, t, ctx) {
  const { T } = ctx;
  const Z = T.zeit.pruefen;
  let locked = false;
  const scene = el("div", "scene card owl-scene");
  const talk = el("div", "talk");
  const bubble = el("div", "bubble", clockText(ctx, t.said.h, t.said.m));
  talk.append(myOwl(), bubble);
  const c = clock(ctx, t.h, t.m, 160);
  scene.append(talk, c.svg);
  const judge = el("div", "judge");
  const yes = button("btn ok judge-btn", T.pruefen.yes, "✓");
  const no = button("btn go judge-btn", T.pruefen.no, "✗");
  judge.append(yes, no);
  const fixer = timeButtons(ctx, t.choices, (x, b) => {
    if (locked) return;
    if (!isSame(x, t)) return void (shake(b), (b.disabled = true), ctx.miss(Z.fixMiss));
    locked = true;
    b.classList.add("right");
    bubble.textContent = clockText(ctx, t.h, t.m);
    ctx.solved(Z.fixed(clockText(ctx, t.h, t.m)));
  });
  fixer.hidden = true;
  yes.addEventListener("click", () => {
    if (locked) return;
    if (!t.right) return void (shake(yes), ctx.miss(Z.lookAgain));
    locked = true;
    ctx.solved(Z.right(clockText(ctx, t.h, t.m)));
  });
  no.addEventListener("click", () => {
    if (locked) return;
    if (t.right) return void (shake(no), ctx.miss(Z.lookAgain));
    judge.hidden = true;
    fixer.hidden = false;
    bubble.classList.add("wrong");
    ctx.tap();
    ctx.tell(Z.fix);
  });
  host.append(scene, judge, fixer);
  ctx.tell(Z.question(clockText(ctx, t.said.h, t.said.m)));
  return {
    hint() {
      c.minutes();
      return Z.hint;
    },
  };
}

export const draw = port({ sehen, machen, forschen, anwenden, pruefen });
