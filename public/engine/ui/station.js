// A station: its own background, its ideas (a choice first when there are several), the perspectives of the
// chosen idea (1 to 5) with their stars in the child's group, and the perspective to play next. Only the
// first perspective is open at first; each further one opens once the one before it is played (L.wayOpen).
// A station with first-visit questions that are still due sends the child to them first (engine/gate.js).

import { station as stationOf, map as mapOf, stationOpen, reachable } from "../graph.js";
import { PERSPECTIVES } from "../../content/perspectives.js";
import { shared as T, num } from "../i18n.js";
import { state, facts, idea as loadIdea, texts as loadTexts, age } from "../app.js";
import * as L from "../learner.js";
import * as gate from "../gate.js";
import * as profiles from "../profiles.js";
import { store } from "../store.js";
import { href, redirect } from "../router.js";
import { el, button, link } from "./parts.js";
import { topbar, homeLink } from "./topbar.js";
import { voice } from "./voice.js";
import { sound } from "./sound.js";

/** The background of a station: art/<map>/<station>.svg over the map's own. */
export function backdrop(s) {
  const look = mapOf(s.map)?.look;
  if (look) document.body.dataset.look = look; // the Berg: notebook paper instead of a picture (app.css)
  else document.body.style.backgroundImage = `url("art/${s.map}/${s.id}.svg"), url("art/${s.map}/station.svg")`;
}

/** How a group is named: a number range ("Zahlen bis 10"), or a level ("Stufe 2") when the idea says `levels`. */
export const groupName = (g, def) => (def?.levels ? T.stationText.levelPlain(num(g)) : T.stationText.level(num(g)));

export async function render(root, route) {
  const s = stationOf(route.station);
  const f = facts();
  if (!s || !f.ready(s.id) || !reachable(f).has(s.id) || !stationOpen(s.id, f)) return redirect(href.map(s?.map ?? "tal"));
  const m = mapOf(s.map);
  voice.aloud = profiles.readAloud(state.kid, m.band);
  store.set("last", s.id);
  backdrop(s);

  const ideaId = s.ideas.includes(route.idea) ? route.idea : (s.ideas.includes(store.get(`idea:${s.id}`, null)) ? store.get(`idea:${s.id}`) : s.ideas[0]);
  store.set(`idea:${s.id}`, ideaId);
  const def = await loadIdea(ideaId);
  const many = s.ideas.length > 1;

  if (gate.due(state.rec, s.id, def)) return redirect(href.gate(s.id));

  const caption = el("p", "caption");
  root.append(
    topbar({ back: { href: href.map(s.map), label: T.labels.map }, middle: el("h1", "title", T.stations[s.id] ?? s.id), extra: [homeLink()] }),
    caption,
  );
  voice.mount({ caption });

  const panel = el("section", "station card");
  root.append(panel);

  if (many) {
    const tabs = el("div", "idea-tabs");
    for (const id of s.ideas) {
      const a = link("idea-tab" + (id === ideaId ? " on" : ""), href.station(s.id, id), T.ideas[id]?.name ?? id);
      a.setAttribute("aria-current", String(id === ideaId));
      tabs.append(a);
    }
    panel.append(tabs);
  }

  const lv = L.level(state.rec, def, age());
  const g = L.groupOf(def, lv);
  const step = def.rungName?.(L.rung(def, lv), await loadTexts(ideaId)); // a sub-step of the range (Feld)
  const head = el("div", "station-head");
  head.append(el("span", "station-icon", s.icon ?? ""), el("div", "", ""));
  head.lastChild.append(el("strong", "", T.ideas[ideaId]?.about ?? ""));
  if (!L.isGame(def) && L.groups(def).length > 1) head.lastChild.append(el("small", "", groupName(g, def) + (step ? ` · ${step}` : "")));
  panel.append(head);

  const names = T.perspectives[m.perspectiveNames] ?? T.perspectives.standard;
  const next = L.suggest(state.rec, def, age());
  const list = el("ul", "persp");
  for (const p of def.perspectives.map((id) => PERSPECTIVES.find((x) => x.id === id))) { // in the idea's order
    const star = L.starred(state.rec, def, p.id, g);
    const played = L.played(state.rec, def.id, p.id);
    const open = L.wayOpen(state.rec, def, p.id);
    // A way not open yet: greyed, with a lock, and no link. It opens when the way before it has been played.
    const a = open ? link(`persp-item${star ? " star" : played ? " played" : ""}${p.id === next ? " next" : ""}`, href.play(s.id, ideaId, p.id, many)) : el("span", "persp-item locked");
    a.append(el("span", "p-icon", p.icon), el("span", "p-name", names[p.id]), el("span", "p-state", star ? "⭐" : played ? "🌱" : open ? "" : "🔒"));
    a.setAttribute("aria-label", `${names[p.id]}${star ? " · " + T.stationText.star : played ? " · " + T.stationText.played : open ? "" : " · " + T.stationText.locked}`);
    if (open) a.addEventListener("click", () => sound.tap());
    else a.setAttribute("aria-disabled", "true");
    const li = el("li");
    li.append(a);
    list.append(li);
  }
  panel.append(list);

  voice.tell(many ? T.stationText.pickIdea : T.stationText.pickWay);
}
