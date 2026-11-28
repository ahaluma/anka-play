// The simulated world of the open Tal: a state that develops through events. Nothing on screen changes the
// frogs directly; the screen, the owl and the child all send events to the world, and the questions of the
// catalogue (questions.js) read their answers from its state. The same world runs without a screen in
// tools/check-offen.mjs, and the owl plays a run ahead on a copy (fork) before it asks it.
//
// State of the pond: { shore, rot, gruen } frogs on the shore, the red pad, the green pad.
// Events:
//   { type: "kommen", n }          n frogs come out of the water onto the shore (a new event starts)
//   { type: "huepf", from, to }    one frog hops from one place to another (the child, or the owl helping)
//   { type: "dazu", pad }          one frog comes out of the water onto a pad
//   { type: "weg", pad }           one frog jumps from a pad into the water
//   { type: "platsch" }            all frogs jump into the water (the event ends)
// An event that cannot happen (no frog to hop) is refused and changes nothing.

export const PLACES = ["shore", "rot", "gruen"];

const RULES = {
  kommen: (s, e) => (e.n > 0 ? { ...s, shore: s.shore + e.n } : null),
  huepf: (s, e) => (e.from !== e.to && s[e.from] > 0 && PLACES.includes(e.to) ? { ...s, [e.from]: s[e.from] - 1, [e.to]: s[e.to] + 1 } : null),
  dazu: (s, e) => (e.pad !== "shore" && PLACES.includes(e.pad) ? { ...s, [e.pad]: s[e.pad] + 1 } : null),
  weg: (s, e) => (e.pad !== "shore" && s[e.pad] > 0 ? { ...s, [e.pad]: s[e.pad] - 1 } : null),
  platsch: () => ({ shore: 0, rot: 0, gruen: 0 }),
};

/** The state after an event, or null when it cannot happen. Pure. */
export function next(state, event) {
  const rule = RULES[event.type];
  return rule ? rule(state, event) : null;
}

/** A world with a state, its history of events, and listeners that hear each change. */
export function create(state = { shore: 0, rot: 0, gruen: 0 }) {
  const listeners = [];
  const w = {
    state: { ...state },
    history: [],
    /** Apply an event. Returns true when it happened. */
    send(event) {
      const s = next(w.state, event);
      if (!s) return false;
      Object.assign(w.state, s);
      w.history.push(event);
      for (const f of listeners) f(event, w.state);
      return true;
    },
    on(f) {
      listeners.push(f);
    },
    /** A copy to play ahead on, without listeners. */
    fork() {
      return create(w.state);
    },
    get total() {
      return w.state.rot + w.state.gruen;
    },
  };
  return w;
}
