// A map: one natural scene (art/<map>/scene.svg) with its stations at their places (content/universe.js,
// positions in a 1000 × 600 picture). What is drawn follows engine/graph.js: visible stations only (the fog
// lifts when a way opens), a lock on a closed door, a sleeping station where nothing is written yet.
// The owl stands at the station the journey leads to next (graph next(), the map's `guide`):
//   tour     the Tal: after a round the owl walks the child there (#/map/tal?walk=wiese,bau)
//   hint     the station is marked, the child may go anywhere
//   glimpse  the Berg: as hint, and near stations still in the fog are drawn as a cloud; a tap says what opens
//            the way to them (graph glimpse()), to make older children curious
// A portal is drawn where it leaves this map (its `pos`): the stepping stones to the river, the bridge to the
// field. Open, it takes the child to the station on the other side (its first-visit questions come first);
// closed, it shows a lock, like a closed door.

import { STATIONS, EDGES } from "../../content/universe.js";
import { map as mapOf, station as stationOf, visible, stationOpen, reachable, edgeOpen, next as nextOf, glimpse, isMastered } from "../graph.js";
import { shared as T, num, textsIn } from "../i18n.js";
import { state, facts } from "../app.js";
import { store } from "../store.js";
import * as profiles from "../profiles.js";
import * as L from "../learner.js";
import { href, go, redirect } from "../router.js";
import { el, button, wait } from "./parts.js";
import { topbar } from "./topbar.js";
import { voice } from "./voice.js";
import { sound, celebrate } from "./sound.js";

const SVG = "http://www.w3.org/2000/svg";
const W = 1000;
const H = 600;

