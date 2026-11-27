// A round (#/s/wiese/sehen), and the first-visit questions of a station (#/gate/steg), which are a round of
// their own kind. This is the frame every idea shares: the steps in the top bar, the question box and the
// voice, the answer part, misses and the help ladder, praise, saving, the done screen with the thinking card
// and the way on. The task comes from the idea's recipe (engine/recipe.js), the picture from its board
// (boards/<board>.js, or ideas/<id>/board.js for a picture that exists once).
//
// A board: draw(host, task, ctx) -> { ready?, ownAnswer?, onAnswer?(given, right, stage), hint?(step) }
//   ctx.ask(key, extra)     a sentence of the task's texts into the question box (read aloud, taps wait)
//   ctx.tell(key, extra)    a sentence into the caption
//   ctx.give(given, node, extra) -> Promise<boolean>   the board's own answer (build, order, its own buttons)
//   ctx.miss(extra)         a wrong step inside a board's own answer (a stone out of order)
//   ctx.solved(extra)       the board's own answer is right (the board checked it itself)
//   ctx.say(sentence, ask, show)  a sentence the board made itself (show false: read aloud only, the board shows
//                           it itself); extra.say does the same for miss, solved, hint
//   ctx.icon, ctx.num, ctx.word, ctx.label(key), ctx.fresh(), ctx.tap(), ctx.ready()

import { station as stationOf, map as mapOf, stationOpen, reachable, reviewFrom, next as nextOf, isMastered } from "../graph.js";
import { STATIONS } from "../../content/universe.js";
import { PERSPECTIVES, CARDS } from "../../content/perspectives.js";
import { shared as T, helpers, say, num } from "../i18n.js";
import { state, facts, idea as loadIdea, texts as loadTexts, age, save } from "../app.js";
import * as L from "../learner.js";
import * as gate from "../gate.js";
import * as profiles from "../profiles.js";
import { taskOf, value } from "../recipe.js";
import * as box from "../box.js";
import { random, pick, shuffle } from "../random.js";
import { policyFor, roundSize, afterRound, afterFeel, isTop } from "../policy.js";
import { plan, Round } from "../round.js";
import { THING_IDS, icon } from "../things.js";
import { href, go } from "../router.js";
import { el, button, link, wait, icons } from "./parts.js";
import { topbar, homeLink } from "./topbar.js";
import { voice } from "./voice.js";
import { sound, celebrate } from "./sound.js";
import { answers, FRAME_MODES } from "./answer.js";
import { backdrop, groupName } from "./station.js";

const NUDGE_AFTER = 7000; // after this long without a tap, the things to tap wiggle
const RECENT = 3; // tasks not repeated
const recentKeys = {}; // per idea and perspective, across rounds of this visit

