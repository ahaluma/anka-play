// The open Tal (the concept "Das offene Tal"): no stations, but small skills. Every question the owl asks counts
// for one skill, right or wrong. From the last answers the skill gets a stand, and the stand decides how often
// the owl practises it. Pure functions: no screen, no storage (tools/check-offen.mjs runs them in Node).
//
// The rules (decided 28.11.):
//   - a skill is "sicher" after at least 20 answers, with 90 % of the last 20 right (18 of 20);
//   - one star for every right answer;
//   - counting beyond 10 starts slowly once counting to 10 is sicher (not at the pond yet).

/** The skills of the pond, in learning order. `after`: the skills that must have been sicher first; none means
 *  open from the start. Comparing runs beside counting from the first event: "mehr" and "gleich viele" at
 *  once, "weniger" (the hardest word) once "mehr" is sicher. Skills taught at other places, like "zerlegen bis
 *  5" at the burrow, do not block here yet. */
export const SKILLS = [
  { id: "zaehlen5", strand: "zahlen", after: [] },
  { id: "mehr", strand: "zahlen", after: [] },
  { id: "gleich", strand: "zahlen", after: [] },
  { id: "weniger", strand: "zahlen", after: ["mehr"] },
  { id: "legen", strand: "zahlen", after: [] },
  { id: "zaehlen10", strand: "zahlen", after: ["zaehlen5"] },
  { id: "merken", strand: "zahlen", after: ["zaehlen5"] },
  { id: "dazu", strand: "zahlen", after: ["zaehlen5"] },
  { id: "weg", strand: "zahlen", after: ["zaehlen5"] },
  { id: "verteilen", strand: "zahlen", after: ["gleich"] },
  { id: "umverteilen", strand: "zahlen", after: ["verteilen"] },
  { id: "fuenfer", strand: "zahlen", after: ["zaehlen5", "umverteilen"] },
  { id: "zehner", strand: "zahlen", after: ["zaehlen10", "fuenfer"] },
  // Taught at the burrow (bau.js): how many are still inside, when some came out.
  { id: "zerlegen5", strand: "zahlen", after: ["zaehlen5"], places: ["bau"] },
  { id: "zerlegen10", strand: "zahlen", after: ["zerlegen5", "zaehlen10"], places: ["bau"] },
  // Taught at the apple tree (apfelbaum.js): sharing apples among two or three hares, then what is left over.
  { id: "teilen", strand: "zahlen", after: ["verteilen"], places: ["apfelbaum"] },
  { id: "rest", strand: "zahlen", after: ["teilen"], places: ["apfelbaum"] },
  // The seven newer places (tal.js). Inside a place the next skill opens once the one before was sicher; across
  // places nothing locks, so the child can wander freely. Counting also comes at the meadow.
  { id: "reihe10", strand: "zahlen", after: ["zaehlen5"], places: ["wiese"] },
  { id: "zaehlen20", strand: "zahlen", after: ["zaehlen10"], places: ["wiese"] },
  { id: "muster2", strand: "ordnen", after: [], places: ["waldrand"] },
  { id: "muster3", strand: "ordnen", after: ["muster2"], places: ["waldrand"] },
  { id: "erster", strand: "ordnen", after: [], places: ["himmel"] },
  { id: "vorher", strand: "ordnen", after: ["erster"], places: ["himmel"] },
  { id: "sortieren", strand: "ordnen", after: [], places: ["nester"] },
  { id: "regel", strand: "ordnen", after: ["sortieren"], places: ["nester"] },
  { id: "vergleichen", strand: "raum", after: [], places: ["pfuetze"] },
  { id: "bildmerken", strand: "raum", after: ["vergleichen"], places: ["pfuetze"] },
  { id: "lage1", strand: "raum", after: [], places: ["huegel"] },
  { id: "lage2", strand: "raum", after: ["lage1"], places: ["huegel"] },
  { id: "formen", strand: "raum", after: [], places: ["bach"] },
  { id: "formen2", strand: "raum", after: ["formen"], places: ["bach"] },
  { id: "laenger", strand: "groessen", after: [], places: ["bach"] },
  { id: "schwerer", strand: "groessen", after: ["laenger"], places: ["bach"] },
  { id: "ordnen3", strand: "groessen", after: ["laenger"], places: ["bach"] },
];
/** The skills a place practises: the pond's are the ones without `places`. Counting, comparing and laying an
 *  amount come back everywhere, so a skill is the same skill at every place. */
