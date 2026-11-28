// The routes after "#", one page for everything:
//
//   #/            the start: for now straight to the pond
//   #/teich       the pond (offen/teich.js)

export function parse(hash = location.hash) {
  const [path, query = ""] = hash.replace(/^#\/?/, "").split("?");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  const q = Object.fromEntries(new URLSearchParams(query));
  if (parts[0] === "teich") return { screen: "teich", q };
  return { screen: "teich", q };
}

export const go = (hash) => {
  if (location.hash === hash) window.dispatchEvent(new HashChangeEvent("hashchange"));
  else location.hash = hash;
};

export const href = {
  home: () => "#/",
  teich: () => "#/teich",
};
