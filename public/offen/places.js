// The places of the open Tal and their portals. Design rule (28.11.): every place has a direct link to exactly
// two other places, and beside each portal stands a small picture of the place it leads to (next to the portal
// to the pond, a little pond). The links go both ways, so the places form a ring the child can walk around.
// tools/check-offen.mjs checks both rules.

export const PLACES = [
  { id: "teich", links: ["apfelbaum", "bau"] },
  { id: "apfelbaum", links: ["bau", "teich"] },
  { id: "bau", links: ["teich", "apfelbaum"] },
];

/** The memory world (memory/): three tables in a ring, the same rule. */
export const MEMORY_PLACES = [
  { id: "memory-zahlen", links: ["memory-formen", "memory-rechnen"] },
  { id: "memory-formen", links: ["memory-rechnen", "memory-zahlen"] },
  { id: "memory-rechnen", links: ["memory-zahlen", "memory-formen"] },
];

/** Every place of every world, by id. A portal leads only within its own world. */
export const placeById = Object.fromEntries([...PLACES, ...MEMORY_PLACES].map((p) => [p.id, p]));
