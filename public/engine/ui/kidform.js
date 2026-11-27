// The form for a child: name, age, animal. Home uses it to add a child, the parents' page to add or change one.

import { shared as T, num } from "../i18n.js";
import * as profiles from "../profiles.js";
import { el, button } from "./parts.js";

/**
 * Fills `form` (a <form>) and shows it. kid: the child to change, or null for a new one.
 * onSave({ name, age, animal }) when the form is sent; onCancel() when it is closed.
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
  const animals = el("div", "animal-row");
  animals.setAttribute("aria-label", T.home.animal);
  // A new child gets an animal nobody else has yet.
  let animal = kid?.animal ?? profiles.ANIMALS.find((a) => !profiles.all().some((k) => k.animal === a)) ?? profiles.ANIMALS[0];
  for (const a of profiles.ANIMALS) {
    const b = button("chip animal" + (a === animal ? " on" : ""), a, a);
    b.addEventListener("click", () => {
      animal = a;
      for (const c of animals.children) c.classList.toggle("on", c === b);
    });
    animals.append(b);
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
  form.append(name, el("label", "", T.home.age), ageRow, el("label", "", T.home.animal), animals, row);
  form.onsubmit = (e) => {
    e.preventDefault();
    form.hidden = true;
    onSave({ name: name.value, age, animal });
  };
  form.hidden = false;
  name.focus();
}
