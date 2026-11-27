// The routes after "#", one page for everything (docs/DESIGN.md, section 9):
//
//   #/                     Home: who plays, then the doors to the maps
//   #/map/tal              a map; #/map/tal?walk=wiese,bau  the owl walks the child from one station to the next
//   #/s/wiese              a station: its perspectives with stars
//   #/s/wiese/sehen        a round (a station with several ideas: #/s/bau/zehn/sehen)
//   #/gate/steg            the first-visit questions of a station (only when they are due)

import { PERSPECTIVES } from "../content/perspectives.js";

const P_IDS = PERSPECTIVES.map((p) => p.id);

export function parse(hash = location.hash) {
  const [path, query = ""] = hash.replace(/^#\/?/, "").split("?");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  const q = Object.fromEntries(new URLSearchParams(query));
  if (parts[0] === "map" && parts[1]) return { screen: "map", map: parts[1], q };
  if (parts[0] === "gate" && parts[1]) return { screen: "gate", station: parts[1], q };
  if (parts[0] === "s" && parts[1]) {
    const rest = parts.slice(2);
    const p = rest.find((x) => P_IDS.includes(x)) ?? null;
    const idea = rest.find((x) => !P_IDS.includes(x)) ?? null;
    return { screen: p ? "play" : "station", station: parts[1], idea, p, q };
  }
  return { screen: "home", q };
}

export const go = (hash) => {
  if (location.hash === hash) window.dispatchEvent(new HashChangeEvent("hashchange"));
  else location.hash = hash;
};

export const href = {
  home: () => "#/",
  map: (id, q = "") => `#/map/${id}${q ? "?" + q : ""}`,
  station: (id, idea = null) => `#/s/${id}${idea ? "/" + idea : ""}`,
  play: (id, idea, p, many = false) => `#/s/${id}${many ? "/" + idea : ""}/${p}`,
  gate: (id) => `#/gate/${id}`,
};
