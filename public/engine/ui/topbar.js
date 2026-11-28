// The top bar of every screen but Home: the way back (Home is always there), the title, the 🔊 button.

import { shared as T } from "../i18n.js";
import { state } from "../app.js";
import { el, button, link, icons } from "./parts.js";
import { voice } from "./voice.js";
import { owl } from "./owl.js";
import { href } from "../router.js";

/** back: { href, label, icon } — on a map it is Home with the child's owl. */
export function topbar({ back, middle = null, extra = [] }) {
  const bar = el("div", "topbar");
  const a = link("icon-btn", back.href);
  a.setAttribute("aria-label", back.label);
  if (back.kid) {
    a.classList.add("who");
    a.append(state.kid ? owl(state.kid.hat, "who-animal") : el("span", "who-animal", "🏠"));
    if (state.kid?.name) a.append(el("span", "who-name", state.kid.name));
  } else a.innerHTML = back.icon ?? icons.back;
  bar.append(a);
  bar.append(middle ?? el("div", "spacer"));
  if (middle) middle.classList.add("middle");
  for (const x of extra) bar.append(x);
  const hear = button("icon-btn sun", T.labels.hear);
  hear.innerHTML = icons.speaker;
  hear.addEventListener("click", () => voice.again());
  bar.append(hear);
  return bar;
}

/** The Home button for any screen (a small house), for screens deeper than the map. */
export function homeLink() {
  const a = link("icon-btn small", href.home());
  a.setAttribute("aria-label", T.labels.home);
  a.innerHTML = icons.home;
  return a;
}
