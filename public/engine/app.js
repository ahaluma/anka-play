// The state of the app in the browser: who plays. Each place (offen/teich.js) keeps its own record on this
// device under its own key.

import * as profiles from "./profiles.js";

export const state = { kid: null };

/** (Re)load who plays. Without any child, a guest plays. */
export function load() {
  state.kid = profiles.current();
}

export const age = () => profiles.age(state.kid);

load();
