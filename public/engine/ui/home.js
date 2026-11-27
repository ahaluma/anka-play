// Home: who plays, then one door per map the child may open (content/universe.js HOME_DOORS).
// A guest (no child chosen) plays the Tal. The language switch is here too.

import { MAPS, HOME_DOORS, STATIONS } from "../../content/universe.js";
import { holds } from "../graph.js";
import { shared as T, LANGS, lang, setLang, num } from "../i18n.js";
import * as profiles from "../profiles.js";
import { state, facts, load } from "../app.js";
import { READY } from "../../ideas/index.js";
import { href, go } from "../router.js";
import { el, button, link } from "./parts.js";
import { sound } from "./sound.js";
import { voice } from "./voice.js";

/** A map can be entered when one of its stations has something to play. */
const mapReady = (id) => STATIONS.some((s) => s.map === id && s.ideas.every((i) => READY.includes(i)));

export function render(root) {
  const top = el("div", "topbar");
  top.append(el("h1", "logo", T.app));
  top.append(el("div", "spacer"));
  const langs = el("div", "langs");
  langs.setAttribute("aria-label", T.labels.language);
  for (const [code, l] of Object.entries(LANGS)) {
    const b = button("lang-btn" + (code === lang ? " on" : ""), l.name, l.short);
    b.addEventListener("click", () => setLang(code));
    langs.append(b);
  }
  top.append(langs);

  const who = el("section", "who-plays card");
  who.append(el("h2", "", T.home.whoPlays));
  const kids = el("div", "kids");
  who.append(kids);
  const form = el("form", "kid-form");
  form.hidden = true;
  who.append(form);

  const doors = el("section", "doors");
  root.append(top, who, doors, el("p", "foot", T.home.privacy));

  function drawKids() {
    kids.replaceChildren();
    const current = profiles.current();
    const tile = (animal, name, sub, on, onTap) => {
      const b = button("kid" + (on ? " on" : ""), name);
      b.append(el("span", "kid-animal", animal), el("span", "kid-name", name));
      if (sub) b.append(el("small", "", sub));
      b.addEventListener("click", onTap);
      kids.append(b);
    };
    for (const k of profiles.all()) {
      tile(k.animal, k.name || k.animal, T.home.years(num(profiles.age(k))), current?.id === k.id, () => pick(k.id));
    }
    tile("🙂", T.home.guest, "", !current, () => pick(null));
    tile("＋", T.home.add, "", false, openForm);
  }

  function pick(id) {
    sound.tap();
    profiles.choose(id);
    load();
    drawKids();
    drawDoors();
  }

  function openForm() {
    sound.tap();
    form.replaceChildren();
    const name = el("input", "field-input");
    name.name = "name";
    name.maxLength = 20;
    name.autocomplete = "off";
    name.placeholder = T.home.name;
    const ageRow = el("div", "age-row");
    ageRow.setAttribute("role", "radiogroup");
    ageRow.setAttribute("aria-label", T.home.age);
    let age = 5;
    for (let a = profiles.MIN_AGE; a <= profiles.MAX_AGE; a++) {
      const b = button("chip" + (a === age ? " on" : ""), T.home.years(num(a)), num(a));
      b.addEventListener("click", () => {
        age = a;
        for (const c of ageRow.children) c.classList.toggle("on", c === b);
      });
      ageRow.append(b);
    }
    const animals = el("div", "animal-row");
    animals.setAttribute("aria-label", T.home.animal);
    let animal = profiles.ANIMALS[0];
    for (const a of profiles.ANIMALS) {
      const b = button("chip animal" + (a === animal ? " on" : ""), a, a);
      b.addEventListener("click", () => {
        animal = a;
        for (const c of animals.children) c.classList.toggle("on", c === b);
      });
      animals.append(b);
    }
    const save = button("btn ok", T.home.save, T.home.save);
    save.type = "submit";
    const cancel = button("btn", T.home.cancel, T.home.cancel);
    cancel.addEventListener("click", () => (form.hidden = true));
    const row = el("div", "form-row");
    row.append(cancel, save);
    form.append(name, el("label", "", T.home.age), ageRow, el("label", "", T.home.animal), animals, row);
    form.onsubmit = (e) => {
      e.preventDefault();
      profiles.add({ name: name.value, age, animal });
      form.hidden = true;
      load();
      drawKids();
      drawDoors();
    };
    form.hidden = false;
    name.focus();
  }

  function drawDoors() {
    doors.replaceChildren(el("h2", "", T.home.whereTo));
    const f = facts();
    for (const m of MAPS) {
      const door = HOME_DOORS.find((d) => d.map === m.id);
      if (!holds(door?.requires ?? null, f)) continue;
      const ready = mapReady(m.id);
      const a = ready ? link(`door card map-${m.id}`, href.map(m.id)) : el("div", `door card map-${m.id} soon`);
      a.append(el("span", "door-art", ""), el("strong", "", T.maps[m.id].name), el("small", "", ready ? T.maps[m.id].note : T.home.soon));
      doors.append(a);
    }
  }

  drawKids();
  drawDoors();
  voice.aloud = profiles.readAloud(state.kid);
}
