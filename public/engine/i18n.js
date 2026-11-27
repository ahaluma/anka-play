// Languages. Every text a child hears or a parent reads lives in a language file:
//
//   lang/<code>.js                 shared words: numbers, praise, buttons, names of maps, stations, things
//   ideas/<id>/lang/<code>.js      the sentences of one idea
//
// German fills every gap of another language. Sentences are small functions, because each language has
// its own grammar: (v, h) => `Es sind ${h.w(v.n)}.` with v = the task's vars and h = helpers (below).

import { store } from "./store.js";

export const LANGS = {
  de: { name: "Deutsch", short: "DE", voice: "de-DE" },
  en: { name: "English", short: "EN", voice: "en-GB" },
  // Not every phone has a Nepali voice: then a Hindi voice reads the Devanagari text.
  ne: { name: "नेपाली", short: "ने", voice: "ne-NP", fallbackVoices: ["hi-IN"], digits: "०१२३४५६७८९" },
};
export const DEFAULT_LANG = "de";

function detect() {
  const saved = store.get("lang", null);
  if (saved && LANGS[saved]) return saved;
  for (const l of globalThis.navigator?.languages ?? []) {
    const code = l.slice(0, 2).toLowerCase();
    if (LANGS[code]) return code;
  }
  return DEFAULT_LANG;
}

export const lang = detect();
if (globalThis.document) document.documentElement.lang = lang;

/** A number in this language's digits: 3 -> "3", or "३" in Nepali. */
export function num(n) {
  const digits = LANGS[lang].digits;
  return digits ? String(n).replace(/[0-9]/g, (d) => digits[d]) : String(n);
}

export function setLang(code) {
  if (!LANGS[code] || code === lang) return;
  store.set("lang", code);
  location.reload();
}

/** Objects merge deeply, so a language file may leave out single sentences. */
function merge(a, b) {
  if (!b) return a;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = v && typeof v === "object" && !Array.isArray(v) && a?.[k] && typeof a[k] === "object" && !Array.isArray(a[k]) ? merge(a[k], v) : v;
  }
  return out;
}

async function load(url) {
  try {
    return (await import(url)).default;
  } catch {
    return null; // no file for this language: German fills the gaps
  }
}

const codes = lang === DEFAULT_LANG ? [DEFAULT_LANG] : [DEFAULT_LANG, lang];

/** The texts in a folder (".../lang/"), German first, the chosen language over it. */
export async function textsIn(base) {
  const parts = await Promise.all(codes.map((c) => load(new URL(`${c}.js`, base).href)));
  return parts.reduce(merge, {});
}

/** The shared words (lang/<code>.js). */
export const shared = await textsIn(new URL("../lang/", import.meta.url));

/** The shared words as a map speaks them: a map may have its own voice (lang/<code>.js, voices.<map>), which
 *  takes the place of the shared sentences it names (the Berg: the expedition's logbook). */
export const voiceOf = (mapId) => merge(shared, shared.voices?.[mapId]);

/** Helpers every sentence gets as its second argument. */
export const helpers = {
  w: (n) => shared.numbers?.[n] ?? num(n), // the number word ("drei"), for the voice
  n: num, // the number in digits
  thing: (id) => shared.things?.[id] ?? { one: id, many: id },
  big: (text) => (text ? text[0].toUpperCase() + text.slice(1) : text),
};

/** A sentence: a string, or a function of (v, h). Missing: "". */
export function say(entry, v = {}) {
  if (typeof entry === "function") return entry(v, helpers);
  return typeof entry === "string" ? entry : "";
}
