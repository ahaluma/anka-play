// Ported from think-lab (welt/ideas/steine/boards.js) with only its imports changed: engine/ui/ported.js gives it
// the round it knew there, boards/berg/ the parts every camp shares. The task is what ideas/steine/tasks.js made.
import { port } from "../../engine/ui/ported.js";

// The boards of camp 11, "Vom Ende her" (welt/berg/). Verstehen, Regel finden (the traps),
// Übertragen and Begründen are the shared camp boards (berg/camp.js). This camp's own:
//
//   machen   Ausprobieren: play against the owl. Take 1 to k stones; whoever takes the last one wins.
//            The owl plays well. If it wins, the same heap comes back: try again.
//
// Texts: ideas/<camp>/lang/<language>.js under "steine".

import { el, button } from "../../engine/ui/ported.js";
import * as kit from "../../boards/berg/kit.js";
import { campBoards, solvedBy, args } from "../../boards/berg/camp.js";
import { DIGITS, owlMove } from "./tasks.js";

export const TOOLS = { falle: "🪤", letzter: "🌶️", zaehlen: "🔢", gleich: "⚖️", brueche: "🍫", paar: "👫", tabelle: "📋", probe: "🧪", bild: "✏️" };

function machen(host, t, ctx) {
  const S = ctx.T.steine;
  const M = S.machen;
  const win = solvedBy(ctx, "steine", TOOLS);
  const a = args(ctx, t);
  const heap = el("div", "card swap-row heap");
  const log = el("p", "scale-status");
  const row = el("div", "find-row");
  let n = t.a.n;
  let done = false;
  const show = () => {
    heap.textContent = "";
    for (let i = 0; i < n; i++) heap.append(el("span", "heap-stone", "🪨"));
    buttons.forEach((b, j) => (b.disabled = done || j + 1 > n));
  };
  const buttons = Array.from({ length: t.a.k }, (_, j) => {
    const b = button("btn find-btn take-btn", M.take(ctx.num(j + 1)), ctx.num(j + 1));
    b.addEventListener("click", () => {
      if (done || j + 1 > n) return;
      ctx.tap();
      n -= j + 1;
      if (n === 0) {
        done = true;
        show();
        log.textContent = M.youWin;
        return void win(host, t, M.won(a));
      }
      const o = owlMove(n, t.a.k);
      n -= o;
      if (n === 0) {
        log.textContent = M.owlWins;
        ctx.miss(M.owlWins);
        n = t.a.n;
      } else log.textContent = M.moves(ctx.num(j + 1), ctx.num(o), ctx.num(n));
      show();
    });
    row.append(b);
    return b;
  });
  host.append(heap, log, row);
  show();
  log.textContent = M.start(ctx.num(n));
  kit.question(host, M.rules(a), M.ask);
  ctx.ready();
  ctx.tell(`${M.rules(a)} ${M.ask}`, "");
  return { hint: () => M.hint(a) };
}

export const BOARDS = campBoards("steine", { TOOLS, DIGITS, machen });

export const draw = port(BOARDS);