export async function render(root, route) {
  const m = mapOf(route.map);
  if (!m) return redirect(href.home());
  voice.aloud = profiles.readAloud(state.kid);
  const f = facts();
  const can = reachable(f);
  const here = STATIONS.filter((s) => s.map === m.id);

  const caption = el("p", "caption");
  root.append(topbar({ back: { href: href.home(), label: T.labels.home, kid: true }, middle: el("h1", "title", T.maps[m.id].name) }), caption);
  voice.mount({ caption });

  const wrap = el("div", "map-wrap card");
  const scene = el("div", `map-scene map-${m.id}`);
  scene.style.backgroundImage = `url("art/${m.id}/scene.svg")`;
  wrap.append(scene);
  root.append(wrap);

  // The paths between drawn stations, as a dashed trail.
  const shown = new Set(here.filter((s) => visible(s.id, f) && can.has(s.id)).map((s) => s.id));
  const trails = document.createElementNS(SVG, "svg");
  trails.setAttribute("viewBox", `0 0 ${W} ${H}`);
  trails.setAttribute("class", "trails");
  trails.setAttribute("aria-hidden", "true");
  for (const e of EDGES) {
    if (e.kind !== "path" || e.from > e.to || !shown.has(e.from) || !shown.has(e.to)) continue;
    const a = stationOf(e.from).pos;
    const b = stationOf(e.to).pos;
    const line = document.createElementNS(SVG, "path");
    const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.12;
    const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.12;
    line.setAttribute("d", `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`);
    trails.append(line);
  }
  scene.append(trails);

  // The stations.
  const nodes = {};
  for (const s of here) {
    if (!shown.has(s.id)) continue;
    const ready = f.ready(s.id);
    const open = stationOpen(s.id, f);
    const b = button("spot", T.stations[s.id] ?? s.id);
    b.style.left = `${(s.pos.x / W) * 100}%`;
    b.style.top = `${(s.pos.y / H) * 100}%`;
    const disc = el("span", "spot-icon", s.icon ?? "•");
    b.append(disc);
    // Names only where there is something to play: a sleeping station keeps the map calm (its name is read).
    if (ready) b.append(el("span", "spot-name", T.stations[s.id] ?? s.id));
    const mark = (text, cls = "") => disc.append(el("span", "spot-mark " + cls, text));
    if (!ready) {
      b.classList.add("asleep");
      mark("💤");
    } else if (!open) {
      b.classList.add("locked");
      mark("🔒");
    } else {
      const stars = s.ideas.reduce((n, i) => {
        const def = state.defs[i];
        if (!def || L.isGame(def)) return n;
        const g = L.groupOf(def, L.level(state.rec, def, f.age));
        return n + def.perspectives.filter((p) => L.starred(state.rec, def, p, g)).length;
      }, 0);
      if (f.mastered(s.id) && !s.game) mark("🏅", "gold");
      else if (stars) mark(`⭐${stars > 1 ? stars : ""}`);
    }
    b.addEventListener("click", () => {
      sound.tap();
      if (!ready) return void voice.tell(T.mapText.asleep);
      if (!open) return void voice.tell(T.mapText.locked);
      store.set("last", s.id);
      go(href.station(s.id));
    });
    scene.append(b);
    nodes[s.id] = b;
  }

  // glimpse (Berg): near stations still in the fog, as clouds. A tap says what opens the way.
  if (m.guide === "glimpse") {
    const seen = new Set();
    for (const id of shown) {
      for (const g of glimpse(id, f)) {
        const s = stationOf(g.id);
        if (seen.has(g.id) || shown.has(g.id) || s.map !== m.id || !f.ready(g.id)) continue;
        seen.add(g.id);
        const what = needs(g.opens, f);
        const b = button("spot fog", T.mapText.fog);
        b.style.left = `${(s.pos.x / W) * 100}%`;
        b.style.top = `${(s.pos.y / H) * 100}%`;
        b.append(el("span", "spot-icon", "☁️"));
        b.addEventListener("click", () => {
          sound.tap();
          voice.tell(`${T.mapText.fog} ${what ? T.mapText.opens(what) : ""}`.trim());
        });
        scene.append(b);
      }
    }
  }

  // The ways to other maps.
  const PORTAL = { "stepping-stones": "🪨", bridge: "🌉", "mountain-path": "🥾" };
  for (const e of EDGES) {
    if (e.kind !== "portal" || !shown.has(e.from) || !e.pos || !f.ready(e.to)) continue;
    const to = stationOf(e.to);
    const open = edgeOpen(e, f) && stationOpen(e.to, f);
    const b = button("portal-sign" + (open ? "" : " locked"), `${T.maps[to.map].name}: ${T.stations[to.id] ?? to.id}`);
    b.style.left = `${(e.pos.x / W) * 100}%`;
    b.style.top = `${(e.pos.y / H) * 100}%`;
    b.append(el("span", "portal-icon", PORTAL[e.icon] ?? "➜"), el("span", "portal-name", open ? T.maps[to.map].name : "🔒"));
    b.addEventListener("click", () => {
      sound.tap();
      if (!open) return void voice.tell(T.mapText.locked);
      store.set("last", to.id);
      go(href.station(to.id));
    });
    scene.append(b);
  }

  // The owl: where the journey goes on. From the station played last (or the map's entry).
  const [walkFrom, walkTo] = (route.q.walk ?? "").split(",");
  const last = stationOf(store.get("last", null))?.map === m.id ? store.get("last", null) : m.entry;
  const stay = f.ready(last) && stationOpen(last, f) && !f.mastered(last) && !stationOf(last).game;
  const target = walkTo && nodes[walkTo] ? walkTo : stay ? last : nextOf(last, f);
  const owl = button("owl-guide", T.mapText.owl, "🦉");
  const place = (id) => {
    const p = stationOf(id).pos;
    owl.style.left = `${(p.x / W) * 100}%`;
    owl.style.top = `${(p.y / H) * 100}%`;
  };
  if (target && nodes[target]) {
    nodes[target].classList.add("next");
    place(walkFrom && nodes[walkFrom] ? walkFrom : target);
    owl.addEventListener("click", () => {
      sound.tap();
      store.set("last", target);
      go(href.station(target));
    });
    scene.append(owl);
  }
  centre(wrap, scene, stationOf(walkFrom || target || last)?.pos);

  if (m.keepsake) await keepsake(root, m, here.filter((s) => shown.has(s.id)), f);

  if (walkFrom && walkTo && nodes[walkTo]) {
    // The tour: the owl walks along the path, the child follows, and the station opens.
    await wait(400);
    owl.classList.add("walking");
    place(walkTo);
    centre(wrap, scene, stationOf(walkTo).pos, true);
    await voice.tell(T.round.follow(T.stations[walkTo]));
    await wait(300);
    if (location.hash.includes("walk=")) {
      store.set("last", walkTo);
      // The walk is over: back from the station is the map itself, not the walk again.
      history.replaceState(history.state, "", href.map(m.id));
      go(href.station(walkTo));
    }
    return;
  }
  voice.tell(T.mapText.whereTo);
}

