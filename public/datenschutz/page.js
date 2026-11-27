// The privacy policy (/datenschutz/), a separate static page. Texts per language in lang/<code>.js (German is
// the binding one), the operator's contact details in contact.js.

import { textsIn, shared as S, lang, LANGS, DEFAULT_LANG } from "../engine/i18n.js";
import { icons } from "../engine/ui/parts.js";
import { CONTACT, UPDATED } from "./contact.js";

const T = await textsIn(new URL("./lang/", import.meta.url));
document.title = `${T.title} · AnkaPlay`;
const $ = (id) => document.getElementById(id);
$("title").textContent = T.title;
$("home").innerHTML = icons.home;
$("home").setAttribute("aria-label", S.labels.home);

const el = (tag, text) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  return e;
};

const [y, m, d] = UPDATED.split("-").map(Number);
const text = $("text");
text.append(el("p", T.updated(new Date(y, m - 1, d).toLocaleDateString(LANGS[lang].voice))));
if (lang !== DEFAULT_LANG && T.note) text.append(el("p", T.note));

for (const s of T.sections(CONTACT).filter(Boolean)) {
  text.append(el("h2", s.h));
  for (const p of s.p || []) text.append(el("p", p));
  if (s.list) {
    const ul = el("ul");
    for (const item of s.list) ul.append(el("li", item));
    text.append(ul);
  }
}
