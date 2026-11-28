// The routes after "#", one page for everything:
//
//   #/            Home: who plays, the language, the door to the pond (engine/ui/home.js)
//   #/teich       the pond (offen/teich.js)
//   #/apfelbaum   the apple tree (offen/apfelbaum.js)
//   #/bau         the burrow (offen/bau.js)
// Every place links to two others (offen/places.js).

export function parse(hash = location.hash) {
  const [path, query = ""] = hash.replace(/^#\/?/, "").split("?");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  const q = Object.fromEntries(new URLSearchParams(query));
  if (["teich", "apfelbaum", "bau"].includes(parts[0])) return { screen: parts[0], q };
  return { screen: "home", q };
}

export const go = (hash) => {
  if (location.hash === hash) window.dispatchEvent(new HashChangeEvent("hashchange"));
  else location.hash = hash;
};

export const href = {
  home: () => "#/",
  teich: () => "#/teich",
};
