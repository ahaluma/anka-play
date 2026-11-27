// Boards ported from think-lab (the Tal stations). They keep the way they talk to the round there: they make
// their sentences themselves (ctx.tell(text), ctx.miss(text), ctx.solved(text), hint() returns a sentence),
// with the sentences of the idea's own language files (ideas/<id>/lang/<language>.js). This file turns that
// into the board interface of engine/ui/play.js, so a ported board needs no other change than its imports:
//
//   // ideas/<id>/board.js
//   import { port, el, button, group, sign, strip, shake, wait } from "../../engine/ui/ported.js";
//   export const draw = port({ sehen, machen, forschen, anwenden, pruefen });
//
// The recipe of the idea names the board's function by its ask key ("teile.sehen" -> sehen), draws the
// numbers of the task as data (its `vars` are the task the board gets) and says answer: { mode: "own" }:
// the board checks the answer itself and tells the round.
//
// What the old ctx had, and where it comes from now:
//   ctx.T          the shared texts, the idea's texts, and (for the idea's own sections) its section at the top
//   ctx.thing(id)  { icon, one, many } of a thing (engine/things.js, lang "things")
//   ctx.tell(s)    before the child's first touch a part of the question (read aloud, taps wait), else the caption
//   ctx.miss(s), ctx.solved(s), ctx.tap(), ctx.ready(), ctx.fresh(), ctx.num(n), ctx.word(n)

import { el, button, group, shake, wait } from "./parts.js";
import { numpad as pad } from "./numpad.js";
import { icon } from "../things.js";

export { el, button, group, shake, wait };

/** think-lab's number pad: numpad(container, T, { digits, onCheck, display }), its labels from the shared texts. */
export const numpad = (container, T, opts) => pad(container, { ...opts, labels: T.labels ?? T });

/** A sign that shows the whole: the number and that many dots in rows of five. */
export function sign(ctx, n) {
  const s = el("div", "sign");
  s.append(el("b", "", ctx.num(n)));
  const dots = el("span", "sign-dots");
  for (let i = 0; i < n; i++) dots.append(el("i"));
  s.append(dots);
  return s;
}

/** Number buttons from..to in rows of five; up to 10 with that many dots. onPick(n, button). */
export function strip(ctx, from, to, onPick) {
  const dotted = to <= 10;
  const box = el("div", dotted ? "answers strip" : "answers strip plain");
  for (let n = from; n <= to; n++) {
    const b = button("btn num-btn", ctx.word(n));
    b.append(el("b", "", ctx.num(n)));
    if (dotted) {
      const dots = el("span", "num-dots");
      for (let i = 0; i < n; i++) dots.append(el("i"));
      b.append(dots);
    }
    b.addEventListener("click", () => onPick(n, b));
    box.append(b);
  }
  return box;
}

/** The two buttons of checking the owl. */
export function judge(T, onPick) {
  const box = el("div", "answers judge");
  const yes = button("btn ok judge-btn", T.pruefen.yes, "✓");
  const no = button("btn go judge-btn", T.pruefen.no, "✗");
  yes.addEventListener("click", () => onPick(true, yes));
  no.addEventListener("click", () => onPick(false, no));
  box.append(yes, no);
  return box;
}

/** The board interface of engine/ui/play.js for a set of think-lab boards, one per perspective. */
export function port(BOARDS) {
  return function draw(host, task, ctx) {
    const words = ctx.words ?? {};
    const own = words[ctx.idea] ?? {};
    const T = { ...ctx.T, pruefen: { yes: ctx.T.labels.yes, no: ctx.T.labels.no }, nut: ctx.T.things.nut, ...words, ...own };
    let asking = true; // until the child first touches something to tap
    const touched = (e) => {
      const c = e.target instanceof Element ? getComputedStyle(e.target).cursor : "";
      if (c === "pointer" || c === "grab") asking = false;
    };
    host.addEventListener("pointerdown", touched, true);
    host.addEventListener("click", touched, true);
    const legacy = {
      T,
      num: ctx.num,
      word: ctx.word,
      thing: (id) => ({ icon: icon(id), ...(ctx.T.things[id] ?? { one: id, many: id }) }),
      // tell(text, "") as in think-lab: read aloud only, the board shows the words itself (the Berg's question box)
      tell: (text, shown) => ctx.say(text, asking, shown !== ""),
      tap: ctx.tap,
      ready: ctx.ready,
      fresh: ctx.fresh,
      miss: (text) => {
        asking = false;
        return ctx.miss({ say: text });
      },
      solved: (text) => {
        asking = false;
        return ctx.solved({ say: text });
      },
    };
    const p = task.show?.as ?? task.ask.split(".").pop();
    const t = { p, ...task.vars };
    const b = BOARDS[p](host, t, legacy) ?? {};
    return {
      ownAnswer: true,
      hint() {
        asking = false;
        const said = b.hint?.();
        return said ? { say: said } : {};
      },
    };
  };
}