/** A station that came out of the fog for the first time (once per child): the surprise, and a picture to save
 *  (think-lab's Denk-Berg, boards/berg/keepsake.js). The last station of the map (the summit) is a surprise of its own. */
async function keepsake(root, m, drawn, f) {
  const KEY = `seen:${m.id}:${state.kid?.id ?? "guest"}`;
  const seen = store.get(KEY, [m.entry]);
  const fresh = drawn.filter((s) => !seen.includes(s.id));
  if (!fresh.length) return;
  store.set(KEY, [...seen, ...fresh.map((s) => s.id)]);
  const [{ keepsake: draw }, words] = await Promise.all([import("../../boards/berg/keepsake.js"), textsIn(new URL("../../boards/berg/lang/", import.meta.url))]);
  const B = words.berg;
  const K = B.keep;
  const all = STATIONS.filter((s) => s.map === m.id);
  const c = fresh.find((s) => s === all.at(-1)) ?? fresh.at(-1);
  const top = c === all.at(-1);
  const rank = all.indexOf(c) + 1;
  const name = state.kid?.name ?? "";
  const tools = drawn.filter((s) => isMastered(s.id, f) && B.tools[s.id]).map((s) => B.tools[s.id]);
  const solved = all.flatMap((s) => s.ideas).reduce((n, i) => n + Object.values(state.rec.ideas[i]?.cells ?? {}).reduce((k, x) => k + (x.n ?? 0) + (x.extra ?? 0), 0), 0);
  const reached = [...drawn.filter((s) => s !== c), c]; // every camp in sight, the new one last
  const picture = draw({
    title: T.maps[m.id].name,
    headline: top ? K.summitHeadline(name) : K.headline(name, num(rank)),
    camp: T.stations[c.id] ?? c.id,
    lines: [...(tools.length ? [K.tools(tools)] : []), K.solved(num(solved))],
    date: new Date().toLocaleDateString(K.locale, { day: "numeric", month: "long", year: "numeric" }),
    brand: T.app,
    animal: state.kid?.animal || "🐰",
    camps: reached.map((s) => [s.pos.x, s.pos.y]),
  });
  const title = top ? K.summitTitle : K.title;
  const text = top ? K.summitText : K.text(T.stations[c.id] ?? c.id);
  const box = el("section", "reached card pop");
  const img = el("img", "reached-img");
  img.src = picture.toDataURL("image/png");
  img.alt = K.alt;
  const save = button("btn go", K.save, K.save);
  const close = button("btn", K.close, K.close);
  save.addEventListener("click", () => {
    sound.tap();
    const a = document.createElement("a");
    a.href = img.src;
    a.download = `${m.id}-${rank}.png`;
    a.click();
    voice.tell(K.saved);
  });
  close.addEventListener("click", () => {
    sound.tap();
    box.remove();
  });
  const btns = el("div", "reached-btns");
  btns.append(save, close);
  box.append(el("h2", "", title), el("p", "", text), img, btns);
  root.append(box);
  sound.win();
  celebrate();
  await voice.tell(`${title} ${text} ${K.offer}`);
}

/** What a condition still needs, in words ("when you have done The fence"), or "" when it cannot be said. */
export function needs(cond, f) {
  if (!cond || cond === "always") return "";
  const [type, arg] = Object.entries(cond)[0] ?? [];
  const N = T.mapText.need;
  const names = (ids) => ids.map((id) => T.stations[id] ?? id).join(T.mapText.and);
  switch (type) {
    case "mastered": {
      const left = arg.filter((id) => !isMastered(id, f));
      return left.length ? N.mastered(names(left)) : "";
    }
    case "age":
      return N.age(num(arg));
    case "parent":
      return N.parent;
    case "flag":
      return N.flag(T.stations[arg.station] ?? arg.station);
    case "any":
    case "all":
      return arg.map((c) => needs(c, f)).filter(Boolean).join(type === "any" ? T.mapText.or : T.mapText.and);
    default:
      return "";
  }
}

/** On a narrow phone the map is wider than the screen: show the part around a station. */
function centre(wrap, scene, pos, smooth = false) {
  if (!pos) return;
  requestAnimationFrame(() => {
    const x = (pos.x / W) * scene.clientWidth - wrap.clientWidth / 2;
    wrap.scrollTo({ left: Math.max(0, x), behavior: smooth ? "smooth" : "auto" });
  });
}
