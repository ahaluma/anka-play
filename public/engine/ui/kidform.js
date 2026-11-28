// The form for a child: name, age, their owl. Home uses it to add a child, the parents' page to add or change one.

import { shared as T, num } from "../i18n.js";
import * as profiles from "../profiles.js";
import { el, button } from "./parts.js";
import { owl } from "./owl.js";

/**
 * Fills `form` (a <form>) and shows it. kid: the child to change, or null for a new one.
 * onSave({ name, age, hat }) when the form is sent; onCancel() when it is closed.
 */
export function kidForm(form, { kid = null, onSave, onCancel, saveText = T.home.save }) {
  form.replaceChildren();
  const name = el("input", "field-input");
  name.name = "name";
  name.maxLength = 20;
  name.autocomplete = "off";
  name.placeholder = T.home.name;
  name.value = kid?.name ?? "";
  const ageRow = el("div", "age-row");
  ageRow.setAttribute("role", "radiogroup");
  ageRow.setAttribute("aria-label", T.home.age);
  let age = Math.min(profiles.MAX_AGE, profiles.age(kid) ?? 5);
  for (let a = profiles.MIN_AGE; a <= profiles.MAX_AGE; a++) {
    const b = button("chip" + (a === age ? " on" : ""), T.home.years(num(a)), num(a));
    b.addEventListener("click", () => {
      age = a;
      for (const c of ageRow.children) c.classList.toggle("on", c === b);
    });
    ageRow.append(b);
  }
  // The owls: the same owl in seven hats, side by side. Only the colour is shown, no word: any child takes any.
  const owls = el("div", "owl-row");
  owls.setAttribute("role", "radiogroup");
  owls.setAttribute("aria-label", T.home.owl);
  // A new child gets a hat nobody else has yet.
  let hat = kid?.hat ?? profiles.freeHat();
  for (const h of profiles.HATS) {
    const b = button("chip owl-pick-chip" + (h.id === hat ? " on" : ""), T.home.hats[h.id]);
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", String(h.id === hat));
    b.append(owl(h.id, ""));
    b.addEventListener("click", () => {
      hat = h.id;
      for (const c of owls.children) {
        c.classList.toggle("on", c === b);
        c.setAttribute("aria-checked", String(c === b));
      }
    });
    owls.append(b);
  }
  const save = button("btn ok", saveText, saveText);
  save.type = "submit";
  const cancel = button("btn", T.home.cancel, T.home.cancel);
  cancel.addEventListener("click", () => {
    form.hidden = true;
    onCancel?.();
  });
  const row = el("div", "form-row");
  row.append(cancel, save);
  form.append(name, el("label", "", T.home.age), ageRow, owls, row);
  form.onsubmit = (e) => {
    e.preventDefault();
    form.hidden = true;
    onSave({ name: name.value, age, hat });
  };
  form.hidden = false;
  name.focus();
}
