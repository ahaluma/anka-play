// The one page: shows the screen of the route. Each screen is a module in engine/ui/ with
// render(root, route) -> optional cleanup function.

import { parse } from "./router.js";
import { load } from "./app.js";
import { voice } from "./ui/voice.js";

const root = document.getElementById("app");
const screens = {
  home: () => import("./ui/home.js"),
  teich: () => import("../offen/teich.js"),
  apfelbaum: () => import("../offen/apfelbaum.js"),
  bau: () => import("../offen/bau.js"),
};

let cleanup = null;
let shown = 0;

async function show() {
  const route = parse();
  const mine = ++shown;
  voice.clear();
  cleanup?.();
  cleanup = null;
  load();
  const mod = await screens[route.screen]();
  if (mine !== shown) return;
  root.replaceChildren();
  document.body.dataset.screen = route.screen;
  document.body.style.backgroundImage = "";
  delete document.body.dataset.look;
  document.body.classList.remove("in-round");
  window.scrollTo(0, 0);
  cleanup = (await mod.render(root, route)) ?? null;
}

window.addEventListener("hashchange", show);
show();

// Works without a connection after the first visit (sw.js). Network first, so a change still shows at once.
// (The modules wait for their texts, so the page may have loaded already.)
if ("serviceWorker" in navigator) {
  const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
  if (document.readyState === "complete") register();
  else addEventListener("load", register);
}
