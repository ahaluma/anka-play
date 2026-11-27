// A number pad for typed answers (from the range up to 20 in school, docs/DESIGN.md section 2). No phone
// keyboard pops up: big keys 1-9, 0, delete and check, in the digits of the language. A real keyboard works too.
//
//   const pad = numpad(container, { digits: 3, onCheck: (n) => right?, labels });
//   pad.clear() · pad.lock(true) · pad.show(n) · pad.remove()

import { num } from "../i18n.js";
import { icons } from "./parts.js";

export function numpad(container, { digits = 2, onCheck, labels = {} }) {
  let typed = "";
  let locked = false;
  container.replaceChildren();
  container.classList.add("numpad-box");
  const display = document.createElement("output");
  display.className = "numpad-display";
  display.setAttribute("aria-label", labels.yourAnswer ?? "");
  display.setAttribute("aria-live", "polite");
  const keys = document.createElement("div");
  keys.className = "numpad";
  const key = (label, cls, aria, action) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn key " + cls;
    b.innerHTML = label;
    if (aria) b.setAttribute("aria-label", aria);
    b.addEventListener("click", action);
    keys.append(b);
    return b;
  };
  for (const d of [1, 2, 3, 4, 5, 6, 7, 8, 9]) key(num(d), "digit", null, () => press(String(d)));
  const erase = key("⌫", "erase", labels.erase, () => press("back"));
  key(num(0), "digit", null, () => press("0"));
  const check = key(icons.check, "check ok", labels.check, () => press("enter"));

  function draw(state = "") {
    display.textContent = typed ? num(Number(typed)) : "?";
    display.className = `numpad-display ${typed ? "typed" : ""} ${state}`;
    check.disabled = !typed || locked;
    erase.disabled = !typed || locked;
  }

  function press(k) {
    if (locked) return;
    if (k === "back") typed = typed.slice(0, -1);
    else if (k === "enter") {
      if (typed) onCheck(Number(typed));
      return;
    } else if (typed.length < digits) typed = typed === "0" ? k : typed + k;
    draw();
  }

  function onKey(e) {
    if (e.key >= "0" && e.key <= "9") press(e.key);
    else if (e.key === "Backspace") press("back");
    else if (e.key === "Enter") press("enter");
    else return;
    e.preventDefault();
  }
  document.addEventListener("keydown", onKey);
  container.append(display, keys);
  draw();

  return {
    clear() {
      typed = "";
      draw();
    },
    lock(on) {
      locked = on;
      draw();
    },
    show(n) {
      typed = String(n);
      draw("right");
    },
    remove() {
      document.removeEventListener("keydown", onKey);
    },
  };
}