let lastPick = null;
const oneOf = (list) => {
  let x;
  do x = pick(list);
  while (list.length > 1 && x === lastPick);
  return (lastPick = x);
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Read aloud by itself: every sentence for young children, else tasks whose numbers are all up to 20. */
const smallNumbers = (task) => Object.values(task.vars).flat().every((x) => typeof x !== "number" || Math.abs(x) <= 20);

/** A text entry by its dotted key ("zahl.sehen"). */
const lookup = (texts, key) => key.split(".").reduce((o, k) => o?.[k], texts) ?? {};

export async function render(root, route) {
  const isGate = route.screen === "gate";
  const s = stationOf(route.station);
  const f0 = facts();
  if (!s || !f0.ready(s.id) || !reachable(f0).has(s.id) || !stationOpen(s.id, f0)) return go(href.map(s?.map ?? "tal"));
  const m = mapOf(s.map);
  const many = s.ideas.length > 1;
  const ideaId = s.ideas.includes(route.idea) ? route.idea : s.ideas[0];
  const def = await loadIdea(ideaId);
  const words = await loadTexts(ideaId);
  const questions = isGate ? gate.questions(s.id, def) : [];
  if (isGate && !gate.due(state.rec, s.id, def)) return go(href.station(s.id, many ? ideaId : null));
  const p = isGate ? questions[0]?.p : def.perspectives.includes(route.p) ? route.p : null;
  if (!p) return go(href.station(s.id));
  const pol = policyFor(m.policy, def);
  const persp = PERSPECTIVES.find((x) => x.id === p);
  const names = T.perspectives[m.perspectiveNames] ?? T.perspectives.standard;
  const r = random(new URLSearchParams(location.search).get("seed") ?? route.q.seed);
  const kidAge = age();
  backdrop(s);
  document.title = `${names[p]} · ${T.stations[s.id]} · ${T.app}`;

  // ---------- The screen

  const steps = el("ol", "steps");
  steps.setAttribute("aria-label", T.labels.tasks);
  const hintBtn = button("icon-btn hint-btn", T.labels.hint, "💡");
  hintBtn.hidden = true;
  const stationHref = href.station(s.id, many ? ideaId : null);
  root.append(topbar({ back: { href: stationHref, label: T.labels.station }, middle: steps, extra: [hintBtn] }));
  const question = el("p", "question card");
  question.setAttribute("aria-live", "polite");
  question.hidden = true;
  const caption = el("p", "caption");
  caption.setAttribute("aria-live", "polite");
  const start = el("section", "screen start");
  const board = el("section", "screen board");
  const done = el("section", "screen done");
  board.hidden = done.hidden = true;
  root.append(question, caption, start, board, done);
  voice.mount({ caption, question });
  voice.aloud = true;

  const show = (name) => {
    start.hidden = name !== "start";
    board.hidden = name !== "board";
    done.hidden = name !== "done";
    hintBtn.hidden = name !== "board" || isGate;
    if (name !== "board") voice.newTask();
  };

  // ---------- Start: the symbol of the perspective and one big button (the first tap also wakes the sound)

  const intro = isGate ? T.gate.welcome : say(words[ideaId]?.intro?.[p]) || names[p];
  start.append(el("div", "start-art", isGate ? "🚪" : persp.icon));
  const play = button("btn go play pulse", T.labels.play);
  play.innerHTML = icons.play;
  start.append(play);
  caption.textContent = intro;
  play.addEventListener("click", async () => {
    play.disabled = true;
    sound.tap();
    await voice.tell(intro);
    startRound();
  });

  // ---------- The round

  let round = null;
  let task = null;
  let slot = null;
  let b = {};
  let widget = null;
  let stage = null; // { kind: "answer" | "fix", value }
  let busy = false;
  let explaining = 0; // while a miss is being explained (its number): a new answer cuts it short, never waits
  let missNo = 0;
  let fresh = false;
  let texts = {};
  let gateAnswers = [];
  let level = null;
  let bridgeKind = null;
  let shownAt = 0; // when the task was ready: the time to the answer (learning box)

  // extra.say: a sentence a board made itself (boards ported from think-lab, engine/ui/ported.js)
  const text = (key, extra = {}) => (typeof extra.say === "string" ? extra.say : say(texts[key], { ...task.vars, ...extra }));

  function drawSteps() {
    steps.replaceChildren(
      ...round.slots.map((x, i) => {
        const mark = { surprise: "🎁", review: x.counted ? "🎒" : "🔁", inverse: "🔁", bridge: "🌉", backpack: "🎒" }[x.kind] ?? "";
        return el("li", (mark ? "gift " : "") + (i < round.at ? "done" : i === round.at ? "now" : ""), mark);
      }),
    );
  }

  function pickReview() {
    if (!pol.review?.perRound || isGate) return null;
    const f = facts();
    const ids = reviewFrom(s.id, f).filter((id) => f.ready(id) && !stationOf(id).game);
    if (!ids.length) return null;
    const sid = pick(ids, r);
    const id = pick(stationOf(sid).ideas, r);
    const d = state.defs[id];
    if (!d || L.isGame(d)) return null;
    const ps = d.perspectives.filter((x) => L.played(state.rec, id, x));
    return { idea: id, p: pick(ps.length ? ps : d.perspectives, r), rung: L.level(state.rec, d, kidAge), station: sid };
  }

  /** The backpack (Berg, policy backpack): tasks from other stations of this map the child has mastered. The one
   *  played longest ago comes first (now and then the second oldest), in a perspective the child has played there,
   *  at the child's level there. The summit (backpack.each) takes one camp per slot, at the top level. */
  function pickBackpack() {
    const bp = pol.backpack;
    const want = (pol.slots ?? []).filter((k) => k === "backpack").length;
    if (!bp || !want || isGate) return [];
    const f = facts();
    const lastDay = (id) => Object.values(state.rec.ideas[id]?.cells ?? {}).map((c) => c.last ?? "").sort().at(-1) ?? "";
    const pool = shuffle(STATIONS.filter((x) => x.map === s.map && x.id !== s.id && f.ready(x.id) && isMastered(x.id, f)), r)
      .flatMap((x) => x.ideas.map((id) => ({ station: x.id, idea: id, def: state.defs[id] })))
      .filter((x) => x.def && !L.isGame(x.def))
      .sort((a, b) => lastDay(a.idea).localeCompare(lastDay(b.idea)));
    if (pool.length > 1 && r() < 0.3) [pool[0], pool[1]] = [pool[1], pool[0]];
    const ps = bp.each ? shuffle(bp.perspectives, r) : bp.perspectives;
    const out = [];
    for (let i = 0; i < want && pool.length; i++) {
      const x = bp.each ? pool.splice(Math.floor(r() * pool.length), 1)[0] : pool[i % pool.length];
      const can = bp.each ? [ps[i % ps.length]] : ps.filter((p) => x.def.perspectives.includes(p) && L.played(state.rec, x.idea, p));
      const p = pick(can.filter((p) => x.def.perspectives.includes(p)), r);
      if (!p) continue;
      out.push({ idea: x.idea, station: x.station, p, rung: bp.rung === "top" ? x.def.ladder.at(-1).id : L.level(state.rec, x.def, kidAge) });
    }
    return out;
  }

  function startRound() {
    level = L.level(state.rec, def, kidAge);
    // Feld: a kind of mistake that came often brings a bridge (the rung that trains it) at the start of the round
    bridgeKind = isGate ? null : L.oftenWrong(state.rec, ideaId, pol.bridgeAfter);
    const bridge = bridgeKind ? L.bridgeRung(def, level, bridgeKind) : null;
    const slots = isGate
      ? questions.map((q) => ({ kind: "gate", idea: ideaId, p: q.p, rung: q.rung, counted: false }))
      : plan({ def, p, rung: level, pol, size: Math.min(roundSize(pol, kidAge), def.roundTasks?.[p] ?? Infinity), played: (x) => L.played(state.rec, ideaId, x), review: pol.review?.from === "below" ? null : pickReview(), below: L.belowTop(def, level), bridge, backpack: pickBackpack(), r });
    const below = def.ladder[L.rungIndex(def, level) - 1]?.id ?? null;
    round = new Round(slots, pol, isGate ? null : below);
    fresh = !L.played(state.rec, ideaId, p);
    gateAnswers = [];
    busy = false;
    if (!isGate) L.visit(state.rec, ideaId);
    show("board");
    runTask();
  }

  let nudgeTimer = 0;
  const restNudge = () => {
    clearTimeout(nudgeTimer);
    board.classList.remove("nudge");
    nudgeTimer = setTimeout(() => {
      if (!busy && !board.hidden) board.classList.add("nudge");
    }, NUDGE_AFTER);
  };
  board.addEventListener("pointerdown", restNudge);

  async function runTask() {
    slot = round.slot;
    drawSteps();
    voice.newTask();
    board.replaceChildren();
    widget = null;
    const sdef = await loadIdea(slot.idea);
    const stexts = slot.idea === ideaId ? words : await loadTexts(slot.idea);
    if (slot.kind === "surprise") await voice.tell(T.round.surprise);
    if (slot.kind === "review" && slot.station) await voice.tell(T.round.review(T.stations[slot.station] ?? slot.station));
    if (slot.kind === "bridge" && round.at === 0) await voice.tell(T.round.bridge(say(stexts[sdef.words ?? slot.idea]?.kinds?.[bridgeKind]) || ""));
    if (slot.kind === "easier") await voice.tell(T.round.easier);
    if (slot.kind === "backpack" && !def.around) await voice.tell(T.round.backpack(T.stations[slot.station] ?? slot.station));
    if (!board.isConnected) return;
    const key = `${slot.idea}/${slot.p}`;
    const recent = (recentKeys[key] ??= []);
    // the rung's params; what the idea reads from the child's facts (the clearing: which operations it may use);
    // on an inverse slot the task before, to turn round
    const params = { ...L.rung(sdef, slot.rung).params, ...(sdef.context?.(facts()) ?? {}) };
    if (slot.kind === "inverse" && task?.vars && task.vars.p === slot.p) params.inverseOf = task.vars;
    const lb = pol.learningBox && sdef.tasks && slot.kind !== "inverse" ? sdef.policy?.learningBox ?? pol.learningBox : null;
    task = lb
      ? box.choose(state.rec, Array.from({ length: lb.among ?? 8 }, () => taskOf(sdef, slot.p, params, { r, things: THING_IDS, recent })), lb, r)
      : taskOf(sdef, slot.p, params, { r, things: THING_IDS, recent });
    recent.unshift(task.key);
    recent.length = Math.min(recent.length, RECENT);
    texts = lookup(stexts, task.ask);
    stage = { kind: "answer", value: task.answer.value };
    voice.aloud = profiles.readAloud(state.kid) || smallNumbers(task);
    voice.newTask();
    board.className = `screen board board-${task.board} p-${slot.p}`;
    const mod = sdef.board === task.board ? await import(`../../ideas/${slot.idea}/board.js`) : await import(`../../boards/${task.board}.js`);
    if (!board.isConnected) return;
    ctx.words = stexts;
    ctx.idea = slot.idea;
    b = mod.draw(board, task, ctx) ?? {};
    if (def.around && !isGate) {
      // something the round's idea adds to every task (the summit: pick a tool first, boards/berg/summit.js)
      const own = b.hint;
      const a = def.around(board, { idea: slot.idea, task, T: words, tell: (x) => voice.tell(x), tap: () => sound.tap(), r: { shuffle: (list) => shuffle(list, r) } }) ?? {};
      b = { ...b, hint: (...args) => { const x = a.hint?.(); return x ? { say: x } : own?.(...args) ?? {}; } };
    }
    if (!b.ownAnswer && FRAME_MODES.includes(task.answer.mode)) widget = frameAnswers(task.answer);
    restNudge();
    shownAt = Date.now();
    if (b.ready) {
      widget?.wait(true);
      await b.ready;
      widget?.wait(false);
      shownAt = Date.now();
    }
  }

  function frameAnswers(answer) {
    return answers(board, answer, {
      num,
      word: helpers.w,
      label: (o) => say(texts.options?.[o]) || T.labels[o] || String(o),
      labels: T.labels,
      onGiven: (v) => check(v),
    });
  }

  const ctx = {
    T,
    num,
    word: helpers.w,
    icon,
    label: (k) => say(texts.labels?.[k]) || T.labels[k] || k,
    text: (k, extra) => text(k, extra),
    ask: (k, extra) => voice.ask(text(k, extra)),
    tell: (k, extra) => voice.tell(text(k, extra)),
    give: (given, node, extra) => check(given, extra),
    // a wrong step of a board's own answer; on the first-visit questions there is only one try
    miss: (extra) => (isGate ? gateAnswer(false) : wrong(extra?.given, extra)),
    solved: (extra) => check(stage.value, extra),
    say: (sentence, asking, show = true) => (asking ? voice.ask(sentence, show) : voice.tell(sentence, show)),
    words: {}, // the texts of the idea of this task (set before each board is drawn)
    fresh: () => fresh && (slot?.kind === "cur" || slot?.kind === "easier"),
    tap: () => sound.tap(),
    ready: () => restNudge(),
    slot: () => slot, // the slot being played ({ kind: "cur" | "bridge" | … })
    weak: () => (state.rec.ideas[slot?.idea]?.weakInRow ?? 0) > 0, // the last round was weak
  };

  /** A wrong answer: the sentence, the mistake kind, and help after hintAfter misses. */
  async function wrong(given, extra = {}) {
    busy = true;
    const mine = (explaining = ++missNo);
    const { help } = round.miss();
    if (extra.kind) L.mistake(state.rec, slot.idea, extra.kind); // a kind of mistake the board knew (the Feld's)
    for (const [kind, rule] of Object.entries(def.mistakes ?? {})) {
      try {
        if (value(rule.when, { given, right: stage.value, type: typeof given })) L.mistake(state.rec, slot.idea, kind);
      } catch {
        /* a rule that does not fit this answer */
      }
    }
    widget?.wrong(given);
    sound.wrong();
    await voice.tell(`${oneOf(T.oops)} ${text(stage.kind === "fix" ? "fixMiss" : "miss", { given, ...extra })}`);
    if (explaining !== mine) return; // the child answered again meanwhile: that answer goes on
    if (help >= 0 && board.isConnected) await hint(help);
    if (explaining !== mine) return;
    explaining = 0;
    busy = false;
  }

  async function hint(step) {
    const kind = pol.help[step] ?? "hint";
    const extra = b.hint?.(step, kind) ?? {};
    const sentence = text(texts[kind] ? kind : "hint", extra);
    if (sentence) await voice.tell(sentence);
  }

  hintBtn.addEventListener("click", () => {
    if (busy || !round || round.done) return;
    sound.tap();
    hint(round.helpStep());
  });

  /** An answer: the frame checks it against the recipe's right answer. */
  async function check(given, extra = {}) {
    // A child who answers again while a miss is still being explained is heard, not ignored: many boards lock
    // themselves on a right answer, so a dropped answer would leave the round stuck.
    if (busy && !explaining) return false;
    explaining = 0;
    busy = false;
    const right = same(given, stage.value);
    const stageName = stage.kind === "fix" ? "fix" : task.answer.mode === "yesNo" ? "judge" : "answer";
    b.onAnswer?.(given, right, stageName);
    if (isGate) return gateAnswer(right);
    if (!right) {
      await wrong(given, extra);
      return false;
    }
    if (stageName === "judge" && given === false && task.answer.fix !== undefined && task.answer.fix !== null) {
      // The owl was wrong, and the child saw it. Now: how many are there?
      stage = { kind: "fix", value: task.answer.fix };
      widget?.remove();
      widget = frameAnswers({ mode: "choose", value: task.answer.fix, options: task.answer.fixOptions ?? [task.answer.fix] });
      sound.tap();
      voice.tell(text("fix"));
      return true;
    }
    busy = true;
    widget?.right(given);
    widget?.lock(true);
    const { first } = round.solve();
    L.task(state.rec, slot.idea, slot.p, slot.rung, first, { counted: slot.counted });
    const lb = pol.learningBox && (state.defs[slot.idea]?.policy?.learningBox ?? pol.learningBox);
    if (lb && task.vars.card) box.record(state.rec, task.vars.card, { first, ms: Date.now() - shownAt, fact: task.vars.fact !== false }, lb);
    save();
    sound.right();
    await Promise.all([voice.tell(`${oneOf(T.praise)} ${text(stage.kind === "fix" ? "fixed" : "right", { given, ...extra })}`), wait(900)]);
    await wait(300);
    busy = false;
    if (!board.isConnected) return true;
    if (round.done) finish();
    else runTask();
    return true;
  }

  /** First-visit questions: one try each, no help, then on to the next one. */
  async function gateAnswer(right) {
    busy = true;
    widget?.lock(true);
    gateAnswers.push({ rung: slot.rung, first: right });
    round.solve();
    if (right) {
      widget?.right(stage.value);
      sound.right();
    } else sound.tap();
    await Promise.all([voice.tell(right ? `${oneOf(T.praise)} ${text("right")}` : T.gate.next), wait(700)]);
    busy = false;
    if (!board.isConnected) return right;
    if (round.done) finish();
    else runTask();
    return right;
  }

  // ---------- Done

  async function finish() {
    clearTimeout(nudgeTimer);
    if (isGate) {
      const at = gate.save(state.rec, def, gateAnswers);
      save();
      done.replaceChildren(el("div", "start-art", "🚪"));
      const on = link("btn go", stationHref, T.labels.play);
      done.append(on);
      show("done");
      sound.win();
      await voice.tell(T.gate.done(groupName(L.groupOf(def, at), def)));
      return;
    }
    const { first, tasks } = round.result;
    const card = def.cards?.[p] ?? persp.card;
    const before = facts().mastered(s.id);
    const res = afterRound(state.rec, def, pol, { p, rung: level, first, tasks, age: kidAge });
    L.roundDone(state.rec, ideaId, card);
    save();
    const f = facts();
    const nowMastered = f.mastered(s.id) && !before;

    done.replaceChildren();
    const c = el("div", "think-card card pop");
    c.append(el("span", "think-icon", CARDS[card] ?? "✨"), el("strong", "", T.cards[card]?.name ?? ""), el("span", "", T.cards[card]?.text ?? ""));
    done.append(c);
    const g = L.groupOf(def, level);
    const row = el("div", "star-row card");
    for (const x of def.perspectives) {
      const on = L.starred(state.rec, def, x, g);
      const st = el("span", "star-cell" + (on ? " on" : "") + (x === p && res.newStar ? " new" : ""));
      st.append(el("span", "", PERSPECTIVES.find((y) => y.id === x).icon), el("b", "", on ? "⭐" : "☆"));
      row.append(st);
    }
    if (!L.isGame(def)) done.append(row);

    let feelBox = null;
    if (pol.askFeel) {
      feelBox = el("div", "feel");
      feelBox.setAttribute("aria-label", T.round.feelQuestion);
      for (const [k, face] of [["easy", "😄"], ["ok", "🙂"], ["hard", "😅"]]) {
        const fb = button("feel-btn", T.round.feel[k]);
        fb.append(el("span", "", face), el("small", "", T.round.feel[k]));
        fb.addEventListener("click", () => {
          for (const o of feelBox.children) o.classList.toggle("on", o === fb);
          sound.tap();
          if (afterFeel(state.rec, def, pol, { share: res.share, feel: k, age: kidAge }) < 0) {
            save();
            voice.tell(numeric(g) ? T.round.smaller : T.round.smallerPlain);
          }
        });
        feelBox.append(fb);
      }
      done.append(feelBox);
    }

    const nextId = m.guide !== "none" ? nextOf(s.id, f) : null;
    const nav = el("div", "next");
    const again = button("btn", T.labels.again, T.labels.again);
    again.addEventListener("click", () => {
      sound.tap();
      startRound();
    });
    nav.append(again, link("btn sun", stationHref, T.round.toStation));
    if (nextId) {
      const follow = link("btn go follow", m.guide === "tour" ? href.map(s.map, `walk=${s.id},${nextId}`) : href.station(nextId));
      follow.append(el("span", "", "🦉"), el("span", "", T.stations[nextId] ?? nextId));
      follow.setAttribute("aria-label", T.round.followShort);
      done.append(follow);
    }
    done.append(nav);
    show("done");
    sound.win();
    celebrate();

    await voice.tell(`${T.round.done} ${T.round.cardGot(T.cards[card]?.name ?? "")} ${T.cards[card]?.text ?? ""}`);
    if (!done.isConnected) return;
    if (res.newStar) await voice.tell(T.round.star);
    if (nowMastered) await voice.tell(T.round.mastered);
    const newG = L.groupOf(def, res.level);
    const sameGroup = newG === g; // the Feld moves by sub-steps inside a range
    const stepName = def.rungName?.(L.rung(def, res.level), words);
    if (res.moved > 0) await voice.tell(sameGroup ? T.round.stepOn(stepName ?? "") : numeric(newG) ? T.round.bigger : T.round.biggerPlain);
    if (res.moved < 0) await voice.tell(numeric(newG) && !sameGroup ? T.round.smaller : T.round.smallerPlain);
    if (!res.moved && !res.star && pol.star.atTop && !isTop(def, level)) await voice.tell(T.round.starsOnTop);
    if (pol.askFeel) await voice.tell(T.round.feelQuestion);
    else if (nextId && m.guide === "tour") voice.tell(T.round.follow(T.stations[nextId] ?? nextId));
  }

  show("start");
  return () => clearTimeout(nudgeTimer);
}

const numeric = (g) => /^\d+$/.test(g ?? "");
