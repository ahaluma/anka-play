// A station: its own background, its ideas (a choice first when there are several), the perspectives of the
// chosen idea (1 to 5) with their stars in the child's group, and the perspective to play next.
// A station with first-visit questions that are still due sends the child to them first (engine/gate.js).

import { station as stationOf, map as mapOf, stationOpen, reachable } from "../graph.js";
import { PERSPECTIVES } from "../../content/perspectives.js";
import { shared as T, num } from "../i18n.js";
import { state, facts, idea as loadIdea, age } from "../app.js";
import * as L from "../learner.js";
import * as gate from "../gate.js";
import * as profiles from "../profiles.js";
import { store } from "../store.js";
import { href, go } from "../router.js";
import { el, button, link } from "./parts.js";
import { topbar, homeLink } from "./topbar.js";
import { voice } from "./voice.js";
import { sound } from "./sound.js";

/** The background of a station: art/<map>/<station>.svg over the map's own. */
export function backdrop(s) {
  document.body.style.backgroundImage = `url("art/${s.map}/${s.id}.svg"), url("art/${s.map}/station.svg")`;
}

/** How a group is named: a number range ("Zahlen bis 10"), or a level ("Stufe 2") when the idea says `levels`. */
export const groupName = (g, def) => (def?.levels ? T.stationText.levelPlain(num(g)) : T.stationText.level(num(g)));

export async function render(root, route) {
  const s = stationOf(route.station);
  const f = facts();
  if (!s || !f.ready(s.id) || !reachable(f).has(s.id) || !stationOpen(s.id, f)) return go(href.map(s?.map ?? "tal"));
  const m = mapOf(s.map);
  voice.aloud = profiles.readAloud(state.kid);
  store.set("last", s.id);
  backdrop(s);

  const ideaId = s.ideas.includes(route.idea) ? route.idea : (s.ideas.includes(store.get(`idea:${s.id}`, null)) ? store.get(`idea:${s.id}`) : s.ideas[0]);
  store.set(`idea:${s.id}`, ideaId);
  const def = await loadIdea(ideaId);
  const many = s.ideas.length > 1;

  if (gate.due(state.rec, s.id, def)) return go(href.gate(s.id));

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

  const g = L.groupOf(def, L.level(state.rec, def, age()));
  const head = el("div", "station-head");
  head.append(el("span", "station-icon", s.icon ?? ""), el("div", "", ""));
  head.lastChild.append(el("strong", "", T.ideas[ideaId]?.about ?? ""));
  if (!L.isGame(def) && L.groups(def).length > 1) head.lastChild.append(el("small", "", groupName(g, def)));
  panel.append(head);

  const names = T.perspectives[m.perspectiveNames] ?? T.perspectives.standard;
  const next = L.suggest(state.rec, def, age());
  const list = el("ul", "persp");
  for (const p of PERSPECTIVES.filter((x) => def.perspectives.includes(x.id))) {
    const star = L.starred(state.rec, def, p.id, g);
    const played = L.played(state.rec, def.id, p.id);
    const a = link(`persp-item${star ? " star" : played ? " played" : ""}${p.id === next ? " next" : ""}`, href.play(s.id, ideaId, p.id, many));
    a.append(el("span", "p-icon", p.icon), el("span", "p-name", names[p.id]), el("span", "p-state", star ? "⭐" : played ? "🌱" : ""));
    a.setAttribute("aria-label", `${names[p.id]}${star ? " · " + T.stationText.star : played ? " · " + T.stationText.played : ""}`);
    a.addEventListener("click", () => sound.tap());
    const li = el("li");
    li.append(a);
    list.append(li);
  }
  panel.append(list);

  voice.tell(many ? T.stationText.pickIdea : T.stationText.pickWay);
}
