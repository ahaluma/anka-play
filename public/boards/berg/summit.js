// The summit's backpack of tools (ported from think-lab's welt/berg/gipfel/gipfel.js): before each task of a
// competition round the child picks the tool to start with. Four tools: the ones that fit (the task's camp, or
// both camps of a summit family) and tools of other camps. Any pick lets the child go on; the voice says whether
// it fits ("Good choice" or "Try it, at the end you see everything that fits"). Afterwards the card "And this
// works too" of the camp boards shows every tool that fits.
//
// engine/ui/play.js calls it after the board is drawn, as the idea's `around` (ideas/gipfel/idea.js):
//   pickTool(host, { idea, task, T, tell, r }) -> { hint?() }   T: the words of the task's idea (with berg)

import { el, button } from "../../engine/ui/ported.js";
import { STATIONS } from "../../content/universe.js";

/** One sign per camp: the tool it gives (think-lab's SIGN). */
export const SIGN = { zaun: "🪵", haken: "✔️", huetten: "🏠", vorrat: "⏪", ameisen: "🐜", waage: "⚖️", stall: "🐔", tanz: "👫", fels: "🔺", socken: "🧦", steine: "🪨", mauer: "🧱" };
const CAMPS = STATIONS.filter((s) => s.map === "berg" && s.id !== "gipfel").map((s) => s.id);

export function pickTool(host, { idea, task, T, tell, tap, r }) {
  const B = T.berg;
  const G = T.gipfel?.round ?? {};
  const fits = idea === "gipfel" ? task.vars.camps ?? [] : [idea];
  const others = r.shuffle(CAMPS.filter((id) => !fits.includes(id))).slice(0, 4 - fits.length);
  const options = r.shuffle([...fits, ...others]);
  // The answer waits until the child has picked a tool.
  const answers = [...host.querySelectorAll(".numpad-box, .judge, .choices, .find-row")].filter((x) => !x.hidden);
  answers.forEach((x) => (x.hidden = true));
  const pick = el("div", "card tool-pick");
  pick.append(el("small", "summit-from", idea === "gipfel" ? G.family : G.camp(B.camps[idea])), el("strong", "", G.pick));
  const row = el("div", "tool-row");
  for (const id of options) {
    const name = B.tools[id];
    const b = button("btn tool-btn", name, "");
    b.append(el("span", "tool-icon", SIGN[id] ?? "💡"), el("span", "tool-name", name));
    b.addEventListener("click", () => {
      tap();
      pick.remove();
      answers.forEach((x) => (x.hidden = false));
      tell(fits.includes(id) ? G.goodPick(name) : G.tryPick(name));
    }, { once: true });
    row.append(b);
  }
  pick.append(row);
  host.append(pick);
  return { hint: () => (pick.isConnected ? G.pick : null) };
}
