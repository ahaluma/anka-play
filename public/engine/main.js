// The one page: shows the screen of the route. Each screen is a module in engine/ui/ with
// render(root, route) -> optional cleanup function.

import { parse } from "./router.js";
import { load, loadAll } from "./app.js";
import { voice } from "./ui/voice.js";

const root = document.getElementById("app");
const screens = {
  home: () => import("./ui/home.js"),
  map: () => import("./ui/map.js"),
  station: () => import("./ui/station.js"),
  play: () => import("./ui/play.js"),
  gate: () => import("./ui/play.js"),
  eltern: () => import("../eltern/eltern.js"),
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
  await loadAll();
  const mod = await screens[route.screen]();
  if (mine !== shown) return;
  root.replaceChildren();
  document.body.dataset.screen = route.screen;
  document.body.style.backgroundImage = "";
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
