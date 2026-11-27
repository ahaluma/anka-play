// A random source. With a seed (?seed=7 in the address, or in tools/) the same seed gives the same tasks,
// handy to reproduce what a child saw. Without a seed: Math.random.

/** mulberry32: a small, good random source from a seed. */
export function random(seed) {
  if (seed === undefined || seed === null || seed === "" || Number.isNaN(+seed)) return Math.random;
  let s = +seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = (list, r = Math.random) => list[Math.floor(r() * list.length)];

export function shuffle(list, r = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