export const skillsAt = (place) => SKILLS.filter((k) => (k.places ?? ["teich"]).includes(place));

export const WINDOW = 20; // the last answers that decide the stand
export const MIN = 20; // answers before a skill can be sicher
export const SURE = 18; // of the last 20: sicher (90 %)
export const LONG_DAYS = 7; // sicher for this many days: lange sicher

/** How often the owl practises a skill of this stand, per chance (the concept's table). */
export const HOW_OFTEN = { neu: 0.9, uebt: 0.9, wackelt: 0.9, sicher: 0.25, lange: 0.1, zu: 0 };

const DAY = 864e5;

/** An empty record, or the saved one made safe. */
export function valid(rec) {
  const r = rec && typeof rec === "object" ? rec : {};
  return { skills: r.skills && typeof r.skills === "object" ? r.skills : {}, stars: Number(r.stars) || 0, wrongRow: Number(r.wrongRow) || 0 };
}

const entry = (rec, id) => (rec.skills[id] ??= { right: 0, wrong: 0, last: [], sureSince: null, wasSure: false });

/** Count one answer. Returns the record (changed in place). */
export function answer(rec, id, right, now = Date.now()) {
  const s = entry(rec, id);
  if (right) s.right++;
  else s.wrong++;
  s.last.push(right ? 1 : 0);
  if (s.last.length > WINDOW) s.last.splice(0, s.last.length - WINDOW);
  if (right) rec.stars++;
  rec.wrongRow = right ? 0 : rec.wrongRow + 1;
  const st = stand(rec, id, now);
  if (st === "sicher" || st === "lange") {
    s.wasSure = true;
    s.sureSince ??= now;
  } else if (st === "wackelt") s.sureSince = null;
  return rec;
}

const rightOfLast = (s) => s.last.reduce((a, b) => a + b, 0);

/**
 * The stand of a skill:
 *   zu       not yet: a skill before was never sicher
 *   neu      open, no answer yet
 *   uebt     fewer than 20 answers, or under 90 % of the last 20
 *   sicher   at least 20 answers and 18 of the last 20 right
 *   lange    sicher for a week or more
 *   wackelt  was sicher, now under 18 of the last 20: practised again like a new one
 */
export function stand(rec, id, now = Date.now()) {
  const def = SKILLS.find((k) => k.id === id);
  const s = rec.skills[id];
  const n = s ? s.right + s.wrong : 0;
  if (!n && def?.after.some((id) => !rec.skills[id]?.wasSure)) return "zu"; // opens once the ones before were sicher
  if (!n) return "neu";
  const r = rightOfLast(s);
  if (n >= MIN && r >= SURE) return s.sureSince && now - s.sureSince >= LONG_DAYS * DAY ? "lange" : "sicher";
  return s.wasSure ? "wackelt" : "uebt";
}

export const isSure = (rec, id, now) => ["sicher", "lange"].includes(stand(rec, id, now));

/** Is the skill open (practised or past)? */
export const isOpen = (rec, id, now) => stand(rec, id, now) !== "zu";

/** How often the owl asks for this skill now (0 to 1). */
export const often = (rec, id, now) => HOW_OFTEN[stand(rec, id, now)];

/** One line per skill, for parents: right, wrong, right of the last 20, stand. */
export const report = (rec, now = Date.now()) =>
  SKILLS.map(({ id }) => {
    const s = rec.skills[id];
    return { id, right: s?.right ?? 0, wrong: s?.wrong ?? 0, lastRight: s ? rightOfLast(s) : 0, lastN: s?.last.length ?? 0, stand: stand(rec, id, now) };
  });
