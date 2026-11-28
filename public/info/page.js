// For parents (/info/), a separate static page like the privacy policy: every map, every station, what a child
// does and learns there, and why AnkaPlay is built this way. Order, icons and names come from the universe and
// the shared words, so the page follows the game; the explanations are in lang/<code>.js (German fills gaps).

import { MAPS, STATIONS } from "../content/universe.js";
import { PERSPECTIVES } from "../content/perspectives.js";
import { READY } from "../ideas/index.js";
import { textsIn, shared, lang, DEFAULT_LANG } from "../engine/i18n.js";
import { icons } from "../engine/ui/parts.js";

const T = await textsIn(new URL("./lang/", import.meta.url));
// German, English and Nepali have their own explanations. A language without them gets the German page, and then
// the names of maps, stations and ways come in German too, so a sentence never mixes two languages; only the frame
// (title, back, note) is translated.
const own = lang === DEFAULT_LANG || (await import(`./lang/${lang}.js`).then((m) => !!m.default.stations, () => false));
const S = own ? shared : (await import("../lang/de.js")).default;
if (!own) document.querySelector("#page").lang = DEFAULT_LANG;
document.title = `${T.title} · ${shared.app}`;
const $ = (id) => document.getElementById(id);
$("title").textContent = T.title;
$("back").innerHTML = icons.back;
$("back").setAttribute("aria-label", T.back);

const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};
const paras = (box, list) => (list ?? []).forEach((p) => box.append(el("p", "", p)));

/** A list of ways to play: icon, name (from the shared words of the map), what it is. In the order they are
 *  written: at a station that is the order the child plays them (tools/check-engine.mjs checks it). */
function waysList(ways, names) {
  const ul = el("ul", "ways");
  for (const p of Object.keys(ways ?? {}).map((id) => PERSPECTIVES.find((x) => x.id === id)).filter(Boolean)) {
    if (!ways[p.id]) continue;
    const li = el("li");
    const what = el("div");
    what.append(el("strong", "", names[p.id]), el("span", "", ways[p.id]));
    li.append(el("span", "w-icon", p.icon), what);
    ul.append(li);
  }
  return ul;
}

const page = $("page");
page.append(...T.intro.map((p) => el("p", "intro", p)));

// Contents
const toc = el("nav", "card toc");
toc.append(el("h2", "", T.contents));
const tocList = el("ul");
const tocItem = (href, text) => {
  const li = el("li");
  const a = el("a", "", text);
  a.href = href;
  li.append(a);
  tocList.append(li);
};
tocItem("#so-spielt", T.basics.h);
for (const m of MAPS) tocItem(`#${m.id}`, `${S.maps[m.id].name} · ${T.ageOf[m.id]}`);
tocItem("#warum", T.why.h);
toc.append(tocList);
page.append(toc);

// How a child plays
const basics = el("section", "card text");
basics.id = "so-spielt";
basics.append(el("h2", "", T.basics.h));
paras(basics, T.basics.p);
basics.append(waysList(T.ways, S.perspectives.standard));
paras(basics, T.basics.after);
page.append(basics);

// The maps, station by station
for (const m of MAPS) {
  const names = S.perspectives[m.perspectiveNames] ?? S.perspectives.standard;
  const sec = el("section", `card text map map-${m.id}`);
  sec.id = m.id;
  const head = el("div", "map-head");
  head.append(el("h2", "", S.maps[m.id].name), el("span", "age", T.ageOf[m.id]));
  sec.append(head);
  paras(sec, T.maps[m.id]);
  if (T.maps[`${m.id}Ways`]) sec.append(waysList(T.maps[`${m.id}Ways`], names));
  paras(sec, T.maps[`${m.id}After`]);

  for (const s of STATIONS.filter((x) => x.map === m.id && x.ideas.every((i) => READY.includes(i)))) {
    const t = T.stations[s.id];
    if (!t) continue;
    const st = el("details", "station");
    st.id = s.id;
    const sum = el("summary");
    sum.append(el("span", "st-icon", s.icon), el("span", "st-name", S.stations[s.id] ?? s.id), el("span", "st-idea", s.ideas.map((i) => S.ideas[i]?.name ?? "").join(" · ")));
    st.append(sum);
    // a station with two ideas explains the second one below the first, in the same way
    for (const [i, part] of [t, t.second].filter(Boolean).entries()) {
      if (i > 0) st.append(el("h3", "second-idea", S.ideas[s.ideas[i]]?.name ?? ""));
      st.append(el("p", "", part.idea));
      if (part.ways) st.append(el("h4", "", T.labels.ways), waysList(part.ways, names));
      if (part.example) st.append(el("p", "example", part.example));
      if (part.steps) st.append(el("h4", "", T.labels.steps), el("p", "", part.steps));
      st.append(el("h4", "", T.labels.learns), el("p", "learns", part.learns));
    }
    sec.append(st);
  }
  page.append(sec);
}

// Why it works
const why = el("section", "card text");
why.id = "warum";
why.append(el("h2", "", T.why.h));
for (const item of T.why.items) why.append(el("h3", "", item.h), el("p", "", item.p));
page.append(why);

if (T.note) {
  const note = el("p", "note", T.note);
  note.lang = lang;
  page.prepend(note);
}

