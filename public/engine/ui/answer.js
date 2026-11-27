// The answer part under a board, for the answer modes the frame draws itself (content/boards.js ANSWERS):
//   choose  numbers: buttons in rows of five, up to 10 with that many dots (a child who cannot read digits
//           counts the dots); words: one button each, named by the idea's texts (options.<value>)
//   type    the number pad
//   yesNo   ✓ and ✗
// The other modes (build, order, place, tapThings) are part of the picture: the board takes them itself.
//
//   const a = answers(host, answer, { num, word, label, onGiven });
//   a.wait(true)        dimmed, no taps (while the story of a task is shown)
//   a.wrong(given)      that button is out
//   a.right(given)      that button turns green
//   a.lock(true)        no more taps

import { el, button, dots, shake, icons } from "./parts.js";
import { numpad } from "./numpad.js";

export const FRAME_MODES = ["choose", "type", "yesNo"];

export function answers(host, answer, { num, word, label = (v) => String(v), labels = {}, onGiven }) {
  let locked = false;
  const box = el("div", "answers");
  const byValue = new Map();
  let pad = null;

  const give = (v, b) => {
    if (locked || box.classList.contains("waiting")) return;
    onGiven(v, b);
  };

  if (answer.mode === "type") {
    pad = numpad(box, { digits: String(answer.value).length + 1, onCheck: (n) => give(n, null), labels });
  } else if (answer.mode === "yesNo") {
    box.classList.add("judge");
    const yes = button("btn ok judge-btn", labels.yes, "✓");
    const no = button("btn go judge-btn", labels.no, "✗");
    yes.addEventListener("click", () => give(true, yes));
    no.addEventListener("click", () => give(false, no));
    byValue.set(true, yes).set(false, no);
    box.append(yes, no);
  } else {
    const options = answer.options ?? [];
    const numbers = options.every((o) => typeof o === "number");
    const withDots = numbers && Math.max(...options) <= 10;
    box.classList.add(numbers ? "strip" : "words");
    if (numbers && !withDots) box.classList.add("plain");
    if (numbers && options.length <= 3) box.classList.add("three");
    for (const o of options) {
      const b = button(numbers ? "btn num-btn" : "btn word-btn", numbers ? word(o) : label(o));
      if (numbers) {
        b.append(el("b", "", num(o)));
        if (withDots) b.append(dots(o));
      } else b.textContent = label(o);
      b.addEventListener("click", () => give(o, b));
      byValue.set(o, b);
      box.append(b);
    }
  }
  host.append(box);

  return {
    el: box,
    wait(on) {
      box.classList.toggle("waiting", on);
    },
    lock(on) {
      locked = on;
      pad?.lock(on);
    },
    wrong(v) {
      const b = byValue.get(v);
      if (b) {
        shake(b);
        if (answer.mode === "choose") b.disabled = true;
      }
      pad?.clear();
    },
    right(v) {
      byValue.get(v)?.classList.add("right");
      pad?.show(v);
    },
    remove() {
      pad?.remove();
      box.remove();
    },
  };
}

export { icons };
