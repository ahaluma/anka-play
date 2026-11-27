// The state of the app in the browser: who plays, their learner record, the loaded ideas and texts.
// Screens (engine/ui/*.js) read and change it; save() writes the record back to this device.

import * as profiles from "./profiles.js";
import { store } from "./store.js";
import * as L from "./learner.js";
import { textsIn } from "./i18n.js";
import { READY } from "../ideas/index.js";

export const state = { kid: null, rec: null, defs: {}, texts: {} };

const recKey = () => `learner:${state.kid?.id ?? "guest"}`;

/** (Re)load who plays and their record. */
export function load() {
  state.kid = profiles.current();
  state.rec = L.valid(store.get(recKey(), null), state.kid?.id ?? "guest");
}

export function save() {
  store.set(recKey(), state.rec);
}

export const age = () => profiles.age(state.kid);

/** An idea's definition (ideas/<id>/idea.js), or null when it is not written yet. */
export async function idea(id) {
  if (!READY.includes(id)) return null;
  if (!state.defs[id]) state.defs[id] = (await import(`../ideas/${id}/idea.js`)).IDEA;
  return state.defs[id];
}

/** An idea's sentences in the chosen language (German fills gaps). */
export async function texts(id) {
  if (!state.texts[id]) state.texts[id] = await textsIn(new URL(`../ideas/${id}/lang/`, import.meta.url));
  return state.texts[id];
}

/** Every written idea, so the graph can tell what is mastered. */
export const loadAll = () => Promise.all(READY.map(idea));

export const facts = () => L.facts(state.rec, { age: age(), defs: state.defs });

load();
