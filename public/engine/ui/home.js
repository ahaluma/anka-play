// Home: who plays (each child with their owl), the language switch, and the door to the pond.
// A guest (no child chosen) plays with the owl without a hat.

import { shared as T, LANGS, lang, setLang, num } from "../i18n.js";
import * as profiles from "../profiles.js";
import { state, load } from "../app.js";
import { href } from "../router.js";
import { el, button, link } from "./parts.js";
import { sound } from "./sound.js";
import { voice } from "./voice.js";
import { kidForm } from "./kidform.js";
import { owl } from "./owl.js";

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

  // The door to the pond, with the owl of the child playing now.
  const doors = el("section", "doors");
  doors.append(el("h2", "", T.home.whereTo));
  const door = link("door card door-teich", href.teich());
  const art = el("span", "door-art", "");
  door.append(art, el("strong", "", T.home.pond), el("small", "", T.home.pondNote));
  doors.append(door);

  const foot = el("p", "foot", T.home.privacy + " ");
  foot.append(link("", "/datenschutz/", T.home.privacyLink));
  const bottom = el("div", "home-foot");
  bottom.append(foot);
  root.append(top, who, doors, bottom);

  function drawKids() {
    kids.replaceChildren();
    const current = profiles.current();
    const tile = (face, name, sub, on, onTap) => {
      const b = button("kid" + (on ? " on" : ""), name);
      b.append(typeof face === "string" ? el("span", "kid-animal", face) : face, el("span", "kid-name", name));
      if (sub) b.append(el("small", "", sub));
      b.addEventListener("click", onTap);
      kids.append(b);
    };
    for (const k of profiles.all()) {
      tile(owl(k.hat, "kid-animal"), k.name || "", T.home.years(num(profiles.age(k))), current?.id === k.id, () => pick(k.id));
    }
    tile(owl(null, "kid-animal"), T.home.guest, "", !current, () => pick(null));
    tile("＋", T.home.add, "", false, openForm);
    art.replaceChildren(owl(state.kid?.hat ?? null, "door-owl"));
  }

  function pick(id) {
    sound.tap();
    profiles.choose(id);
    load();
    drawKids();
  }

  function openForm() {
    sound.tap();
    kidForm(form, {
      onSave: (kid) => {
        profiles.add(kid);
        load();
        drawKids();
      },
    });
  }

  drawKids();
  voice.aloud = profiles.readAloud(state.kid);
}
